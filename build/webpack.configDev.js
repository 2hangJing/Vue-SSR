//  CommonJS 语法
const path                  = require('path');
const webpack               = require('webpack');
const merge                 = require('webpack-merge');
const VueSSRClientPlugin    = require('vue-server-renderer/client-plugin');
module.exports= merge( require('./webpack.configBase.js'),{
    mode: "development",
    //  eval==>通过eval()执行，不能正确显示行数  | cheap==>只显示错误代码行位置 
    //  inline==>source map被记录到打包JS文件中 | module==>可以捕获loader的报错 
    //  可以自由的与 source-map 组合，比如如下常用，开发与构建的配置
    //  development: cheap-module-eval-source-map
    //  production:  cheap-module-source-map
    devtool: "cheap-module-eval-source-map",
    entry: {
        main: [
            path.resolve(__dirname, '../src/entry-client.js'),
            path.resolve(__dirname, '../server/server-dev-hotReload.js'),
        ],
    },
    output: {
        //  入口文件输出名称，对应 entry 的 key
        filename: '[name].js',
        //  chunk文件输出名称
        chunkFilename: 'chunk.[name].js',
    },

    // watch 原理：https://segmentfault.com/a/1190000008111793
    watch: false,
    module: {
        rules:[
            {
                test: /\.scss$/,
                use:[
                    {loader: "style-loader", options:{ injectType: 'styleTag' }},
                    {
                        loader: "css-loader", 
                        //  代表scss 解析到内置 @import 的其他scss时会再从头走一遍 loader
                        options:{ importLoaders: 2 } 
                    },
                    //  postcss 需要在 cssloader 之前嗲调用
                    {loader: "postcss-loader"},
                    {loader: "sass-loader"},
                ]
            },{
                test: /\.css$/,
                use:[
                    {loader: "style-loader",options:{ injectType: 'styleTag' }},
                    {loader: "css-loader"}
                ]
            },
        ]
    },
    plugins: [
        // eventSource 浏览器刷新 自定义插件
        // new webpackReload(),

        // HMR
        new webpack.HotModuleReplacementPlugin(),

        // 此插件在输出目录中生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin()
    ],
})