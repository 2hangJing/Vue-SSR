<template>
    <div>
        <h2>HOME</h2>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        asyncData({ store, route }) {
            // 触发 action 后，会返回 Promise
            return store.dispatch('action_article_articleDetail', 14)
        },
        mounted() {}
    }
</script>
<style lang='scss'>
    // @import ;
</style>