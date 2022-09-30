<template>
<v-app>

  <resifStationSelector :visible="stationSelectionDialog" @select="stationSelection"  @cancel="cancelStationSelection" :network="selectedNetwork.length> 0 ? selectedNetwork[0]: ''" :locations="selectedLocationAsString"  :currentselection="selectedStation" :stations="completeFilteredStation" :channels="selectedChannelAsString"></resifStationSelector>

   <v-snackbar v-model="notifier" top :color="notifierColor" :timeout="timeout">
      {{ notifierMessage }}
      <v-btn dark text @click="notifier = false">Close</v-btn>
    </v-snackbar>

  <v-container fluid>
    <v-alert outlined :tile="false" color="transparent  " :sticky="true" class="pa-0 ma-0">
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
          <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular	" color="blue" @click="resetAllUrlParam()">Reset</v-btn>
          <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular ml-2" color="blue" @click.stop="dialog = true">Usage</v-btn>
          <v-btn v-else :elevation="0" class="white--text" rounded color="blue">
            <v-icon :small="true">fas fa-undo</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" lg="6" xl="6">
          <p class="text-sm-left pa-0 ma-0">The nodata parameter indicates that a 404 code is returned when no data is available. </p>
        </v-col>
      </v-row>
    </v-alert>
  </v-container>

   <v-container fluid>
     <v-row>
       <v-col col="12">
       <v-radio-group row v-model="requestType">
         <span class="mr-2 font-weight-medium">Type of request</span>
    <v-radio value="query" label="Query"></v-radio>
    <v-radio value="extent" label="Extent"></v-radio>
</v-radio-group>
</v-col>
     </v-row>
      <v-row>
<v-col cols="12" lg="4" md="6">

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
          

          <v-col cols="12"  v-if="this.filteredTree.length==0">
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

          <v-col cols="12" >

            <v-combobox prepend-icon="share" label="Network" v-model="selectedNetwork" :items="filteredNetwork" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedNetwork" >
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
          <v-col cols="12" >
            <v-combobox prepend-icon="fa-broadcast-tower" label="Station" v-model="selectedStation" :items="filteredStation" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedStation()" >
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Station code.Wildcards (? or *) are authorized.Example: CH?F, A*</span>
              </v-tooltip>

                <section slot="append-outer" >
                <v-tooltip top>
                <template v-slot:activator="{ on }">
             <v-btn  v-on="on" icon @click.prevent="openStationSelectionDialog">
                    <v-icon color="primary" :disabled="selectedNetwork.length != 1 || filteredStation.length==0">fa-map-marked</i></v-icon>
                  </v-btn>
               
                </template>
                <span>You can select your stations on a map if you have selected only one network and if your current selection is consistent</span>
              </v-tooltip>
              </section>


            </v-combobox>
          </v-col>
          <v-col cols="12" >
            <v-combobox prepend-icon="fa-map-marked" label="Location" v-model="selectedLocation" :items="filteredLocation" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedLocation()">
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Location code.Wildcards (? or *) are authorized.</span>
              </v-tooltip>
            </v-combobox>
            <v-combobox prepend-icon="fa-wave-square" label="Channel" v-model="selectedChannel" :items="filteredChannel" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedChannel()" >
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
       </v-col>

<v-col cols="12" lg="4" md="6">
<v-col cols="12" class="pa-0">
<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>TEMPORAL SELECTION</v-toolbar-title>
       <v-spacer></v-spacer>
      <v-switch v-model="checkstartdate" title="Enable temporal selection" class="mt-2"></v-switch>
</v-toolbar>
 
<v-col cols="12" >

<v-datetime-picker
                  v-model="selectedStartDate"
                  time-format="HH:mm:ss"
                  label="Start date"
                    :text-field-props="textFieldProps"
                    :disabled="!checkstartdate"
                  ref="starttime"
                  :clearable="true"
                  
                ></v-datetime-picker>
  <v-datetime-picker 
                  v-model="selectedEndDate"
                  time-format="HH:mm:ss"
                  :disabled="!checkstartdate"
                  label="End date"
                    :text-field-props="textFieldProps"
                  ref="endtime"
                  :clearable="true"
                ></v-datetime-picker>
   

   </v-col>


<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>MERGE OPTION</v-toolbar-title>
</v-toolbar>
<v-col cols="12">
            <v-checkbox class="mb-0" label="Samplerate" v-model="selectedCheckbox" value="samplerate">
              <template v-slot:label>
               Samplerate 
               
               <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Time spans from data with differing sample rates will be grouped together. If specified this field will be omitted from the result.</span>
              </v-tooltip>
               
              </template>
            </v-checkbox>


<v-checkbox class="mb-0" label="Quality" v-model="selectedCheckbox" value="quality">
              <template v-slot:label>
               Quality 
               
               <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Time spans from data with differing quality codes will be grouped together. If specified this field will be omitted from the result.</span>
              </v-tooltip>
               
              </template>
            </v-checkbox>

            <v-checkbox class="mb-0" label="Overlap" v-model="selectedCheckbox" value="overlap">
              <template v-slot:label>
               Overlap 
               
               <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Time spans from data that overlap will be merged together. This option does not apply to the extent method.</span>
              </v-tooltip>
               
              </template>
            </v-checkbox>

</v-col>

</v-col>


    </v-col>




<v-col cols="12" lg="4" md="6">

<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>OTHER OPTIONS</v-toolbar-title>
    </v-toolbar>

  <v-col cols="12">

  <v-select :items="itemQuality" v-model="selectedQuality" prepend-icon="fas fa-certificate" label="Quality" autocomplete chips tags select multiple clearable deletable-chips>
          <v-tooltip slot="append" top>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon color="grey lighten-1">help_outline</i></v-icon>
              </v-btn>
            </template>
            <span>Select data based on miniSEED data quality indicator. D,R,Q,M,B. M and B (default) are treated the same and indicate best available. If M or B are selected, the output data records will be stamped with a M.</span>
          </v-tooltip>
        </v-select>

  <v-select :items="itemFormat" v-model="selectedFormat" prepend-icon="fas fa-sign-out-alt" label="Format">
            </v-select>
  <v-select :items="itemNOrderBy" v-model="selectedRadios" prepend-icon="fas fa-sort-amount-down" label="Order by">
            </v-select>


  <v-select :items="itemNoData" v-model="selectedNoData" prepend-icon="far fa-circle" label="No data">
            </v-select>
  <v-text-field label="Limit" v-model="selectedLimit" prepend-icon="fas fa-hand-paper"> </v-text-field>
  <v-text-field v-if="isQuery" label="Merge gaps" v-model="selectedMergeGap" prepend-icon="fas fa-link">
     
<template v-slot:append>

               <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>If set, merge time spans that are separated by the specified tolerance in seconds.</span>
              </v-tooltip>
               
              </template>   
     
  </v-text-field>
  <v-checkbox v-model="selectedRestrictedData" label="Include restricted data"></v-checkbox>
  <v-checkbox v-if="isQuery" v-model="selectedLatestUpdate" label="Show" value="latestupdate"></v-checkbox>
</v-col>
</v-col>
  </v-row>

</v-container>
<v-container>
    <v-dialog v-model="dialog" width="700px">
      <v-card>
        <v-card-title class="headline">Usage</v-card-title>
        <v-card-text>
          <resifAvaiabilityUsage></resifAvaiabilityUsage>
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
import resifAvaiabilityUsage from './resif-avaiability-usage'
import resifStationSelector from "../resif-station-selector"
import urlBuilderMixin from "../../mixin/urlBuilderMixin"

export default {
  components: {
    resifAvaiabilityUsage, resifStationSelector
  },
  mixins: [urlBuilderMixin],
  name: "resif-availability-url-builder",

   created() {
    var dateNow = new Date();
    dateNow.setUTCHours(0, 0, 0, 0);
    this.selectedStartDate = dateNow

    this.loadTree();
  },


   computed: {

     isQuery() {
       return this.requestType=="query"
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

    buildedUrl() {
      let url = this.wsService+`/fdsnws/availability/1/${this.requestType}?
       
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
         this.selectedEndDate != ""
           ? `&endtime=${this.formatDate(this.selectedEndDate)}`
           : ``
       } 
       ${this.selectedQuality != "" ? `&quality=${this.selectedQuality}` : ``}
       ${
         this.selectedLevel != ""
           ? `&level=${this.itemLevelsVal[this.selectedLevel]}`
           : ``
       }
       ${
         this.selectedFormat != ""
           ? `&format=${this.selectedFormat}`
           : ``
       }
       ${this.selectedCheckbox != "" ? `&merge=${this.selectedCheckbox}` : ``}
          ${this.selectedRadios != "" ? `&orderby=${this.selectedRadios}` : ``}
       ${
         this.selectedRestrictedData != ""
           ? `&includerestricted=true`
           : `&includerestricted=false`
       }
        ${(this.isQuery && this.selectedLatestUpdate != "") ? `&show=latestupdate` : ``}
        ${this.selectedLimit != "" ? `&limit=${this.selectedLimit}` : ``}

        ${
          (this.isQuery && this.selectedMergeGap != "")
            ? `&mergegaps=${this.selectedMergeGap}`
            : ``
        }
        ${
         this.selectedNoData != ""
           ? `&nodata=${this.selectedNoData}`
           : ``
       }
       `;
      url = url.replace(/\s/g, "");
      return url.replace(/\?&/, "?");
    }
    
  },

  data: () => ({
    date: "lol",
    requestType:"query",
    itemQuality: ["D", "R", "Q", "M"],
    config: {
      wrap: true, // set wrap to true only when using 'input-group'
      dateFormat: 'Z',
      altInput: true,
      altFormat: 'Z',
      enableTime: true,
      enableSeconds: true,
      allowInput: true,
      clickOpens: false
    },
    checkstartdate: false,
   textFieldProps: {
        appendIcon: 'event'
      },
    
    dateNow: "",
    networks: [],
    dialog: false,
    itemNOrderBy: ["nslc_time_quality_samplerate","latestupdate","latestupdate_desc", "timespancount", "timespancount_desc"],
    selectedCheckbox: [],
    selectedRadios: "nslc_time_quality_samplerate",
    selectedRestrictedData: true,
    selectedLatestUpdate: "",
    select: [],
    selectedQuality: [],
    timeout: 2000,
    notifier: false,
    notifierMessage: "",
    notifierColor: "success",
    selectedLevel: "",
    selectedFormat: "text",
    selectedNoData: "204",
    selectedStartDate: "",
    selectedEndDate: "",
    selectedLimit: "",
    selectedMergeGap: "",
    itemLevels: ["Network", "Station", "Channel", "Response"],
    itemLevelsVal: {
      Network: "network",
      Station: "station",
      Channel: "channel",
      Response: "response"
    },
    itemFormat: ["text", "geocsv", "json"],
    itemNoData: ["204", "404"],
    itemFormatVal: {
      Text: "text",
      GeoCsv: "geocsv",
      Json: "json"
    }
  }),
  methods: {
    upperCase() {
      this.select = this.select.map(function (x) {
        return x.toUpperCase();
      });
    },

     displaySuccess: function(message) {
      this.notifierMessage = message;
      this.notifierColor = "success";
      this.timeout = 2000;
      this.notifier = true;
    },
   
    resetAllUrlParam() {
      this.requestType="query"
      this.selectedNetwork = [];
      this.selectedFormat = "text";
      this.select = [];
      this.selectedStation = [];
      this.selectedLocation = [];
      this.selectedChannel = [];
      this.selectedQuality = "";
      this.selectedLimit = "";
      this.selectedMergeGap = "";
      this.selectedEndDate = "";
      this.selectedStartDate = "";
      this.selectedLatestUpdate = "";
      this.selectedCheckbox = [];
      this.selectedRadios = "nslc_time_quality_samplerate";
      this.selectedEndDate = "";
      this.selectedNoData="204",
      this.selectedQuality=[],
      this.selectedRestrictedData= true,
      this.resetPicker("starttime")
      this.resetPicker("endtime")
      var dateNow = new Date();
    dateNow.setUTCHours(0, 0, 0, 0);
    this.selectedStartDate = dateNow
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
