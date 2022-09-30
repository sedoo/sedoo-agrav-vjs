import VuexPersistence from 'vuex-persist'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let serviceurl = "";
if (process.env.NODE_ENV == "development") {
    serviceurl = "http://localhost:8493";
} else if (process.env.NODE_ENV == "production") {
    serviceurl = "https://services.aeris-data.fr/resif";
}

let wsserviceurl = "https://ws.resif.fr";

let pdfandspectroserviceurl = "";
if (process.env.NODE_ENV == "development") {
    pdfandspectroserviceurl = serviceurl + "/station/v1_0/image";
} else if (process.env.NODE_ENV == "production") {
    pdfandspectroserviceurl =
        "http://seismology.resif.fr/portailresif/rest/proxy/img";
}


const state = {
    username: "",
    orcid: "",
    token: "",
    profile: "",
    resifservice: serviceurl,
    resifwsservice: wsserviceurl,
    pdfandspectroserviceurl: pdfandspectroserviceurl,
    breadcrumbRoot: "ccc"
};

const getters = {

    getToken: state => state.token,
    getOrcid: state => state.orcid,
    getResifService: state => state.resifservice,
    getResifWsService: state => state.resifwsservice,
    getPdfAndSpectroServiceUrl: state => state.pdfandspectroserviceurl,
    getBreadcrumbRoot: state => state.breadcrumbRoot
}

const mutations = {

    setUsername(state, username) {
        state.username = username
    },
    setOrcid(state, orcid) {
        state.orcid = orcid
    },
    setToken(state, token) {
        state.token = token
    },
    setProfile(state, profile) {
        state.profile = profile
    },
    setBreadcrumbRoot(state, breadcrumbRoot) {
        state.breadcrumbRoot = breadcrumbRoot
    },
}
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})

export default new Vuex.Store({
    getters,
    state,
    mutations,
    plugins: [vuexLocal.plugin],
});