<template>
<v-app>
  <div class="" id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-main class="pt-0">
          <v-container fluid>
            <v-app>
   

<v-navigation-drawer style="    z-index: 0 !important" class="ml-4 " app>
    <v-sheet style="margin-top:80px">
      <v-list>
        <v-list-item-group v-model="index">
          <v-list-item active-class="active" @click="activeStat='data-download'" :class="activeStat=='data-download' ? 'active' : ''">
            Data download
          </v-list-item>
          <v-list-item @click="activeStations" active-class="active">
            Top ten stations
          </v-list-item>
          <v-list-item @click="activeNetworks" active-class="active">
            Top ten networks
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>

  </v-navigation-drawer> 


<v-container v-if="activeStat == 'topTenNetworks'">
  <p class="text-center">
  <span class="text-h5">Top 10 Networks</span><br><span class="text-caption">according to distributed volume</span> 
  </p>
  <v-radio-group
      v-model="networkMedia"
      row
    >
      <v-radio
        label="Dataselect"
        value="dataselect"
      ></v-radio>
      <v-radio
        label="Seedlink"
        value="seedlink"
      ></v-radio>
    </v-radio-group>

  <resif-stat-topten type="network" :format="networkMedia" period="3m" label="Last 3 months" :random="randomNetwork" />
  <resif-stat-topten type="network" :format="networkMedia" period="12m" label="Last 12 months" :random="randomNetwork"/>
  <resif-stat-topten type="network" :format="networkMedia" period="all" label="Global volume" :random="randomNetwork"/>

  <v-alert
      border="left"
      color="grey lighten-3"

      dark
    >
<div class="text-caption grey--text text--darken-3">
Top ten networks : {{networkMedia | capitalize}}<br>
These figures shows the stations/networks with the most downloaded data. These may be biased towards the channels with the most dense data, i.e. with higher sampling rates.
</div>

   </v-alert>


</v-container>
  <v-container v-if="activeStat == 'topTenStations'">
 <p class="text-center">
  <span class="text-h5">Top 10 Stations</span><br><span class="text-caption">according to distributed volume</span> 
  </p>

 <v-radio-group
      v-model="stationMedia"
      row
    >
      <v-radio
        label="Dataselect"
        value="dataselect"
      ></v-radio>
      <v-radio
        label="Seedlink"
        value="seedlink"
      ></v-radio>
    </v-radio-group>

  <resif-stat-topten type="station" :format="stationMedia" period="3m" label="Last 3 months" :random="randomStation"/>
  <resif-stat-topten type="station" :format="stationMedia" period="12m" label="Last 12 months" :random="randomStation"/>
  <resif-stat-topten type="station" :format="stationMedia" period="all" label="Global volume" :random="randomStation"/>

   <v-alert
      border="left"
      color="grey lighten-3"

      dark
    >
<div class="text-caption grey--text text--darken-3">
Top ten stations : {{stationMedia | capitalize}}<br>
These figures shows the stations/networks with the most downloaded data. These may be biased towards the channels with the most dense data, i.e. with higher sampling rates.
</div>

   </v-alert>

</v-container>

  <v-container v-if="activeStat == 'data-download'">

    <v-row>
      <v-col >
          <div>
          <v-tabs slider-color="transparent" grow v-model="tabL">
            <v-tab href="#tab-All">
              <span>All data</span>
            </v-tab>
            <v-tab href="#tab-permanent">
              <v-icon class="mr-2">all_inclusive</v-icon>
              <span>Permanent networks</span>
            </v-tab>

            <v-tab href="#tab-temporary">
              <v-icon class="mr-2">hourglass_empty</v-icon>
              <span>Temporary networks</span>
            </v-tab>

          </v-tabs>
</div>
        <v-tabs-items v-model="tabL">
          <v-tab-item :key="111" value="tab-All">
            <resif-stat-timeserie :url="allUrl"></resif-stat-timeserie>
        </v-tab-item>
          <v-tab-item :key="11" value="tab-permanent">
              <v-combobox :focus="true" v-model="permanentNetwork" :items="permanentNetworks" label="Select a permanent network" ></v-combobox>
              <span v-if="permanentNetwork">
               <resif-stat-timeserie :url="permanentUrl"></resif-stat-timeserie>
               </span>
               <span v-else>
                 You must select a network.
               </span>
          </v-tab-item>
          <v-tab-item :key="1" value="tab-temporary">
             <v-combobox :focus="true" v-model="temporaryNetwork" :items="temporaryNetworks" label="Select a temporary network" ></v-combobox>
              <span v-if="temporaryNetwork">
               <resif-stat-timeserie :url="temporaryUrl"></resif-stat-timeserie>
               </span>
               <span v-else>
                 You must select a network.
               </span>
          </v-tab-item>
        </v-tabs-items>



      </v-col>
    </v-row>

  </v-container>
            </v-app>



          </v-container>
        </v-main>
      </v-app>
    </v-app>
  </div>

</v-app>
</template>

<script>
import resifStatTimeserie from "./resif-stat-timeserie"
import resifStatTopten from "./resif-stat-topten"
export default {
  name: "resif-stats",
components:{
 resifStatTimeserie, resifStatTopten
},
 

data: () => ({
    activeStat: "data-download",
    stationMedia: "dataselect",
    networkMedia:  "dataselect",
    permanentNetworks: [],
    permanentNetwork: null,
    temporaryNetworks: [],
    temporaryNetwork: null,
    index: null,
    tabL: null,
    randomStation:"",
    randomNetwork:"",
    allUrl:"https://ws.resif.fr/resifws/statistics/1/query?request=timeseries&format=json"
    
  }),
  
  computed: {

    permanentUrl() {
      if (!this.permanentNetwork) {
        return "";
      } else {
        return this.allUrl+'&network='+this.permanentNetwork.name;
      }
    },
    temporaryUrl() {
      if (!this.temporaryNetwork) {
        return "";
      } else {
        return this.allUrl+'&network='+this.temporaryNetwork.value;
      }
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

      networkListService() {
      return this.service+"/network/v1_0/list"
    },

    
  },
  mounted() {
    this.loadNetworks();
    
  },

  filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
},


  methods: {

    activeStations: function(){
      this.activeStat='topTenStations';
      this.randomStation= Math.random().toString(36).substring(7)
    },

     activeNetworks: function(){
      this.activeStat='topTenNetworks';
      this.randomNetwork= Math.random().toString(36).substring(7)
    },

    loadNetworks() {

this.axios.get(this.networkListService).then(response => {


response.data.permanentNetworks.map(pNetwork => {
        this.permanentNetworks.push({
          name: pNetwork.identifier,
          identifier: pNetwork.shortIdentifier,
          number: pNetwork.totalNumberStations,
          description: pNetwork.description,
          restricted: pNetwork.restricted,
          startEnd: pNetwork.endDate.substring(0, 4) !== "2500" ? `${pNetwork.startDate.substring(0, 4)}-${pNetwork.endDate.substring(0, 4)}` : `${pNetwork.startDate.substring(0, 4)}-null`,
          startTime: pNetwork.startDate,
          endTime: pNetwork.endDate,
          text: pNetwork.identifier+" - "+pNetwork.description,
          value: pNetwork.identifier
        });

        this.permanentNetwork = this.permanentNetworks[0]
    })

response.data.temporaryNetworks.map(pNetwork => {

        this.temporaryNetworks.push({
          name: pNetwork.code,
          identifier: pNetwork.shortIdentifier,
          number: pNetwork.totalNumberStations,
          description: pNetwork.description,
          restricted: pNetwork.restricted,
          startEnd: pNetwork.endDate.substring(0, 4) !== "2500" ? `${pNetwork.startDate.substring(0, 4)}-${pNetwork.endDate.substring(0, 4)}` : `${pNetwork.startDate.substring(0, 4)}-null`,
          startTime: pNetwork.startDate,
          endTime: pNetwork.endDate,
          text: pNetwork.code+" - "+pNetwork.description,
          value: pNetwork.shortIdentifier.replace(/_/g, '')
        });

        this.temporaryNetwork = this.temporaryNetworks[0]
    })

})


    }

  },

};
</script>

<style>

.v-application div[role="tablist"] a[role="tab"] {
  text-decoration: none;
}

</style>
