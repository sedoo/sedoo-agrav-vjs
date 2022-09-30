<template>
<span>
   <v-dialog v-model="searching" persistent max-width="700px">
          <section class="pa-5 white">
                <v-progress-linear :indeterminate="true"></v-progress-linear>
                Searching...
          </section>
  </v-dialog>
   <v-snackbar v-model="notifier" top :color="notifierColor" :timeout="timeout">
      {{ notifierMessage }}
      <v-btn dark text @click="notifier = false">Close</v-btn>
    </v-snackbar>
<v-app>

  <v-container fluid>
   
    <v-card  class="mt-12" elevation="0">
      <v-row v-resize="onResize">
        <v-col>

          <v-card elevation="0">

            <v-sheet tag="div" max-height="700px" ref="mapResult" class="mapAllStation">
              <div ref="initZoomButton">
                <div class="ol-full-screen ol-unselectable ol-control" style="margin-top:60px">
                  <button @click="initZoom()" title="reinitilize Zoom" class="ol-zoom-out" type="button"><span class="mdi mdi-restart"></span></button>
                </div>
              </div>
              <div ref="layercontrol">
                <v-menu class="white--text" left offset-x content-class="my-menu" :close-on-content-click="false">
                  <template v-slot:activator="{ on }">
                    <div style=" margin-top:30px" class="ol-full-screen ol-unselectable ol-control">
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
                      <v-chip small color="primary"><span ref="popupTitle"></span></v-chip>
                      &nbsp; <router-link ref="detaiLink" class="text-decoration-none clickable" tag="span"  to="#">
                        <v-icon color="white" right>mdi-magnify</v-icon>
                      </router-link>

                    </v-card-title>

                <v-card-text>
                  <div style="color:white" ref="popupContent"></div>
                </v-card-text>
              </v-card>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>

          <v-card class="elevation-0">
            <v-card-title>
              <v-text-field v-model="search" prepend-icon="search" label="Filter search result" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table :headers="stations.headers" :items="stations.stations" :items-per-page="100" class="elevation-0" :search="search" dense>
              <template v-slot:body="{ items }">
                <tbody>
                  <tr v-for="(item,index) in items" :key="index + uuidv4()">
                    <td>
                       <router-link class="text-decoration-none clickable" tag="span" :to="`/${item.networkShortIdentifier}/${item.detail}`">
                      <v-chip class="white-text clickable" x-small :color="getColor(item.endDate)" >
                        <span class="white--text"> {{ item.station_code }}</span>
                      </v-chip>
                       </router-link>
                    </td>
                    <td>{{ item.site }}</td>
                <td>{{ item.startDate.substring(10,0) }}</td>
                <td><span v-if="item.endDate.substring(4,0) !=='2500'">{{ item.endDate.substring(10,0) }}</span>
                  <v-icon v-else>mdi-infinity</v-icon>
                </td>
                <td>{{ parseFloat(item.longitude).toFixed(4)}}</td>
                <td>{{parseFloat(item.latitude).toFixed(4) }}</td>
                <td>{{item.elevation}}</td>
                    <td>
                      <router-link class="text-decoration-none clickable" tag="span" :to="`/${item.networkShortIdentifier}/${item.detail}`">
                    <v-icon right>mdi-magnify</v-icon>
                  </router-link>
                   </td>

                  </tr>
                </tbody>
              </template>
            </v-data-table>

          </v-card>
        </v-col>

      </v-row>

    </v-card>

  </v-container>

</v-app>
</span>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import { defaults as defaultControls, Control } from "ol/control";
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

export default {
  name: "resif-search-by-station-result",
  components: {},
  props: {
    serviceUrl: {
      Type: String,
      default: ""
    },

    randomkey: {
      Type: String,
      default: ""
    }
  },

  computed: {

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
    }
  },

  data: () => ({
    layerdisplay:'satellite',
     timeout: 2000,
    notifier: false,
    notifierMessage: "",
    notifierColor: "success",
    searching: false,
    search: "",
    stations: {
      headers: [{
          text: "Station Code",
          align: "left",
          width: "10%",
          sortable: true,
          value: "station_code"
        },
        {
          text: "Site",
          align: "left",
          width: "30%",
          sortable: true,
          value: "site",
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
        },
        {
          text: "Latitude",
          align: "left",
          width: "10%",
          sortable: true,
          value: "latitude",
        },
        {
          text: "Elevation",
          align: "left",
          width: "10%",
          sortable: true,
          value: "elevation",
        },
        {
          text: "Station detail",
          align: "left",
          width: "10%",
          sortable: true,
          value: "detail"
        }
      ],
      stations: [],
    },
    tab: null,
    update:true,
    value: 0,
    query: false,
    show: true,
    netid: "",
    satid: "",
    StationDescription: [],
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
      })
  }),

  watch: {
show(val){

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
    serviceUrl(value) {
      //this.launchSearch();
    },
    randomkey(value) {
      this.launchSearch();
    }
  },

  mounted() {
this.initMap();
    
  },

  methods: {

launchSearch() {
      this.searching=true;
      this.query = true
      this.show = true
      // this.stations.stations.length = 0;
      // this.stations.stations.length = []
      this.stations.stations = []
      this.$nextTick(() => {
        let url = this.serviceUrl;

        this.axios.get(url).then(response => {
          
          this.searching = false;
          debugger

          response.data.features.forEach(feat => {
            this.stations.stations.push({
              site: feat.properties.site,
              latitude: feat.properties.latitude,
              longitude: feat.properties.longitude,
              elevation: feat.properties.elevation,
              startDate: feat.properties.startDate,
              endDate: feat.properties.endDate,
              station_code: ` ${feat.properties.networkCode}.${feat.properties.code}`,
              detail: feat.properties.code,
              networkCode: feat.properties.networkCode,
              networkShortIdentifier: feat.properties.networkShortIdentifier
            });
          });

          if (this.stations.stations.length == 0 ) {
            this.displayWarning("Your search matches no station")
          }

          let toto = new GeoJSON({  featureProjection: 'EPSG:3857'});

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
                source: new OSM({ wrapX: false, }),
                layer: "open_street_map"
              }),
              new TileLayer({
                /*    extent: transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857'), */
                source: new XYZ({
                  url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",

                  wrapX: false
                }),
                layer: "open_topo_map"
              }),
              new TileLayer({
                source: new XYZ({
                  wrapX: false,

              
                  url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                }),
                layer: "satellite"
              }),
            ]
          })
          
          this.map.setLayerGroup(
            new LayerGroup({
              layers: [
                this.baselayers,

              ]
            })
          );

         
          this.map.addLayer(this.vectorLayer);
          this.map.updateSize()
          this.map.getView().setZoom(2);
          this.map.getView().fit(this.vectorSource.getExtent(), {
            size: this.map.getSize(),
            maxZoom: this.$maxFitZoom
          });
          
        });

      });
      
      setTimeout(() => {
        this.query = false
        this.show = false
        this.value = 100
          }, 1000)
},

    getColor(val) {
     
      let color = null
      let now = new Date()
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
        target: this.$refs.mapResult.$el,
        layers: [

        ],
        view: new View({
          view: new View({
          center: [0, 0],
          zoom:2,
          minZoom :2  ,
          maxZoom: this.$maxZoom
        })
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
          let content = `
        Station : ${feature.get("code")}<br>
       Elevation: ${feature.get("elevation")}<br>
      Site:  ${feature.get("site")}<br>
      Network state :${feature.get("networkState")}<br>
         Longitude:  ${parseFloat(feature.get("longitude")).toFixed(4)}<br>
        Latitude:  ${parseFloat(feature.get("latitude")).toFixed(4)}<br>
       `;
          let tileContent = ` ${feature.get("networkCode")}.${feature.get("code")}`;
          let detail = `/${feature.get("networkShortIdentifier")}/${feature.get("code")}`;
          detailStation.to = detail;
          titlePopUp.innerHTML = tileContent;
          content_element.innerHTML = content;
          overlay.setPosition(coord);

        } else {
          overlay.setPosition(undefined);
          closer.blur();
        }
      });
      
    },
    onResize() {
      if (this.map) {

        this.map.updateSize()
      }
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

     displayWarning: function(message) {
  		this.notifierMessage = message
  		this.notifierColor = 'warning'
  		this.timeout=8000
  		this.notifier = true
    },
    

    initZoom() {
      this.map.getView().fit(this.vectorSource.getExtent(), {
        size: this.map.getSize(),
        maxZoom: this.$maxFitZoom
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
    }
  }
};
</script>

<style>
.mapAllStation {
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

.ol-popup-closer-1 {
  color: white;
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  size: 20px;
}

.clickable {
  cursor: pointer;
}

.link_detail {
  -webkit-text-stroke: 0.1px;
  -webkit-text-stroke-color: rgb(217, 217, 217);
}
</style>
