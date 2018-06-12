import Vue from "vue";
import App from "./App.vue";
import {} from "./lib/lib";

// eslint-disable-next-line
require("normalize.css");
// eslint-disable-next-line
require("tachyons");


// add service worker if we can

if('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => {
                console.log("Registered service worker.")
            })
    })
}

if ('standalone' in navigator) {
    // do stuff here when we're in a PWA
    // note - we need to check if navigator.standalone is true
}


// vue init

Vue.config.productionTip = true;
Vue.prototype.$dev = Vue.config.productionTip;

import VueResource from "vue-resource";
Vue.use(VueResource);

import Notifications from "vue-notification";
Vue.use(Notifications);

import FluxApi from "./lib/api";
Vue.use(FluxApi);

import ErrHandlers from "./lib/errors";
Vue.use(ErrHandlers);

import { FluxUtils } from "./lib/fluxUtils";
Vue.use(FluxUtils);

import VueRouter from "vue-router";
Vue.use(VueRouter);

import ToggleButton from 'vue-js-toggle-button'
Vue.use(ToggleButton)

import Dashboard from "./components/Dashboard.vue";
import UserValidation from "./components/UserValidation.vue";
import UserDetailsMain from "./components/UserDetails";
import UserRevocation from "./components/UserRevocation.vue";

import R from "./routes";

const routes = [
    { path: R.Dashboard, component: Dashboard },
    { path: R.ValidateSelf, component: UserValidation },
    { path: R.EditUserDetails, component: UserDetailsMain },
    { path: R.MembershipRevocation, component: UserRevocation },
    { path: "*", redirect: "/" }
];

const router = new VueRouter({ routes });

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
