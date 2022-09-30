<template>
  <v-main class="ma-3">
    <router-view @login="login"></router-view>
  </v-main>
</template>

<script>
import router from "../../router-orcid";

import VueJwtDecode from "vue-jwt-decode";
export default {
  name: "resif-orcid",
  router: router,
 
  computed: {
    redirectUri() {
      return window.location.origin + window.location.pathname;
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

    token() {
      return this.$store.getters.getToken;
    },

    logged() {
      if (this.token) {
        if (this.token != "") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  },
  created() {
    var code = this.getCodeParameter();
    if (this.logged) {
      let aux = VueJwtDecode.decode(this.token);
      let current_time = Date.now() / 1000;
      if (aux.exp < current_time) {
        this.logout();
        return;
      } else {
        // this.$router.push("/myproposals");
        console.log("I'm LOGGGGGED")
        return;
      }
    }
    if (code) {
   
      this.axios
        .get(
          this.service+"/login/v1_0/orcid" +
            "?code=" +
            code +
            "&redirect_uri=" +
            this.redirectUri
        )
        .then(response => {
          
          this.$store.commit("setUsername", response.data.name);
          this.$store.commit("setOrcid", response.data.orcid);
          this.$store.commit("setToken", response.data.token);

          
    
      
        });

    } else if (!this.logged) {
      this.logout();
    }
  },

  methods: {
    logout() {
      this.$store.commit("setUsername", null);
      this.$store.commit("setOrcid", null);
      this.$store.commit("setToken", null);

      this.$router.push("/");
      const jsonp = require("jsonp");
      jsonp(
        "https://orcid.org/userStatus.json?logUserOut=true",
        null,
        () => {}
      );
    },
    login() {
      this.$router.push("/logging");
      window.open(
        "https://orcid.org/oauth/authorize?client_id=APP-XG6AYC3B6VAC1AAC&response_type=code&scope=/authenticate&redirect_uri=" +
          this.redirectUri,
        "_self"
      );
    },
    getCodeParameter() {
      return this.getURLParameter("code");
    },
    getURLParameter(sParam) {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split("&");
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] == sParam) {
          return decodeURIComponent(sParameterName[1]);
        }
      }
      return null;
    }
  }
};
</script>

<style>
</style>
