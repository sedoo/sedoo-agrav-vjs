import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vuetify from "vuetify"
import i18n from './i18n.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import DatetimePicker from 'vuetify-datetime-picker'
import VueClipboards from 'vue-clipboards';
import { VueMasonryPlugin } from 'vue-masonry';
import VueSilentbox from 'vue-silentbox'
import vGallery from 'v-gallery'
import VueFlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
//import './bootstrap.css';
import 'flatpickr/dist/themes/material_blue.css';


import store from './store/resif-store-orcid'

axios.interceptors.request.use(
    config => {
        if (store.getters.getToken) {
            config.headers["Authorization"] = "Bearer " + store.getters.getToken;
        }
        return config;
    },
    error => {
        Promise.reject(error);
    }
);

import Vue2Crumbs from 'vue-2-crumbs'
Vue.use(Vue2Crumbs)
Vue.use(vGallery)

Vue.use(VueSilentbox)
Vue.use(VueMasonryPlugin)
Vue.use(moment)
Vue.use(DatetimePicker)
Vue.use(VueAxios, axios)
Vue.use(Vuetify)
Vue.use(VueClipboards)
Vue.config.productionTip = false

Vue.prototype.$maxZoom = 17
Vue.prototype.$maxFitZoom = 13

new Vue({
    vuetify,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app')