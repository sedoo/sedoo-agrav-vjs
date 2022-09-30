import Vue from "vue"
import Router from "vue-router"
import resifLogging from './components/resif-orcid/resif-orcid-logging.vue'
import resifOrcidLoading from './components/resif-orcid/resif-orcid-loading.vue'
import resifOrcidLogged from './components/resif-orcid/resif-orcid-logged.vue'
Vue.use(Router)

export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    mode: "hash",

    routes: [

        {
            path: '/',
            name: 'logging',
            component: resifLogging,
        },
        {
            path: '/logging',
            name: 'resifOrcidLoading',
            component: resifOrcidLoading,

        },
        {
            path: '/loadingprofile',
            name: 'resifOrcidLogged',
            component: resifOrcidLogged,
        },
    ]
})