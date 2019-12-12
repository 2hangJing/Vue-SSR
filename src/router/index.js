/*
 * @Author: monai
 * @Date: 2019-12-11 16:05:50
 * @LastEditors: monai
 * @LastEditTime: 2019-12-12 17:52:48
 */
import Vue from 'vue';
import Router from 'vue-router';
import routerHome from './home';

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            ...routerHome
        ]
    })
}