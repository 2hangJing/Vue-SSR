/*
 * @Author: monai
 * @Date: 2019-12-11 15:58:50
 * @LastEditors: monai
 * @LastEditTime: 2019-12-12 11:47:06
 */
import Vue              from 'vue';
import App              from './App.vue';
import { createRouter } from './router/index';
import { createStore }  from './store/index';
//  同步路由信息到 store 中的插件
import { sync }         from 'vuex-router-sync'

// 导出一个工厂函数，用于创建新的
// 应用程序、router 和 store 实例
export function createApp() {

    const router = createRouter();
    const store = createStore();

    // 同步路由状态(route state)到 store
    sync(store, router)

    const app = new Vue({
        router,
        store,
        // 根实例简单的渲染应用程序组件。
        render: h => h(App)
    })
    return { app, router, store };
}