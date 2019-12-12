//  CommonJS 语法
const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require("html-webpack-plugin");
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports= {
    mode: "none",
    entry: {
        main: [path.resolve(__dirname, "../src/main.js")],
    },
    output: {
        publicPath: "./",
        path: path.resolve(__dirname, "../dist")
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader:'vue-loader'
            },{
                test: /\.(svg|woff|woff2|eot|ttf|otf)$/,
                use:[{
                    loader: "file-loader",
                    options: {
                        outputPath: "font",
                        name: "[name].[ext]"
                    }
                }]
            },{
                test: /\.(png|jpg|gif|)$/,
                use:[{
                    loader: "url-loader",
                    options: {
                        //  图片输出到文件夹的路径，默认在 output.path 为根目录
                        outputPath: "img",

                        //  统一添加图片输出路径前得字符串，默认是 outputPath 的路径加图片名称
                        //  配置CDN时常用
                        // publicPath: path.resolve(__dirname, "dist", "img"),

                        name: "[name].[ext]",
                        limit: 5*1024
                    }
                }]
            },{ 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: [{
                    loader: "babel-loader",
                }]
            }
        ]
    },

    plugins: [
        //  具体参数链接： https://juejin.im/post/5ce96ad7e51d455a2f2201e1
        new htmlWebpackPlugin({
            title: "webpack4",
            template: path.resolve(__dirname, "../static/index.html"),
            inject: "body",
            favicon: path.resolve(__dirname, "../src/img/favicon.ico"),
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
                'theme-color': "#2ebaae"
            },
            minify: true
        }),
        //  异步chunk prefetch 加载优化 
        //  webpack v4 需要安装 preload-webpack-plugin@next
        //  链接：https://github.com/GoogleChromeLabs/preload-webpack-plugin
        new PreloadWebpackPlugin({
            rel: "prefetch",
            as: "script"
        }),

        //  shimming 垫片配置项
        //  https://webpack.docschina.org/guides/shimming/
        new webpack.ProvidePlugin({
            $: "jquery",
        }),

        //  vue plugin
        new VueLoaderPlugin()
    ]
}