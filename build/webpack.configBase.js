//  CommonJS 语法
const path              = require('path');
const webpack           = require('webpack');
const VueLoaderPlugin   = require('vue-loader/lib/plugin');

module.exports= {
    mode: "none",
    output: {
        publicPath: "/",
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
                        limit: 5*1024,
                        esModule: false
                    }
                }]
            },{ 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: [{
                    loader: "babel-loader",
                }]
            },
        ]
    },

    plugins: [

        //  shimming 垫片配置项
        //  https://webpack.docschina.org/guides/shimming/
        new webpack.ProvidePlugin({
            $: "jquery",
        }),

        //  vue plugin
        new VueLoaderPlugin()
    ]
}