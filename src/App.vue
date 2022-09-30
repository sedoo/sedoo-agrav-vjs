<template>
  <div>
       <resifBrowseByNetworks></resifBrowseByNetworks>
  </div>

</template>

<script>
import resifUrlBuilder from "./components/resif-url-builder/resif-url-builder";
import resifStationUrlBuilder from "./components/resif-station-url-builder/resif-station-url-builder";
import resifAvailabilityUrlBuilder from "./components/resif-availability-url-builder/resif-availability-url-builder";
import resifProductDownload from "./components/resif-product-download/resif-product-download"
import resifStationDetail from "./components/resif-station-description/resif-station-detail"
import resifWfcatalogueUrlBuilder from "./components/resif-Wfcatalogue-url-builder/resif-Wfcatalogue-url-builder"
import resifBrowseByNetworks from "./components/resif-seismic-network/resif-browse-by-networks"
import resifBrowseByProviders from "./components/resif-seismic-network/resif-browse-by-providers"
import resifBrowseByStations from "./components/resif-seismic-network/resif-browse-by-stations"
import resifStationProvider from "./components/station-provider/resif-station-provider"
import resifProvider from "./components/station-provider/resif-provider"
import resifBrowseStation from "./components/resif-browse-by-station/resif-browse-station"
import resifBrowseByStation from "./components/resif-browse-by-station/resif-browse-by-station"
import resifAskRestrictedData from "./components/resif-ask-restircted-data/resif-ask-restircted-data"
import resifAskAdmin from './components/resif-ask-restircted-data/resif-ask-admin.vue'
import resifCacheAdmin from './components/resif-admin/resif-cache-admin.vue'
import resifNetworkManager from './components/resif-ask-restircted-data/resif-network-manager'
import resifOrcid from './components/resif-orcid/resif-orcid.vue'
import resifStats from './components/resif-stats.vue'

export default {
  name: "App",
  components: {
    resifAskAdmin,
    resifCacheAdmin,
    resifStationUrlBuilder,
    resifAvailabilityUrlBuilder,
    resifProductDownload,
    resifWfcatalogueUrlBuilder,
    resifStationProvider,
    resifStationDetail,
    resifProvider,
    resifBrowseByNetworks,
    resifBrowseByProviders,
    resifBrowseByStation,
    resifBrowseStation,
    resifBrowseByStations,
    resifUrlBuilder,
    resifAskRestrictedData,
    resifNetworkManager,
    resifAskAdmin,
    resifOrcid,
    resifStats
  },

  data: () => ({
    date: "lol",
    // Get more form https://chmln.github.io/flatpickr/options/
    config: {
      wrap: true, // set wrap to true only when using 'input-group'
      dateFormat: 'Z',
      altInput: true,
      altFormat: 'Z',
      enableTime: true,
      enableSeconds: true,
      allowInput: true,
      clickOpens: false
    }
  })
}
</script>
