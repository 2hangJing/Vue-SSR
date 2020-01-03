
const fs                        = require("fs");
const path                      = require('path');
const server                    = require('express')();
const { createBundleRenderer }  = require('vue-server-renderer');
const serverBundle              = require('../dist/vue-ssr-server-bundle.json');
const clientManifest            = require('../dist/vue-ssr-client-manifest.json');
const resolve                   = file => path.resolve(__dirname, file);
const template                  = fs.readFileSync(resolve('../src/static/index.html'), 'utf-8');
const config                    = require('../config/config.base');

const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template, 
    clientManifest 
});

server.get('*', (req, res) => {

    res.setHeader("Content-Type", "text/html");

    renderer.renderToString({url: req.url}, (err, html) => {
        if(err) {
            console.log( err );
        }
        res.send(html).end();
    })
})

server.listen(config.PORT_HTTP, () => {

    console.log(colors.green(`> node service is running! \n> port ${ config.PORT_HTTP }`));
})