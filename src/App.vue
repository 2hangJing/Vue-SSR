<template>
    <div id='app'>
        <h2>测试 123</h2>
        <!-- 路由匹配到的组件将渲染在这里 -->
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        mounted() {}
    }
</script>
<style lang='scss'>
    @import './scss/app.scss';
</style>