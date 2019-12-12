//  CommonJS 语法
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

module.exports= {
    mode: "production",
    entry: {
        vendor: ['vue', 'axios', 'vue-router'],
    },
    output: {
        publicPath: "./",
        path: path.resolve(__dirname, "../static/dll"),
        filename: '[name].js',
        library: "[name]_[hash]"
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
            },
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
        new webpack.DllPlugin({
            path: path.join(__dirname, "../static/dll", "[name]-manifest.json"),
            name: "[name]_[hash]"
        })
    ]
}