<template>
<v-app>

    <router-view/>
  </v-app>
</template>

<script>
export default {
  name: "resif-browse-station",
  components: {
   
  },
created () {
this.$router.push('/browseByStation')},
  data: () => ({

  })
}
</script>