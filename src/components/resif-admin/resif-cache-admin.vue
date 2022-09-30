<template>
<v-app>
  <v-snackbar v-model="notifier" top :color="notifierColor" :timeout="timeout"  >
      {{ notifierMessage }}
      <v-btn dark text  @click="notifier = false" > Close </v-btn>
</v-snackbar>
   <tokenRefresher></tokenRefresher>

  <v-container v-if="loggedOrcid">
  <v-btn @click="refreshCache" :loading="refreshing" color="primary"> Refresh cache </v-btn>
  <v-btn  color="primary"  :loading="displaying"  class="  ml-2" @click="fetchStatus" >Display cache status</v-btn>
 <v-btn  color="primary"  class="  ml-2" @click="logout" >Logout</v-btn>


  </v-container>
  <v-container v-else>
    <resifOrcid></resifOrcid>
  </v-container>
</v-app>
</template>

<script>
import resifOrcid from "../resif-orcid/resif-orcid"
import tokenRefresher from "../resif-orcid/TokenRefresher";
export default {
  name: "resif-cache-admin",
components:{
  resifOrcid, tokenRefresher
},
data: () => ({
    store: null,
    authorized:false,
    refreshing: false,
    displaying: false,
      timeout: 2000,
   	  notifier: false,
      notifierMessage: '',
      notifierColor: 'success'
  }),
  watch: {
    loggedOrcid: function() {
      this.checkIsAuthorized()
    }
  },
  computed: {

    storeWrapper() {
      if (this.$store) {
        return this.$store
      } else {
        return this.store
      }
    },

    loggedOrcid() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getOrcid;
      }
      return null
    },

    service() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifService;
      }
      return null
    }

   
  },
  created() {
    this.checkIsAuthorized()
  },


  methods: {

    refreshCache: function() {
       this.refreshing = true;
       this.axios
        .get(
          this.service+"/cache/v1_0/clear"
        )
        .then(() => {
         this.refreshing = false
         this.displaySuccess("Cache refreshing has started")
        }).catch(() => {
            this.refreshing = false
            this.displayError("An error has occured while refreshing the cache")
          });

    },

    fetchStatus: function() {
       this.displaying = true;
       this.axios
        .get(
          this.service+"/cache/v1_0/status"
        )
        .then((response) => {
         this.displaying = false
         if (response.data=="Cache fully loaded") {
           this.displaySuccess(response.data)
         } else {
          this.displayStatus(response.data)
         }
        }).catch(() => {
            this.displaying = false
            this.displayError("An error has occured while refreshing the cache")
          });

    },

     logout: function() {
      this.storeWrapper.commit("setUsername", null);
      this.storeWrapper.commit("setOrcid", null);
      this.storeWrapper.commit("setToken", null);
      const jsonp = require("jsonp");
      jsonp(
        "https://orcid.org/userStatus.json?logUserOut=true",
        null,
        () => {}
      );
      this.checkIsAuthorized()
    },

     displayError: function(message) {
  		this.notifierMessage = message
  		this.notifierColor = 'error'
  		this.timeout=8000
  		this.notifier = true
    },
    
     displaySuccess: function(message) {
  		this.notifierMessage = message
  		this.notifierColor = 'success'
  		this.timeout=3000
  		this.notifier = true
    },

      displayStatus: function(message) {
  		this.notifierMessage = message
  		this.notifierColor = 'warning'
  		this.timeout=5000
  		this.notifier = true
    },

    checkIsAuthorized() {
      if (!this.loggedOrcid) {
        this.authorized = false
        return
      } 
      this.axios
        .get(
          this.service+"/contact/v1_0/listAdministratorOrcids"
        )
        .then(response => {
          this.authorized = response.data.includes(this.loggedOrcid)
        })
    },
    getName(orcid) {

      this.axios
        .get(
          this.service+`/contact/v1_0/namebyorcid/${orcid}`
        )
        .then(response => {
          
          this.editedItem.name = response.data
        });
    }
   
  }

};
</script>

<style>
</style>
