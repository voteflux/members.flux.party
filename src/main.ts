import Vue from 'vue'
import App from './App.vue'

// eslint-disable-next-line
require('normalize.css');

Vue.config.productionTip = true
Vue.prototype.$dev = Vue.config.productionTip

import VueResource from 'vue-resource';
Vue.use(VueResource);

import Notifications from 'vue-notification';
Vue.use(Notifications)

import FluxApi from './lib/api';
Vue.use(FluxApi);

import VueRouter from 'vue-router'
Vue.use(VueRouter)


import HelloWorld from './components/HelloWorld.vue'
import LoginForm from './components/LoginForm.vue'

const routes = [
    {path: '/', component: LoginForm},
    {path: '/test', component: HelloWorld}
]

const router = new VueRouter({ routes })

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
