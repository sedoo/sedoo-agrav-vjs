<template>
<span>
  
<v-app>
  
  <div class="" id="app">
    <v-app id="inspire">
      <v-app id="inspire">

        <v-app-bar style="position: relative; z-index: 0 !important" elevation="0" app color="indigo" dark v-if="type=='internal'">
          <div class="pl-2">
          <span class="text-h6" v-if="isLevel1">
           {{level1Label}}
          </span>

          <span class="text-h6" v-else-if="isLevel2">
            <span class="clickable" @click="goToLevel1"> {{level1Label}}</span> > {{currentNetworkLabel}}
          </span>

          <span class="text-h6" v-else>
            <span class="clickable" @click="goToLevel1">{{level1Label}}</span> > 
            <span class="clickable" @click="goToLevel2">{{currentNetworkLabel}}</span> > {{currentStationLabel}}
          </span>
          </div>
        </v-app-bar>
        <v-main class="pt-0">
          <v-container fluid>
            <router-view style="width:100%" />
          </v-container>
        </v-main>
      </v-app>
    </v-app>
  </div>
</v-app>
</span>


</template>

<script>
import router from "../../router-providers";
export default {
  name: "resif-browse-by-providers",
   router: router,
  components: {

  },
  created() {},

  props: {
    type: {
      Type: String,
      default: "internal"
    },

    externalselector: {
      Type: String,
      default: "h1.entry-title"
    }
   
  },

  watch:{
    $route (){
        this.computeExternalBreadcrumb();
    }
} ,

  mounted() {
    this.setExternalListeners()
    this.computeExternalBreadcrumb();

  },

  computed: {

    isInternal: function() {
      return this.breadcrumbType == "internal";
    },

    currentNetworkLabel: function() {
      return "Network: " + this.formatNetwork(this.$route.params.nertworkId)
    },

    currentStationLabel: function() {
      return "Station: " + this.$route.params.stationId
    },


    isLevel1: function() {
      if (this.$route.name == 'providers') {
        return true;      
      }
      return false;
    },

    isLevel2: function() {
      if (this.$route.name == 'networkDescription') {
        return true;      
      }
      return false;
    },

    level1Label: function() {
      return "Browse by providers"
    }
  },

  data: () => ({
  }),
  methods: {

    setExternalListeners() {
    var self = this
    document.addEventListener('click',function(e){
    if(e.target && e.target.id== 'provider-bc-level1'){
      self.goToLevel1();
     }

    if(e.target && e.target.id== 'provider-bc-level2'){
      self.goToLevel2();
     }
    });

    },

computeExternalBreadcrumb() {

    //  debugger;
    if (this.type == 'external') {
      let breadcrumb = document.querySelector(this.externalselector);
      if (breadcrumb == null) {
        return
      }
      if (this.isLevel1) {
        breadcrumb.innerHTML = this.level1Label;
      }
      else if (this.isLevel2) {
        breadcrumb.innerHTML = "<span id='provider-bc-level1' style='cursor:pointer'>"+this.level1Label+"</span>  > "+this.currentNetworkLabel;
      } else {
        breadcrumb.innerHTML = "<span id='provider-bc-level1' style='cursor:pointer'>"+this.level1Label+"</span>  > <span id='provider-bc-level2' style='cursor:pointer'>"+this.currentNetworkLabel+ "</span> > "+this.currentStationLabel
      }
    }

    },

    goToLevel1() {
      this.$router.push('/');
    },

    goToLevel2() {
      this.$router.push('/'+this.$route.params.nertworkId);
    },

    formatNetwork(value) {
      if (value == null) {
        return ""
      }
      if (value.indexOf("__")<0) {
        return value;
      } else {
        let aux = value.split("__");
        return aux[0]+ ' ('+aux[1]+')'
      }
    }
  }
}
</script>

<style>


.clickable {
  cursor: pointer;
}
</style>
