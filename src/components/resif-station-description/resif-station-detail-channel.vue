<template>
<v-app>
   <v-dialog v-model="spectroOrPdfDialog" width="1000px">
      <v-card>
        <v-card-title class="headline">{{spectroOrPdfTitle}}</v-card-title>

        <v-card-text class="pa-5">
          <div justify="center" v-if="spectroOrPdfError == false">
            <div  width="100%" v-show="spectroOrPdfLoading"> 
              <v-progress-linear :indeterminate="true"></v-progress-linear><br>
              Generating ...
            </div>
            <div >
 <img 
      :src="spectroOrPdfUrl" 
      height="600"
      width="900"
      @error="spectroOrPdfErrored"
      @load="spectroOrPdfLoaded"
    >
     
    </img>
            </div>
   
  </div>
  <div v-else>
    <v-alert
      dense
      border="left"
      type="warning"
    >
    <p>An error has occured while generating the image. Maybe the selected period doesn't match the channel activity</p>
    <p>
    The used URL is: {{spectroOrPdfUrl}}
    </p>
    </v-alert>
  </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="spectroOrPdfDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  <v-navigation-drawer class="ml-4" app>
    <v-sheet style="margin-top:80px">
      <v-list v-if="displaySensor">
        <v-list-item-group v-model="indexlist">
          <v-list-item active-class="active" @click="$vuetify.goTo('#Sensor', {duration: 300, offset: 90, easing: 'easeInOutCubic' })">
            Sensor
          </v-list-item>
          <v-list-item v-if="displayChannel" @click="$vuetify.goTo('#description', option)" active-class="active">
            Channel description
          </v-list-item>
          <v-list-item v-if="displayResponse" @click="$vuetify.goTo('#response', option)" active-class="active">
            Response
          </v-list-item>
          <v-list-item v-if="displaySpectro" @click="$vuetify.goTo('#spectrogram', option)" active-class="active">
            Spectrograms
          </v-list-item>
          <v-list-item v-if="displayPdf" @click="$vuetify.goTo('#pdf', option)" active-class="active">
            Pdf
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-sheet>
  </v-navigation-drawer>
  <v-container fluid>
    <v-row>
      <v-col cols=3>
        <v-card elevation="0" outlined tile flat>
          <v-card-title style="background-color:#898D00;" class="subtitle pl-2 pa-1 white--text">
            Sensor list 
          </v-card-title>
          <v-text-field :disabled="true" :open="open" prepend-icon="search" name="name" label="Search" v-model="searchSensor" single-line></v-text-field>
          <v-treeview :search="searchSensor" class="channel-treeview" dense activatable @update:active="test" :items="items" :open.sync="openSensors"  transition 
          :active.sync="activeSensors"
          >

            <template slot="label" slot-scope="{item,leaf,selected,indeterminate,active,open}">
              <v-sheet tag="p" class="pa-1 clickable" :class="getChannelClass(item.channelInfo.endDate)" v-if="leaf" @click="sensorfct(active,item)">{{item.code}}
                <span style="cursor : pointer">( {{item.channelInfo.startDate.substring(10,0)}}
                  <v-icon small>mdi-arrow-right</v-icon>
                  <span style="cursor : pointer"  v-if="item.channelInfo.endDate.substring(4,0) !== '2500' "> {{item.channelInfo.endDate.substring(10,0)}}</span>
                  <v-icon medium  v-else>mdi-infinity</v-icon> )
                </span>
              </v-sheet>
              <p style="cursor : pointer" class="pt-3 mb-2" v-else @click="sensorfct(active,item)">{{item.name}}
                <v-badge color="#898D00" offset-x="-2px" :content="item.children.length"></v-badge>
              </p>
            </template>
          </v-treeview>
        </v-card>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col>
        <v-row>
          <v-col class="pt-0">

            <v-card id="Sensor" max-width="2500" v-if="displaySensor" outlined tile flat>
              <v-card-title style="background-color:#898D00;" class="subtitle pl-2 pa-1 white--text">
                Sensor information

              </v-card-title>

              <v-list dense>
                <template v-for="(description,key,index) in sensor">
                  <v-list-item v-if="description !==''" :key='description+index'>

                    <span>
                      <v-icon color="rgb(254, 211, 129)">
                        <!-- {{iconselector(key)}} -->
                      </v-icon> <span class="subtitle-2"> {{decamelize(key, " ")}}</span> : {{description}}
                    </span>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card id="description" v-if="displayChannel" outlined tile flat>
              <v-card-title style="background-color:#898D00;" class="subtitle pl-2 pa-1 white--text">
                Channel description
              </v-card-title>
              <v-list dense>
                <template v-for="(description,key,index) in channel">

                  <v-list-item v-if ="key == 'startDate'" class="subtitle pa-1" :key='description+index'>
                      <span class="subtitle-2"> {{decamelize(key, " ")}}</span> : {{description | formatChannelDate}}
                  </v-list-item>


                 <v-list-item v-else-if ="key == 'endDate' && description.substring(0,4) != '2500'" class="subtitle pa-1" :key='description+index'>
                      <span class="subtitle-2"> {{decamelize(key, " ")}}</span> : {{description | formatChannelDate}}
                  </v-list-item>

                  <v-list-item v-else-if="key != 'endDate' && description !=='' " class="subtitle pa-1" :key='description+index'>
                      <span class="subtitle-2"> {{decamelize(key, " ")}}</span> : {{description}}
                  </v-list-item>
                </template>
              </v-list>

            </v-card>
          </v-col>
        </v-row>

<v-row>
          <v-col>  

            <v-card id="pdf" v-if="displayPdf" outlined tile flat>
              <v-card-title style="background-color:#898D00;" class="subtitle pa-1 white--text">
                Data Availability&nbsp;<v-icon :title="dataAvailabilityTooltip" color="white">mdi-information</v-icon>
              </v-card-title>
              <v-row >
            <v-col cols="6" offset="5" >Qualities: <span class="font-weight-medium mx-2">Q</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#1B5E20"></div> <span class="font-weight-medium mx-2">M</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#388E3C"></div>     <span class="font-weight-medium mx-2">D</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#FF6F00"></div>   <span class="font-weight-medium mx-2">R</span> <div style=" display: inline-block; width: 15px; height: 15px;background:#B71C1C"></div> </v-col>
          </v-row>
              <v-row>
                 <v-col offset="3">

                        </v-col>
                        <v-col cols="3">

                          <v-select :items="yearArray" v-model="yearValue" label="Select year"></v-select>

                        </v-col>
                        <v-col offset="3"></v-col>


              </v-row>

               <v-card-text style="margin: 0 auto; width: 95%;padding-left: 5px" class="visavail" id="visavail_channel_container">

                        <v-alert outlined v-if="nodataA" class="text-center" type="warning" icon=false :value="true">
                          No data available
                        </v-alert>
                        <p id="visavail_channel_graph">
                         
                        </p>
                      </v-card-text>
              <!--     <v-gallery :images="pdfimglist" :caption="true"></v-gallery> -->
            </v-card>

          </v-col>
        </v-row>

        <v-row>

          <v-col>

            <v-card id="response" v-if="displayResponse" outlined tile flat>
              <v-card-title style="background-color:#898D00;" class="subtitle pl-2 pa-1 white--text">
                Response
              </v-card-title>
              <v-row>
                <v-col>
                  <v-list dense>
                    <template v-for="(description,key,index) in response.response[0]">
                      <v-list-item v-if="description !==''" class="subtitle pa-1" :key='description+index'>
                        <span>
                          <v-icon color="rgb(254, 211, 129)">
                            <!-- {{iconselector(key)}} -->
                          </v-icon> <span class="subtitle-2"> {{decamelize(key, " ")}}</span> : {{description}}
                        </span>
                      </v-list-item>
                    </template>
                    <v-list-item class=" pa-2">
                      <span class="subtitle-2">ASCII file of poles and zeros compatible SAC :&nbsp </span>
                      <v-btn class="mr-2 white--text elevation-0" tile @click="download('sacp',response.channelIdentifier)" small color="#006F7F">Download</v-btn>
                    </v-list-item>
                    <v-list-item class=" pa-2">
                      <span class="subtitle-2"> ASCII file of poles and zeros : &nbsp </span>
                      <v-btn class="mr-2 white--text elevation-0" tile @click="download( 'resp',response.channelIdentifier)" small color="#006F7F">Download</v-btn>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col>
                  <v-card elevation="0">
                    <v-card-title class="title"><span v-if="!isloaded" style="width: 100%;">Loading plot ... <br> <v-progress-linear  :height="2" indeterminate></v-progress-linear>
                    </span><span v-else>Plot</span>
                    </v-card-title>
                    <img v-show="false" :src="gallery[0].src" @load="loaded" @error="noplot"/>
                    <div v-if="isloaded && plotAvailable">
                    <silent-box @load="loaded" :gallery="gallery"> </silent-box>
                    </div>
                    <v-card-text v-if="isloaded && !plotAvailable"> 
                      No plot available
                    </v-card-text>

                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
           <v-row>
          <v-col>
        
            <v-card id="spectrogram"   v-if="displaySpectro" outlined tile flat>
              <v-card-title style="background-color:#898D00;" class="subtitle pa-1 white--text">
                SPECTROGRAMS
              </v-card-title>
              <v-row align="center"
      justify="center">
                <v-col cols="12" sm="6" >
                  <v-select v-model="spectrogramPeriod" :items="spectrogramPeriods" label="Select a period" item-text="label" item-value="value"></v-select>
                </v-col>
                <v-col cols="12" sm="5">
                <v-btn class="mr-2 white--text elevation-0" tile  small color="#006F7F" @click="spectroImageDisplay()">Generate</v-btn> 
                </v-col> 
              </v-row>
              <v-row>

              </v-row>
              <!--    <v-gallery :images="spectroimglist" :caption="true"></v-gallery> -->
            </v-card>

          </v-col>
          </v-row>


          <v-row>
          <v-col>
        
            <v-card id="spectrogram"   v-if="displayPdf" outlined tile flat>
              <v-card-title style="background-color:#898D00;" class="subtitle pa-1 white--text">
                PDF
              </v-card-title>
              <v-row align="center"
      justify="center">
                <v-col cols="12" sm="6" >
                  <v-select v-model="pdfPeriod" :items="pdfPeriods" label="Select a period" item-text="label" item-value="value"></v-select>
                </v-col>
                <v-col cols="12" sm="5">
                <v-btn class="mr-2 white--text elevation-0" tile  small color="#006F7F" @click="pdfImageDisplay()">Generate</v-btn> 
                </v-col> 
              </v-row>
              <v-row>

              </v-row>
              <!--    <v-gallery :images="spectroimglist" :caption="true"></v-gallery> -->
            </v-card>

          </v-col>
          </v-row>
          
      </v-col>
    </v-row>

  </v-container>
  <div id="modal01" class="w3-modal" onclick="this.style.display='none'">

    <div class="w3-modal-content w3-animate-zoom">
      <img @error="$event.target.src='https://via.placeholder.com/1000x150.png/000000/FFFFFF?text=Data+no+available'" id="img01" src='#'>
    </div>
  </div>
</v-app>
</template>

<script>

import * as visavail from "visavail";
import moment from "moment";
import "visavail/visavail.css";
import "visavail/visavail.js";
import * as d3 from "d3";

export default {
  name: "resif-station-detail-channel",

  props: {
    sensorInformation: {
      type: Array,
      default: null
    },
    networkCode: {
      type: String,
      default: ""
    },
    stationCode: {
      type: String,
      default: ""
    },
    channelCode: {
      type: String,
      default: ""
    },
    locationCode: {
      type: String,
      default: ""
    },
    channelStartDate: {
      type: String,
      default: ""
    }

  },
  created() {
    this.displayRouteChannel();
  },
  watch: {

    channelCode() {
      this.displayRouteChannel()
    },

    locationCode() {
      this.displayRouteChannel()
    },

    channelStartDate() {
      this.displayRouteChannel()
    },

    yearValue() {
      d3.select("#visavail_channel_graph").html(null);
      this.dataAvailability()
    },
    sensorInformation(val) {
      
      val.map((sensor, index) => {
        let item = {
          id: index,
          isSensor: true,
          name: sensor.key ? sensor.key : "sensor name undefine",
          sensorInfo: {
            identifier: sensor.identifier,
            model: sensor.model,
            type: sensor.type,
            name: sensor.key,
            serialNumber: sensor.serialNumber,
            description: sensor.description,
            installationDate: sensor.installationDate,
            calibrationDate: sensor.calibrationDate,
            manufacturer: sensor.manufacturer
          },

          children: []
        };
        
        sensor.channels.map(channel => {
          let obj = {
            id: this.cpt++,
            isSensor: false,
            code: channel.locationCode ?
              channel.code + "." + channel.locationCode : channel.code,
            channelInfo: {
              code: channel.code,
              type: channel.type,
              locationCode: channel.locationCode,
              restrictedStatus: channel.restrictedStatus,
              elevation: channel.elevation,
              startDate: channel.startDate,
              endDate: channel.endDate,
              azimuth: channel.azimuth,
              depth: channel.depth,
              latitude: channel.latitude,
              longitude: channel.longitude,
              storageFormat: channel.storageFormat,
              clockDrift: channel.clockDrift,
              dip: channel.dip,
              sampleRate: channel.sampleRate
            },

            response: {
              channelIdentifier: {
                code: channel.code,

                locationCode: channel.locationCode,
                elevation: channel.elevation,
                startDate: channel.startDate,
                endDate: channel.endDate
              },
              response: channel.response
            },
            comment: channel.comment
          };
          item.children.push(obj);
          item.children.sort((a, b) => {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return (
              new Date(b.channelInfo.endDate) - new Date(a.channelInfo.endDate)
            );
          });
        });
        this.items.push(item);
      });
      this.displayRouteChannel();
      
     
    }
  },
  computed: {

    spectroOrPdfUrl() {
      if (!this.channel) {
        return "";
      }

      let mode="";

      if(this.spectroOrPdf=="spectro") {
        mode= "spectrogram=true&";
      }

      if(this.spectroOrPdf=="pdf") {
        mode=""
      }


      let aux = this.wsService+"/resifws/ppsd/1/query?"+mode+"height=600&width=900&net="+this.networkCode+"&sta="+this.stationCode+"&cha="+this.channel.code+"&loc="+this.channel.locationCode+this.spectroOrPdfPeriod

      return aux
    },

    spectroOrPdfPeriod() {
      if (!this.channel) {
        return ""
      }
      let start ="";
      let end="";
      let period=""
      if(this.spectroOrPdf=="spectro") {
        period= this.spectrogramPeriod;
      }

      if(this.spectroOrPdf=="pdf") {
        period= this.pdfPeriod;
      }

      if (period == 'ALL') {
        start = this.channel.startDate.split("T")[0];
        if (this.channel.endDate.indexOf("2500")>=0) {
          end = this.formatDate(new Date());
        } else {
          end = this.channel.endDate.split("T")[0];
        }
      }

       if (period == 'YEAR') {
        let year = new Date().getFullYear(); 
        start = year+"-01-01";
        end = year+"-12-31";
      }

      if (period == 'LYEAR') {
        let year = new Date().getFullYear(); 
        start = (year-1)+"-01-01";
        end = (year-1)+"-12-31";
      }

       if (period == 'MONTH') {
        let firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); 
        let lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0);
        start = this.formatDate(firstDayOfMonth);
        end = this.formatDate(lastDayOfMonth);
      }

       if (period == 'LMONTH') {
        let firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth()-1, 1); 
        let lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        start = this.formatDate(firstDayOfMonth);
        end = this.formatDate(lastDayOfMonth);
      }

      

      return "&start="+start+"&end="+end;

    },

    dataAvailabilityTooltip() {
      return "At the network level, the figure represents for each year and each"+
" station the continuity of the data of the vertical component of the velocimetric sensor. When several channels are available,  the channel"+
" corresponding to the widest frequency range at the highest sampling frequency is shown. All available data segments are displayed according to their quality (R,D,M,Q)."
+"\n\n"
+"At the station level, the data continuity is represented by year for all channels and all data qualities (R,D,M,Q).\n\n"
+"At channel level the data continuity is represented per year for all data qualities (R,D,M,Q)."
    },

    selected() {
      
      if (!this.active.length) return undefined;

      const id = this.active[0];

      return this.users.find(user => user.id === id);
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

     pdfAndSpectroService() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getPdfAndSpectroServiceUrl;
      }
      return null
    },
  },

 filters: {
        formatChannelDate(value) {
            return value.replace("T", " ");
        }
    },

  data() {
    return {
      spectroOrPdfDialog: false,
      spectroOrPdfTitle: "",
      spectroOrPdf: "",
      spectroOrPdfError: false,
      spectroOrPdfLoading: false,
      spectrogramPeriods: [{ value: 'ALL', label: "All" }, { value: 'YEAR', label: "Current year " }, { value: 'LYEAR', label: "Last year" }, { value: 'MONTH', label: " Current month" }, { value: 'LMONTH', label: 'Last month' }],
      spectrogramPeriod: 'ALL',
      pdfPeriods: [{ value: 'ALL', label: "All" }, { value: 'YEAR', label: "Current year " }, { value: 'LYEAR', label: "Last year" }, { value: 'MONTH', label: " Current month" }, { value: 'LMONTH', label: 'Last month' }],
      pdfPeriod: 'ALL',
      indexlist: 0,
      nodataA: false,
      spectroimglist: [],
      pdfimglist: [],
      imgtype: [{ value: 'ALL', label: "All" }, { value: 'YEAR', label: "Current year " }, { value: 'LYEAR', label: "Last year" }, { value: 'MONTH', label: " Current month" }, { value: 'LMONTH', label: 'Last month' }],
      displaySensor: false,
      displayChannel: false,
      displayData: false,
      displaySpectro: false,
      displayPdf: false,
      displayResponse: false,
      gallery: [{ src: "" }],
      isloaded: false,
      selection: [],
      cpt: 10,
      items: [],
      response: { response: [] },
      channel: null,
      active: [],
      sensor: null,
      open: [],
      users: [],
      searchSensor: "",
      startDate: "",
      endDate: "",
      showPlot: false,
      plotAvailable: false,
      yearValue: null,
      yearArray: [],
      openSensors: [],
      activeSensors: []

    };
  },
  methods: {

    displayRouteChannel() {
      if ((this.channelStartDate.length>0) && (this.locationCode.length>0) && (this.channelCode.length>0)) {
        if (this.items.length>0) {
          for (let i = 0; i < this.items.length; i++) {
            let aux = this.items[i].children;
            for (let j = 0; j < aux.length; j++) {
              let channelInfo = aux[j].channelInfo;
              if ( (channelInfo.code == this.channelCode) && (channelInfo.locationCode == this.locationCode) && (channelInfo.startDate == this.channelStartDate)) {
                this.openSensors.push(i)
                this.activeSensors.push(aux[j].id)
                this.sensorfct(false, aux[j])
                break;
              }
            }
          }
        }
      }
    },

    spectroOrPdfLoaded() {
      this.spectroOrPdfLoading = false;
    },

    spectroOrPdfErrored() {
      this.spectroOrPdfLoading = false;
      this.spectroOrPdfError = true;
    },


    formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
},

    removeTemporaryYear(networkCode) {
      if (networkCode.indexOf("__")>=0) {
        return networkCode.split("__")[0]
      } else {
        return networkCode
      }
    },

    spectroImageDisplay() {
      this.spectroOrPdfTitle="Spectrogram";
      this.spectroOrPdf="spectro"
      this.spectroOrPdfError = false
      this.spectroOrPdfLoading = true
      this.spectroOrPdfDialog=true;
    },

    pdfImageDisplay() {
this.spectroOrPdfTitle="Pdf";
this.spectroOrPdf="pdf"
this.spectroOrPdfError = false
this.spectroOrPdfLoading = true
      this.spectroOrPdfDialog=true;
    },

    dataAvailability() {
      if (this.yearValue == null) {
        return
      }
      this.axios
        .get(this.wsService+`/fdsnws/availability/1/query?merge=samplerate,overlap&includerestricted=true&net=${this.removeTemporaryYear(this.networkCode)}&sta=${this.stationCode}&loc=${this.channel.locationCode}&cha=${this.channel.code}&start=${this.yearValue}-01-01T00:00:00	&end=${this.yearValue}-12-31T23:59:59&format=json`)
        .then(response => {
          let dataAvailabilityDataSet = [];

          // le jsodata.datasourcesn est parsé et les dates sont mises au format attendu par visavail
          this.nodataA = false
          if (response.data.datasources) {
            response.data.datasources.map(channel => {
              

              if (channel.timespans.length > 0) {
                let measure = `Quality: ${channel.quality}` 
                dataAvailabilityDataSet.push({

                  measure: measure,
                  measure_description: `${channel.network}-${channel.station}-${channel.channel}-${channel.location}-${channel.quality}`,
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
            })
          } else {
            this.nodataA = true
          }

          const timelineOptions = {
            id_div_container: "visavail_channel_container",
            id_div_graph: "visavail_channel_graph",
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
            }
          };

          visavail.generate(timelineOptions, dataAvailabilityDataSet);
        })
    },

    onImgErrorSmalllol(source) {
      
      source.src = "https://via.placeholder.com/728x90.png?text=Image+no";
      // disable onerror to prevent endless loop

      return true;
    },
    onImgErrorSmall(source) {
      
      document.getElementById("img01").src = "https://via.placeholder.com/728x90.png?text=Image+no";
      // disable onerror to prevent endless loop
      source.onerror = "";

      return true;
    },

    imgpop(element) {
      
      document.getElementById("img01").src = element.url;
      document.getElementById("modal01").style.display = "block";
    },
    loaded() {
      this.isloaded = true;
      this.plotAvailable = true;
    },

    noplot() {
      this.isloaded = true;
      this.plotAvailable = false;
    },

    isLoading(event) {
      if (event) {
        this.showPlot = true;
        
      } else {
        this.showPlot = false;
      }
    },
    download(type, identifier) {
      
      let baseUrl = this.wsService+"/";
      /* channelIdentifier: {
                    code: channel.code,
                    type: channel.type,
                    locationCode: channel.locationCode,
                    elevation: channel.elevation,
                    startDate: channel.startDate
                  }, */

      let serviceUrl = "";
      if (type === "resp") {
        serviceUrl =
          baseUrl +
          `resifws/resp/1/query?net=${this.networkCode}&sta=${this.stationCode}&loc=${identifier.locationCode}&cha=${identifier.code}&start=${identifier.startDate}&end=${identifier.endDate}`;
      } else if (type === "sacp") {
        serviceUrl =
          baseUrl +
          `resifws/sacpz/1/query?net=${this.networkCode}&sta=${this.stationCode}&loc=${identifier.locationCode}&cha=${identifier.code}&start=${identifier.startDate}&end=${identifier.endDate}`;
      }
      window.open(serviceUrl, "_blank");
    },
    iconselector(title) {
      return this.titleicon[title];
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
    isDisplay(key) {
      if (
        key === "children" ||
        key === "id" ||
        key === "isSensor" ||
        key === "key"
      ) {
        return false;
      } else {
        return true;
      }
    },
    getColor(val) {
      let color = null;
      let now = new Date();
      if (Date.parse(val) < Date.parse(now.toISOString())) {
        color = "orange";
      } else {
        color = "";
      }

      return color;
    },


    getChannelClass(val) {
      let color = null;
      let now = new Date();
      if (Date.parse(val) < Date.parse(now.toISOString())) {
        color = "grey--text";
      } else {
        color = "black--text";
      }

      return color;
    },

    sensorfct(active, item) {
      let routeFragments = this.$route.path.split('/').filter((a) => a)
      
      history.pushState(
      {},    
      null,
      '#' + "/"+routeFragments[0]+"/"+routeFragments[1]+"/"+item.channelInfo.locationCode+'/'+item.channelInfo.code+"/"+item.channelInfo.startDate
      )
      
      if (!active && item.isSensor) {
        this.displaySensor = true;
        this.displayChannel = false;
        this.displayData = false;
        this.displayResponse = false;
        this.displaySpectro = false,
          this.displayPdf = false,
          this.sensor = item.sensorInfo;
      } else if (!active && !item.isSensor) {
        this.displayChannel = true;
        this.displayData = false;
        this.displayResponse = true;
        this.displaySpectro = true,
          this.displayPdf = true,
          this.channel = item.channelInfo;
        this.response = item.response;
        let startyear = this.channel.startDate.substring(0, 4);
      let endYear = new Date().getFullYear();
      let aux = parseInt(this.channel.endDate.substring(0, 4));
      if (aux < endYear) {
        endYear = aux;
      }
      let yearArray = [];
      for (let i = endYear; i >= startyear; i--) {
        yearArray.push(i)
      }
      this.yearArray = yearArray;
      this.yearValue = yearArray[0]
        
    
        this.isloaded = false;
        this.gallery.pop();
        this.gallery.push({
          src: this.wsService+`/resifws/evalresp/1/query?net=${this.networkCode}&sta=${this.stationCode}&loc=${item.channelInfo.locationCode}&cha=${item.channelInfo.code}&time=${item.channelInfo.startDate}&format=plot`,

          thumbnailWidth: "420px"
        });

        this.spectroimglist = []
        this.pdfimglist = []
        //let url = this.pdfAndSpectroService+`?url=pqlx/${this.networkCode}/${this.networkCode}.${this.stationCode}.${item.channelInfo.locationCode}.${item.channelInfo.code}`
        let url = this.pdfAndSpectroService+"?network="+this.networkCode+"&station="+this.stationCode+"&location="+item.channelInfo.locationCode+"&channel="+item.channelInfo.code;
        this.imgtype.map(type => {

          let spectro = {
            title: type.label,
            url: `${url}&type=${type.value}.SP.png`,
            thumbnail: `${url}&type=${type.value}.SP.icon.png`
          }
          this.spectroimglist.push(spectro)
          let pdf = {
            title: type.label,
            url: `${url}&type=${type.value}.png`,
            thumbnail: `${url}&type=${type.value}.icon.png`
          }

          this.pdfimglist.push(pdf)
        })
      } else {}
    },
    test(val) {
      
     
    }
  }
};
</script>

<style>

.clickable {
  cursor: pointer;
}

.channel-treeview p {
  margin-bottom: 0px;
}


.channel-treeview .v-treeview-node__label {
  overflow: visible !important;
}

.channel-treeview .v-treeview-node__children {
  overflow-x: auto !important;
}

.hoveropacity:hover {
  opacity: 0.60
}

.w3-modal {
  z-index: 3;
  display: none;
  padding-top: 100px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4)
}

.w3-modal-content {
  margin: auto;
  background-color: transparent;
  position: relative;
  padding: 0;
  outline: 0;
  width: 600px
}
svg{
  width:auto !important
}

.active {
  border-left: 3px solid #e36517;
  font-weight: 600;
  pointer-events: none;
  padding-left: 25px;
}


.visavail-tooltip div.tooltip-overlay {
  width: 300px;
  text-align: center;
}

.visavail-tooltip .tooltip_has_data {
    margin-right: 10px;
}
</style>
