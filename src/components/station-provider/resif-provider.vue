<template>
<v-app>
  <div class=""  id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-app-bar style="position: relative; z-index: 0 !important" elevation="0" app color="indigo" dark>
          <app-breadcrumbs>
            <span slot-scope="{to, label, utils}" primary-title>
              <router-link :to="to" class="text-decoration-none white--text text-h6" exact :itemprop="utils && utils.itemprop">{{label}}</router-link>
              <i class="mx-4 fas fa-angle-right "></i>
            </span>
            <span slot="current" slot-scope="{label}" class="text-h6">{{label}}</span>
          </app-breadcrumbs>
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
</template>

<script>
export default {
  name: "resif-provider",
  components: {},
  created() {
    if(window.location.href.indexOf("networkDetail") === -1){

      this.$router.push("/dataProvider");
    }
  },
  data: () => ({})
};
</script>
