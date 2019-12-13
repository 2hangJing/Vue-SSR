const fs = require('fs')
const path = require('path')
const webpack = require('webpack');
const MFS = require('memory-fs');
const chokidar = require('chokidar');
const colors = require('colors');
const { createBundleRenderer } = require('vue-server-renderer');
const clientConfig = require('../build/webpack.configClient');
const serverConfig = require('../build/webpack.configServer');
const server = require('./server-base');
const config = require('../config/config.base');

let template = path.resolve(__dirname, '../src/static/index.html'),renderer,serverBundle,clientManifest;

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


/* ---------------------------------------------- client start ---------------------------------------------- */ 
//  客户端注入页面刷新 JS
clientConfig.entry.main.push(path.resolve(__dirname, './server-dev-hotReload.js'));

let clientCompiler = webpack(clientConfig);
let clientHotComplier = webpackHotMiddleware(clientCompiler, {
    reload: true
});
let clientDevComplier = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    logLevel: "error",
    logTime: true
});

server.use(clientDevComplier);
// webpackHotMiddleware 浏览器刷新配置
server.use(clientHotComplier);

/* ---------------------------------------------- client end ---------------------------------------------- */ 






/* ---------------------------------------------- server start ---------------------------------------------- */ 

let serverCompiler = webpack(serverConfig);
let mfs = new MemoryFS();
//  将serverBundle 输出到内存中
serverCompiler.outputFileSystem = mfs
//  server webpack 监听
serverCompiler.watch({}, (err, state)=>{
    if(err){
        console.log( err );
    }else{

        serverBundle = JSON.parse(mfs.readFileSync(path.join(clientConfig.output.path, 'vue-ssr-server-bundle.json'), "utf-8"));

        upData().then(()=>{

            render(serverBundle, {clientManifest, template}, clientHotComplier);
        })
    }
});



/* ---------------------------------------------- server end ---------------------------------------------- */ 


server.get('*', (req, res) => {

    res.setHeader("Content-Type", "text/html");

    upData().then(()=>{
        render();
    })
})

server.listen(config.PORT_HTTP, () => {
    console.log(colors.green(`node service is running! \nport: ${ config.PORT_HTTP }`));
})