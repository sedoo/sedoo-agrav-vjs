<template>
<v-app>
   

<v-navigation-drawer style="    z-index: 0 !important" class="ml-4" app>
    <v-sheet style="margin-top:80px">
      <v-list>
        <v-list-item-group v-model="index">
          <v-list-item active-class="active" @click="$vuetify.goTo('#providerselection', option)">
            Provider selection
          </v-list-item>
          <v-list-item @click="$vuetify.goTo('#mapextent', option)" active-class="active">
            Geographical extent
          </v-list-item>
          <v-list-item @click="$vuetify.goTo('#stationlist', option)" active-class="active">
            Station list
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>

  </v-navigation-drawer> 
  <v-container>

    <v-row>
       <v-col cols="12" class="mb-0" id="providerselection">
        <span class="display-1">Data providers</span>
      </v-col>
      <v-col cols="12" class="mb-0" >
        <v-select  v-model="layerdisplay" :items="providerList" label="Select data provider" solo></v-select>
      </v-col>

    </v-row>

    <v-row v-if="currentProvider.webSite.length>0 || currentProvider.webSite.length>0">

      <v-col cols="6" class="mb-0">
        <span v-if="currentProvider.webSite.length>0">
      <v-icon small class="mr-2">mdi-web</v-icon><a target="_blank" :href="currentProvider.webSite" >{{currentProvider.webSite}}</a>
      </span>
      </v-col>
      <v-col cols="6" class="mb-0">
        <span v-if="currentProvider.email.length>0">
      <v-icon small class="mr-2">mdi-email-outline</v-icon>  {{currentProvider.email}}
      </span>
      </v-col>
    </v-row>

    <v-row>

 <v-col cols="12" class="mb-0" id="mapextent">
        <span class="display-1">Geographical extent</span>
      </v-col>
      <v-col cols="12">
        <v-card elevation="0" >

          <v-sheet tag="div" min-height="800px" ref="mapnetwork" class="mapAllStation">
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
                <v-radio-group small v-model="basedisplay">

                  <v-radio small class=" mx-2" label="Open street map" value="open_street_map"></v-radio>
                  <v-radio class="ml-2" label="Open topo map" value="open_topo_map"></v-radio>
                  <v-radio class="ml-2" label="Satellite" value="satellite"></v-radio>
                </v-radio-group>
              </v-menu>
            </div>

          </v-sheet>
          <div ref="popup" class="ol-popup ">
            <v-card elevation="6" style="border-radius:12px; background-color:rgba(0,0,0,0.6)">
              <span  href="#" ref="popupCloser" class="clickable ol-popup-closer-1">
                <v-icon color="white">clear </v-icon>
              </span>
              <v-card-title class="text--white" style="border-radius:10px">
                <v-chip small color="primary"  @click="goToPopupStation"><span ref="popupTitle"></span></v-chip>
                &nbsp <router-link ref="detaiLink" tag="span" class="text-decoration-none clickable" to="#">
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
      <v-col id="stationlist">
       <span class="display-1">Station list</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field prepend-icon="search" label="station" single-line hide-details v-model="filterStation"></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-12">

      <v-col cols=12 >

        <v-data-table :headers="providers.headers" :items="providers.stations" :items-per-page="100" :footer-props="{'items-per-page-options': [100, -1]}" class="elevation-0" dense>
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="(item,index) in items" :key="index + uuidv4()">
                <td>
                  <v-chip class="white-text" x-small :color="getColor(item.endDate)" >
                    <span class="white--text clickable" @click="goTo(`/${item.networkShortIdentifier}/${item.detail}`)" > {{ item.station_code }} </span>
                  </v-chip>
                  <v-icon small v-if="item.restricted=='closed'" title="Restricted access">mdi-lock</v-icon>

                </td>
                <td><ul><li v-for="provider in item.providers" :key="provider" style="display: list-item;">{{provider}}</li></ul></td>
                <td>{{ item.startDate }}</td>
                <td><span v-if="item.networkEndDate.substring(4,0) !=='2500'">{{ item.endDate.substring(10,0) }}</span>
                  <v-icon v-else>mdi-infinity</v-icon>
                </td>

                <td>{{parseFloat(item.latitude).toFixed(4) }}</td>
                <td>{{ parseFloat(item.longitude).toFixed(4)}}</td>
                <td>{{ item.elevation }}</td>
                <td>
                  <router-link tag="span" class="text-decoration-none clickable" :to="`/${item.networkShortIdentifier}/${item.detail}`">
                    <v-icon right>mdi-magnify</v-icon>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <canvas id="mapCanvas" crossorigin="anonymous"></canvas>
</v-app>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import { defaults as defaultControls, Control } from "ol/control";
import View from "ol/View";
import LayerGroup from "ol/layer/Group";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Overlay from "ol/Overlay";
import FullScreen from "ol/control/FullScreen";
import { transformExtent } from "ol/proj.js";
import { RegularShape } from "ol/style";
import { upAndDown } from 'ol/easing';
import { getCenter } from 'ol/extent';

export default {

  name: "resif-station-provider",
   computed: {

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
    }
   },

  data() {
    return {
      option: {duration: 300, offset: 90, easing: 'easeInOutCubic' },
      providers: {
        headers: [{
            text: "Station Code",
            align: "left",

            sortable: true,
            value: "station_code",
            filter: this.stationFilter
          },
          {
            text: "Providers",
            align: "left",

            sortable: true,
            value: "providers",
            filter: this.providersFilter
          },

          {
            text: "Start Date",
            align: "left",

            sortable: true,
            value: "startDate"
          },
          {
            text: "End Date",
            align: "left",

            sortable: true,
            value: " endDate"
          },
          {
            text: "Latitude",
            align: "left",

            sortable: true,
            value: "latitude"
          },
          {
            text: "Longitude",
            align: "left",

            sortable: true,
            value: "longitude"
          },
          {
            text: "Elevation",
            align: "left",

            sortable: true,
            value: "longitude"
          },
          {
            text: "Station detail",
            align: "left",

            sortable: true,
            value: "detail"
          }
        ],
        stations: []
      },
      filterStation: "",
      filterProvider: "",
      providerList: [],
      providerDetails: {},
      currentProvider: {email:"", webSite:""},
      vectorFeatures: null,
      search: "",
      geoJsonData: [],
      vectorlayertab: [],
      providerMap: [],
      basedisplay: "satellite",
      setVisibilityOpen: true,
      setVisibilityClosed: true,
      setVisibilityDisable: true,
      layerdisplay: "All providers",
      baselayers: null,
      NetworkDescription: [],
      code: "",
      description: "",
      endDate: "",
      restrictedStatus: "",
      startDate: "",
      totalNumberStations: "",
      alternateCode: "",
      vectorLayer: null,
      openVectorLayer: null,
      closedVectorLayer: null,
      disableVectorLayer: null,
      vectorSource: null,
      openVectorSource: null,
      closedVectorSource: null,
      disableVectorSource: null,
      content: "",
      map: null,
      geoJsonStation: null,
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
    };
  },
  watch: {

    basedisplay(val) {
      this.baselayers.getLayers().forEach((element, index, array) => {
        if (val === element.values_.layer) {
          
          element.setVisible(true);
        } else {
          element.setVisible(false);
        }
      });
    },
    layerdisplay(val) {
      
      this.currentProvider = this.providerDetails[val];

      this.vectorFeatures.getLayers().forEach((element, index, array) => {
        if (val === element.values_.layer || val === "All providers") {
          this.filterProvider = val === "All providers" ? "" : val
          
          element.setVisible(true);

          (val !== "All providers") ? this.map.getView().fit(element.getSource().getExtent(), {
               maxZoom: this.$maxFitZoom
      }): this.initZoom()
        } else {
          element.setVisible(false);
        }

      });
    }
  },
  mounted() {
    this.initMap();
    //  this.export()
    this.axios
      .get(this.service+"/provider/v1_0/list")
      .then(response => {
        let providerTmp = ["All providers"];
        response.data.map(element => {
          providerTmp = providerTmp.concat(element.agency);
        });
        this.providerList = [...new Set(providerTmp)];
        this.providerList.filter(element => {
          return element != "";
        });

        let details = {}
        
        let aux = response.data;
        for (let i = 0; i < aux.length; i++) {
          let element = aux[i];
          let detail = {};
          detail.webSite= element.webSite;
          detail.email = element.email;
          details[element.agency]= detail;
        }

        details["All providers"] = { "webSite": "", "email": "" };

        this.providerDetails = details; 

      });
    this.axios
      .get(this.service+"/provider/v1_0/stations")
      .then(response => {
        let aux = [];
        this.geoJsonData = response.data;
        
        let geoJson = new GeoJSON({
          featureProjection: 'EPSG:3857'
        });
        this.providerList.forEach(providerAgency => {
          
          var vectorSource = new VectorSource({
            wrapX: false
          });

          this.geoJsonData.features.forEach((feat) => {
            if (feat.properties.operators.indexOf(providerAgency)>-1) {
              vectorSource.addFeature(geoJson.readFeature(feat));
              let identifier = feat.properties.code+"_"+feat.properties.networkCode+"_"+feat.properties.networkStartDate;
              if (aux.indexOf(identifier)<0) {
              this.providers.stations.push({
                networkStartDate: feat.properties.networkStartDate ? feat.properties.networkStartDate.substring(0, 10) : "",
                networkEndDate: feat.properties.networkEndDate ? feat.properties.networkEndDate.substring(0, 10) : "",
                startDate: feat.properties.startDate ? feat.properties.startDate.substring(0, 10) : "",
                endDate: feat.properties.endDate ? feat.properties.endDate.substring(0, 10) : "",
                longitude: parseFloat(feat.properties.longitude).toFixed(4),
                latitude: parseFloat(feat.properties.latitude).toFixed(4),
                elevation: feat.properties.elevation ? feat.properties.elevation : "--no-data--",
                providers: feat.properties.operators,
                station_code: `${feat.properties.networkCode}.${feat.properties.code}`,
                networkCode: feat.properties.networkCode,
                networkShortIdentifier: feat.properties.networkShortIdentifier,
                detail: feat.properties.code,
                restricted: feat.properties.networkRestrictedStatus
              });
              aux.push(identifier)
              }
              /*   this.geoJsonData.features.splice(index, 1); */
              
              
       
            }
          });
          this.providerMap.push(
            new VectorLayer({
              /*  extent: transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857'), */
              source: vectorSource,
              layer: providerAgency,
              style: this.styleFunction,
              renderMode: 'vector'
            })
          );
          
        
          
        });
        

        this.baselayers = new LayerGroup({
          title: "Basemaps",
          layers: [
            new TileLayer({
              source: new OSM({ wrapX: false, crossOrigin: "Anonymous" }),
              layer: "open_street_map"
            }),
            new TileLayer({
              /*    extent: transformExtent([-180, -90, 180, 90], 'EPSG:4326', 'EPSG:3857'), */
              source: new XYZ({
                url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
                crossOrigin: "Anonymous",
                wrapX: false
              }),
              layer: "open_topo_map"
            }),
            new TileLayer({
              source: new XYZ({
                wrapX: false,
                crossOrigin: "Anonymous",

                url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              }),
              layer: "satellite"
            })
          ]
        });
        this.vectorFeatures = new LayerGroup({
          title: "vectorFeatures",
          layers: [...this.providerMap]
        });
        this.map.setLayerGroup(
          new LayerGroup({
            layers: [this.baselayers, this.vectorFeatures]
          })
        );

        this.map.updateSize();
      });
  },
  methods: {

    goTo(route) {
      this.$router.push(route)
    },

 goToPopupStation() {
      this.$router.push(this.$refs.detaiLink.to)
    },

    trunc(number, decimals) {
      const tmp = number + '';
      if (tmp.indexOf('.') > -1) {
        return +tmp.substr(0, tmp.indexOf('.') + decimals + 1);
      } else {
        return +number
      }
    },
    initZoom() {
      this.map.setView(new View({
        center: [0, 0],
        zoom: 1.8,

      }))
    },
    export () {

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
        if (navigator.msSaveBlob) {
          // link download attribuute does not work on MS browsers
          navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
        } else {
          var link = document.getElementById('image-download');
          link.href = mapCanvas.toDataURL();
          link.click();
        }
      });
      this.map.renderSync();

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
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    flyTo() {
      var duration = 2000;
      var start = +new Date();
      var pan = ol.animation.pan({
        duration: duration,
        source: /** @type {ol.Coordinate} */ (view.getCenter()),
        start: start
      });
      var bounce = ol.animation.bounce({
        duration: duration,
        resolution: 4 * view.getResolution(),
        start: start
      });
      this.map.beforeRender(pan, bounce);
      view.setCenter(lausanne);
    },
    initMap() {
      var container = this.$refs.popup;
      var content_element = this.$refs.popupContent;
      var closer = this.$refs.popupCloser;
      var titlePopUp = this.$refs.popupTitle;
      var detailStation = this.$refs.detaiLink;
      this.map = new Map({
        target: this.$refs.mapnetwork.$el,

        view: new View({
          center: [0, 0],
          zoom: 2,
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
          const icon = document.createElement("i");
          let tileContent = ` ${feature.get("networkCode")}.${feature.get( "code" )}`;

          let detail = `/${feature.get("networkShortIdentifier")}/${feature.get("code")}`;

          let content = `
        Operator(s):  ${this.formatOperators(feature.get("operators"))}
         Longitude: ${parseFloat(feature.get("longitude")).toFixed(4)}</br>
        Latitude:  ${parseFloat(feature.get("latitude")).toFixed(4)}</br>
        Elevation:  ${parseFloat(feature.get("elevation")).toFixed(2)}</br>
         Status: ${feature.get(
          "networkRestrictedStatus"
        )}`

          detailStation.to = detail;
          titlePopUp.innerHTML = tileContent;
          content_element.innerHTML = content;
          overlay.setPosition(coord);
          

          content_element.innerHTML = content;
          overlay.setPosition(coord);
          
        } else {
          overlay.setPosition(undefined);
          closer.blur();
        }
      });
    },

    formatOperators(operators) {
      
        let aux ="<ul >";

        for (let i =0; i< operators.length; i++) {
          aux = aux+"<li style='display: list-item;'>"+operators[i]+"</li>"
        }

        aux = aux + "</ul>"
        return aux;
      
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
    providersFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.filterProvider) {
        return true;
      }
      // Check if the current loop value (The dessert name)
      // partially contains the searched word.
      if (this.filterProvider == "All providers") {
        return ""
      } else {
        // debugger
        return value.join(" ").toLowerCase().includes(this.filterProvider.toLowerCase());
      }
    },
  }
};
</script>

<style scoped>
.mapAllStation {}

.clickable {
  cursor: pointer
}

.ol-popup {
  position: absolute;
  background-color: transparent;
  width: 550px;
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

.link_detail {
  -webkit-text-stroke: 0.1px;
  -webkit-text-stroke-color: rgb(217, 217, 217);
}
</style>
