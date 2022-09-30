<template>
<v-card class="elevation-0">
  <!--  -->
  <v-card-title> Instructions on
    &nbsp <a href="https://www7.obs-mip.fr/resif/resif-data-access/"> retrieving waveform data and metadata </a>&nbsp
    for this and other seismic networks</v-card-title>
  <v-simple-table>
    <template v-slot:default>

      <tbody>
        <template v-for="(description,key,index) in StationDescription">
          <tr v-if="description !==''" :key='index + uuidv4()'>
            <td>
              <v-list-item>
                <v-list-item-content  v-if="key === 'doi'">
                    <span class="v-list-item__title"> {{decamelize(key, " ")}} : &nbsp
                    <span class="v-list-item__subtitle">  <a   :href="description"> {{description}}</a>  </span>
                  </span>
                 
                </v-list-item-content>
                <v-list-item-content  v-else>
                 <span class="v-list-item__title"> {{decamelize(key, " ")}} : &nbsp
                    <span class="v-list-item__subtitle">  {{description}} </span>
                  </span>
                </v-list-item-content>
              </v-list-item>
            </td>
          </tr>
        </template>

        <tr>
          <td>
            <v-list-item>
              <v-list-item-content>

                <div>

                  <span class="v-list-item__title"> Export : &nbsp</span>
                  <v-btn class="mr-2 elevation-0" tile @click="download('XML',networkIdentifier)" small color="primary">XML</v-btn>
                  <v-btn class="mr-2 elevation-0" tile @click="download( 'Text',networkIdentifier)" small color="primary">Text</v-btn>
                  <v-btn class="mr-2 elevation-0" tile @click="canvasToPDf()" small color="primary">PDF</v-btn>

                </div>
              </v-list-item-content>
            </v-list-item>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
  <div ref="mapstation" class="map"></div>
  <div id="popup" class="ol-popup v-tooltip__content menuable__content__active">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content"></div>
  </div>
 <canvas style="width:1000px" v-show="false" id="mapCanvas" crossorigin="anonymous"></canvas>
</v-card>
</template>

<script>
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Overlay from "ol/Overlay";
import FullScreen from "ol/control/FullScreen";
import WFS from 'ol/format/WFS';
import TileWMS from 'ol/source/TileWMS';

export default {
  name: "resif-seismic-network-by-network-description",
  props: {
    stationName: {
      Type: String,
      default: ""
    },
    networkId:{
      type:String,
      default :""
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

service() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifService;
      }
      return null
    }
   },

    wsService() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifWsService;
      }
      return null
    },

  data: () => ({
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
    geoJsonStation: null
  }),
  
  mounted(){

},
  watch: {
    networkId(val) {
      if (!this.map) {
        this.initMap()
      }
      
      let url = this.service+"/network/v1_0/" + val;
      this.map.renderSync()
      this.axios.get(url).then(response => {

        
        let data = response.data.properties;
       
        let features = response.data.features;
        features.forEach(element => {
           if (element.properties.code === this.stationName){
         
          let obj = {}
          obj.elevation = element.properties.elevation
          obj.site = element.properties.site
          obj.code = element.properties.code
          obj.latitude = element.properties.latitude
          obj.longitude = element.properties.longitude}
         // this.Stations.stations.push(obj)

        });
        
        

        this.map.removeLayer(this.vectorLayer);
        let toto = new GeoJSON({ featureProjection: "EPSG:3857" });
        this.geoJsonStation = {
          crs: {
            type: "name",
            properties: {
              name: "EPSG:4326"
            }
          },
          type: "FeatureCollection",
          features: response.data.features
        };
        this.vectorSource = new VectorSource({
          features: toto.readFeatures(this.geoJsonStation)
        });
        this.vectorLayer = new VectorLayer({
          source: this.vectorSource,
          style: this.styleFunction
        });
        this.map.addLayer(this.vectorLayer);
        this.map.getView().fit(this.vectorSource.getExtent(), {
          size: this.map.getSize(),
          maxZoom: this.$maxFitZoom
        });
      });
    }
  },
 
  methods: {
    initMap() {
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM()
          })
        ],
        target: "mapstation",
        view: new View({
          center: [0, 0],
          zoom: 2
        })
      });
      let container = document.getElementById("popup");
      let content_element = document.getElementById("popup-content");
      let closer = document.getElementById("popup-closer");
      closer.onclick = () => {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };
      let overlay = new Overlay({
        element: container,
        autoPan: true,
        offset: [0, -10]
      });
      this.map.addOverlay(overlay);

      let fullscreen = new FullScreen();
      this.map.addControl(fullscreen);

      this.map.on("click", evt => {
        let feature = this.map.forEachFeatureAtPixel(
          evt.pixel,
          (feature, layer) => {
            return feature;
          }
        );
        if (feature) {
          let geometry = feature.getGeometry();
          let coord = geometry.getCoordinates();
          
          let content = `
        <h2> Station : ${feature.get("code")} (network: ${this.networkIdentifier})</h2>
        <h3> Elevation: <b>${feature.get("elevation")}</b></h3>
        <h3> Site:  <b>${feature.get("site")}</b></h3>
        <h3> Longitude:  <b>${feature.get("longitude")}</b></h3>
        <h3> Latitude:  <b>${feature.get("latitude")}</b></h3>
        <h3> Restricted <b>status: ${this.NetworkDescription.restrictedStatus}</b></h3>
        
        <a href="#" class="link_detail" >Details</a>
       `

          content_element.innerHTML = content;
          overlay.setPosition(coord);

          
        }
      });

      this.map.on("pointermove", e => {
        if (e.dragging) return;

        let pixel = this.map.getEventPixel(e.originalEvent);
        let hit = this.map.hasFeatureAtPixel(pixel);
        
        
        if (this.map.getTarget().style)
          this.map.getTarget().style.cursor = hit ? "pointer" : "";
      });
    },
    download(type, identifier) {

      let baseUrl = this.wsService+`/fdsnws/station/1/query?network=${identifier}&level=station`
      let serviceUrl = ""
      if (type === "XML") {
        serviceUrl = baseUrl
      } else if (type === "Text") {
        serviceUrl = baseUrl + "&format=text";
      }
      window.open(serviceUrl, '_blank');
    },
    decamelize(str, separator) {
      separator = typeof separator === 'undefined' ? '_' : separator;

      let final = str
        .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
        .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
        .toLowerCase();

      return final.charAt(0).toUpperCase() + final.slice(1)
    },
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
   
    styleFunction() {
      let style = null;
      
      if (this.NetworkDescription.restrictedStatus === "closed") {
        style = new Style({
          text: new Text({
            text: "\uE0C7",
            font: `600 30px "Material Icons"`,

            fill: new Fill({
              color: "#E04006"
            }),
            stroke: new Stroke({
              color: "rgba(255, 255, 255, 1)",
              width: 1
            })
          })
        });
      } else {
        style = new Style({
          text: new Text({
            text: "\uE0C8",
            font: `600 30px "Material Icons"`,

            fill: new Fill({
              color: "rgb(102, 204, 0)"
            }),
            stroke: new Stroke({
              color: "rgba(255, 255, 255, 1)",
              width: 1
            })
          })
        });
      }
      return style;
    }
  }
};
</script>

<style>
.map{
height:500px;
}
.ol-popup {
  position: absolute;
  width: 500px;

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
}

.ol-popup-closer:after {
  content: "✖";
  color: rgb(217, 217, 217);
}

.link_detail {
  -webkit-text-stroke: 0.1px;
  -webkit-text-stroke-color: rgb(217, 217, 217);
}
</style>
