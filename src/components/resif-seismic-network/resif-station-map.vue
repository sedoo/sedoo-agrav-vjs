<template>
<v-container fluid no-gutters>
  <v-card class="elevation-0 mt-6">
    <!--  -->
    <v-card-title class="headline pa-2" style="background-color:#e36517; color:white"> <span>{{title}} &nbsp</span> <span class='body-2'>( total number of stations : {{numberStationOpen + numberStationClosed}} )</span>

    </v-card-title>
    <v-card-subtitle class="ma-0 pa-0">
      <v-card-actions class="pl-0">
        <v-checkbox class="mr-3" :dense="true" :persistent-hint="true" :hint='"number of open stations  :" + numberStationOpen' v-model="setVisibilityOpen" label=" Status : Open "></v-checkbox>
        <v-checkbox class="mr-3" :dense="true" :persistent-hint="true" :hint='"number of closed stations  :" + numberStationClosed' v-model="setVisibilityClosed" :label="`Status : Closed`"></v-checkbox>
        <v-checkbox class="mr-3" :dense="true" :persistent-hint="true" :hint='"number of public stations  :" + numberStationPublic' v-model="setVisibilityPublic" label=" Access : Public "></v-checkbox>
        <v-checkbox class="mr-3" :dense="true" :persistent-hint="true" :hint='"number of restricted stations  :" + numberStationRestricted' v-model="setVisibilityRestricted" label=" Access : Restricted "></v-checkbox>
        <v-spacer></v-spacer>
         <v-switch
      v-model="andMode"
      label="And mode"
    ></v-switch>
    <v-icon class="ml-2" title="Activate the AND mode if you want to select stations that correspond to both status AND access">mdi-information</v-icon>
      </v-card-actions>
    </v-card-subtitle>
    <v-row v-resize="onResize">
      <v-col>
        <v-card elevation="0">

          <v-sheet tag="div" min-height="1000px"  ref="mapnetwork" class="mapAllStation">
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

        </v-card>
      </v-col>
    </v-row>
    <div ref="popup" class="ol-popup ">
      <v-card elevation="6" style="border-radius:12px; background-color:rgba(0,0,0,0.6)">
        <span href="#" ref="popupCloser" class="ol-popup-closer-1 clickable">
          <v-icon color="white">clear</v-icon>
        </span>
        <v-card-title class="text--white" style="border-radius:10px">
          <v-chip small color="primary" class="clickable" @click="goToPopupStation"><span ref="popupTitle"></span></v-chip>

         &nbsp  <router-link ref="detaiLink" class="text-decoration-none clickable" tag="span" to="#"> <v-icon color="white" right>mdi-magnify</v-icon></router-link> 
        </v-card-title>
        <v-card-text>
          <div style="color:white" ref="popupContent"></div>
        </v-card-text>
        <v-card-actions>
          <span ></span>
        </v-card-actions>
      </v-card>
    </div>

  </v-card>

</v-container>
</template>

<script>
import "ol/ol.css";
import { defaults as defaultControls, Control } from "ol/control";
import { defaults } from 'ol/interaction';

import Map from "ol/Map";
import View from "ol/View";
import LayerGroup from "ol/layer/Group";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import WMS from "ol/source/TileWMS";
import GeoJSON from "ol/format/GeoJSON";
import { boundingExtent } from "ol/extent";
import { toSize } from "ol/size";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke } from "ol/style";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import Overlay from "ol/Overlay";
import FullScreen from "ol/control/FullScreen";
import { transformExtent } from "ol/proj.js";
import { RegularShape } from "ol/style";
import ZoomToExtent from 'ol/control/ZoomToExtent';

export default {
  name: "resif-station-map",
  props: {
    urlStationService: {
      Type: String,
      default: ""
    },
    title: {
      Type: String,
      default: ""
    }
  },
  data: () => ({
    andMode: false,
    setVisibilityOpen: true,
    setVisibilityClosed: true,
    setVisibilityRestricted: false,
    setVisibilityPublic: false,
    layerdisplay: 'satellite',
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
    vectorSource: null,
    numberStationOpen : 0,
    numberStationClosed : 0,
    numberStationRestricted : 0,
    numberStationPublic : 0,
    content: "",
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
    invisibleStyle: new Style({}),
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
    disableStyle: new Style({
      image: new RegularShape({
        fill: new Fill({
          color: "rgba(255, 157, 0, 0.6)"
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
    layerdisplay(val) {
      this.baselayers.getLayers().forEach((element, index, array) => {
        if (val === element.values_.layer) {
          
          element.setVisible(true);
        } else {
          element.setVisible(false);
        }
      });
    },
    setVisibilityOpen() {
      this.updateFeatureVisibility();
    },
    setVisibilityClosed() {
      this.updateFeatureVisibility();
    },
     setVisibilityPublic() {
      this.updateFeatureVisibility();
    },
    setVisibilityRestricted() {
      this.updateFeatureVisibility();
    },
    andMode() {
      this.updateFeatureVisibility();
    },
  },
  computed: {
   
    
  },
  mounted() {
    this.initMap();
    this.getStationServices();
  },

  methods: {

    goToPopupStation() {
      this.$router.push(this.$refs.detaiLink.to)
    },

    

    initMap() {
      var container = this.$refs.popup;
      var content_element = this.$refs.popupContent;
      var closer = this.$refs.popupCloser;
      var titlePopUp = this.$refs.popupTitle;
     var detailStation = this.$refs.detaiLink;
  
      this.map = new Map({
        target: this.$refs.mapnetwork.$el,
        interactions: defaults({
          dragPan: true
        }),
        view: new View({
          center: [0, 0],
          zoom:2,
          minZoom :2  ,
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
        element: container,
        autoPan: true,
        autoPanMargin: 60,
        autoPanAnimation: {
          duration: 350
        }
      });

      this.map.addOverlay(overlay);
      this.$refs.popupCloser.onclick = () => {
        
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
          const icon = document.createElement("i");
          let tileContent = ` ${feature.get("networkCode")}.${feature.get(
            "code"
          )}`;
         
          let detail = `/${feature.get("networkCode")}/${feature.get("code")}`; 
          let content = `
         Longitude:  ${parseFloat(feature.get("longitude")).toFixed(4)} <br>
         Latitude:  ${parseFloat(feature.get("latitude")).toFixed(4)}<br>
         Elevation:  ${parseFloat(feature.get("elevation")).toFixed(2)}<br>
         Status: ${feature.get("networkRestrictedStatus")}<br>
        `;
            
        detailStation.to = detail;
          titlePopUp.innerHTML = tileContent;
          content_element.innerHTML = content;
          overlay.setPosition(coord);
          
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
    getStationServices() {
      let url = this.urlStationService;

      this.axios.get(url).then(response => {
        
        let geoJsonData = response.data;

        let geoJSON = new GeoJSON({
        featureProjection: 'EPSG:3857'
        });

        let numberStationOpen = 0;
        let numberStationClosed = 0;
        let numberStationRestricted = 0;
        let numberStationPublic = 0;


        this.vectorSource = new VectorSource({
          wrapX: false
        });
       
        geoJSON.readFeatures(geoJsonData).forEach(feat => {
          var attribut = feat.getProperties();
          if (attribut.networkRestrictedStatus == "open") {
            numberStationPublic++;
          }
          else {
            numberStationRestricted++;
          }

          let now = new Date()
      let aux = attribut.endDate.split("T")[0]
      let endDate = new Date(aux)
      if (now > endDate) {
          numberStationClosed++
      } else {
        numberStationOpen++;
      }

          this.vectorSource.addFeature(feat)



        });

        this.numberStationOpen = numberStationOpen;
        this.numberStationClosed = numberStationClosed;
        this.numberStationRestricted = numberStationRestricted;
        this.numberStationPublic = numberStationPublic;

        this.vectorLayer = new VectorLayer({
            source: this.vectorSource,
            style: this.styleFunction
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
        this.map.setLayerGroup(
          new LayerGroup({
            layers: [
              this.baselayers,
              this.vectorLayer
            ]
          })
        );
        
      this.map.getView().fit(this.vectorSource.getExtent(), {
                   size: this.map.getSize(),
                   maxZoom: this.$maxFitZoom
                 });
      });
    },
    onResize() {
      if (this.map) {
        

      }

    },
    initZoom() {
      this.map.setView(new View({
        center: [0, 0],
   

        zoom: 1.5,

      }))
    },

    updateFeatureVisibility() {
      let features = this.vectorSource.getFeatures();
      for (let i=0; i < features.length; i++) {
        if (this.isVisible(features[i])) {
          features[i].setStyle(this.styleFunction(features[i]));  
        } else {
          features[i].setStyle(this.invisibleStyle);
        }
        
      }
    },

    isVisible(feature) {
      let isCompatibleWithAccess = false;
      let access = feature.values_.networkRestrictedStatus; 
      if (access == "open") {
        if (this.setVisibilityPublic) {
          if (this.andMode) {
            isCompatibleWithAccess = true;
          } else {
          return true
          }
        }
      } else {

        if (this.setVisibilityRestricted) {
           if (this.andMode) {
            isCompatibleWithAccess = true;
          } else {
          return true
          }
        }

      }
      if (this.andMode) {
        if (!isCompatibleWithAccess) {
          return false
        }
      }
      let now = new Date();
      let aux = feature.values_.endDate.split("T")[0]
      let endDate = new Date(aux)
      if (now > endDate) {
           if (this.setVisibilityClosed) {
          return true
        }
      } else {
         if (this.setVisibilityOpen) {
          return true
        }
      }


      return false;
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

<style scoped>

.clickable {
  cursor: pointer;
}

.mapAllStation {

  width: 100%;
  height: 100%;
}

.mapAllStation:-webkit-full-screen {
  height: 100%;
  margin: 0;
}

.mapAllStation:-ms-fullscreen {
  height: 100%;
}

.mapAllStation:fullscreen {
  height: 100%;
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

.link_detail {
  -webkit-text-stroke: 0.1px;
  -webkit-text-stroke-color: rgb(217, 217, 217);
}
</style>
