<template>
<v-app>
  <v-navigation-drawer class="ml-4" app>
 
  </v-navigation-drawer> 
  <v-container fluid >
    <v-row>
      <v-col >
        <div>
          <v-tabs slider-color="transparent" grow v-model="tabL">
            <v-tab href="#tab-All">
              <v-icon class="mr-2">all_inclusive</v-icon>
              <span> All</span>
            </v-tab>
            <v-tab href="#tab-L1">
              <v-icon class="mr-2">all_inclusive</v-icon>
              <span>Permanent</span>
            </v-tab>

            <v-tab href="#tab-L2">
              <v-icon class="mr-2">hourglass_empty</v-icon>
              <span>Temporary</span>
            </v-tab>

          </v-tabs>
        </div>

        <v-tabs-items v-model="tabL">
          <v-tab-item :key="111" value="tab-All">
            <resif-station-map title="All stations" :urlStationService="service+'/tree/v1_0/stations'"></resif-station-map>
            <v-card flat>
              <v-card-text>
                <v-card class="elevation-0">
                  <v-card-title>
                    <v-text-field v-model="search" prepend-icon="search" label="Search in all network list" single-line hide-details></v-text-field>
                  </v-card-title>
                  <v-data-table dense calculate-widths :headers="All.headers" :items="All.network" :items-per-page="100" :search="search" class="elevation-0">
                    <template v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="(item,index) in items" :key="item.name+index">
                          <td>
                                <router-link  tag="span" :to="`/${item.identifier}`"> 
                            <v-chip  class="white--text text-decoration-none clickable" x-small  :color="getColor(item)" key="unlock">
                                {{ item.name }}
                            </v-chip>
                                </router-link>
                            <v-icon small v-if="item.restricted" title="Restricted access">mdi-lock</v-icon>
                              
                          </td>

                          <td>{{ item.number }}</td>
                          <td> <span> &nbsp {{item.startTime.substring(4,0)}}
                              <v-icon small>mdi-arrow-right</v-icon>
                              <span v-if="item.endTime.substring(4,0) !== '2500'">{{item.endTime.substring(4,0)}}</span>
                              <v-icon small v-else>mdi-infinity</v-icon>
                            </span></td>
                          <td>{{ item.description }}</td>
                          <td> <router-link  class="text-decoration-none clickable" tag="span" :to="`/${item.identifier}`"> <v-icon right>mdi-magnify</v-icon></router-link></td>
                        </tr>
                      </tbody>
                    </template>
                    <!--  <template v-slot:item.restricted="{item}">
                      <v-chip small v-if="!item.restricted" :color="getColor(item.restricted)" key="unlock">
                        <v-icon small>lock_open</v-icon>
                      </v-chip>
                      <v-chip small v-else :color="getColor(item.restricted)" key="lock">
                        <v-icon small>lock</v-icon>
                      </v-chip>
                    </template> -->
                  </v-data-table>
                </v-card>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="11" value="tab-L1">
            <resif-station-map title="Permanent station" :urlStationService="service+'/tree/v1_0/stations?type=permanent'"></resif-station-map>
            <v-card flat>
              <v-card-text>
                <v-card class="elevation-0">
                  <v-card-title>
                    <v-text-field v-model="search" prepend-icon="search" label="Search in permanent networks list" single-line hide-details></v-text-field>
                  </v-card-title>
                  <v-data-table dense calculate-widths :headers="Permanent.headers" :items="Permanent.network" :items-per-page="100" :search="search" class="elevation-0">
                    <template v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="(item,index) in items" :key="item.name+index">
                          <td>
                              <router-link    tag="span" :to="`/${item.identifier}`"> 
                            <v-chip x-small class="white--text text-decoration-none clickable" :color="getColor(item)">
                              {{ item.name }}
                            </v-chip>
                              </router-link>
                              <v-icon small v-if="item.restricted" title="Restricted access">mdi-lock</v-icon>
                          </td>

                          <td>{{ item.number }}</td>
                          <td> <span> &nbsp {{item.startTime.substring(10,0)}}
                              <v-icon small>mdi-arrow-right</v-icon>
                              <span v-if="item.endTime.substring(4,0) !== '2500'">{{item.endTime}}</span>
                              <v-icon small v-else>mdi-infinity</v-icon>
                            </span></td>
                          <td>{{ item.description }}</td>
                          <td>
                            <router-link class="text-decoration-none clickable" tag="span" :to="`/${item.name}`"> <v-icon right>mdi-magnify</v-icon></router-link>

                            
                          </td>
                        </tr>
                      </tbody>
                    </template>
                    <template v-slot:item.restricted="{item}">
                      <v-chip class="white-text" small v-if="!item.restricted" :color="getColor(item.restricted)" key="unlock">
                        <v-icon small>lock_open</v-icon>
                      </v-chip>
                      <v-chip class="white-text" small v-else :color="getColor(item.restricted)" key="lock">
                        <v-icon small>lock</v-icon>lol
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <v-tab-item :key="22" value="tab-L2">
            <resif-station-map title="Temporary station" :urlStationService="service+'/tree/v1_0/stations?type=temporary'"></resif-station-map>
            <v-card flat>
              <v-card-text>
                <v-card class="elevation-0">
                  <v-card-title>
                    <v-text-field v-model="search" prepend-icon="search" label="Search in temporary network list" single-line hide-details></v-text-field>
                  </v-card-title>
                  <v-data-table dense calculate-widths :headers="Temporary.headers" :items="Temporary.network" :items-per-page="100" :search="search" class="elevation-0">
                    <template v-slot:body="{ items }">
                      <tbody>
                        <tr v-for="(item,index) in items" :key="item.name+index">
                          <td>
                              <router-link   tag="span" :to="`/${item.identifier}`"> 
                            <v-chip x-small :color="getColor(item)" class="white--text text-decoration-none clickable" >
                              {{ item.name }}
                            </v-chip>
                              </router-link>
                              <v-icon small v-if="item.restricted" title="Restricted access">mdi-lock</v-icon>
                          </td>

                          <td>{{ item.number }}</td>
                          <td><span> &nbsp {{item.startTime.substring(4,0)}}
                              <v-icon small>mdi-arrow-right</v-icon>
                              <span v-if="item.endTime.substring(4,0) !== '2500'">{{item.endTime.substring(4,0)}}</span>
                              <v-icon small v-else>mdi-infinity</v-icon>
                            </span></td>
                          <td>{{ item.description }}</td>
                          <td> <router-link class="text-decoration-none clickable" tag="span" :to="`/${item.identifier}`"> <v-icon right>mdi-magnify</v-icon></router-link></td>
                        </tr>
                      </tbody>
                    </template>
                    <template v-slot:item.restricted="{item}">
                      <v-chip small v-if="!item.restricted" :color="getColor(item.restricted)" key="unlock">
                        <v-icon small>lock_open</v-icon>
                      </v-chip>
                      <v-chip small v-else :color="getColor(item.restricted)" key="lock">
                        <v-icon small>lock</v-icon>
                      </v-chip>
                    </template>
                  </v-data-table>
                </v-card>
              </v-card-text>
            </v-card>
          </v-tab-item>

        </v-tabs-items>

      </v-col>

    </v-row>

  </v-container>
</v-app>
</template>

<script>
import resifStationMap from "./resif-station-map"

export default {
  name: "resif-seismic-network-by-network",
  components: { resifStationMap},

  computed: {

    urlservice() {
      return this.service+"/network/v1_0/list"
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
    }
 },

  data: () => ({
    statTime: "",
    endTime: "",
    networkIdentifier: null,
    type: "",
    tab: null,
    showDescription: false,
    tabL: null,
    virtual: ["ALPARRAY_FR (143 stations)"],
    search: "",
    Virt: {
      headers: [{
          text: "Network",
          align: "left",
          sortable: true,
          value: "name"
        },
        { text: "Number", value: "number" }
      ],
      network: []
    },
    All: {
      headers: [{
          text: "FDSN network code",
          align: "left",
          width: "6%",
          sortable: true,
          value: "name"
        },

        {
          text: "Number of stations",
          align: "left",
          width: "7%",
          sortable: true,
          value: "number"
        },
        {
          text: "Start-End",
          align: "left",
          width: "5%",
          sortable: true,
          value: "startTime"
        },
        {
          text: "Description",
          align: "left",
          sortable: true,
          width: "30%",
          value: "description"
        },
        {
          text: "Detail",
          align: "left",
          width: "10%",
          sortable: true,
          value: "name"
        },
      ],
      network: []
    },
    Permanent: {
      headers: [{
          text: "FDSN network code",
          align: "left",
          width: "7%",
          sortable: true,
          value: "name"
        },
        {
          text: "Number of stations",
          align: "left",
          width: "7%",
          sortable: true,
          value: "number"
        },
        {
          text: "Start-End",
          align: "left",
          width: "7%",
          sortable: true,
          value: "startTime"
        },
        {
          text: "Description",
          align: "left",
          width: "30%",
          sortable: true,
          value: "description"
        },
        {
          text: "Detail",
          align: "left",
          width: "10%",
          sortable: true,
          value: "name"
        },
      ],
      network: []
    },

    Temporary: {
      headers: [{
          text: "FDSN network code",
          align: "left",
          width: "7%",
          sortable: true,
          value: "name"
        },
        {
          text: "Number of stations",
          align: "left",
          width: "7%",
          sortable: true,
          value: "number"
        },
        {
          text: "Start-End",
          align: "left",
          width: "5%",
          sortable: true,
          value: "startEnd"
        },
        {
          text: "Description",
          align: "left",
          width: "30%",
          sortable: true,
          value: "description"
        },
        {
          text: "Detail",
          align: "left",
          width: "10%",
          sortable: true,
          value: "name"
        },
      ],
      network: []
    }
  }),
  mounted() {

    this.axios.get(this.urlservice).then(response => {
      

      response.data.permanentNetworks.map(pNetwork => {

        this.Permanent.network.push({
          name: pNetwork.identifier,
          identifier: pNetwork.shortIdentifier,
          number: pNetwork.totalNumberStations,
          description: pNetwork.description,
          restricted: pNetwork.restricted,
          startEnd: pNetwork.endDate.substring(0, 4) !== "2500" ? `${pNetwork.startDate.substring(0, 4)}-${pNetwork.endDate.substring(0, 4)}` : `${pNetwork.startDate.substring(0, 4)}-null`,
          startTime: pNetwork.startDate,
          endTime: pNetwork.endDate
        });

        this.All.network.push({
          name: pNetwork.identifier,
          identifier: pNetwork.shortIdentifier,
          number: pNetwork.totalNumberStations,
          description: pNetwork.description,
          restricted: pNetwork.restricted,
          startEnd: pNetwork.endDate.substring(0, 4) !== "2500" ? `${pNetwork.startDate.substring(0, 4)}-${pNetwork.endDate.substring(0, 4)}` : `${pNetwork.startDate.substring(0, 4)}-null`,
          startTime: pNetwork.startDate,
          endTime: pNetwork.endDate
        })
      });
      response.data.temporaryNetworks.map(tNetwork => {
        this.Temporary.network.push({
          name: tNetwork.code,
          identifier: tNetwork.shortIdentifier,
          number: tNetwork.totalNumberStations,
          description: tNetwork.description,
          restricted: tNetwork.restricted,
          startEnd: tNetwork.endDate.substring(0, 4) !== "2500" ? `${tNetwork.startDate.substring(0, 4)}-${tNetwork.endDate.substring(0, 4)}` : `${tNetwork.startDate.substring(0, 4)}-null`,
          startTime: tNetwork.startDate,
          endTime: tNetwork.endDate
        });
        
        this.All.network.push({
          name: tNetwork.code,
          identifier: tNetwork.shortIdentifier,
          number: tNetwork.totalNumberStations,
          description: tNetwork.description,
          restricted: tNetwork.restricted,
          startEnd: tNetwork.endDate.substring(0, 4) !== "2500" ? `${tNetwork.startDate.substring(0, 4)}-${tNetwork.endDate.substring(0, 4)}` : `${tNetwork.startDate.substring(0, 4)}-null}`,
          startTime: tNetwork.startDate,
          endTime: tNetwork.endDate
        });
      });

      
    });
  },
  methods: {

    getColor(item) {
      
      let color = null
      let now = new Date()
      let aux = item.endTime.split("T")[0]
      let endDate = new Date(aux)
      if (now > endDate) {
        color = "red";
      } else {
        color = "green";
      }
      return color
    },

    changeFormat(tab, dataTab) {
      tab.forEach(element => {
        var arrStr = element.split(" ");
        let number = arrStr[1].split("(");
        number = number[1];

        dataTab.network.push({
          name: arrStr[0],
          number: number
        });
        
      });
    }
  }
};
//# sourceURL=settings.vue
</script>

<style scoped>
/* .selectedRow {
  background-color: #a7b1c2;
  font-weight: bold;
}



.active {
  border: 2px solid #a7b1c2;
  border-bottom-width: 0 !important;
  border-radius: 10px 10px 0 0;
  background-color: #fff !important;
  color: #7d7d7d;
}

.v-tabs:not(.v-tabs--vertical) .v-tab {
  background-color: none;
  border-bottom: 2px solid #a7b1c2;

} */

.clickable {
  cursor: pointer;
}

.v-application div[role="tablist"] a[role="tab"] {
  text-decoration: none;
}

.tabs {
  position: relative;
  top: 2px;

}
</style>
