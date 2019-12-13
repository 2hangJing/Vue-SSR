import axios from 'axios'


/*  SSR渲染全部使用 https
    浏览器根据当前 URL 切换协议 
    根据执行环境环境切换 http 与 https 
------------------------------------*/ 
let protocol = 'http:';
let GETURL = 'www.ismoon.cn';

// try {
    
//     !!window && ({ protocol } = window.location)
// } catch (error) {

//     /*  SSR 区分本地开发与线上版本
//     ---------------------------*/ 
//     protocol = GETURL.includes("ismoon") ? "http:" : "http:";
// }



export default {
    
    //  首页 --> 文 章 列 表
    articleList(){
        

        return axios.get(`${protocol}//${GETURL}/article/list`);
    },

    //  文章详情页
    articleDetail(id){

        return axios.get(`${protocol}//${GETURL}/article/detail?id=${id}`);
    },

    //  音频引入
    audioLoad(){
        
        return axios.get(`/static/audio/FlashFunk.mp3`);
    },

    //  留言
    contact(data){

        return axios.post(`${protocol}//${GETURL}/contact/detail`,data);
    }

}