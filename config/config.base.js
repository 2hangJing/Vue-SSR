module.exports = {

    //  HTTP 服务端口
    PORT_HTTP: 8000,

    //  在docker 中webpack监听文件失效，开启 watch 轮询，代替文件监听
    DOCKER_webpackPoll: false,

    //  编译完成后自动刷新页面
    autoRefresh: true,
    //  服务启动后打开浏览器
    autoOpen: true,
    //  开发模式时是否开启：编译中请求页面等待新 render ，而不返回旧 render 模式
    waitRender: true,
    
    
    
}