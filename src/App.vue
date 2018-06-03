<template>
    <div id="app" class="w-100 w-80-m w-70-l center">
        <notifications/>
        <Loading v-show="loginState == IS_LOGGING_IN">
            Checking login details...
        </Loading>

        <div v-show="loginState == IS_LOGGED_IN">
            <transition name="fade"><router-view/></transition>
        </div>

        <div v-show="loginState == IS_NOT_LOGGED_IN">
            <LoginForm/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import LoginForm from "./components/LoginForm.vue"
    import Loading from "./components/Loading.vue"
    import VueRouter from "vue-router"

    const cs = {
            IS_LOGGED_IN: 1,
            IS_NOT_LOGGED_IN: 2,
            IS_LOGGING_IN: 3,
        }

    export default /*class App extends Vue*/ {
        components: { LoginForm, Loading },
        data: () => ({
            loginState: cs.IS_LOGGING_IN,
            ...cs
        }),
        methods: {
            loadAuth() {
                const loginFailed = () => this.loginState = cs.IS_NOT_LOGGED_IN

                this.$flux.auth.loadAuth()
                    .caseOf({
                        nothing: () => loginFailed(),
                        just: auth => this.$flux.v1.getUserDetails(auth)
                            .then(r => r.caseOf({
                                left: e => {
                                    loginFailed()
                                    this.$flux.auth.remove()
                                },
                                right: () => {
                                    this.auth = auth
                                    this.loginState = cs.IS_LOGGED_IN
                                }
                            }))
                    })
            },
            created() {
            }
        },
        created(){
            this.loadAuth()
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    .fade-enter-active, .fade-leave-active {
        transition-property: opacity;
        transition-duration: .25s;
    }

    .fade-enter-active {
        transition-delay: .25s;
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>
