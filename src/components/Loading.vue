<template>
    <div v-show="config._show" class="loading">
        {{ config._msg }}
    </div>
</template>

<script>
    export default {
        name: "Loading",
        props: {
            config: {
                _msg: "",
                _show: false
            }
        },
        show: (_msg) => ({_msg, _show: true}),
        hide: () => ({_msg: "", show: false}),
        init: () => ({_msg: "", _show: false})
    }
</script>

<style scoped>
    .loading {
        border: #333 1px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        padding: 3px;
    }
</style>