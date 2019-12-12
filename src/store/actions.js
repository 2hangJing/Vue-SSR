import axiosData from "../api/indexAxios.js"

export default {

    //  全局 scroll 函数 push
    action_scroll_push:({ commit, dispatch, state },fun) => {
        
        return commit("mutations_scroll_push",fun);
    },
    //  全局 scroll 函数 清空
    action_scroll_clear:({ commit, dispatch, state }) => {
        
        return commit("mutations_scroll_clear");
    },

    //  全局 nav 控制
    action_nav_switch:({ commit, dispatch, state }, boolean) => {
        
        return commit("mutations_nav_switch",boolean);
    },
    

    //  网站SEO 部分数据
    action_webSEO_edit:({ commit, dispatch, state },webSEO) => {
        
        return commit("mutations_webSEO_edit",webSEO);
    },

    action_index_articleList:({ commit, dispatch, state },id) => {
        
        return axiosData.articleList().then((response)=>{

            commit("mutations_index_articleList",response.data);
        })
    },
    action_article_articleDetail:({ commit, dispatch, state },id) => {
        
        return axiosData.articleDetail(id).then((response)=>{

            commit("mutations_article_articleDetail",response.data[0]);
        })
    },

    //  音频引入
    action_audio_load:({ commit, dispatch, state }) => {
        
        return axiosData.audioLoad.then((response)=>{

            commit("mutations_article_articleDetail",response.data[0]);
        })
    },
}