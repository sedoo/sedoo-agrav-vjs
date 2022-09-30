<template>
  <v-card elevation="0">

    <v-sheet
      tag="div"
      style=" height: 100%; width: 100%;"

      max-height="700px"
      ref="mapStationUrl"
      class="mapAllStation"
    >

      <div ref="initZoomButton">
        <div
          class="ol-full-screen ol-unselectable ol-control"
          style="margin-top:35px"
        >
          <button
            @click="initZoom()"
            title="reinitialize Zoom"
            class="ol-zoom-out"
            type="button"
          ><span class="mdi mdi-restart"></span></button>
        </div>
      </div>
      <div ref="layercontrol">
        <v-menu
          class="white--text"
          left
          offset-x
          content-class="my-menu"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <div class="ol-full-screen ol-unselectable ol-control">
              <button
                title="Zoom in"
                class="ol-zoom-in"
                type="button"
              ><span
                  class="mdi mdi-layers-triple"
                  v-on="on"
                ></span></button> </div>

          </template>
          <v-radio-group
            small
            v-model="layerdisplay"
          >

            <v-radio
              small
              class=" mx-2"
              label="Open street map"
              value="open_street_map"
            ></v-radio>
            <v-radio
              class="ml-2"
              label="Open topo map"
              value="open_topo_map"
            ></v-radio>
            <v-radio
              class="ml-2"
              label="Satellite"
              value="satellite"
            ></v-radio>
          </v-radio-group>
        </v-menu>
      </div>

      <div ref="rectZone">
        <div
          class="ol-full-screen ol-unselectable ol-control"
          style="margin-top:105px"
        >
          <button
            @click="drawModeRect"
            title="rectangular selection"
            class="ol-zoom-out"
            type="button"
          ><span class="mdi mdi-vector-rectangle"></span></button>
        </div>
      </div>
      <div ref="circleZone">
        <div
          class="ol-full-screen ol-unselectable ol-control"
          style="margin-top:70px"
        >
          <button
            @click="drawModeCircle"
            title="Circle selection"
            class="ol-zoom-out"
            type="button"
          ><span class="mdi mdi-vector-circle"></span></button>
        </div>
      </div>
      <div ref="delShape">
        <div
          style="margin-top:140px"
          class="ol-full-screen ol-unselectable ol-control"
        >
          <button
            @click="delFeatureByClick"
            title="Delete"
            class="ol-zoom-out"
            type="button"
          ><span class="mdi mdi-eraser"></span></button>
        </div>
      </div>

    </v-sheet>

  </v-card>
</template>

<script>
import Feature from "ol/Feature";
import * as Extent from "ol/extent.js";
import Map from "ol/Map.js";
import View from "ol/View.js";
import Polygon from "ol/geom/Polygon";
import { toLonLat, transform } from "ol/proj";
import { Draw } from "ol/interaction.js";
import MousePosition from "ol/control/MousePosition.js";
import { defaults, ScaleLine } from "ol/control.js";
import { Tile, Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { format } from "ol/coordinate";
import LinearRing from "ol/geom/LinearRing";
import { circular as circularPolygon } from "ol/geom/Polygon";
import LineString from "ol/geom/LineString";
import Select from "ol/interaction/Select";
import { fromLonLat } from "ol/proj";
import XYZ from "ol/source/XYZ";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import WMS from "ol/source/TileWMS";
import { defaults as defaultControls, Control } from "ol/control";
import LayerGroup from "ol/layer/Group";
export default {
  name: "aeris-catalog-map",

  props: {
    rectCoordinate: {
      type: Object,
      default: () => {}
    },
    circleCoordinate: {
      type: Object,
      default: () => {}
    },
    url: {
      type: String,
      default:
        "https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZnJhbmNvaXNhbmRyZSIsImEiOiJjaXVlMGE5b3QwMDBoMm9tZGQ1M2xubzVhIn0.FK8gRVJb4ADNnrO6cNlWUw"
    }
  },

  data() {
    return {
      ol: null,
      map: null,
      mainSource: null,
      vector: null,
      raster: null,
      previewSource: null,
      previewLayer: null,
      drawRectActive: false,
      drawCircleActive: false,
      delActive: false,
      drawDeleteActive: false,
      defaultCenter: null,
      isDrawMode: false,
      drawIsActive: false,
      draw: null,
      drawing: false,
      geodesicCenter: null,
      geodesicRadius: null,
      drawRadius: null,
      selectionBox: null,
      selectionCircle: null,
      select: null,
      layerdisplay: null
    };
  },

  watch: {
    layerdisplay(val, o) {
      
      this.baselayers.getLayers().forEach((element, index, array) => {
        if (val === element.values_.layer) {
          element.setVisible(true);
        } else {
          element.setVisible(false);
        }
      });
    },
    rectCoordinate: {
      handler(value) {
        this.handleAddSelectionEvent(value);
      },
      deep: true
    },
    circleCoordinate: {
      handler(value) {
        this.handleAddCircleSelectionEvent(value.prop);
      },
      deep: true
    }
  },

  mounted() {
    this.$nextTick(() => {

      this.initialiseMainSource();
      this.map = new Map({
        target: this.$refs.mapStationUrl.$el,

        view: new View({
  
          center: [0, 0],
          zoom: 1.5,

          
          maxZoom: this.$maxZoom,
          minZoom: 1
        })
      });
      this.baselayers = new LayerGroup({
        title: "Basemaps",
        layers: [
          new TileLayer({
            /*  extent: transformExtent(
                 [-180, -90, 180, 90],
                 "EPSG:4326",
                 "EPSG:3857"
               ), */
            className: "ol-overviewmap",
            source: new OSM({
              wrapX: false
            }),

            layer: "open_street_map"
          }),
          new TileLayer({
            source: new XYZ({
              url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
              wrapX: false
            }),
            tilePixelRatio: 10,
            layer: "open_topo_map"
          }),
          new TileLayer({
            source: new XYZ({
              wrapX: false,
              url:
                "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }),
            layer: "satellite"
          })
        ]
      });
      this.initDraw();
      this.initDrawEndListener();
      this.initInteraction();
      this.map.setLayerGroup(
        new LayerGroup({
          layers: [this.baselayers, this.vector]
        })
      );

      var rectZoneButton = new Control({
        element: this.$refs.rectZone
      });
      this.map.addControl(rectZoneButton);

      var circleZoneButton = new Control({
        element: this.$refs.circleZone
      });
      var layerbutton = new Control({
        element: this.$refs.layercontrol
      });
      this.map.addControl(layerbutton);
      var restartZoombutton = new Control({
        element: this.$refs.initZoomButton
      });
      this.map.addControl(restartZoombutton);
      this.map.addControl(circleZoneButton);

      var delShapeButton = new Control({
        element: this.$refs.delShape
      });
      this.map.addControl(delShapeButton);
    });

  },

  methods: {
    initDraw() {
      this.drawRadius = new Draw({
        source: this.mainSource,
        type: "LineString",
        maxPoints: 2
      });

      this.draw = new Draw({
        source: this.mainSource,
        type: "LineString",
        geometryFunction: this.drawGeometryFunction,
        maxPoints: 2
      });
    },
    initDrawEndListener() {
      this.draw.addEventListener("drawend", this.handleSelectionDrawEnd);
      this.drawRadius.addEventListener(
        "drawend",
        this.handleSelectionDrawRadiusEnd
      );
      this.mainSource.on("addfeature", event => {
        this.removeFeature("lineRadius");
      });
    },
    initZoom() {
      this.map.setView(
        new View({
          center: [0, 0],
          projection: "EPSG:4326",
          smoothExtentConstraint: false,
          zoom: 2.5,

          minZoom: 2.5,

          maxZoom: this.$maxZoom
        })
      );
    },
    drawModeRect() {
      this.drawRectActive = true;
      this.drawCircleActive = false;
      this.delActive = false;
      this.map.removeInteraction(this.drawRadius);
      this.map.removeInteraction(this.select);
      this.map.addInteraction(this.draw);
      let selectionDraw = null;
      this.$emit("selectionDrawEvent", selectionDraw);
    },
    drawModeCircle() {
      this.drawRectActive = false;
      this.drawCircleActive = true;
      this.delActive = false;

      this.map.removeInteraction(this.draw);
      this.map.removeInteraction(this.select);
      this.map.addInteraction(this.drawRadius);
      let selectionDrawCircle = null;
      this.$emit("selectionDrawCircleEvent", selectionDrawCircle);
    },
    handleAddCircleSelectionEvent(coord) {
      let geodesic = this.createGeodesicFeature(
        fromLonLat(
          [Number(coord.center[0]), Number(coord.center[1])],
          "EPSG:3857"
        ),
        this.convertD2M(Number(coord.radius)),
        this.convertD2M(Number(coord.holeRadius)),
        250
      );
      this.removeFeature("circular");
      geodesic.setId("circular");
      this.mainSource.addFeature(geodesic);
    },
    handleAddSelectionEvent(coord) {
      let feature = this.coordsToFeature(coord.coordinate);
      this.removeFeature("selectionBox");
      feature.setId("selectionBox");
      this.mainSource.addFeature(feature);
    },

    coordsToFeature(coords) {
      let obj = null;
      let l = Object.keys(coords).length;
      if (l === 4) {
        if (Number(coords.north) > 85) coords.north = 85;
        if (Number(coords.south) < -85) coords.south = -85;
        obj = new Polygon([
          [
            [Number(coords.west), Number(coords.north)],
            [Number(coords.east), Number(coords.north)],
            [Number(coords.east), Number(coords.south)],
            [Number(coords.west), Number(coords.south)],
            [Number(coords.west), Number(coords.north)]
          ]
        ]).transform("EPSG:4326", "EPSG:900913");
      } else if (l === 2) {
        obj = new Point(
          transform(
            [Number(coords.lon), Number(coords.lat)],
            "EPSG:4326",
            "EPSG:900913"
          )
        );
      }

      let feature = new Feature({
        geometry: obj
      });
      return feature;
    },

    handleSelectionDrawRadiusEnd(e) {
      let linefeature = e.feature;
      this.mainSource.clear();
      linefeature.setId("lineRadius");

      this.geodesicCenter = linefeature.getGeometry().getCoordinates()[0];

      let last = linefeature.getGeometry().getCoordinates()[1];

      let dx = this.geodesicCenter[0] - last[0];
      let dy = this.geodesicCenter[1] - last[1];
      this.geodesicRadius = Math.sqrt(dx * dx + dy * dy);

      let geoFeat = this.createGeodesicFeature(
        this.geodesicCenter,
        this.geodesicRadius,
        0,
        250
      );

      let selectionDrawCircle = {
        center: toLonLat(this.geodesicCenter),
        radius: this.convertM2D(this.geodesicRadius),
        holeRadius: 0
      };
      geoFeat.setId("circular");
      this.mainSource.addFeature(geoFeat);
      this.$emit("selectionDrawCircleEvent", selectionDrawCircle);
    },

    createGeodesicFeature(center, radius, holeRadius, nbPt) {
      let geometry = new Polygon([]);

      if (holeRadius > radius) holeRadius = radius;
      let circle = circularPolygon(toLonLat(center), radius, nbPt);
      circle.transform("EPSG:4326", "EPSG:3857");

      geometry.setCoordinates(circle.getCoordinates());

      geometry.appendLinearRing(
        new LinearRing(
          this.createCirclePointCoords(center[0], center[1], holeRadius, nbPt)
        )
      );
      let geodesicFeature = new Feature({
        name: "circ",
        geometry: geometry
      });
      return geodesicFeature;
    },
    createCirclePointCoords(
      circleCenterX,
      circleCenterY,
      circleRadius,
      pointsToFind
    ) {
      let center = [circleCenterX, circleCenterY];
      let circle = circularPolygon(
        toLonLat(center, "EPSG:3857"),
        circleRadius,
        pointsToFind
      );
      circle.transform("EPSG:4326", "EPSG:3857");
      return circle.getCoordinates()[0];
    },
    handleSelectionDrawEnd(e) {
      this.mainSource.clear();
      e.feature.setId("selectionBox");
      this.selectionBox = e.feature;
      let clone = e.feature.clone();
      let extent = clone.getGeometry().getExtent();
      let bottomRight = transform(
        Extent.getBottomRight(extent),
        "EPSG:3857",
        "EPSG:4326"
      );
      let topLeft = transform(
        Extent.getTopLeft(extent),
        "EPSG:3857",
        "EPSG:4326"
      );
      let selectionDraw = {
        east: bottomRight[0],
        south: bottomRight[1],
        west: topLeft[0],
        north: topLeft[1]
      };

      this.$emit("selectionDrawEvent", selectionDraw);
    },

    drawGeometryFunction(coordinates, geometry) {
      if (!geometry) {
        geometry = new Polygon(coordinates);
      }
      let start = coordinates[0];
      let end = coordinates[1];
      geometry.setCoordinates([
        [start, [start[0], end[1]], end, [end[0], start[1]], start]
      ]);
      return geometry;
    },
    delFeatureByClick() {
      this.drawRectActive = false;
      this.drawCircleActive = false;
      this.delActive = true;
      this.mainSource.clear();
    },

    removeFeature(id) {
      let feature = this.mainSource.getFeatureById(id);
      if (feature) {
        this.mainSource.removeFeature(feature);
      }
    },
    initInteraction() {
      this.map.addControl(
        new MousePosition({
          projection: "EPSG:4326",
          coordinateFormat: coord => {
            return format(coord, "Longitude : {x} , Latitude : {y}", 4);
          },
          className: "custom-mouse-position map-component",
          target: document.getElementById("mapCoordinates"),
          undefinedHTML: "&nbsp;"
        })
      );

      this.map.addControl(
        new ScaleLine({
          div: this.$refs.scale
        })
      );
    },
    convertM2D(distanceInMeter) {
      return distanceInMeter / 111000;
    },
    convertD2M(distanceInDegrees) {
      return distanceInDegrees * 111000;
    },
    initialiseMainSource() {
      this.mainSource = new VectorSource({
        wrapX: false,
        noWrap: true
      });
      this.vector = new VectorLayer({
        source: this.mainSource
      });
      this.raster = new TileLayer({
        source: new OSM()
      });
    }
  }
};
</script>

<style scoped>
.map {
  margin: 0;
  height: 100%;
  width: 100%;
}
</style>
