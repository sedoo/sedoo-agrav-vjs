<template>
<span>

<v-app >

  <v-navigation-drawer style="    z-index: 0 !important" class="ml-4" app>
    <v-sheet style="margin-top:80px">
      <v-list>
        <v-list-item-group v-model="index">
          <v-list-item active-class="active" @click="$vuetify.goTo('#detail', {duration: 300, offset: 90, easing: 'easeInOutCubic' })">
            Network detail
          </v-list-item>
          <v-list-item @click="$vuetify.goTo('#data', option)" active-class="active">
            Data availability
          </v-list-item>
          <v-list-item @click="$vuetify.goTo('#mapextent', option)" active-class="active">
            Geographical extent
          </v-list-item>
          <v-list-item @click="$vuetify.goTo('#liste', option)" active-class="active">
            Station list
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>
  </v-navigation-drawer>

  <!-- Sizes your content based upon application components 

  <!-- Provides the application the proper gutter -->
  <v-container fluid>

    <v-row v-show="requestStatus=='loading'">
      <v-col>
      <v-progress-linear indeterminate></v-progress-linear>
      Loading...
      </v-col>
    </v-row>
     <v-row v-show="requestStatus=='badrequest'">
      <v-col>
      <v-alert
      icon="error"
      prominent
      type="warning"
    >This network code seems to be invalid.</v-alert>
      </v-col>
    </v-row>
    <v-row v-show="requestStatus=='error'">
      <v-col>
      <v-alert
      icon="error"
      prominent
      type="error"
    >An unexpected error has occured. Please try again later.</v-alert>
      </v-col>
    </v-row>
    <v-row v-show="requestStatus=='ok' || requestStatus=='loading'">

      <v-col>
        <v-card id="detail" height="75%" class="elevation-0 ">
          <v-card-title style="background-color:#e36517;" class="headline pa-2 white--text"> Network {{networkcode}}</v-card-title>
          <v-row>

            <span class="display-1 ml-3 mt-6"> Network detail</span></v-row>
          <v-row>

            <v-card class="elevation-0 ">

              <v-list>
                <template v-for="(description,key,index) in NetworkDescription">
                  <v-list-item v-if="description !==''" :key='description+index'>
                    <v-list-item-content v-if="key ==='citationInformation'">
                      <v-list-item-title class="title">
                        <v-icon color="rgb(254, 211, 129)">{{iconselector(key)}}</v-icon> {{decamelize(key, " ")}}
                      </v-list-item-title>
                      <v-sheet max-width="95%">
                        <v-alert outlined color="blue" class="ml-8 mt-2 network-description">{{description}}</v-alert>
                      </v-sheet>
                      <div v-if="howtocitelink" class="ml-8 mt-2">
                         Please, consult this <a :href="howtocitelink" target="_blank">link</a> to know how to cite this network.
                      </div>
                    </v-list-item-content>
                    <v-list-item-content v-else>
                      <v-list-item-title class="title">
                        <v-icon color="rgb(254, 211, 129)">{{iconselector(key)}}</v-icon> {{decamelize(key, " ")}}
                      </v-list-item-title>
                      <v-sheet class="ml-8 mt-2" max-width="95%">
                        <p :class="'network-description mt-2 '+key">{{description}}</p>
                      </v-sheet>
                    </v-list-item-content>
                  </v-list-item>

                </template>

                 <v-list-item v-if="operators && operators.length > 0 ">
                    <v-list-item-content>
                      <v-list-item-title class="title">
                        <v-icon color="rgb(254, 211, 129)">mdi-city-variant-outline</v-icon> Operators
                      </v-list-item-title>
                      <span v-if="!operators || operators.length ==0 ">
                        <div class="ml-8 mt-2">No operators</div>
                      </span>
                      <span v-else>
                      <div v-for="(operator,index) in operators" :key="index" class="pa-3">
                      <div class="text-subtitle-1 font-weight-medium">{{operator.agency}}</div>
                      <div>
                        <div v-if="operator.email" class="pl-2"><v-icon small class="mr-2">mdi-email-outline</v-icon> {{operator.email}}</div>
                        <div v-if="operator.webSite" class="pl-2"><v-icon small class="mr-2">mdi-web</v-icon><a target="_blank" :href="operator.webSite" >{{operator.webSite}}</a> </div> 
                      </div>
                      </div>
                      </span>

                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      <v-icon color="rgb(254, 211, 129)">mdi-comment-processing-outline</v-icon>Comments
                    </v-list-item-title>
                    <span v-if="comments && comments.length > 0">
                    <v-data-iterator :items="comments" item-key="value" :items-per-page="4" hide-default-footer no-data-text="-">
                      <template v-slot:default="{ items }">
                        <v-row>
                          <v-col v-for="com in items" :key="com.value" cols="6" class="py-0 px-2">
                            <v-card class="ma-1  pa-4" outlined elevation="0" >

                              <span class="pl-1"> Content</span><span class=" font-weight-medium"> : {{com.value}}<br> </span>
                              <v-expansion-panels flat>
                                <v-expansion-panel class="pa-0" v-for="(author,index) in com.authors " :key="index">
                                  <v-expansion-panel-header class="pa-0 " @click="myFilter">
                                    <template v-slot:actions>

                                    </template>

                                    <template v-slot:default>

                                      <v-icon :class="{'icon-rotat' : isActive}">mdi-chevron-down</v-icon>

                                      <span> Author : {{author.name}} </span><span class="grey--text"> &nbsp ({{com.beginEffectiveTime.substring(10,0)}}
                                        <v-icon small>mdi-arrow-right</v-icon>
                                        <span class="grey--text" v-if="com.endEffectiveTime.substring(4,0) !== '2500'">{{com.endEffectiveTime}}</span>
                                        <v-icon medium color="grey" v-else>mdi-infinity</v-icon>)
                                      </span>

                                    </template>

                                  </v-expansion-panel-header>
                                  <v-expansion-panel-content>
                                    <p v-if="author.agency" class="subtitle-2 mb-0	">
                                      <v-icon small>mdi-home-city-outline </v-icon> Agency : {{author.agency}}
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
                            </v-card>
                          </v-col>
                        </v-row>
                      </template>
                    </v-data-iterator>
                    </span>
                    <span v-else>
                        No available comment 
                      </span>
                  </v-list-item-content>
                </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="title">
                        <v-icon color="rgb(254, 211, 129)">copyright</v-icon> Rights
                      </v-list-item-title>
                      <span v-if="!rights || rights.length ==0 ">
                        <div class="ml-8 mt-2">No rights defined</div>
                      </span>
                      <span v-else>
                      <div v-for="(right,index) in rights" :key="index" class="ml-8 mt-2">
                      <div class="text-subtitle-1"><span v-if="isClickableRight(right)"><a :href="right.rightsUri" target="_blank">{{right.rights}}</a></span><span v-else>{{right.rights}}</span></div>
                      </div>
                      </span>

                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title class="title">
                        <v-icon color="rgb(254, 211, 129)">input</v-icon> Access
                      </v-list-item-title>
                      <span v-if="!access || access.length ==0 ">
                        <div class="ml-8 mt-2">No access defined</div>
                      </span>
                      <span v-else>
                      <div v-for="(acces,index) in access" :key="index" class="ml-8 mt-2">
                      <div class="text-subtitle-1"><span v-if="isClickableAccess(acces)"><a :href="acces.url" target="_blank">{{acces.description}}</a></span><span v-else>{{acces.description}}</span></div>
                      </div>
                      </span>

                    </v-list-item-content>
                  </v-list-item>


                   

                
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="title">
                      <v-icon color="rgb(254, 211, 129)">mdi-card-text-outline</v-icon> {{decamelize('export', " ")}}
                    </v-list-item-title>
                    <span class="ml-6 mt-2"> <span>
                        <v-btn class="mr-2 white--text elevation-0" tile @click="download('XML',networkIdentifier)" small color="#006F7F">Station XML</v-btn>
                      </span>
                      <span>
                        <v-btn class="mr-2 white--text elevation-0" tile @click="download( 'Text',networkIdentifier)" small color="#006F7F">Text</v-btn>
                      </span>
                      <span>
                        <v-btn :loading="loading" :disabled="loading" class="mr-2 white--text elevation-0" tile @click.stop="canvasToPDf()" small color="#006F7F">PDF</v-btn>
                      </span>
                      <span>
                        <v-btn class="mr-2 white--text elevation-0" tile @click.stop="download('DataCite',doi)" small color="#006F7F">Datacite</v-btn>
                      </span>
                    </span>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

            </v-card>

          </v-row>
          <v-row>
            <span id="data" class="display-1 ml-3 mt-6">Data availability  <v-icon :title="dataAvailabilityTooltip">mdi-information</v-icon> </span></v-row>
          <v-row >
            <v-col cols="6" offset="5" >Qualities: <span class="font-weight-medium mx-2">Q</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#1B5E20"></div> <span class="font-weight-medium mx-2">M</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#388E3C"></div>     <span class="font-weight-medium mx-2">D</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#FF6F00"></div>   <span class="font-weight-medium mx-2">R</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#B71C1C"></div> </v-col>
          </v-row>

          <v-row>
            

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
          
          
          </v-row>





          <v-row>

            <span id="mapextent" class="display-1 ml-3 mt-6">Geographical Extent</span></v-row>
          <v-row>

            <v-col>
              <v-sheet>
                <v-sheet id="mapNetworkDescription" class="mapnetwork">
                  <div ref="initZoomButton">
                    <div class="ol-full-screen ol-unselectable ol-control" style="margin-top:70px">
                      <button @click="initZoom()" title="reinitilize Zoom" class="ol-zoom-out" type="button"><span class="mdi mdi-restart"></span></button>
                    </div>
                  </div>
                  <div id="layercontrol">
                    <v-menu class="white--text" left offset-x content-class="my-menu" :close-on-content-click="false">
                      <template v-slot:activator="{ on }">
                        <div style="margin-top:35px" class="ol-full-screen ol-unselectable ol-control">
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

                <div ref="popup" class="ol-popup ">
                  <v-card elevation="6" style="border-radius:12px; background-color:rgba(0,0,0,0.6)">
                    <span href="#" ref="popupCloser" class="clickable ol-popup-closer-1">
                      <v-icon color="white">clear </v-icon>
                    </span>
                    <v-card-title class="text--white" style="border-radius:10px">
                      <v-chip small color="primary" class="clickable" @click="goToPopupStation"><span ref="popupTitle"></span></v-chip>
                      &nbsp <router-link ref="detaiLink" class="text-decoration-none clickable" tag="span" to="#">
                        <v-icon color="white" right>mdi-magnify</v-icon> 
                      </router-link>

                    </v-card-title>
                    <v-card-text>
                      <div style="color:white" ref="popupContent"></div>
                    </v-card-text>
                    <v-card-actions>
                      <span></span>
                    </v-card-actions>
                  </v-card>
                </div>
              </v-sheet>
            </v-col>
          </v-row>
          <v-row>
            <span id="liste" class="display-1 ml-3 mt-6">Station List</span><br><br><br><br>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field prepend-icon="search" label="network" single-line hide-details v-model="filterNetwork"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field prepend-icon="search" label="station" single-line hide-details v-model="filterStation"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field prepend-icon="search" label="site" single-line hide-details v-model="filterSite"></v-text-field>
            </v-col>

          </v-row>

          <v-data-table :headers="headers" :items="stations.stations" item-key="station_code" :footer-props="{'items-per-page-options':[15, 30, 50, 100, -1]}" :items-per-page="50" class="elevation-0" dense>
            <template v-slot:item="{ item, expand, isExpanded }">
              <tr>
                <td>
                  <v-chip fab x-small :color="getColor(NetworkDescription.endDate)" key="lock">
                    <span class="white--text">{{ item.network_code }}</span>
                  </v-chip>
                  <v-icon small v-if="NetworkDescription.restrictedStatus=='closed'" title="Restricted access">mdi-lock</v-icon>
                </td>
                <td>
                  <router-link class="text-decoration-none" tag="span" :to="`/${netid}/${item.detail}`">
                  <v-chip class="clickable" fab x-small :color="getColor(item.end_date)" >
                    <span class="white--text">{{ item.station_code }}</span>
                  </v-chip>
                  </router-link>
                </td>
                <td>{{ item.site }}</td>
                <td>{{ item.start_date.substring(10,0) }}</td>
                <td><span v-if="item.end_date.substring(4,0) !=='2500'">{{ item.end_date.substring(10,0) }}</span>
                  <v-icon v-else>mdi-infinity</v-icon>
                </td>
                <td>{{ parseFloat(item.longitude).toFixed(4)}}</td>
                <td>{{parseFloat(item.latitude).toFixed(4) }}</td>
                <td>{{item.elevation}}</td>
                <td>


                  <router-link class="text-decoration-none clickable" tag="span" :to="`/${netid}/${item.detail}`">
                    <v-icon right>mdi-magnify</v-icon>
                  </router-link>
                </td>

              </tr>

            </template>

          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <canvas style="width:500px" v-show="false" id="mapCanvas" crossorigin="anonymous"></canvas>
</v-app>
</span>
</template>

<script>
import * as visavail from "visavail";
import moment from "moment";
import "visavail/visavail.css";
import "visavail/visavail.js";
import * as d3 from "d3";
import * as easings from "vuetify/es5/services/goto/easing-patterns";
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
import $ from "jquery";

export default {
  name: "resif-seismic-network-by-network-description",

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

     wsService() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifWsService;
      }
      return null
    },

service() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifService;
      }
      return null
    },


    headers() {
      return [{
          text: "Network Code",
          align: "left",
          width: "10%",
          sortable: true,
          value: "network_code",
          filter: this.networkFilter
        },

        {
          text: "Station Code",
          align: "left",
          width: "10%",
          sortable: true,
          value: "station_code",
          filter: this.stationFilter
        },
        {
          text: "Site",
          align: "left",
          width: "30%",
          sortable: true,
          value: "site",
          filter: this.siteFilter
        },

        {
          text: "Start Date",
          align: "left",
          width: "10%",
          sortable: true,
          value: "start_date"
          // filter: this.latitudeFilter
        },
        {
          text: "End date",
          align: "left",
          width: "10%",
          sortable: true,
          value: "end_date"
          //filter: this.latitudeFilter
        },
        {
          text: "Longitude",
          align: "left",
          width: "10%",
          sortable: true,
          value: "longitude",
          filter: this.longitudeFilter
        },
        {
          text: "Latitude",
          align: "left",
          width: "10%",
          sortable: true,
          value: "latitude",
          filter: this.latitudeFilter
        },
        {
          text: "Elevation",
          align: "left",
          width: "10%",
          sortable: true,
          value: "elevation",
          filter: this.elevationFilter
        },
        {
          text: "Station detail",
          align: "left",
          width: "10%",
          sortable: true,
          value: "detail"
        }
      ];
    }
  },

  props: {
    networkIdentifier: {
      Type: String,
      default: ""
    },
    type: {
      Type: Boolean,
      default: false
    }
  },

  data: () => ({
    channels: ["GHZ","DHZ","CHZ","EHZ","SHZ","HHZ","BHZ","MHZ","LHZ","VHZ","GLZ","DLZ","CLZ","ELZ","SLZ","HLZ","BLZ","MLZ","LLZ","VLZ","GNZ","DNZ","CNZ","ENZ","SNZ","HNZ","BNZ","MNZ","LNZ","VNZ"],
    yearArray: [],
    yearvalue: null,
    loadingData: false,
    loading: false,
    nodataA: false,
    requestStatus: "loading",
    comments: [],
    operators: [],
    rights:[],
    access:[],
    doi: "",
    index: 0,
    titleicon: {
      FDSNcode: "mdi-card-text-outline",
      abstract: "mdi-card-text-outline",
      citationInformation: "mdi-comment-quote-outline",
      doi: "mdi-file-link-outline",
      description: "mdi-clipboard-text-outline",
      totalNumberStations: "mdi-matrix",
      restrictedStatus: "mdi-lock",
      startDate: "mdi-calendar-text",
      endDate: "mdi-calendar-text",
      historicalCode: "mdi-av-timer",
      alternateCode: "mdi-timeline-clock",
      overview: "mdi-panorama-horizontal",
      scientificObjectives: "mdi-telescope",
      responsibles: "mdi-account-tie",
      contacts: "mdi-contacts"
    },
    expanded: [],
    singleExpand: false,
    filterNetwork: "",
    filterStation: "",
    filterSite: "",
    filterElevation: "",
    filterLongitude: "",
    filterLatitude: "",

    layerdisplay: "satellite",
    stations: {
      stations: []
    },
    openStyle: new Style({
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
    }),
    closedStyle: new Style({
      image: new RegularShape({
        fill: new Fill({
          color: "rgba(255, 48, 48,0.6)"
        }),
        stroke: new Stroke({
          color: "black",
          width: 1
        }),
        points: 3,
        radius: 10,
        angle: 0
      })
    }),
    netid: "",
    isActive: false,
    NetworkDescription: [],
    code: "",
    description: "",
    endDate: "",
    restrictedStatus: "",
    startDate: "",
    totalNumberStations: "",
    alternateCode: "",
    vectorLayer: null,
    vectorSource: null,
    map: null,
    geoJsonStation: null,
    overlay: null,
    networkcode: null,
    networkShortIdentifier: null,
    option: {
      duration: 300,
      offset: 60,
      easing: "easeInOutCubic"
    },
    howtocitelink:null
  }),
  created() {
    this.netid = this.$route.params.nertworkId;
  },
  mounted() {
    this.computeHowToCiteLink()
  },

  watch: {

    yearvalue() {
      d3.select("#visavail_graph").html(null);
      this.loadingData = true;
      this.dataAvailability()
    },

    layerdisplay(val) {
      
      this.baselayers.getLayers().forEach((element, index, array) => {
        if (val === element.values_.layer) {
          element.setVisible(true);
        } else {
          element.setVisible(false);
        }
      });
    },
    netid(val) {
      this.initMap();
      
      let url = this.service+"/network/v1_0/" + val;
      this.map.renderSync();
      this.axios.get(url).then(response => {
        this.requestStatus = "ok"
        var data = response.data.properties;
        this.networkcode = data.code ? data.code : "";
        this.networkShortIdentifier = data.shortIdentifier ? data.shortIdentifier : "";
        this.comments = data.comments;
        this.operators = data.operators;
        this.rights = data.rights;
        this.access = data.access;
        this.doi = data.doi;
        this.headers.splice(4, 1);
        
        this.NetworkDescription = {
          FDSNcode: data.code ? data.code : "",
          
          description: data.description ? data.description : "",
          doi: data.doi ? data.doi : "",
          abstract: data.abstract ? data.abstract : "",
          citationInformation: data.citationInformation ?
            data.citationInformation : "",
          totalNumberStations: data.totalNumberStations ?
            data.totalNumberStations : "",
          
          startDate: data.startDate ? data.startDate.substring(0, 10) : "",
          endDate: data.endDate.substring(0, 4) !== "2500" ?
            data.endDate.substring(0, 10) : "",
          historicalCode: data.historicalCode ? data.historicalCode : "",
          overview: data.overview ? data.overview : "",
          scientificObjectives: data.scientificObjectives ?
            data.scientificObjectives : "",
          responsibles: data.responsibles ? data.responsibles : "",
          contacts: data.contacts ? data.contacts : ""
        };

        /*
        alternateCode: data.alternateCode ? data.alternateCode : "",
        restrictedStatus: data.restrictedStatus ? data.restrictedStatus : "",
        */

         let startyear = data.startDate.substring(0, 4);
      let endYear = new Date().getFullYear();
      let aux = parseInt(data.endDate.substring(0, 4));
      if (aux < endYear) {
        endYear = aux;
      }
      let yearArray = [];
      for (let i = endYear; i >= startyear; i--) {
        yearArray.push(i)
      }
      this.yearArray = yearArray;
      this.yearvalue = yearArray[0]
        
        
        response.data.features.forEach(feat => {
          this.stations.stations.push({
            network_code: this.networkcode,
            site: feat.properties.site,
            station_code: feat.properties.code,
            detail: feat.properties.code,
            longitude: parseFloat(feat.properties.longitude).toFixed(4),
            latitude: parseFloat(feat.properties.latitude).toFixed(4),
            elevation: parseFloat(feat.properties.elevation).toFixed(2),
            start_date: feat.properties.startDate,
            end_date: feat.properties.endDate
          });
        });
        this.map.removeLayer(this.vectorLayer);
        let toto = new GeoJSON({
          featureProjection: 'EPSG:3857'
        });
        this.geoJsonStation = {
          crs: {
            type: "name",
            properties: {
              featureProjection: 'EPSG:3857'
            }
          },
          type: "FeatureCollection",
          features: response.data.features
        };
        this.vectorSource = new VectorSource({
          wrapX: false,
          features: toto.readFeatures(this.geoJsonStation)
        });
        this.vectorLayer = new VectorLayer({
          source: this.vectorSource,
          style: this.styleFunction
        });
        this.baselayers = new LayerGroup({
          title: "Basemaps",
          layers: [
            new TileLayer({

              source: new OSM({ wrapX: false }),
              crossOrigin: "anonymous",
              layer: "open_street_map"
            }),
            new TileLayer({
              source: new XYZ({
                url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
                crossOrigin: "anonymous",
                wrapX: false
              }),

              layer: "open_topo_map"
            }),
            new TileLayer({

              source: new XYZ({
                wrapX: false,
                crossOrigin: "anonymous",
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
        
      })
      .catch(error => {
        let requestStatus = 'error'
        if ((error.response) && (error.response.status) && (error.response.status==400)) {
          requestStatus="badrequest"
        }
        this.requestStatus=requestStatus;
      })
      
      ;
    }
  },
  methods: {

    goToPopupStation() {
      this.$router.push(this.$refs.detaiLink.to)
    },

    computeHowToCiteLink: function() {
      let aux = document.getElementById("configuration");
      if (aux == null) {
        return
      }
      else {
        let value = aux.getAttribute("how-to-cite-link")
        if (value == null) {
          return
        }
        if (value.length ==0) {
          return;
        }
        this.howtocitelink = value;
      }
    },

    isClickableRight: function(right) {
      if (!right.rightsUri) {
        return false;
      }
      return (right.rightsUri.toLowerCase().startsWith("http"))
    },

     isClickableAccess: function(access) {
      if (!access.url) {
        return false;
      }
      return (access.url.toLowerCase().startsWith("http"))
    },

    mustReplace(currentChannel, currentLocation, challengerChannel, challengerLocation) {
      let currentIndex  = this.channels.indexOf(currentChannel);
      let challengerIndex  = this.channels.indexOf(challengerChannel);
      
      if (currentIndex == -1) {
        currentIndex = 999;
      }

      if (challengerIndex == -1) {
        challengerIndex = 1000;
      }

      if (currentIndex < challengerIndex) {
        return false
      }
      if (challengerIndex < currentIndex) {
        return true;
      } 
      return (parseInt(currentLocation) > parseInt(challengerLocation))

    },

    removeTemporaryYear(networkCode) {
      if (networkCode.indexOf("__")>=0) {
        return networkCode.split("__")[0]
      } else {
        return networkCode
      }
    },

    dataAvailability() {
      this.axios
        .get(this.wsService+`/fdsnws/availability/1/query?mergegaps=43200&merge=samplerate,overlap&includerestricted=true&net=${this.removeTemporaryYear(this.netid)}&start=${this.yearvalue}-01-01T00:00:00	&end=${this.yearvalue}-12-31T23:59:59&format=json`)
        .then(response => {
          
          let dataAvailabilityDataSet = [];

          // le jsodata.datasourcesn est parsé et les dates sont mises au format attendu par visavail
          this.nodataA = false
          if (response.data.datasources) {

            let currentStation = response.data.datasources[0].station;
            let currentChannel = response.data.datasources[0].channel;
            let currentLocation = response.data.datasources[0].location;
            // debugger
            let filteredChannelsAndLocations = []
            for (let i=0; i < response.data.datasources.length; i++) {
              if (response.data.datasources[i].station != currentStation ) {
                filteredChannelsAndLocations.push(currentStation+"_"+currentChannel+"_"+currentLocation);
                currentChannel = response.data.datasources[i].channel;
                currentLocation = response.data.datasources[i].location;
                currentStation = response.data.datasources[i].station;
              } else {
                if (this.mustReplace(currentChannel, currentLocation, response.data.datasources[i].channel, response.data.datasources[i].location)) {
                currentChannel = response.data.datasources[i].channel;
                currentLocation = response.data.datasources[i].location;
                }
              }
            }
            filteredChannelsAndLocations.push(currentStation+"_"+currentChannel+"_"+currentLocation);


            response.data.datasources.map(channel => {
              
              if (channel.timespans.length > 0) {
                let key = channel.station+"_"+channel.channel+"_"+channel.location
                if (filteredChannelsAndLocations.indexOf(key)>=0) {
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
            },
          };
          this.loadingData = false
          visavail.generate(timelineOptions, dataAvailabilityDataSet);
        })
    },

    isTemporaryNetwork() {

      if (this.NetworkDescription.endDate=="") {
        return false;
      }
      if (this.NetworkDescription.endDate.substring(0, 4) == "2500" ) {
        return false;
      }
      else {
        return true;
      }
    },

    canvasToPDf() {
      this.loading = true
      this.map.once("rendercomplete", () => {
        
        var mapCanvas = document.getElementById("mapCanvas");
        var size = this.map.getSize();
        mapCanvas.width = size[0];
        mapCanvas.height = size[1];
        var mapContext = mapCanvas.getContext("2d");
        
        Array.prototype.forEach.call(
          document.querySelectorAll("canvas.ol-unselectable "),
          canvas => {
            
            if (canvas.width > 0) {
              var opacity = "1";
              mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
              canvas.style.transform = "matrix(1, 0, 0, 1, 0, 0)";
              var transform = canvas.style.transform;
              
              // Get the transform parameters from the style's transform matrix
              var matrix = transform
                .match(/^matrix\(([^\(]*)\)$/)[1]
                .split(",")
                .map(Number);
              // Apply the transform to the export map context
              CanvasRenderingContext2D.prototype.setTransform.apply(
                mapContext,
                matrix
              );
              mapContext.drawImage(canvas, 0, 0);
            }
          }
        );

        // link download attribuute does not work on MS browsers
        //navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');

        let url = this.service+`/network/v1_0/print/${this.networkShortIdentifier}`;
        
        mapCanvas.toBlob(
          blob => {
            
            var formData = new FormData();

            formData.append("networkMap", blob);
            $.ajax({
              method: "POST",
              processData: false,
              contentType: false,
              url: url,
              data: formData
            }).done(o => {
              
              let binaryString = window.atob(o);
              let binaryLen = binaryString.length;
              let bytes = new Uint8Array(binaryLen);
              for (let i = 0; i < binaryLen; i++) {
                let ascii = binaryString.charCodeAt(i);
                bytes[i] = ascii;
              }

              let blob = new Blob([bytes], { type: "application/pdf" });
              let link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = `${this.networkcode}.pdf`;
              link.click();
              
              this.loading = false
            });
          },
          "image/png",
          1
        );
      });
      this.map.renderSync();
    },
    myFilter() {
      this.isActive = !this.isActive;
    },
    iconselector(title) {
      return this.titleicon[title];
    },
    getColor(val) {
      let color = null;
      let now = new Date();
      let aux = val.split("T")[0]
      let endDate = new Date(aux)
      if (now > endDate) {
        color = "red";
      } else {
        color = "green";
      }
      return color
     
    },
    initMap() {
      var container = this.$refs.popup;
      var content_element = this.$refs.popupContent;
      var closer = this.$refs.popupCloser;
      var titlePopUp = this.$refs.popupTitle;
      var detailStation = this.$refs.detaiLink;
      this.map = new Map({
        layers: [],
        target: "mapNetworkDescription",
        view: new View({
          center: [0, 0],
          zoom: 2.5,
          minZoom: 1,
          maxZoom: this.$maxZoom
        })
      });
      var layerbutton = new Control({
        element: document.getElementById("layercontrol")
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
          // let detail = `/networkDetail/${feature.get("networkCode")}/${feature.get("code")}
          let detail = `/${feature.get("networkCode")}/${feature.get("code")}`
          let content = `
         Longitude:  ${parseFloat(feature.get("longitude")).toFixed(4)} <br>
         Latitude:  ${parseFloat(feature.get("latitude")).toFixed(4)}<br>
         Elevation:  ${parseFloat(feature.get("elevation")).toFixed(2)}<br>
         Site: ${feature.get("site")}<br>
        `;

          detailStation.to = detail;
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
    download(type, identifier) {
      let baseUrl = this.wsService+`/fdsnws/station/1/query?network=${this.networkcode}&level=station`;
      if (this.isTemporaryNetwork()) {
        let startDate = moment(this.NetworkDescription.startDate).subtract(1, 'd').format('YYYY-MM-DD');
        let endDate = moment(this.NetworkDescription.endDate).add(1, 'd').format("YYYY-MM-DD")
        baseUrl = this.wsService+`/fdsnws/station/1/query?network=${this.networkcode}&level=station&starttime=${startDate}&endtime=${endDate}`;
      }
      let serviceUrl = "";
      if (type === "XML") {
        serviceUrl = baseUrl;
      } else if (type === "Text") {
        serviceUrl = baseUrl + "&format=text";
      } else if (type === "DataCite") {
        serviceUrl = `https://api.datacite.org/dois/${identifier}`;
      } 
      window.open(serviceUrl, "_blank");
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
    
    styleFunction(feature) {
      let now = new Date()
      let aux = feature.values_.endDate.split("T")[0]
      let endDate = new Date(aux)
      if (now > endDate) {
        return this.closedStyle;
      } else {
        return this.openStyle;
      }
    },

    initZoom() {
      this.map.getView().fit(this.vectorSource.getExtent(), {
        size: this.map.getSize(),
        maxZoom: this.$maxFitZoom
      });
    },
    matchRuleShort(str, rule) {
      
      var escapeRegex = str =>
        str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
      
  
      return new RegExp(
        "^" +
        rule
        .split("*")
        .map(escapeRegex)
        .join(".*") +
        "$"
      ).test(str);
    },
    /**
     * Filter for dessert names column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    /*   filterStation: "",
      : "",
      :"",
      :"",
      :"", */
    networkFilter(value) {
      if (!this.filterNetwork) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.filterNetwork.toLowerCase());
      /*  if (!this.filterStation) {
         return true;
       }
       
       return this.matchRuleShort(
         value.toLowerCase(),
         this.filterStation.toLowerCase()
       ) */ //new RegExp('^' + this.station_codeFilter.toLowerCase().replace(/\*/g, '.*') ).test(value.toLowerCase()) // value.includes(this.station_codeFilter.toLowerCase());
    },
    stationFilter(value) {
      if (!this.filterStation) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.filterStation.toLowerCase());
      /*  if (!this.filterStation) {
         return true;
       }
       
       return this.matchRuleShort(
         value.toLowerCase(),
         this.filterStation.toLowerCase()
       ) */ //new RegExp('^' + this.station_codeFilter.toLowerCase().replace(/\*/g, '.*') ).test(value.toLowerCase()) // value.includes(this.station_codeFilter.toLowerCase());
    },
    /**
     * Filter for calories column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    siteFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.filterSite) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.filterSite.toLowerCase());
    },
    longitudeFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.filterLongitude) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.filterLongitude.toLowerCase());
    },
    latitudeFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.filterLatitude) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.filterLatitude.toLowerCase());
    },
    elevationFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.filterElevation) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.filterElevation.toLowerCase());
    }
  }
};
</script>

<style>

 .clickable {
   cursor: pointer;
 }

 .network-description.abstract {
   text-align: justify;
 }

 p.network-description, .v-alert.network-description {
  margin-bottom: 0px;
 }

.active {
  border-left: 3px solid #e36517;
  font-weight: 600;
  pointer-events: none;
  padding-left: 25px;
}

.v-expansion-panel-header__icon {
  display: none !important;
}

.v-expansion-panel-header>*:not(.v-expansion-panel-header__icon) {
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: none;
}

.icon-rotat {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.mapnetwork {
  height: 500px;
}

.ol-popup {
  position: absolute;
  background-color: transparent;
  width: 450px;
  padding: 0;
  border-radius: 5px;
  bottom: 12px;
  left: -50px;
}

.my-menu {
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 0;
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
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}

.ol-popup-closer-1 {
  color: white;
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  size: 20px;
}

.link_detail {
  -webkit-text-stroke: 0.1px;
  -webkit-text-stroke-color: rgb(217, 217, 217);
}

body {
  height: 100%;
  overflow: hidden;
}
</style>
