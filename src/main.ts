import Vue from 'vue'
import App from './App.vue'

// eslint-disable-next-line
require('normalize.css');
// eslint-disable-next-line
require('tachyons')

Vue.config.productionTip = true
Vue.prototype.$dev = Vue.config.productionTip

import VueResource from 'vue-resource';
Vue.use(VueResource);

import Notifications from 'vue-notification';
Vue.use(Notifications)

import FluxApi from './lib/api';
Vue.use(FluxApi);

import ErrHandlers from './lib/errors'
Vue.use(ErrHandlers)

import VueRouter from 'vue-router'
Vue.use(VueRouter)


import HelloWorld from './components/HelloWorld.vue'
import Dashboard from './components/Dashboard.vue'

const routes = [
    {path: '/', component: Dashboard},
    {path: '/test', component: HelloWorld},
    {path: '*', redirect: '/'}
]

const router = new VueRouter({ routes })

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
