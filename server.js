
const fs                        = require("fs");
const path                      = require('path');
const Vue                       = require('vue');
const server                    = require('express')();
const { createBundleRenderer }  = require('vue-server-renderer');

const serverBundle              = require('./dist/vue-ssr-server-bundle.json');
const clientManifest            = require('./dist/vue-ssr-client-manifest.json');

const resolve                   = file => path.resolve(__dirname, file);
const template                  = fs.readFileSync(resolve('./src/static/index.html'), 'utf-8');

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
})

server.get('*', (req, res) => {

    res.setHeader("Content-Type", "text/html");

    renderer.renderToString({url: req.url}, (err, html) => {
        if(err) {
            console.log( err );
        }
        res.send(html).end();
    })
})

server.listen(8080)