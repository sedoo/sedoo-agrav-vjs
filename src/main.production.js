//import module

import Vue from "vue";
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify/lib';
//import 'vuetify/dist/vuetify.min.css'
import vueCustomElement from 'vue-custom-element'
import DatetimePicker from 'vuetify-datetime-picker'

import VueClipboards from 'vue-clipboards';
import { VueMasonryPlugin } from 'vue-masonry';
import VueSilentbox from 'vue-silentbox'

//import component 
import resifAvailabilityUrlBuilder from "./components/resif-availability-url-builder/resif-availability-url-builder.vue"
import resifStationUrlBuilder from "./components/resif-station-url-builder/resif-station-url-builder.vue"
import resifUrlBuilder from "./components/resif-url-builder/resif-url-builder.vue"
import resifSeismicNetworkByNetwork from "./components/resif-seismic-network/resif-seismic-network-by-network.vue"
import resifProductDownload from "./components/resif-product-download/resif-product-download"
import resifWfcatalogueUrlBuilder from "./components/resif-Wfcatalogue-url-builder/resif-Wfcatalogue-url-builder.vue"
import resifStationProvider from "./components/station-provider/resif-station-provider.vue"
import resifProvider from "./components/station-provider/resif-provider.vue"
import resifBrowseByStationResult from "./components/resif-browse-by-station/resif-browse-by-station-result.vue"
import resifBrowseByStation from "./components/resif-browse-by-station/resif-browse-by-station"
import resifBrowsStation from "./components/resif-browse-by-station/resif-browse-station.vue"
// import resifNetwork from "./components/resif-seismic-network/resif-network.vue"

import resifBrowseByNetworks from "./components/resif-seismic-network/resif-browse-by-networks";
import resifBrowseByProviders from "./components/resif-seismic-network/resif-browse-by-providers";
import resifBrowseByStations from "./components/resif-seismic-network/resif-browse-by-stations";


import resifAskRestirctedData from "./components/resif-ask-restircted-data/resif-ask-restircted-data.vue"
import resifNetworkManager from './components/resif-ask-restircted-data/resif-network-manager'
import resifAskAdmin from "./components/resif-ask-restircted-data/resif-ask-admin"
import store from './store/resif-store-orcid'
import resifCacheAdmin from './components/resif-admin/resif-cache-admin.vue'
import resifStat from './components/resif-stats.vue'


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

import resifOrcid from "./components/resif-orcid/resif-orcid.vue"
//import "document-register-element/build/document-register-element";
import routernetworks from "./router-networks";
import routerproviders from "./router-providers";
import routerstations from "./router-stations";

import vGallery from 'v-gallery'

import Vue2Crumbs from 'vue-2-crumbs'
Vue.use(Vue2Crumbs)

Vue.use(vGallery)
import VueFlatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'flatpickr/dist/themes/material_blue.css';
Vue.use(VueFlatPickr);


Vue.prototype.$maxZoom = 17
Vue.prototype.$maxFitZoom = 13

Vue.use(Vuetify);
let vuetify = new Vuetify({});
Vue.use(VueSilentbox)
Vue.use(VueMasonryPlugin)
Vue.use(vuetify)
Vue.use(vueCustomElement);
Vue.use(VueAxios, axios)
Vue.use(DatetimePicker)
Vue.use(VueClipboards)

const VueComponent = [
    resifBrowseByStation,
    resifStationUrlBuilder,
    resifUrlBuilder,
    resifAvailabilityUrlBuilder,
    resifSeismicNetworkByNetwork,
    resifProductDownload,
    resifBrowsStation,
    resifWfcatalogueUrlBuilder,
    // resifProvider,
    // resifNetwork,
    resifBrowseByNetworks,
    resifBrowseByProviders,
    resifBrowseByStations,
    resifStationProvider,
    resifBrowseByStationResult,
    resifAskRestirctedData,
    resifNetworkManager,
    resifAskAdmin,
    resifCacheAdmin,
    resifStat,
];
VueComponent.forEach(comp => {
    console.log("Start adding ", comp.name, " to custome element ...")
    comp.vuetify = vuetify;
    if (comp.name == "resif-browse-by-networks") {
        comp.router = routernetworks
    } else if (comp.name == "resif-browse-by-providers") {
        comp.router = routerproviders;
    } else if (comp.name == "resif-browse-by-providers") {
        comp.router = routerproviders;
    } else if (comp.name == "resif-browse-by-stations") {
        comp.router = routerstations;
    }
    comp.store = store

    Vue.customElement(comp.name, comp)
    console.log("Finish adding ", comp.name, " to custome element")
})


resifOrcid.vuetify = vuetify
resifOrcid.store = store
Vue.customElement(resifOrcid.name, resifOrcid)
const urlCdnStyle = [
    "https://fonts.googleapis.com/css?family=Material+Icons",
    "https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.2.45/css/materialdesignicons.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/svg-with-js.css",
    "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v6.0.1/css/ol.css",
    "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
]

const urlCdnScript = [
        "https://unpkg.com/moment@2.24.0/min/moment.min.js",
        "https://unpkg.com/moment@2.24.0/locale/fr.js",
        "'https://code.jquery.com/jquery-1.12.4.min.js'"
    ]
    // adding CDN css font url
urlCdnStyle.forEach(CdnStyleUrl => {
    console.log("add style cdn url : ", CdnStyleUrl)
    let styleTag = document.createElement("link");
    styleTag.href = CdnStyleUrl;
    styleTag.rel = "stylesheet"
    document.getElementsByTagName('head')[0].appendChild(styleTag);
})

// adding CDN script  url
urlCdnScript.forEach(CdnScriptUrl => {
    console.log("add script cdn url : ", CdnScriptUrl)
    let scriptTag = document.createElement("script");
    scriptTag.src = CdnScriptUrl;
    scriptTag.type = "text/javascript"
    document.getElementsByTagName('head')[0].appendChild(scriptTag);
})