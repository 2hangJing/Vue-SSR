
export default {

    //  全局 scroll 函数 push
    mutations_scroll_push:(state,fun) => {

        state.scroll.push(fun);
    },

    //  全局 scroll 函数 清空
    mutations_scroll_clear:(state) => {
        
        state.scroll = [];
    },

    mutations_nav_switch:(state,arg) => {
        
        state.nav_switch = arg;
    },



    mutations_webSEO_edit:(state,arg) => {
        
        state.webSEO = arg;
    },

    mutations_index_articleList:(state,arg) => {

        state.index_articleList = arg;
    },
    mutations_article_articleDetail:(state,arg) => {
        
        state.article_articleDetail = arg;

        state.webSEO.title = arg.title;

        state.webSEO.keywords = arg.keywords;
        
        state.webSEO.description = arg.introduction;
    },

    mutations_audio_load:(state,arg) => {
        
        state.audio_load = arg;
    },
}