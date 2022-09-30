<template>
<v-app>
<v-container>
  <v-stepper style="box-shadow: none" v-model="e1">
    <v-stepper-header style="box-shadow: none" flat>
      <v-stepper-step :complete="e1 > 1" step="1">Select restricted network(s)</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Ask for acess </v-stepper-step>

    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card elevation="0" class="pa-5 mt-5 mb-6">
          <v-checkbox class="pa-0 ma-0 " v-for="(netRest, index ) in networkRestrictedList" v-model="selectedNetworks" :label="netRest.label" :value="netRest.value" :key='netRest.label + index'></v-checkbox>
        </v-card>

        <v-btn outlined :disabled="selectedNetworks.length === 0" color="primary" @click="e1 = 2">
          Continue
        </v-btn>

      </v-stepper-content>

      <v-stepper-content step="2">

        <v-card class="mb-6" elevation="0">

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field prepend-icon="mdi-account" v-model="name"  :rules="nameRules" label="Name" required></v-text-field>
            <v-text-field prepend-icon="mdi-email" v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
            <v-text-field prepend-icon="mdi-home-city" v-model="institute" :rules="instituteRules" label="Institute" required></v-text-field>
            <v-textarea prepend-icon="mdi-comment-question-outline" v-model="purpose" :rules="purposRules" label="Purpose" required></v-textarea>
             <p class="grey--text mt-6 mb-6">Selected networks :<v-chip small  color="orange" class=" white--text mr-2 ml-2" v-for="net in selectedNetworks" :key="net">{{net}}</v-chip> </p> 
            <v-btn outlined block elevation="0" :disabled="!valid" color="success" class="mr-4" @click="validate">Send</v-btn>

          </v-form>

        </v-card>
        <v-btn outlined  color="primary" @click="e1 = 1">
          back
        </v-btn>

      </v-stepper-content>

    </v-stepper-items>
  </v-stepper>

</v-container>
 <v-snackbar color="error" top v-model="snackbarfail" :timeout="2000">
     <span >Failure to send request  </span>
    </v-snackbar>

    <v-snackbar color="success" top v-model="snackbar" :timeout="2000">
      <span >Successfully completed request</span>
    </v-snackbar>
</v-app>
</template>

<script>
export default {
  name: 'resif-ask-restircted-data',
  data: () => ({
    snackbar:false,
    snackbarfail:false,
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],

    institute: "",
    instituteRules: [
      v => !!v || 'Institute is required',
    ],
    purpose: "",
    purposRules: [
      v => !!v || 'Purpos is required',
    ],
    selectedNetworks: [],
    networkRestrictedList: [],
    e1: 1,
  }),
 computed: {

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

    askRequestPayLoad() {

      return {
        "email": this.email,
        "institute": this.institute,
        "name": this.name,
        "networks": this.selectedNetworks,
        "purposes": this.purpose
      }
    }
  },
  mounted() {
    this.axios
      .get(this.service+"/network/v1_0/list")
      .then(response => {
        
        response.data.permanentNetworks.map(pNetwork => {
          if (pNetwork.restricted) {
            let netRestricted = { label: `${pNetwork.code}-${pNetwork.description}`, value: pNetwork.code }
            this.networkRestrictedList.push(netRestricted)
          }
        })
        response.data.temporaryNetworks.map(tNetwork => {
          if (tNetwork.restricted) {
            let netRestricted = { label: `${tNetwork.code}-${tNetwork.description}`, value: tNetwork.code }
            this.networkRestrictedList.push(netRestricted)
          }
        })
        this.networkRestrictedList = this.networkRestrictedList.filter((item, pos) => {
          return this.networkRestrictedList.indexOf(item) == pos;
        })
        
      });
  },
  methods: {
    validate() {
      
      
      if (this.$refs.form.validate()){
      this.axios.post(this.service+'/contact/v1_0/askRestricted', this.askRequestPayLoad)
        .then((response) => {
          this.snackbar=true
          
        }, (error) => {
          this.snackbarfail=true
          
        });}
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
  },
}
</script>

<style>

</style>
