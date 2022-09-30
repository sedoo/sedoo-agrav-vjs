<template>
<v-app>
  <v-container elevation="0" fluid>

    <v-snackbar v-model="snackbar" top color='info'>
      <span class="headline ">Please add search parameter to your request</span>
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-stepper elevation="0" v-model="stepperState">

      <v-stepper-items>
        <v-stepper-content class="ml-8 mr-8" step="1">
          <v-btn class="mt-3 ml-2" color="primary" sendSearchStationRequest @click="sendSearchStationRequest()">
            <v-icon dark left>mdi-magnify</v-icon> search
          </v-btn>

          <v-btn class="mt-3 ml-2" text @click="resetAllUrlParam()">reset</v-btn>
          <v-card elevation="0" class="mb-12">
            <v-row>
              <v-col cols="12" class="gray--text text-caption"> If you enter text manually, dont forget to type on the ENTER key before clicking on SEARCH</v-col>
              <v-col cols="12" lg="4">
                <v-row>
                  <v-col cols="12" v-if="this.filteredTree.length==0">
                    <v-alert v-if="loading"
      dense
      border="left"
      type="info"
    >Loading...</v-alert>
             <v-alert
      dense
      border="left"
      type="warning" v-else
    >Your selection is inconsistent.</v-alert>
                  </v-col>
                  <v-col cols="12" lg="11">
                    <v-combobox prepend-icon="mdi-share-variant" label="Network"   v-model="selectedNetwork" :items="filteredNetwork" validate-on-blur autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedNetwork()">
                      <v-tooltip slot="append" attach top>
                        <template v-slot:activator="{ on }">
                          <v-btn icon v-on="on">
                            <v-icon color="grey lighten-1">help_outline</i></v-icon>
                          </v-btn>
                        </template>
                        <span>Network code .Wildcards (? or *) are authorized.Example: FR, R*</span>
                      </v-tooltip>
                    </v-combobox>
                  </v-col>
                  <v-col cols="12" lg="11">
                    <v-combobox prepend-icon="mdi-access-point-network" label="Station" v-model="selectedStation" :items="filteredStation"  validate-on-blur autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedStation()">
                      <v-tooltip slot="append" top>
                        <template v-slot:activator="{ on }">
                          <v-btn icon v-on="on">
                            <v-icon color="grey lighten-1">help_outline</i></v-icon>
                          </v-btn>
                        </template>
                        <span>Station code.Wildcards (? or *) are authorized.Example: CH?F, A*</span>
                      </v-tooltip>
                    </v-combobox>
                  </v-col>
                  <v-col cols="12" lg="11">
                    <v-combobox prepend-icon="mdi-map" label="Location" v-model="selectedLocation" :items="filteredLocation" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedLocation()">
                      <v-tooltip slot="append" top>
                        <template v-slot:activator="{ on }">
                          <v-btn icon v-on="on">
                            <v-icon color="grey lighten-1">help_outline</i></v-icon>
                          </v-btn>
                        </template>
                        <span>Location code.Wildcards (? or *) are authorized.</span>
                      </v-tooltip>
                    </v-combobox>
                    <v-combobox prepend-icon="mdi-access-point " label="Channel" v-model="selectedChannel" :items="filteredChannel" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedChannel()">
                      <v-tooltip slot="append" top>
                        <template v-slot:activator="{ on }">
                          <v-btn icon v-on="on">
                            <v-icon color="grey lighten-1">help_outline</i></v-icon>
                          </v-btn>
                        </template>
                        <span>Channel code .Wildcards (? or *) are authorized.Example: BH?</span>
                      </v-tooltip>
                    </v-combobox>
                  </v-col>
                  <v-col cols="12" lg="11">
                    <v-combobox prepend-icon="mdi-webhook" label="Network State" v-model="selectedNetworkState" :items="itemNetworkState" item-text="label" item-value="code" autocomplete chips tags select multiple clearable deletable-chips :return-object="false">
                      <template slot="selection" slot-scope="data">
                        <v-chip :selected="data.selected" close @input="remove(data.item)">
                          {{ getItemText(itemNetworkState,data.item) }}
                        </v-chip>
                      </template>
                    </v-combobox>
                    <v-combobox prepend-icon="mdi-router-network" label="Station type" v-model="selectedStationType" :items="itemStationType" item-text="label" item-value="code" autocomplete chips tags select multiple clearable deletable-chips :return-object="false" >
                      <template slot="selection" slot-scope="data">
                        <v-chip :selected="data.selected" close @input="remove(data.item)">
                          {{ getItemText(itemStationType,data.item) }}
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-col>
                </v-row>
                <v-row>

                </v-row>
              </v-col>
              <v-divider vertical></v-divider>
              <v-col>
                <v-card class="ml-8 mr-8" elevation="0">

                  <v-row>
                    <v-col v-if="circleMode" offset-lg="2" cols="6" lg="2">
                      <v-text-field prepend-icon="mdi-latitude" label="Center latitude" v-model=" circle.prop.center[1]"> </v-text-field>
                    </v-col>
                    <v-col v-if="circleMode" cols="6" lg="2">
                      <v-text-field prepend-icon="mdi-longitude" label="Center longitude" v-model=" circle.prop.center[0]"> </v-text-field>

                    </v-col>
                    <v-col v-if="circleMode" cols="6" lg="2">
                      <v-text-field prepend-icon="mdi-ruler" label="Radius" v-model="circle.prop.radius"> </v-text-field>
                    </v-col>
                    <v-col v-if="circleMode" cols="6" lg="2">
                      <v-text-field prepend-icon="mdi-ruler" label="Hole Radius" v-model="circle.prop.holeRadius"> </v-text-field>
                    </v-col>
                    <v-col v-if="!circleMode" offset-lg="5" cols="12" lg="2">
                      <v-text-field prepend-icon="mdi-compass-outline" label="North" v-model=" map.coordinate.north"> </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center" justify="center">
                    <v-col cols="12" lg="2" jclass="justify-center">
                      <v-text-field v-if="!circleMode" prepend-icon="mdi-compass-outline" label="West" v-model=" map.coordinate.west">
                      </v-text-field>
                    </v-col>
                    <v-col cols="12" lg="8" class="fill-height">
                      <resif-station-url-map-builder :circleCoordinate="circle" :rectCoordinate="map" @selectionDrawEvent="getSelection" @selectionDrawCircleEvent="getCircleSelection"></resif-station-url-map-builder>
                    </v-col>
                    <v-col cols="12" lg="2">
                      <v-text-field v-if="!circleMode" prepend-icon="mdi-compass-outline" label="East" v-model=" map.coordinate.east">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-if="!circleMode" offset-lg="5" cols="12" lg="2">
                      <v-text-field prepend-icon="mdi-compass-outline" label="South" v-model="map.coordinate.south"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-card>

        </v-stepper-content>

        <v-stepper-content step="2">
          <v-btn class="mt-3 ml-2" color="primary" @click="stepperState = 1">
            <v-icon dark left>mdi-chevron-left</v-icon> return to search
          </v-btn>

          <v-card elevation="0" class="mb-12">
            <resifBrowseByStationResult :serviceUrl="urlservice" :randomkey="random"></resifBrowseByStationResult>
          </v-card>

        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

  </v-container>
</v-app>
</template>

<script>
import resifStationUrlMapBuilder from "../resif-station-url-builder/resif-station-url-map-builder"//resif-station-url-map-builder";
import resifBrowseByStationResult from "./resif-browse-by-station-result.vue";
import urlBuilderMixin from "../../mixin/urlBuilderMixin"

export default {
  name: "resif-browse-by-station",
  mixins: [urlBuilderMixin],
  components: {
    resifStationUrlMapBuilder,
    resifBrowseByStationResult,
  },

  mounted() {
    
    //debugger
    this.axios.get(this.service+"/station/v1_0/stationTypes")
      .then(response => {
        
        this.itemStationType = response.data
      })
  
  },
created () {
  this.loadTree();
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
    },

   
    
  },

  data: () => ({
    urlservice: "",
    snackbar: false,
    stepperState: 1,
    networks: [],
    circleMode: false,
    random:"",
    itemNetworks: [],
    itemStations: [],
    itemLocations: [],
    itemChannels: [],
    itemStationType: [],
    itemNetworkState: [{ label: "Completed", code: "COMPLETED" }, { label: "On going", code: "ONGOING" }, { label: "Planned", code: "PLANNED" }],
    itemGeology: [],
    select: [],
    selectedStationType: [],
    selectedNetworkState: [],
    selectedGeology: [],
    selectedLevel: "",
    selectedFormat: "",
    selectedStartDate: "",
    selectedEndDate: "",
    stationlisttype: [],
    advancedCriteria: {
      startbefore: "",
      startafter: "",
      endbefore: "",
      endafter: ""
    },
    checkLongestonly: false,
    selectedLongestonly: false,
    map: {
      coordinate: {
        north: "",
        south: "",
        east: "",
        west: ""
      }
    },
    circle: {
      prop: {
        center: [null, null],
        radius: null,
        holeRadius: null
      }
    },

    e1: 0
  }),
  methods: {

    logblur() {
      console.log("blur")
    },

    getItemText(itemtab, val) {
      const item = itemtab.find((i) => i.code === val);
      return item ? item.label : "";
    },
    convertM2D(distanceInMeter) {
      return distanceInMeter / 111000;
    },
    convertD2M(distanceInDegrees) {
      return distanceInDegrees * 111;
    },
    getSelection(selection) {
      if (selection) {
        this.map.coordinate.north = selection.north.toFixed(4);
        this.map.coordinate.south = selection.south.toFixed(4);
        this.map.coordinate.east = selection.east.toFixed(4);
        this.map.coordinate.west = selection.west.toFixed(4);
        this.circle.prop.center[0] = "";
        this.circle.prop.center[1] = "";
        this.circle.prop.radius = "";
        this.circle.prop.holeRadius = "";
      }
      this.circleMode = false;
      this.rectMode = true;
    },
    getCircleSelection(selection) {
      if (selection) {
        this.circle.prop.center[0] = selection.center[0].toFixed(4);
        this.circle.prop.center[1] = selection.center[1].toFixed(4);
        this.circle.prop.radius = selection.radius.toFixed(4);
        this.circle.prop.holeRadius = selection.holeRadius.toFixed(4);

        this.map.coordinate.north = "";
        this.map.coordinate.south = "";
        this.map.coordinate.east = "";
        this.map.coordinate.west = "";
      }

      this.rectMode = false;
      this.circleMode = true;
    },
    

    dateToISOLikeButLocal(date) {
      if (date) {
        let offsetMs = date.getTimezoneOffset() * 60 * 1000;
        let msLocal = date.getTime() - offsetMs;
        let dateLocal = new Date(msLocal);
        let iso = dateLocal.toISOString();
        let isoLocal = iso.slice(0, 19);
        return isoLocal;
      } else {
        return "";
      }
    },
    checkProperties(obj) {
      for (var key in obj) {
        if (obj[key] === null || obj[key] === "") return false;
      }
      return true;
    },
    sendSearchStationRequest() {
      //nord, est, sud, ouest
      //Center lon,center lat, radius et radiusHole

      console.log( this.selectedNetwork)
      
      this.urlservice = this.service+`/station/v1_0/search?${
        this.selectedNetwork.length > 0
          ? `&networks=${this.selectedNetwork}`
          : ``
      }${
        this.selectedStation.length > 0
          ? `&stations=${this.selectedStation}`
          : ``
      }${
        this.selectedLocation.length > 0
          ? `&locations=${this.selectedLocation}`
          : ``
      }${
        this.selectedChannel.length > 0
          ? `&channels=${this.selectedChannel}`
          : ``
      }${
        this.selectedStationType.length > 0
          ? `&types=${this.selectedStationType}`
          : ``
      }${
        this.selectedNetworkState.length > 0
          ? `&networkStates=${this.selectedNetworkState}`
          : ``
      }${
        this.selectedGeology.length > 0
          ? `&geologies=${this.selectedGeology}`
          : ``
      }

      ${
        this.checkProperties(this.map.coordinate)
          ? `&box=${this.map.coordinate.north},${this.map.coordinate.east},${this.map.coordinate.south},${this.map.coordinate.west}`
          : ``
      }${
        this.checkProperties(this.circle.prop)
          ? `&circle=${this.circle.prop.center[0]},${
              this.circle.prop.center[1]
            },${this.circle.prop.radius}${
              this.circle.prop.holeRadius > 0
                ? `,${this.circle.prop.radius}`
                : ``
            }`
          : ``
      }`;
      
      if (
        this.urlservice !== this.service+"/station/v1_0/search?"
      ) {
        this.stepperState = 2;
        this.random = Math.floor(Math.random() * (1000))
      } else {
        this.snackbar = true;
      }
    },
    resetAllUrlParam() {
      this.selectedMinimumlength = "";
      this.selectedLevel = "";
      this.selectedFormat = "";
      this.selectedNetwork = [];
      this.select = [];
      this.selectedStation = [];
      this.selectedLocation = [];
      this.selectedChannel = [];
      this.selectedQuality = "";
      this.selectedNetworkState = [];
      this.selectedStationType = [];
      this.selectedGeology = [];

      this.map.coordinate.north = "";
      this.map.coordinate.south = "";
      this.map.coordinate.east = "";
      this.map.coordinate.west = "";
      this.circle.prop.center[0] = "";
      this.circle.prop.center[1] = "";
      this.circle.prop.radius = "";
      this.circle.prop.holeRadius = "";

      this.advancedCriteria.startbefore = "";
      this.advancedCriteria.endbefore = "";
      this.advancedCriteria.startafter = "";
      this.advancedCriteria.endafter = "";
      this.checkAuth = false;
      this.checkLongestonly = false;
      this.selectedLongestonly = false;
    }
  }
};
</script>

<style>
.v-banner__text {
  width: 100% !important;
  padding: 0;
  margin: 0;
}

.v-banner__wrapper {
  padding: 10px !important;
}

.expansion-panel {
  border: 0;
  box-shadow: none;
}

.v-expansion-panel::before {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.theme--light.v-expansion-panels .v-expansion-panel {
  background: #fafafa !important;
}
</style>
