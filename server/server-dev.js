const c = require('child_process');
const fs = require('fs')
const path = require('path')
const webpack = require('webpack');
const MFS = require('memory-fs');
const chokidar = require('chokidar');
const colors = require('colors');
const { createBundleRenderer } = require('vue-server-renderer');
const webpackHotMiddleware  = require('webpack-hot-middleware');
const webpackDevMiddleware  = require('webpack-dev-middleware');
const clientConfig = require('../build/webpack.configDev');
const serverConfig = require('../build/webpack.configServer');
const {express, server} = require('./server-base');
const config = require('../config/config.base');

let template = fs.readFileSync(path.resolve(__dirname, '../src/static/index.html'), "utf-8"),
    renderer,serverBundle,clientManifest,resolveFunc;

function render(arg_serverBundle, options, clientHotComplier) {

    renderer = createBundleRenderer(arg_serverBundle, Object.assign({
        runInNewContext: false,
        basedir: path.resolve(__dirname, '../dist'),
    }, options));

    //  renderer更新后刷新浏览器
    config.autoRefresh && clientHotComplier.publish({ action: 'reload' })
    
    //  render后清空 bundle, client、server 再次监听变更时判断对方是否打包赋值完毕
    serverBundle = clientManifest = null;

    //  兼容初次请求时
    resolveFunc ? resolveFunc() : resolveFunc = true;
    
    console.log(colors.green(`> Compilation is complete!`));
}

function renderPromise(){
    return new Promise((resolve, reject)=>{

        resolveFunc && resolve()
        
        resolveFunc = resolve;
    });
}

function readFile(fs, file){
    try {
        return fs.readFileSync(path.join(clientConfig.output.path, file), "utf-8")
    } catch (e) {
        console.log( e );
    }
}

/* ---------------------------------------------- client start ---------------------------------------------- */ 
let clientCompiler = webpack(clientConfig);
let clientHotComplier = webpackHotMiddleware(clientCompiler, { reload: true });
let clientDevComplier = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: 'error',
    logTime: true
});

server.use(clientDevComplier);
// webpackHotMiddleware 浏览器刷新配置
server.use(clientHotComplier);

//  监听client 编译完成后读取内存中的 manifest.json
//  buildDone 为不存在的插件，此处只是用钩子本身作用，为对一些静态文件操作，所以不需要监听固定的 plugin
clientCompiler.hooks.done.tap('buildDone', (compilation)=>{
    clientManifest = JSON.parse(readFile( clientDevComplier.fileSystem, "vue-ssr-client-manifest.json"));
    
    if(serverBundle && clientManifest){
        
        render(serverBundle, {clientManifest, template}, clientHotComplier);
    }
 });

//  监听模式下新的编译触发时的钩子
clientCompiler.hooks.watchRun .tap('buildStart', ()=>{
    
    //  在监听编译时请求页面不再返回 变更前的 renderer，在 promise 中等待 render 函数执行完毕后返回新的 renderer
    config.waitRender && (resolveFunc = false)
});


//  webpackDevMiddleware 编译成功后 clientManifest 赋值
// clientDevComplier.waitUntilValid(() => { 

//     clientManifest = JSON.parse(readFile( clientDevComplier.fileSystem, "vue-ssr-client-manifest.json"));
    
//     if(serverBundle && clientManifest){
        
//         render(serverBundle, {clientManifest, template}, clientHotComplier);
//     }
// });

/* ---------------------------------------------- client end ---------------------------------------------- */ 



/* ---------------------------------------------- server start ---------------------------------------------- */ 

let serverCompiler = webpack(serverConfig);
let mfs = new MFS();

//  将serverBundle 输出到内存中
serverCompiler.outputFileSystem = mfs;
//  server webpack 监听
serverCompiler.watch({}, (err, state)=>{
    if(err){
        console.log( err );
    }else{

        serverBundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'));

        if(serverBundle && clientManifest){
            
            render(serverBundle, {clientManifest, template}, clientHotComplier);
        }
    }
});



/* ---------------------------------------------- server end ---------------------------------------------- */ 

server.get('*', (req, res) => {

    res.setHeader('Content-Type', 'text/html');

    const context = {
        url: req.url,
        description: "",
        keywords: ""
    };

    // if(req.path == '/favicon.ico')res.send(readFile(fs, '../src/static/favicon.ico')).end();

    renderPromise().then(()=>{
        
        renderer.renderToString(context, (err, html) => {
            if (err) {
                console.log(colors.red(`error：${JSON.stringify(err)} --- path：${req.path}`));
                return
            }

            res.send(html).end();
        });
    });
});

server.listen(config.PORT_HTTP, () => {

    console.log(colors.green(`> node service is running! \n> port ${ config.PORT_HTTP }`));

    c.exec(`start http://localhost:${ config.PORT_HTTP }/`);
})