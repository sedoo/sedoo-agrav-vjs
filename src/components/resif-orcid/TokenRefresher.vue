<template>
  <span></span>
</template>

<script>
export default {

name:'tokenRefresher',
  data() {
    return {
      refresher: null,
      store: null
    };
  },
  

  created() {
    this.refreshToken();
    this.refresher = setInterval(() => {
      this.refreshToken();
    }, 10000);
  },

  destroyed() {
    clearInterval(this.refresher);
  },

computed: {

    loggedOrcid() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getOrcid;
      }
      return null
    },

     storeWrapper() {
      if (this.$store) {
        return this.$store
      } else {
        return this.store
      }
    },
    getToken() {
      return this.storeWrapper.getters.getToken;
    },
    service() {
      return this.storeWrapper.getters.getResifService;
    },
    refreshService() {
      return this.service+"/token/v1_0/refresh";
    }
    
  },

  methods: {
    refreshToken() {
      if (!this.storeWrapper.getters.getToken) {
        
        
        return;
      } else {
        
     
        this.axios
          .get(this.refreshService)
          .then((response) => {
            
            this.storeWrapper.commit("setToken", response.data);
            
            
          })
          .catch(()=> {
            this.$emit("error");
          })
          .finally(() => {});
      }
    }
  }
};
</script>