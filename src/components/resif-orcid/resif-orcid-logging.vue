<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="8">
        <div style="text-align:center " class="display-2 ma-3 font-weight-thin">
      
        </div>
        <div style="text-align:center" class="headline">
          You need to login using
          <v-btn class="mx-3 light-green lighten-5" @click="login">
            <img
              style="vertical-align:middle;"
              src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
              width="24"
              height="24"
            />
            <span class="px-2">Orcid</span> </v-btn
          >to use the application.
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name:"resif-logging",
  data: () => ({}),
  methods: {
    login() {
      this.$emit("login");
    }
  }
};
</script>