import Vue from "vue";
import Router from "vue-router";
import resifSeismicNetworkByNetworkDescription from "./components/resif-seismic-network/resif-seismic-network-by-network-description.vue";
import resifStationDetail from "./components/resif-station-description/resif-station-detail.vue";
import resifStationProvider from "./components/station-provider/resif-station-provider.vue";
Vue.use(Router);

export default new Router({
    scrollBehavior() {
        return { x: 0, y: 0 };
    },
    mode: "hash",

    routes: [{
            path: "/",
            name: "providers",
            component: resifStationProvider,
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