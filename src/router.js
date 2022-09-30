import Vue from "vue";
import Router from "vue-router";
import resifSeismicNetworkByNetworkDescription from "./components/resif-seismic-network/resif-seismic-network-by-network-description.vue";
import resifSeismicNetworkByNetwork from "./components/resif-seismic-network/resif-seismic-network-by-network.vue";
import resifStationDetail from "./components/resif-station-description/resif-station-detail.vue";
import resifStationProvider from "./components/station-provider/resif-station-provider.vue";
import resifBrowseByStation from "./components/resif-browse-by-station/resif-browse-by-station";
Vue.use(Router);

export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    mode: "hash",

    routes: [{
            path: "/networks",
            name: "networks",
            component: resifSeismicNetworkByNetwork,
        },

        {
            path: "/networks/:nertworkId",
            name: "resifSeismicNetworkByNetworkDescription",
            component: resifSeismicNetworkByNetworkDescription,
        },

        {
            path: "/networks/:nertworkId/:stationId",
            name: "resifStationDetail",
            component: resifStationDetail,
        },

        {
            path: "/providers",
            name: "providers",
            component: resifStationProvider,
        },

        {
            path: "/providers/:nertworkId",
            name: "resifSeismicNetworkByNetworkDescription",
            component: resifSeismicNetworkByNetworkDescription,
        },

        {
            path: "/providers/:nertworkId/:stationId",
            name: "resifStationDetail",
            component: resifStationDetail,
        },

        {
            path: "/stations",
            name: "stations",
            component: resifBrowseByStation,
        },

        {
            path: "/stations/:nertworkId",
            name: "resifSeismicNetworkByNetworkDescription",
            component: resifSeismicNetworkByNetworkDescription,
        },

        {
            path: "/stations/:nertworkId/:stationId",
            name: "resifStationDetail",
            component: resifStationDetail,
        },
    ],
});