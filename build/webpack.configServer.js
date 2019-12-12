//  CommonJS 语法
const path                  = require('path');
const merge                 = require('webpack-merge');
const webpack               = require('webpack');
const VueSSRServerPlugin    = require('vue-server-renderer/server-plugin')

module.exports= merge(require("./webpack.configBase.js"), {

    // mode: "production",
    mode: "none",

    //  eval==>通过eval()执行，不能正确显示行数  | cheap==>只显示错误代码行位置 
    //  inline==>source map被记录到打包JS文件中 | module==>可以捕获loader的报错 
    //  可以自由的与 source-map 组合，比如如下常用，开发与构建的配置
    //  development: cheap-module-eval-source-map
    //  production:  cheap-module-source-map
    devtool: "cheap-module-source-map",

    entry: {
        main: [path.resolve(__dirname, '../src/entry-server.js')],
    },

    output: {
        //  入口文件输出名称，对应 entry 的 key
        //  contenthash 根据内容产生 hash 未更改的JS 复用浏览器缓存
        filename: '[name].[contenthash].js',
        //  chunk文件输出名称
        chunkFilename: 'chunk.[name].[contenthash].js',
        // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
        libraryTarget: 'commonjs2'
    },
    // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
    // 并且还会在编译 Vue 组件时，
    // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
    target: 'node',

    optimization: {
        //  TerserPlugin 压缩代码
        //  mode: "production" 默认开启
        minimize: true,

        //  usedExports 确定每个模块的已用导出，是 tree shaking 配置项
        //  tree shaking 只支持 ESmodule，bable中已配置使用 ES module导出
        //  usedExports 会标记无用代码，但是并不会删除，需要代码压缩工具删除无用代码，比如 webpack4 内置得 TerserPlugin 
        usedExports: true,

        //  开启 package.json 的 sideEffects 选项, 过滤不需要 tree shaking 文件
        //  mode: "production" 默认开启
        sideEffects: true,

        //  代码分割
        splitChunks:{
            //  开启代码分割得类型，all==> 同步异步都开启 async==> 只对异步开启
            chunks: "all",

            //  大于 30KB 得代码才会进行代码分割
            minSize: 5000 * 1024,

            //  对代码分割后大于 maxSize 得chunk 再次进行代码分割，一般不用配置，默认0
            maxSize: 0,

            //  至少使用了 minChunks 次数后才会进行代码分割打包，>= minChunks 后进行分割
            minChunks: 1,

            //  最多分割得包个数，超过之后不在经行分割
            maxAsyncRequests: 5,

            //  入口文件做代码分割包数目得最大限制
            maxInitialRequests: 3,

            //  打包后的chunk 名字前缀（组）与从哪里引入得JS入口中间的链接字符
            //  例：nodeModules-index 代表 cacheGroups中 nodeModules分组，这个包从 webpack.entry.index 对应得JS中引入得 
            automaticNameDelimiter: '-',
            name: true,

            //  同步异步都控制配置项，chunk名称，chunk来源，正则匹配等
            //  异步得代码名称为 import 中设置得 webpackChunkName
            //  cacheGroups ==>缓存组，起名原因：当 xx.JS中引入多个都符合 cacheGroups.nodeModules 时，不会打包成多个chunk,而是混合在一起打包成一个，符合得模块先缓存起来，最终一起打包
            cacheGroups: {
                //  加载的 node_modules 模块JS 打包在单独得chunk中
                //  nodeModules 为node_modules 中JS模块，'nodeModules' 为打包后chunk得名字前缀
                nodeModules: {
                    test: /[\\/]node_modules[\\/]/,

                    //  权重。当上面几个代码分割条件都符合的时候根据权重分配
                    priority: -10,

                    //  此配置直接覆盖 chunk 得名称
                    //  设置后所有在 node_modules 中且需要的JS 被打包成一个 vendors.js 有可能会出错，不建议设置
                    //  测试 同步异步混合 打包情况下设置此值后，最终运行出错
                    // name:'vendors',

                    // splitChunks.chunk 设置不是 initial 时，直接设置 名称以及类型会报错，慎用
                    //  看到一篇博客说此问题为现存 webpack v4.41.2 BUG，不确定
                    // filename: "node_module.js"
                },
                default: {
                    priority: -20,
                    //  如果当前 chunk中引用了另外一个包，那个包被打包过，是否复用。
                    //  ture 会影响最终chunk 名
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        // 这是将服务器的整个输出 构建为单个 JSON 文件的插件。
        // 默认文件名为 `vue-ssr-server-bundle.json`
        new VueSSRServerPlugin()
    ]
})
