<template>
<v-app>

  <v-dialog
      v-model="selectionDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Selection results
        </v-card-title>

        <v-card-text class="pa-5">
          <p>Matching networks: <b>{{currentSelectedNetworks}}</b></p>
          <p>Matching stations: <b>{{currentSelectedStations}}</b></p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="selectionDialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

   <v-snackbar v-model="notifier" top :color="notifierColor" :timeout="timeout">
      {{ notifierMessage }}
      <v-btn dark text @click="notifier = false">Close</v-btn>
    </v-snackbar>

  <v-container fluid>
    <v-alert  :tile="false"  :sticky="true" class="pa-0 ma-0">
      <v-row>
        <v-col :class="{'pa-0': $vuetify.breakpoint.xs} " class="text-center" cols="12" lg="12" xl="12">
          <v-alert outlined color=" blue" style="word-break: break-all;" class="ma-0 title text-center text-wrap" :class="{'subtitle-2': $vuetify.breakpoint.xs}">
            <a v-if="!$vuetify.breakpoint.xs" :href="buildedUrl" target="_blank"> {{buildedUrl}}</a> 
            <a v-else :href="buildedUrl" target="_blank"> GO TO URL</a>
            <v-btn title="Copy to clipboard" text class="px-2"
    v-clipboard="buildedUrl" small color="success"
    @success="displaySuccess('The url has been copied to the clipboard.')"
>
 <v-icon >
        mdi-content-copy
      </v-icon>
</v-btn>
          </v-alert>
        </v-col>
        <v-col :class="{'pa-0': $vuetify.breakpoint.xs}" cols="6" lg="6" xl="6" v-show="!$vuetify.breakpoint.xs">
          <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular	" color="blue" @click="resetAllUrlParam">Reset</v-btn>
          <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular ml-2" color="blue" @click.stop="dialog = true">Usage</v-btn>
          
          <v-btn v-else :elevation="0" class="white--text" rounded color="blue">
            <v-icon :small="true">fas fa-undo</v-icon>
          </v-btn>
          <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular ml-2" :loading="testing" color="blue" @click="testSelection">Test selection</v-btn>
        </v-col>
      </v-row>

      <!-- <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular	" color="blue" @click="resetAllUrlParam">Reset</v-btn>
      <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular ml-2" :loading="testing" color="blue" @click="resetAllUrlParam">Test selection</v-btn> -->


      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-switch v-model="autotesting" 
           title="This will automatically test your selection every 10 seconds">
            <template v-slot:label>
              Automatic test
              <span  v-if="autotesting" class="ml-4"> 
          Matching networks: <b>{{currentSelectedNetworks}}</b>&nbsp;Matching stations: <b>{{currentSelectedStations}}</b>
          </span>
            </template>  
           </v-switch>
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
         
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" lg="6" xl="6">
          <p class="v-label theme--light text-sm-left pa-0 ma-0">The nodata parameter indicates that a 404 code is returned when no data is available. </p>
        </v-col>
      </v-row>
    </v-alert>

    <v-row>

      <v-col cols="12" lg="4">
        <v-row>
          
           <v-col cols="12" lg="11">

<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>HIERACHICAL SELECTION</v-toolbar-title>
      <v-spacer></v-spacer>

 <v-tooltip top>
      <template v-slot:activator="{ on}">
        <v-icon
          color="white"
          v-on="on"
        >
          help_outline
        </v-icon>
      </template>
      <span>These four criteria are dynamically linked</span>
    </v-tooltip>

    
    </v-toolbar>
           </v-col>

          <v-col cols="12" lg="11" v-if="this.filteredTree.length==0">
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

            <v-combobox @change="computeUrl" prepend-icon="share" label="Network" v-model="selectedNetwork" :items="filteredNetwork" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedNetwork()">
              <v-tooltip slot="append" top>
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
            <v-combobox @change="computeUrl" prepend-icon="fa-broadcast-tower" label="Station" v-model="selectedStation" :items="filteredStation" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedStation()">
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
            <v-combobox @change="computeUrl" prepend-icon="fa-map-marked" label="Location" v-model="selectedLocation" :items="filteredLocation" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedLocation()">
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Location code.Wildcards (? or *) are authorized.</span>
              </v-tooltip>
            </v-combobox>
            <v-combobox @change="computeUrl" prepend-icon="fa-wave-square" label="Channel" v-model="selectedChannel" :items="filteredChannel" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedChannel()">
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


        </v-row>


        <v-row>

      
 <v-col cols="12" lg="11">



<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>TEMPORAL SELECTION</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-switch v-model="checkstartdate" title="Enable temporal selection" class="mt-2"></v-switch>
    </v-toolbar>
           </v-col>


 <v-col cols="12" lg="11">


 <v-datetime-picker
                  v-model="selectedStartDate"
                  time-format="HH:mm:ss"
                  label="Start date"
                    :text-field-props="textFieldProps"
                  ref="selectedStartDate"
                  :disabled="!checkstartdate"
                  :clearable="true"
                ></v-datetime-picker>


   </v-col>

        </v-row>
        <v-row>

<v-col cols="12" lg="11">


 <v-datetime-picker
                  v-model="selectedEndDate"
                  time-format="HH:mm:ss"
                  :disabled="!checkstartdate"
                  label="End date"
                    :text-field-props="textFieldProps"
                  ref="selectedEndDate"
                ></v-datetime-picker>


   </v-col>
          
        </v-row>
        <v-row>

 <v-col cols="12" lg="11">
<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>OUTPUT OPTIONS</v-toolbar-title>
    </v-toolbar>
           </v-col>


          <v-col cols="12" lg="11">
            <v-select :items="itemLevels" v-model="selectedLevel" prepend-icon="fas fa-stream" label="Level">
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Select data based on miniSEED data quality indicator. D,R,Q,M,B. M and B (default) are treated the same and indicate best available. If M or B are selected, the output data records will be stamped with a M.</span>
              </v-tooltip>
            </v-select>
          </v-col>
          <v-col cols="12" lg="11">
            <v-select :items="itemFormat" v-model="selectedFormat" prepend-icon="fas fa-sign-out-alt" label="Format">
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Select data based on miniSEED data quality indicator. D,R,Q,M,B. M and B (default) are treated the same and indicate best available. If M or B are selected, the output data records will be stamped with a M.</span>
              </v-tooltip>
            </v-select>
          </v-col>

           <v-col cols="12" lg="11">
<v-toolbar dense flat color="#e36629" class="white--text" @click="fold = !fold">
      <v-toolbar-title>ADVANCED OPTIONS
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <v-btn icon>
        <v-icon color="white" v-if="fold" >mdi-chevron-down</v-icon>
        <v-icon color="white" v-else >mdi-chevron-up</v-icon>
      </v-btn>
    </v-toolbar>
           </v-col>

             <v-col cols="12" v-if="!fold">

                    <v-checkbox dense class=" pa-0 ma-0" label="Match timeseries " v-model="matchtimeseries"></v-checkbox>

                    <v-checkbox dense class=" pa-0 " label="Include restricted channels " v-model="includerestricted"></v-checkbox>
                  </v-col>


<v-col cols="12" lg="11" v-if="!fold">


 <v-datetime-picker
                  v-model="advancedCriteria.updatedafter"
                  time-format="HH:mm:ss"
                  label="Updated after"
                  :text-field-props="textFieldProps"
                  ref="updatedafter"  
                ></v-datetime-picker>


   </v-col>

   <v-col cols="12" lg="11" v-if="!fold">


 <v-datetime-picker
                  v-model="advancedCriteria.startbefore"
                  time-format="HH:mm:ss"
                  label="Start before"
                  ref="startbefore" 
                    :text-field-props="textFieldProps"
                ></v-datetime-picker>


   </v-col>

    <v-col cols="12" lg="11" v-if="!fold">


 <v-datetime-picker
                  v-model="advancedCriteria.startafter"
                  time-format="HH:mm:ss"
                  label="Start after"
                    :text-field-props="textFieldProps"
                  ref="startafter" 
                ></v-datetime-picker>
   </v-col>

     <v-col cols="12" lg="11" v-if="!fold">


 <v-datetime-picker
                  v-model="advancedCriteria.endbefore"
                  time-format="HH:mm:ss"
                  label="End before"
                    :text-field-props="textFieldProps"
                  ref="endbefore" 
                ></v-datetime-picker>
   </v-col>

     <v-col cols="12" lg="11" v-if="!fold">


 <v-datetime-picker
                  v-model="advancedCriteria.endafter"
                  time-format="HH:mm:ss"
                  label="End after"
                    :text-field-props="textFieldProps"
                  ref="endafter"
                ></v-datetime-picker>
   </v-col>

          
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-col cols="12" lg="11">
<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>GEOGRAPHICAL EXTENT</v-toolbar-title>
    </v-toolbar>
           </v-col>
        <v-card elevation="0">
          <v-row>
            <v-col v-if="circleMode" offset-lg="2" cols="6" lg="2">
              <v-text-field prepend-icon="far fa-compass" label="Center latitude" v-model=" circle.prop.center[1]"> </v-text-field>
            </v-col>
            <v-col v-if="circleMode" cols="6" lg="2">
              <v-text-field prepend-icon="far fa-compass" label="Center longitude" v-model=" circle.prop.center[0]"> </v-text-field>
            </v-col>
            <v-divider vertical></v-divider>
            <v-col v-if="circleMode" cols="6" lg="2">
              <v-text-field prepend-icon="fas fa-ruler" label="Radius" v-model="circle.prop.radius"> </v-text-field>
            </v-col>
            <v-col v-if="circleMode" cols="6" lg="2">
              <v-text-field prepend-icon="fas fa-ruler" label="Hole Radius" v-model="circle.prop.holeRadius"> </v-text-field>
            </v-col>
            <v-col v-if="!circleMode" offset-lg="5" cols="12" lg="2">
              <v-text-field prepend-icon="far fa-compass" label="North" v-model=" map.coordinate.north"> </v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center">
            <v-col cols="12" lg="2" jclass="justify-center">
              <v-text-field v-if="!circleMode" prepend-icon="far fa-compass" label="West" v-model=" map.coordinate.west">
              </v-text-field>
            </v-col>
            <v-col cols="12" lg="8" class="fill-height">
              <resif-station-url-map-builder :circleCoordinate="circle" :rectCoordinate="map" @selectionDrawEvent="getSelection" @selectionDrawCircleEvent="getCircleSelection"></resif-station-url-map-builder>
            </v-col>
            <v-col cols="12" lg="2">
              <v-text-field v-if="!circleMode" prepend-icon="far fa-compass" label="East" v-model=" map.coordinate.east">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col v-if="!circleMode" offset-lg="5" cols="12" lg="2">
              <v-text-field prepend-icon="far fa-compass" label="South" v-model="map.coordinate.south"></v-text-field>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="headline">Usage</v-card-title>

        <v-card-text>
          <resifSatationUrlBuilderUsage></resifSatationUrlBuilderUsage>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</v-app>
</template>

<script>
import resifStationUrlMapBuilder from "./resif-station-url-map-builder";
import resifSatationUrlBuilderUsage from "./resif-satationUrlBuilder-usage"
import urlBuilderMixin from "../../mixin/urlBuilderMixin"

export default {
  name: "resif-station-url-builder",
  components: {
    resifStationUrlMapBuilder,
    resifSatationUrlBuilderUsage
  },
  mixins: [urlBuilderMixin],
  destroyed: function() {
    clearInterval(this.automaticTester);
  },

  watch: {
    
    autotesting:function() {
        if (this.autotesting) {
          this.testSelection()
        }
    },

  },

  created() {
     this.automaticTester = setInterval(() => {
       if (this.autotesting) {
        this.testSelection();
      }
    }, 10000);

    var dateNow = new Date();
    dateNow.setUTCHours(0, 0, 0, 0);
    this.selectedStartDate = dateNow
    this.loadTree();
  },

  computed: {


    buildedUrl() {
      let url = this.wsService+`/fdsnws/station/1/query?
       ${
         this.selectedNetwork.length > 0
           ? `&network=${this.selectedNetwork}`
           : ``
       }
       ${
         this.selectedStation.length > 0
           ? `&station=${this.selectedStation}`
           : ``
       }
       ${
         this.selectedLocation.length > 0
           ? `&location=${this.selectedLocation}`
           : ``
       }
       ${
         this.selectedChannel.length > 0
           ? `&channel=${this.selectedChannel}`
           : ``
       }
       ${
         this.selectedStartDate != "" && this.checkstartdate
           ? `&starttime=${this.formatDate(this.selectedStartDate)}`
           : ``
       }
        ${
         this.matchtimeseries != ""
           ? `&matchtimeseries=${this.matchtimeseries}`
           : ``
       }${
         this.includerestricted != ""
           ? `&includerestricted=${this.includerestricted}`
           : ``
       }
       ${this.selectedEndDate != "" && this.checkstartdate ? `&endtime=${this.formatDate(this.selectedEndDate)}` : ``}
       ${
         this.selectedLevel != ""
           ? `&level=${this.selectedLevel}`
           : ``
       }
       ${
         this.selectedFormat != ""
           ? `&format=${this.selectedFormat}`
           : ``
       }
           ${
             this.advancedCriteria.updatedafter != ""
               ? `&updatedafter=${this.formatDate(this.advancedCriteria.updatedafter)}`
               : ``
           }
       ${
         this.advancedCriteria.startbefore != ""
           ? `&startbefore=${this.formatDate(this.advancedCriteria.startbefore)}`
           : ``
       }
       ${
         this.advancedCriteria.endbefore != ""
           ? `&endbefore=${this.formatDate(this.advancedCriteria.endbefore)}`
           : ``
       }
       ${
         this.advancedCriteria.startafter != ""
           ? `&startafter=${this.formatDate(this.advancedCriteria.startafter)}`
           : ``
       }
      ${
        this.advancedCriteria.endafter != ""
          ? `&endafter=${this.formatDate(this.advancedCriteria.endafter)}`
          : ``
      }
       
      ${
        this.map.coordinate.north != ""
          ? `&maxlat=${this.map.coordinate.north}`
          : ``
      }
      ${
        this.map.coordinate.south != ""
          ? `&minlat=${this.map.coordinate.south}`
          : ``
      }
      ${
        this.map.coordinate.west != ""
          ? `&minlon=${this.map.coordinate.west}`
          : ``
      }
      ${
        this.map.coordinate.east != ""
          ? `&maxlon=${this.map.coordinate.east}`
          : ``
      }
        ${
          this.circle.prop.center[0] != ""
            ? `&lon=${this.circle.prop.center[0]}`
            : ``
        }
         ${
           this.circle.prop.center[1] != ""
             ? `&lat=${this.circle.prop.center[1]}`
             : ``
         }
       ${
         this.circle.prop.radius != ""
           ? `&maxradius=${this.circle.prop.radius}`
           : ``
       }
       ${
         this.circle.prop.holeRadius != ""
           ? `&minradius=${this.circle.prop.holeRadius}`
           : ``
       }
       
       &nodata=404`;
      url = url.replace(/\s/g, "");
      return url.replace(/\?&/, "?");
    },

     testUrl() {
      let url = this.wsService+`/fdsnws/station/1/query?
       ${
         this.selectedNetwork.length > 0
           ? `&network=${this.selectedNetwork}`
           : ``
       }
       ${
         this.selectedStation.length > 0
           ? `&station=${this.selectedStation}`
           : ``
       }
       ${
         this.selectedLocation.length > 0
           ? `&location=${this.selectedLocation}`
           : ``
       }
       ${
         this.selectedChannel.length > 0
           ? `&channel=${this.selectedChannel}`
           : ``
       }
       ${
         this.selectedStartDate != "" && this.checkstartdate
           ? `&starttime=${this.formatDate(this.selectedStartDate)}`
           : ``
       }
        ${
         this.matchtimeseries != ""
           ? `&matchtimeseries=${this.matchtimeseries}`
           : ``
       }${
         this.includerestricted != ""
           ? `&includerestricted=${this.includerestricted}`
           : ``
       }
       ${this.selectedEndDate != "" && this.checkstartdate ? `&endtime=${this.formatDate(this.selectedEndDate)}` : ``}
       ${
             this.advancedCriteria.updatedafter != ""
               ? `&updatedafter=${this.formatDate(this.advancedCriteria.updatedafter)}`
               : ``
           }
       ${
         this.advancedCriteria.startbefore != ""
           ? `&startbefore=${this.formatDate(this.advancedCriteria.startbefore)}`
           : ``
       }
       ${
         this.advancedCriteria.endbefore != ""
           ? `&endbefore=${this.formatDate(this.advancedCriteria.endbefore)}`
           : ``
       }
       ${
         this.advancedCriteria.startafter != ""
           ? `&startafter=${this.formatDate(this.advancedCriteria.startafter)}`
           : ``
       }
      ${
        this.advancedCriteria.endafter != ""
          ? `&endafter=${this.formatDate(this.advancedCriteria.endafter)}`
          : ``
      }
       
      ${
        this.map.coordinate.north != ""
          ? `&maxlat=${this.map.coordinate.north}`
          : ``
      }
      ${
        this.map.coordinate.south != ""
          ? `&minlat=${this.map.coordinate.south}`
          : ``
      }
      ${
        this.map.coordinate.west != ""
          ? `&minlon=${this.map.coordinate.west}`
          : ``
      }
      ${
        this.map.coordinate.east != ""
          ? `&maxlon=${this.map.coordinate.east}`
          : ``
      }
        ${
          this.circle.prop.center[0] != ""
            ? `&lon=${this.circle.prop.center[0]}`
            : ``
        }
         ${
           this.circle.prop.center[1] != ""
             ? `&lat=${this.circle.prop.center[1]}`
             : ``
         }
       ${
         this.circle.prop.radius != ""
           ? `&maxradius=${this.circle.prop.radius}`
           : ``
       }
       ${
         this.circle.prop.holeRadius != ""
           ? `&minradius=${this.circle.prop.holeRadius}`
           : ``
       }
       
       &format=xml&level=station`;
      url = url.replace(/\s/g, "");
      return url.replace(/\?&/, "?");
    },
    
  },

  data: () => ({
    selectionDialog: false,
    autotesting: false,
    textFieldProps: {
        appendIcon: 'event'
      },
    currentSelectedStations:null,
    currentSelectedNetworks: null,
    fold: false,
    timeout: 2000,
    notifier: false,
    notifierMessage: "",
    notifierColor: "success",
    testing: false,
    checkstartdate: false,
    textProps: {
      "prepend-icon": "far fa-calendar-alt",
      clearable: true
    },
    timeProps: {
      "use-seconds": true
    },
    circleMode: false,
    dialog: false,
    itemNetworks: [],
    itemStations: [],
    itemLocations: [],
    itemChannels: [],
    includerestricted: true,
    matchtimeseries: false,
    select: [],
    selectedLevel: "station",
    selectedFormat: "xml",
    selectedStartDate: null,
    random:"0",
    selectedEndDate: "",

    advancedCriteria: {
      startbefore: "",
      startafter: "",
      endbefore: "",
      endafter: "",
      updatedafter: ""
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
        center: [0, 0],
        radius: 0,
        holeRadius: 0
      }
    },
    itemLevels: ["network", "station", "channel", "response"],

    itemFormat: ["xml", "text"],

    e1: 0
  }),
  methods: {

    
    testSelection() {
       this.testing = true;
       this.axios
        .get(
          this.testUrl.replace("nodata=404","")
        )
        .then((response) => {
         this.testing = false
         this.currentSelectedStations = (response.data.match(/<Station/g) || []).length;
         this.currentSelectedNetworks = (response.data.match(/<Network/g) || []).length;
         if (!this.autotesting) {
          this.selectionDialog = true
         }
        }).catch(() => {
            this.testing = false
            this.displayError("An error has occured testing this selection")
          });
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


     displaySuccess: function(message) {
      this.notifierMessage = message;
      this.notifierColor = "success";
      this.timeout = 2000;
      this.notifier = true;
    },

     displayError: function(message) {
  		this.notifierMessage = message
  		this.notifierColor = 'error'
  		this.timeout=8000
  		this.notifier = true
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
      this.selectedStartDate = "";
      this.resetPicker("selectedStartDate")
      this.selectedEndDate = "";
      this.resetPicker("selectedEndDate")
      this.matchtimeseries = false;
      this.includerestricted = false;
      
      this.map.coordinate.north = "";
      this.map.coordinate.south = "";
      this.map.coordinate.east = "";
      this.map.coordinate.west = "";
      this.circle.prop.center[0] = "";
      this.circle.prop.center[1] = "";
      this.circle.prop.radius = "";
      this.circle.prop.holeRadius = "";

      this.advancedCriteria.startbefore = "";
      this.resetPicker("startbefore")
      this.advancedCriteria.endbefore = "";
      this.resetPicker("endbefore")
      this.advancedCriteria.startafter = "";
      this.resetPicker("startafter")
      this.advancedCriteria.endafter = "";
      this.resetPicker("endafter")
      this.advancedCriteria.updatedafter = ""
      this.resetPicker("updatedafter")
      this.checkAuth = false;
      this.checkLongestonly = false;
      this.selectedLongestonly = false;
    }
  }
};
</script>

<style>
.hideField>input {}

.v-application a:hover {
    color: #1976d2 !important;
}

.v-banner__text {
  width: 100% !important;
  padding: 0;
  margin: 0;
}

.v-banner__wrapper {
  padding: 10px !important;
}

.disabled {
   color: rgba(0, 0, 0, 0.6); 
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
