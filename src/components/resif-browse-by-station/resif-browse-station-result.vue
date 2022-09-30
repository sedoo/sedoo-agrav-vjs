<template>
<v-app>

    <router-view/>
  </v-app>
</template>

<script>
export default {
  name: "resif-browse-station-result",
  components: {
   
  },
created () {
this.$router.push('/browseByStationResult')},
  data: () => ({

  })
}
</script>