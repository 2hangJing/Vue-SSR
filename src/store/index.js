import Vue          from 'vue';
import Vuex         from 'vuex';
import actions      from './actions';
import mutations    from './mutations';
import getters      from './getters';

Vue.use(Vuex);

export function createStore () {
    return new Vuex.Store({
        state: {
            //  全局scroll 执行函数列表
            scroll:[],
            webSEO:{
                title:"",
                keywords:"张京的博客、IT、前端开发、小程序、nodejs、旅游、精彩文章转载",
                description:"张京的个人博客，记录前端开发中的坑，一些笔记",
            },
            index_articleList : [],
            article_articleDetail: {},
            audio_load:"",
            nav_switch: false
        },
        actions,
        mutations,
        getters
    })
}
