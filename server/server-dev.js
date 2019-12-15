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

let template = fs.readFileSync(path.resolve(__dirname, '../src/static/index.html'), "utf-8"),renderer,serverBundle,clientManifest;
let mfs = new MFS();

function render(serverBundle, options, clientHotComplier, context, errCallback, successCallback) {

    renderer = createBundleRenderer(serverBundle, Object.assign({
        runInNewContext: false,
        basedir: path.resolve(__dirname, '../dist'),
    }, options));

    //  renderer更新后刷新浏览器
    clientHotComplier.publish({ action: 'reload' });  

    // renderer.renderToStream(context, (err, html)=>{

    //     err && errCallback

    //     successCallback(html);
    // })
}

function upData(){
    return new Promise((resolve, reject)=>{
        if(serverBundle && clientManifest){
            resolve()
        }
    })
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

clientCompiler.hooks.done.tap('BuildStatsPlugin', (compilation)=>{
    clientManifest = JSON.parse(readFile( clientDevComplier.fileSystem, "vue-ssr-client-manifest.json"));
    
    if(serverBundle && clientManifest){
        render(serverBundle, {clientManifest, template}, clientHotComplier);
    }
 });

//  webpackDevMiddleware 编译成功后 clientManifest 赋值
clientDevComplier.waitUntilValid(() => { 

    clientManifest = JSON.parse(readFile( clientDevComplier.fileSystem, "vue-ssr-client-manifest.json"));
    
    if(serverBundle && clientManifest){
        render(serverBundle, {clientManifest, template}, clientHotComplier);
    }
    // upData().then(()=>{

    //     render(serverBundle, {clientManifest, template}, clientHotComplier);
    // })
});

/* ---------------------------------------------- client end ---------------------------------------------- */ 






/* ---------------------------------------------- server start ---------------------------------------------- */ 

let serverCompiler = webpack(serverConfig);
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
        // upData().then(()=>{

        //     render(serverBundle, {clientManifest, template}, clientHotComplier);
        // })
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

    upData().then(()=>{
        
        renderer.renderToString(context, (err, html) => {
            if (err) {
                console.log(colors.red(`error：${JSON.stringify(err)} --- path：${req.path}`));
                return
            }
            res.send(html).end();
        })
    });
});

server.listen(config.PORT_HTTP, () => {

    console.log(colors.green(`node service is running! \nport: ${ config.PORT_HTTP }`));
})