<template>
<v-app>

  <v-navigation-drawer style="    z-index: 0 !important" class="ml-4" app>
    <v-sheet style="margin-top:80px">
      <v-list>
        <v-list-item-group v-model="index">
          <v-list-item active-class="active" @click="$vuetify.goTo('#detail', {duration: 300, offset: 90, easing: 'easeInOutCubic' })">
            Station detail
          </v-list-item>
          <v-list-item @click="$vuetify.goTo('#mapextent', option)" active-class="active">
            Geographic extent
          </v-list-item>
    
            <v-list-item @click="$vuetify.goTo('#data', option)" active-class="active">
              Data availability
            </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>
  </v-navigation-drawer>

  <v-container fluid>

    <v-row>
      <v-col>
        <v-card width="100%" elevation="0">
          <v-card-title style="background-color:#e36517;" class="headline pa-2 white--text">
          Station {{networkCode}}.{{stationCode}}
          </v-card-title>
          <v-tabs :grow="true" v-model="tab">
            <v-tab :eager="true">
              Station information
            </v-tab>
            <v-tab eager>
              Channels
            </v-tab>

          </v-tabs>
          <v-tabs-items eager v-model="tab">
            <v-tab-item :eager="true">

              <v-card class="elevation-0">
                <v-row>
                  <v-card-title>
                    <span id="detail" class="display-1 ml-3 mt-6"> Station detail</span></v-card-title>
                </v-row>

                <v-list>
                  <template v-for="(description,key,index) in StationDescription">
                    <span >
                    <v-list-item v-if="description !==''" :key='description+index'>
                      <v-list-item-content v-if="key === 'siteName'">
                        <v-list-item-title class="title">
                          <v-icon color="rgb(254, 211, 129)">{{iconselector(key)}}</v-icon> {{decamelize(key, " ")}}
                        </v-list-item-title>
                        <v-sheet class=" mt-2" v-if="!Object.values(siteDetail).every(o => o === null)">
                          <v-expansion-panels popout>
                            <v-expansion-panel>
                              <v-expansion-panel-header>{{siteName}}</v-expansion-panel-header>
                              <v-expansion-panel-content>
                                country: {{siteDetail.siteCountry}}
                                town: {{siteDetail.siteTown}}
                                county: {{siteDetail.siteCounty}}
                                region: {{siteDetail.siteRegion}}
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-sheet>
                        <v-sheet v-else>
                          <v-sheet class="ml-8 mt-2">
                            <span class=" mt-2">{{description}}</span>
                          </v-sheet>
                        </v-sheet>
                      </v-list-item-content>
                      <v-list-item-content v-else>
                        <v-list-item-title class="title">
                          <v-icon color="rgb(254, 211, 129)">{{iconselector(key)}}</v-icon> {{decamelize(key, " ")}}
                        </v-list-item-title>
                        <v-sheet class="ml-8 mt-2" max-width="95%">
                          <span class=" mt-2">{{description}}</span>
                          
                        </v-sheet>
                      </v-list-item-content>

                    </v-list-item>
                    </span>
                  </template>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="title">
                        <v-icon color="rgb(254, 211, 129)">mdi-city-variant-outline</v-icon> Operators
                      </v-list-item-title>


                      <div v-for="(operator,index) in operators" :key="index" class="pa-3">
                      <div class="text-subtitle-1 font-weight-medium">{{operator.agency}}</div>
                      <div>
                        <div v-if="operator.email" class="pl-2"><v-icon small class="mr-2">mdi-email-outline</v-icon> {{operator.email}}</div>
                        <div v-if="operator.webSite" class="pl-2"><v-icon small class="mr-2">mdi-web</v-icon><a target="_blank" :href="operator.webSite" >{{operator.webSite}}</a> </div> 
                      </div>
                      </div>


                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="title">
                        <v-icon color="rgb(254, 211, 129)">mdi-comment-processing-outline</v-icon> Comments
                      </v-list-item-title>
                      <span v-if="comments && comments.length>0">
                      <v-data-iterator :items="comments" item-key="value" :items-per-page="2" no-data-text="-">
                        <template v-slot:default="{ items }">

                          <v-col v-for="(com, index) in items" :key='com.value+index' cols="6">
                            <v-card class="ml-8 pa-4" outlined elevation="0">

                              <span class="pl-1"> Content</span><span class=" font-weight-medium"> : {{com.value}}<br> </span>

                              <v-expansion-panels v-if="com.authors == []" flat>
                                <v-expansion-panel class="pa-0" v-for="(author,index) in com.authors " :key="index">
                                  <v-expansion-panel-header class="pa-0 " @click="myFilter">
                                    <template v-slot:actions>

                                    </template>

                                    <template v-slot:default>

                                      <v-icon :class="{'icon-rotat' : isActive}">mdi-chevron-down</v-icon>

                                      <span v-if="author.name"> Author : {{author.name}} </span><span class="grey--text"> &nbsp ( {{com.beginEffectiveTime.substring(10,0)}}
                                        <v-icon small>mdi-arrow-right</v-icon>
                                        <span class="grey--text" v-if="com.endEffectiveTime.substring(4,0) !== '2500' && com.endEffectiveTime != '' "> {{com.endEffectiveTime.substring(10,0)}}</span>
                                        <v-icon medium color="grey" v-else>mdi-infinity</v-icon> )
                                      </span>

                                    </template>

                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <p v-if="author.agency" class="subtitle-2 mb-0	">
                                      <v-icon small>mdi-home-city-outline </v-icon>Agency : {{author.agency}}
                                    </p>
                                    <p v-if="author.phone" class="subtitle-1 mb-0	">
                                      <v-icon small>mdi-card-account-phone-outline</v-icon> phone:{{author.phone}}
                                    </p>
                                    <p v-if="author.email" class="subtitle-2 mb-0	">
                                      <v-icon small>mdi-email-edit-outline</v-icon> Email : <a :href='`mailto:${author.email}`'>{{author.email}}</a>

                                    </p>

                                  </v-expansion-panel-content>
                                </v-expansion-panel>
                              </v-expansion-panels>

                              <span v-else class="grey--text"><br> ( {{com.beginEffectiveTime.substring(10,0)}}
                                <v-icon small>mdi-arrow-right</v-icon>
                                <span class="grey--text" v-if="com.endEffectiveTime.substring(4,0) !== '2500' && com.endEffectiveTime != '' "> {{com.endEffectiveTime.substring(10,0)}}</span>
                                <v-icon medium color="grey" v-else>mdi-infinity</v-icon>)
                              </span>
                            </v-card>
                          </v-col>

                        </template>

                      </v-data-iterator>
                      </span>
                      <span v-else>
                        No available comment 
                      </span>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="ml-4 title">
                      <v-icon color="rgb(254, 211, 129)">mdi-card-text-outline</v-icon> {{decamelize('export', " ")}}
                    </v-list-item-title>
                    <span class="ml-12 mt-2"> <span>
                        <v-btn class="mr-2 white--text elevation-0" tile @click="download('XML')" small color="#006F7F">XML</v-btn>
                      </span>
                      <span>
                        <v-btn class="mr-2 white--text elevation-0" tile @click="download( 'Text')" small color="#006F7F">Text</v-btn>
                      </span>
                      <span>
                        <v-btn v-if="false" class="mr-2 elevation-0" tile @click="canvasToPDf()" small color="primary">PDF</v-btn>

                      </span>

                    </span>
                  </v-list-item-content>
                </v-list>
                <v-row>
                  <v-card-title>
                    <span id="mapextent" class="display-1 ml-3 mt-6">Geographical Extent</span>
                  </v-card-title>

                </v-row>

                <v-sheet>
                  <v-sheet ref="mapStationDetail" class="mapnetwork">
                    <div ref="initZoomButton">
                      <div class="ol-full-screen ol-unselectable ol-control" style="margin-top:60px">
                        <button @click="initZoom()" title="reinitilize Zoom" class="ol-zoom-out" type="button"><span class="mdi mdi-restart"></span></button>
                      </div>
                    </div>
                    <div ref="layercontrol">
                      <v-menu class="white--text" left offset-x content-class="my-menu" :close-on-content-click="false">
                        <template v-slot:activator="{ on }">
                          <div style="margin-top:30px" class="ol-full-screen ol-unselectable ol-control">
                            <button title="Zoom in" class="ol-zoom-in" type="button"><span class="mdi mdi-layers-triple" v-on="on"></span></button> </div>

                        </template>
                        <v-radio-group small v-model="layerdisplay">

                          <v-radio small class=" mx-2" label="Open street map" value="open_street_map"></v-radio>
                          <v-radio class="ml-2" label="Open topo map" value="open_topo_map"></v-radio>
                          <v-radio class="ml-2" label="Satellite" value="satellite"></v-radio>
                        </v-radio-group>
                      </v-menu>
                    </div>
                  </v-sheet>
                  <v-row v-if="yearArray.length>0">
                    <v-card min-height="500px" flat width="100%">
                      <v-card-title primary-title>
                        <span id="data" class="display-1 ml-3 mt-6">Data availability <v-icon :title="dataAvailabilityTooltip">mdi-information</v-icon></span>
                      </v-card-title>
                      <v-row >
            <v-col cols="6" offset="5" >Qualities: <span class="font-weight-medium mx-2">Q</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#1B5E20"></div> <span class="font-weight-medium mx-2">M</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#388E3C"></div>     <span class="font-weight-medium mx-2">D</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#FF6F00"></div>   <span class="font-weight-medium mx-2">R</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#B71C1C"></div> </v-col>
          </v-row>
                      <v-row >

                        <v-col offset="3">

                        </v-col>
                        <v-col cols="3">

                          <v-select :items="yearArray" v-model="yearvalue" label="Select year"></v-select>

                        </v-col>
                        <v-col offset="3"></v-col>
                      </v-row>

 <v-col  v-if="loadingData" cols="12">
                      <v-progress-linear height="2" :indeterminate="true"  ></v-progress-linear>
                      Loading ...
                </v-col>

                      <v-sheet tag="div" style="margin: 0 auto; width: 100%;padding: 10px" class="visavail" id="visavail_container">

                        <v-alert outlined v-if="nodataA" class="text-center" type="warning" icon=false :value="true">
                          No data available
                        </v-alert>
                        <p id="visavail_graph">
                          <!-- Visavail.js chart will be placed here -->
                        </p>
                      </v-sheet>
                    </v-card>

                  </v-row>
                  <div ref="popup" class="ol-popup ">
                    <v-card elevation="6" style="border-radius:12px; background-color:rgba(0,0,0,0.6)">
                      <span href="#" ref="popupCloser" class="clickable ol-popup-closer-1">
                        <v-icon color="white">clear </v-icon>
                      </span>
                      <v-card-title class="text--white" style="border-radius:10px">
                        <v-chip small color="primary"><span ref="popupTitle"></span></v-chip>
                      </v-card-title>
                      <v-card-text>
                        <div style="color:white" ref="popupContent"></div>
                      </v-card-text>
                      <v-card-actions>
                        <span style="color: white;" ref="detaiLink"></span>
                      </v-card-actions>
                    </v-card>
                  </div>
                </v-sheet>

              </v-card>

              <div id="map" class="mapdetail"></div>
              <div id="popup" class="ol-popup v-tooltip__content menuable__content__active">
                <a href="#" id="popup-closer" class="ol-popup-closer"> </a>
                <div id="popup-content"></div>
              </div>

            </v-tab-item>
            <v-tab-item :eager="true">
              <resif-station-detail-channel :networkCode="networkCode" :stationCode="stationCode" :channelCode="channelId" :locationCode="locationId"  :channelStartDate="channelStartDate" :sensorInformation="sensorInformation"></resif-station-detail-channel>
            </v-tab-item>
          </v-tabs-items>
        </v-card>

        <canvas style="width:1000px" v-show="false" id="mapCanvas" crossorigin="anonymous"></canvas>
      </v-col>
    </v-row>
  </v-container>
</v-app>
</template>

<script>
import * as visavail from "visavail";
import moment from "moment";
import "visavail/visavail.css";
import "visavail/visavail.js";
import * as d3 from "d3";
// DOM element where the Timeline will be attached
import "ol/ol.css";
import { defaults as defaultControls, Control } from "ol/control";
import Map from "ol/Map";
import View from "ol/View";
import LayerGroup from "ol/layer/Group";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import WMS from "ol/source/TileWMS";
import { transformExtent } from "ol/proj.js";
import GeoJSON from "ol/format/GeoJSON";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Overlay from "ol/Overlay";
import FullScreen from "ol/control/FullScreen";
import WFS from "ol/format/WFS";
import TileWMS from "ol/source/TileWMS";
import { RegularShape } from "ol/style";
import resifStationDetailChannel from "./resif-station-detail-channel"
export default {
  name: "resif-station-detail",
  components: { resifStationDetailChannel },
  computed: {

    dataAvailabilityTooltip() {
      return "At the network level, the figure represents for each year and each"+
" station the continuity of the data of the vertical component of the velocimetric sensor. When several channels are available,  the channel"+
" corresponding to the widest frequency range at the highest sampling frequency is shown. All available data segments are displayed according to their quality (R,D,M,Q)."
+"\n\n"
+"At the station level, the data continuity is represented by year for all channels and all data qualities (R,D,M,Q).\n\n"
+"At channel level the data continuity is represented per year for all data qualities (R,D,M,Q)."
    },

    storeWrapper() {
      if (this.$store) {
        return this.$store
      } else {
        return this.store
      }
    },

    service() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifService;
      }
      return null
    },

 wsService() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifWsService;
      }
      return null
    },


  },
  props: {
    networkidentifier: {
      Type: String,
      default: ""
    },

    stationidentifier: {
      Type: String,
      default: ""
    },

    type: {
      Type: Boolean,
      default: false
    }
  },
  data: () => ({
    loadingData: false,
    index:0,
    nodataA: false,
    comments: [],
    operators: [],
    stationvalue: "",
    yearvalue: null,
    titleicon: {

      siteName: "mdi-map",
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      code: "mdi-card-text-outline",
      type: "mdi-cog",
      citationInformation: "mdi-comment-quote-outline",
      networkCode: "mdi-share-variant",
      state: "mdi-state-machine",
      restrictedStatus: "mdi-lock",
      totalNumberStations: "mdi-matrix",
      startDate: "mdi-calendar-text",
      endDate: "mdi-calendar-text",
      agency: "mdi-city-variant-outline",
      webSite: "mdi-web",
      email: "mdi-email-outline"
    },
    isActive: false,
    tab: null,
    siteName: ``,
    siteDetail: {
      siteCountry: ``,
      siteTown: ``,
      siteCounty: ``,
      siteRegion: ``
    },
    timeline: null,
    sensorInformation: null,
    netid: "",
    satid: "",
    channelId: "",
    locationId: "",
    channelStartDate: "",
    networkCode: "",
    stationCode: "",
    endDate: "",
    layerdisplay: "satellite",
    StationDescription: [],
    code: "",
    description: "",
    restrictedStatus: "",
    startDate: "",
    totalNumberStations: "",
    alternateCode: "",
    vectorLayer: null,
    vectorSource: null,
    map: null,
    geoJsonStation: null,
    overlay: null,
    yearArray: [],
    stationArray: []
  }),
  created() {

    this.netid = this.$route.params.nertworkId;
    this.satid = this.$route.params.stationId;

    if (this.$route.params.channelId) {
      this.channelId = this.$route.params.channelId;
    }
    else {
      this.channelId =""
    }

    if (this.$route.params.locationId) {
      this.locationId = this.$route.params.locationId;
    }
    else {
      this.locationId =""
    }

     if (this.$route.params.startDate) {
      this.channelStartDate = this.$route.params.startDate;
    }
    else {
      this.channelStartDate =""
    }

    if (this.stationidentifier.length>0) {
      this.satid = this.stationidentifier
    }

     if (this.stationidentifier.length>0) {
      this.netid = this.networkidentifier
    }

    this.dataAvailability()
  },

  mounted() {

    this.initMap();

    setTimeout(() => { this.map.updateSize(); }, 200)

    let url =
      this.service+"/station/v1_0/station?station=" +
      this.satid +
      "&network=" +
      this.netid;

    this.axios.get(url).then(response => {
      
      let data = response.data.properties;
      
      this.networkCode = data.networkCode
      this.stationCode = data.code
      this.startDate = data.startDate ? data.startDate.substring(0, 10) : ``
      this.endDate = data.endDate

      let startyear = this.startDate.substring(0, 4);
      let endYear = new Date().getFullYear();
      let aux = parseInt(this.endDate.substring(0, 4));
      if (aux < endYear) {
        endYear = aux;
      }
      let yearArray = [];
      for (let i = endYear; i >= startyear; i--) {
        yearArray.push(i)
      }
      this.yearArray = yearArray;
      this.yearvalue = yearArray[0]


      this.siteName = data.site.name ? data.site.name : ``
      this.siteDetail.siteCountry = data.site.country ? data.site.country : null
      this.siteDetail.siteTown = data.site.town ? data.site.town : null
      this.siteDetail.siteCounty = data.site.county ? data.site.county : null
      this.siteDetail.siteRegion = data.site.region ? data.site : null
      this.operators = data.operators
      this.comments = data.comments.sort((a, b) => {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.beginEffectiveTime) - new Date(a.beginEffectiveTime);
      });
      this.sensorInformation = data.sensors
      this.StationDescription = {
        code: data.code ? data.code : ``,
        networkCode: data.networkCode ? data.networkCode : ``,
        siteName: data.site.name ? data.site.name : ``,
        type: data.type ? data.type : ``,
        state: data.state ? data.state : ``,
        restrictedStatus: data.restrictedStatus ? data.restrictedStatus : ``,
        startDate: data.startDate ? data.startDate.substring(0, 10) : ``,
        endDate: data.endDate.substring(0, 4) !== "2500" ?
          data.endDate.substring(0, 10) : "",
      };
      

      let toto = new GeoJSON({ featureProjection: "EPSG:4326" });
      this.geoJsonStation = {
        crs: {
          type: "name",
          properties: {
            name: "EPSG:4326"
          }
        },
        type: "FeatureCollection",
        features: response.data
      };
      this.vectorSource = new VectorSource({
        wrapX: false,
        features: toto.readFeatures(response.data)
      });
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
        style: this.styleFunction
      });

      this.baselayers = new LayerGroup({
        title: "Basemaps",
        layers: [
          new TileLayer({
            extent: transformExtent(
              [-180, -90, 180, 90],
              "EPSG:4326",
              "EPSG:3857"
            ),
            source: new OSM({ wrapX: false }),
            visible: false,
            layer: "open_street_map"
          }),
          new TileLayer({
            visible: false,
            source: new XYZ({
              url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
              wrapX: false
            }),
            tilePixelRatio: 10,
            layer: "open_topo_map"
          }),
          new TileLayer({

            extent: transformExtent(
              [-180, -90, 180, 90],
              "EPSG:4326",
              "EPSG:3857"
            ),
            source: new XYZ({
              wrapX: false,

              url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }),
            layer: "satellite"
          })
        ]
      });
      this.map.setLayerGroup(
        new LayerGroup({
          layers: [this.baselayers]
        })
      );
      this.map.addLayer(this.vectorLayer);
      this.map.getView().fit(this.vectorSource.getExtent(), {
        size: this.map.getSize(),
        maxZoom: this.$maxFitZoom
      });
    });

    if ((this.channelId.length>0) &&  (this.locationId.length>0)) {
      //As of one channel and location are present in the URL we activate the channel tab.
      this.tab = 1
    }

  },
  watch: {
    stationvalue() {
      this.dataAvailability()
    },
    yearvalue() {
      d3.select("#visavail_graph").html(null);
      this.loadingData = true;
      this.dataAvailability()
    },
    layerdisplay(val, o) {
      
      this.baselayers.getLayers().forEach((element, index, array) => {
        if (val === element.values_.layer) {
          element.setVisible(true);
        } else {
          element.setVisible(false);
        }
      });
    },
  },
  methods: {
    dataAvailability() {

      if (!this.yearvalue) {
        return
      }
      
      this.axios
        .get(this.wsService+`/fdsnws/availability/1/query?mergegaps=3600&merge=samplerate,overlap&includerestricted=true&net=${this.removeTemporaryYear(this.netid)}&sta=${this.satid}&start=${this.yearvalue}-01-01T00:00:00	&end=${this.yearvalue}-12-31T23:59:59&format=json`)
        .then(response => {
          
          let dataAvailabilityDataSet = [];

          // le jsodata.datasourcesn est parsé et les dates sont mises au format attendu par visavail
          this.nodataA = false
          if (response.data.datasources) {
            response.data.datasources.map(channel => {
              

              if (channel.timespans.length > 0) {
                dataAvailabilityDataSet.push({

                  measure: `${channel.station}-${channel.channel}-${channel.location}`,
                  measure_description: `${channel.station}-${channel.channel}-${channel.location}-${channel.quality}`,
                  "categories": {
            "Quality M": {class: "m-quality" },
            "Quality Q": {class: "q-quality"},
            "Quality R": {class: "r-quality" },
            "Quality D": {class: "d-quality"},
        },
                  data: channel.timespans.map((t) => {
                    return [
                      moment.utc(t[0]).format("YYYY-MM-DD HH:mm:ss"),
                      "Quality "+channel.quality,
                      moment.utc(t[1]).format("YYYY-MM-DD HH:mm:ss")
                    ];
                  })
                });
              }
            })
          } else {
            this.nodataA = true
          }

          const timelineOptions = {
            id_div_container: "visavail_container",
            id_div_graph: "visavail_graph",
            custom_categories: true,
            zoom: {
              enabled: true
            },
            title: {
              enabled: false
            },
            sub_title: {
              enabled: false
            },
            legend: {
              enabled: false
            },
            responsive: {
              enabled: true,
            },
            line_spacing: 5,
            tooltip: {
              height: 180,
              width: 300,
              // class: 'tooltip-class',
              position: "overlay",
              left_spacing: 20,
              only_first_date: false,
              date_plus_time: true
            }
          };
          visavail.generate(timelineOptions, dataAvailabilityDataSet);

          this.loadingData = false
        })
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    myFilter() {
      this.isActive = !this.isActive;

    },
    download(type, identifier) {
      let baseUrl = this.wsService+`/fdsnws/station/1/query?network=${this.networkCode}`
      let startDateMinusOne = moment(this.startDate).subtract(1, 'd').format('YYYY-MM-DD');
      let endDatePlusOne = moment(this.endDate).add(1, 'd').format("YYYY-MM-DD");
      baseUrl = baseUrl + `&startafter=${startDateMinusOne}&endbefore=${endDatePlusOne}&level=channel`;

      let serviceUrl = "";
      if (type === "Text") {
        serviceUrl = baseUrl + `&format=text&station=${this.stationCode}`;
      } else if (type === "XML") {
        serviceUrl = baseUrl + `&station=${this.stationCode}`;
      }
      window.open(serviceUrl, "_blank");
    },
    iconselector(title) {
      return this.titleicon[title];
    },
    decamelize(str, separator) {
      if (str === "FDSNcode") {
        return "FDSN code";
      } else {
        separator = typeof separator === "undefined" ? "_" : separator;
        let final = str
          .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
          .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
          .toLowerCase();
        return final.charAt(0).toUpperCase() + final.slice(1);
      }
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    initMap() {
      var container = this.$refs.popup;
      var content_element = this.$refs.popupContent;
      var closer = this.$refs.popupCloser;
      var titlePopUp = this.$refs.popupTitle;
      var detailStation = this.$refs.detaiLink;
      this.map = new Map({
        layers: [],
        target: this.$refs.mapStationDetail.$el,
        view: new View({
          center: [0, 0],
          projection: 'EPSG:4326',
          smoothExtentConstraint: false,
          zoom: 2.5,

          minZoom: 2,

          maxZoom: this.$maxZoom
        })
      });
      var layerbutton = new Control({
        element: this.$refs.layercontrol
      });
      this.map.addControl(layerbutton);
      var restartZoombutton = new Control({
        element: this.$refs.initZoomButton
      });
      this.map.addControl(restartZoombutton);
      var overlay = new Overlay({
        stopEvent: true,
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 150
        }
      });
      this.map.addOverlay(overlay);
      closer.onclick = () => {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
      var fullscreen = new FullScreen();
      this.map.addControl(fullscreen);
      this.map.on("click", evt => {
        
    
        var feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          (feature, layer) => {
            
          
            return feature;
          }
        );
        if (feature) {
          
          let geometry = feature.getGeometry();
          let coord = geometry.getCoordinates();
          let tileContent = `${feature.get("networkCode")}.${feature.get("code")}`;
          let detail = ``; // #/networkDetail/'+netid+'/'+item.detail

          let content = `
         Longitude:  ${parseFloat(feature.get("longitude")).toFixed(4)} <br>
         Latitude:  ${parseFloat(feature.get("latitude")).toFixed(4)}<br>
         Elevation:  ${parseFloat(feature.get("elevation")).toFixed(2)}<br>
         Site: ${feature.get("site").name}<br>
        `;

          detailStation.innerHTML = detail;
          titlePopUp.innerHTML = tileContent;
          content_element.innerHTML = content;
          overlay.setPosition(coord);
          
        } else {
          overlay.setPosition(undefined);
          closer.blur();
        }
      });
      this.map.on("pointermove", e => {
        if (e.dragging) return;

        var pixel = e.map.getEventPixel(e.originalEvent);
        // initialize the hit variable to false (not found)
        var hit = false;
        e.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
          if (feature) {
            //IF we have found the layer, flag it (but don't return anything!)
            hit = true;
          }
        });

        e.map.getTargetElement().style.cursor = hit ? "pointer" : "";
      });

    },
    initZoom() {
      this.map.getView().fit(this.vectorSource.getExtent(), {
        size: this.map.getSize(),
        maxZoom: this.$maxFitZoom
      });
    },
    decamelize(str, separator) {
      separator = typeof separator === "undefined" ? "_" : separator;

      let final = str
        .replace(/([a-z\d])([A-Z])/g, "$1" + separator + "$2")
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + separator + "$2")
        .toLowerCase();

      return final.charAt(0).toUpperCase() + final.slice(1);
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    


    removeTemporaryYear(networkCode) {
      if (networkCode.indexOf("__")>=0) {
        return networkCode.split("__")[0]
      } else {
        return networkCode
      }
    },

    canvasToPDf() {

      this.map.once('rendercomplete', () => {
        
        var mapCanvas = document.getElementById('mapCanvas');
        var size = this.map.getSize();
        mapCanvas.width = size[0];
        mapCanvas.height = size[1];
        var mapContext = mapCanvas.getContext('2d');
        
        Array.prototype.forEach.call(document.querySelectorAll('canvas.ol-unselectable '), (canvas) => {
          
          if (canvas.width > 0) {
            var opacity = '1';
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
            canvas.style.transform = "matrix(1, 0, 0, 1, 0, 0)"
            var transform = canvas.style.transform;
            
            // Get the transform parameters from the style's transform matrix
            var matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
            mapContext.drawImage(canvas, 0, 0);

          }
        });

        // link download attribuute does not work on MS browsers
        //navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
        mapCanvas.toBlob(blob => {
          
          var formData = new FormData();

          formData.append('networkMap', blob);
          $.ajax({
            method: "POST",
            processData: false,
            contentType: false,
            url: this.service+`/station/v1_0/print?station=${this.stationCode}&network=${this.networkCode}`,
            data: formData
          }).done((o) => {
            
            let binaryString = window.atob(o);
            let binaryLen = binaryString.length;
            let bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
              let ascii = binaryString.charCodeAt(i);
              bytes[i] = ascii;
            }

            let blob = new Blob([bytes], { type: "application/pdf" });
            let link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${this.networkcode}.${this.stationCode}.pdf`;
            link.click();
            
          });

        }, "image/png", 1);

      });
      this.map.renderSync();

    },
    styleFunction() {
      let style = null;

      let now = new Date()
      let aux = this.StationDescription.endDate.split("T")[0]
      let endDate = new Date(aux)
      if (now > endDate) {
        style = new Style({
          image: new RegularShape({
            fill: new Fill({
              color: "rgba(255, 48, 48, 0.6)"
            }),
            stroke: new Stroke({
              color: "black",
              width: 1
            }),
            points: 3,
            radius: 10,
            angle: 0
          })
        });
      } else {
        style = new Style({
          image: new RegularShape({
            fill: new Fill({
              color: "rgba(81, 255, 81, 0.6)"
            }),
            stroke: new Stroke({
              color: "black",
              width: 1
            }),
            points: 3,
            radius: 10,
            angle: 0
          })
        });
      }

      return style;
    }
  }
};
</script>

<style>
.clickable {
  cursor: pointer;
}

.mapdetail {
  height: 500px;
}

.m-quality {
  fill: #388E3C;
}

.q-quality {
  fill: #1B5E20;
}

.r-quality {
  fill: #B71C1C;
}

.d-quality {
  fill: #FF6F00;
}

.icon-rotat {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.ol-popup {
  position: absolute;
  width: 450px;
  padding: 15px;
  border-radius: 5px;
  bottom: 12px;
  left: -50px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: rgba(0, 0, 0, 0.6);
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  size: 20px;
}

.ol-popup-closer:after {
  content: "✖";
  color: rgb(217, 217, 217);
}

.link_detail {
  -webkit-text-stroke: 0.1px;
  -webkit-text-stroke-color: rgb(217, 217, 217);
}

.ytitle {
  font-size: 0.7rem !important;
  font-family: "Roboto", sans-serif !important;
}

.visavail-tooltip div.tooltip-overlay {
  width: 300px;
  text-align: center;
}

.visavail-tooltip .tooltip_has_data {
    margin-right: 10px;
}
</style>
