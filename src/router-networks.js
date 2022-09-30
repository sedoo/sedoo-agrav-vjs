import Vue from "vue";
import Router from "vue-router";
import resifSeismicNetworkByNetworkDescription from "./components/resif-seismic-network/resif-seismic-network-by-network-description.vue";
import resifSeismicNetworkByNetwork from "./components/resif-seismic-network/resif-seismic-network-by-network.vue";
import resifStationDetail from "./components/resif-station-description/resif-station-detail.vue";
Vue.use(Router);

export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    mode: "hash",

    routes: [{
            path: "/",
            name: "networks",
            component: resifSeismicNetworkByNetwork,
        },

        {
            path: "/:nertworkId",
            name: "networkDescription",
            component: resifSeismicNetworkByNetworkDescription,
        },

        {
            path: "/:nertworkId/:stationId",
            name: "stationDescription",
            component: resifStationDetail,
        },

        {
            path: "/:nertworkId/:stationId/:locationId",
            name: "channelDescription",
            component: resifStationDetail,
        },

        {
            path: "/:nertworkId/:stationId/:locationId/:channelId",
            name: "channelDescription",
            component: resifStationDetail,
        },

        {
            path: "/:nertworkId/:stationId/:locationId/:channelId/:startDate",
            name: "channelDescription",
            component: resifStationDetail,
        }
    ],
});