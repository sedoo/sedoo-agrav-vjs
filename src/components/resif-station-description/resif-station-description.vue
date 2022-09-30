<template>
<v-container fluid>
  <v-row>
    <v-col centered cols="12">
      <v-card class="elevation-0">

        <v-tabs centered v-model="tab">
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#tab-1">
            <v-icon class="mr-2">menu_book</v-icon>
            <span>Description</span>
          </v-tab>
          <v-tab :disabled="true" href="#tab-2">
            <v-icon class="mr-2">device_hub</v-icon>
            <span>Site information</span>
          </v-tab>

          <v-tab :disabled="true" href="#tab-3">
            <v-icon small class="mr-2">fas fa-database</v-icon>
            <span>Snapshot</span>
          </v-tab>

          <v-tab :disabled="true" href="#tab-4">
            <v-icon class="mr-2">textsms</v-icon>
            <span>Comments</span>
          </v-tab>

          <v-tab :disabled="true" href="#tab-5">
            <v-icon class="mr-2">textsms</v-icon>
            <span>Channel</span>
          </v-tab>

          <v-tab :disabled="true" href="#tab-6">
            <v-icon class="mr-2">textsms</v-icon>
            <span>Sensor</span>
          </v-tab>

          <v-tab :disabled="true" href="#tab-7">
            <v-icon class="mr-2">textsms</v-icon>
            <span>PDF</span>
          </v-tab>

          <v-tab :disabled="true" href="#tab-8">
            <v-icon class="mr-2">textsms</v-icon>
            <span>Spectorgramme</span>
          </v-tab>

          <v-tab :disabled="true" href="#tab-9">
            <v-icon class="mr-2">textsms</v-icon>
            <span>Data availability </span>
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item :eager="true" :key="1" value="tab-1">
            <v-card flat>
              <v-card-text>
                <resif-station-description-information :stationName="sta" :networkId="NetworkId"></resif-station-description-information>

              </v-card-text>
            </v-card>
          </v-tab-item>

        </v-tabs-items>
      </v-card>
      <v-card class=" elevation-0 text-center justify-center">

      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import resifStationDescriptionInformation from "./resif-station-description-information"

export default {
  name: "resif-station-description",
  components: {
    resifStationDescriptionInformation
  },
  props: {
    StationId: {
      Type: String,
      default: ""
    },
    NetworkId: {
      Type: String,
      default: ""
    }
  },
  computed:{
    sta(){
      
      return this.StationId
    }
  },
  watch: {
    StationId(val) {
      
    }
  },
  mounted() {
    
  },
  data: () => ({
    networkIdentifier: null,
    type: "",
    tab: null,

  })
};
</script>

<style scoped>
.selectedRow {
  background-color: red;
  font-weight: bold;
}
</style>
