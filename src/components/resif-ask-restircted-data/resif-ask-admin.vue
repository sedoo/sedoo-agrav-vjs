<template>
<v-app>
   <tokenRefresher></tokenRefresher>
 
  <v-container v-if="loggedOrcid">
    <v-data-table v-if="authorized" :headers="headers" :items="listAdmin" :items-per-page="20" :footer-props="{'items-per-page-options':[20, 30, 50, 100, -1]}">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Administrator list</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="700px">

            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="primary" dark class="  mb-2" @click="logout" >Logout</v-btn>
              <v-btn outlined color="primary" dark class="  mr-3 mb-2" @click="addAdmin">+ add new administrator </v-btn>
            </template>

            <v-card>
              <v-card-title>
              New Administrator
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="editedItem.orcid" label="Orcid"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field :disabled='true' :readonly="true" v-model="editedItem.name" label="Name"></v-text-field>
                    </v-col>

                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-1" text  @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text :loading="saving" @click="saveAdmin">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
       
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>

    </v-data-table>
    <div v-else class="text-center pa-10 headline">
      You are not allowed to administrate this part of the application.
      <v-btn outlined color="primary" dark class="  ml-2" @click="logout" >Logout</v-btn>
    </div>
    <v-snackbar color="error" top v-model="snackbarfail" :timeout="2000">
      <span>An error occured while saving </span>
    </v-snackbar>

    <v-snackbar color="success" top v-model="snackbar" :timeout="2000">
      <span>Administrator successfully saved</span>
    </v-snackbar>

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
  name: "resif-ask-admin",
components:{
  resifOrcid, tokenRefresher
},
 

data: () => ({
    store: null,
    loading:false,
    saving: false,
    authorized:false,
    dialog: false,
    headers: [
      { text: "Name", value: "name" },
      { text: "Orcid", value: "orcid" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    saveOrcidList: [],
    snackbar: false,
    snackbarfail: false,
    desserts: [],
    editedItem: {
      name: "",
      orcid: ''
    },
    defaultItem: {
      name: "",
      orcid: '',
    },
    listAdmin: [],
    tab: null
  }),
  watch: {
    'editedItem.orcid': {
      handler(after, before) {
        this.getName(after)
      },
      deep: true

    },

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

    service() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifService;
      }
      return null
    },

    loggedOrcid() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getOrcid;
      }
      return null
    },
  },
  created() {
    this.checkIsAuthorized()
  },


  methods: {

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

    loadContent() {
      this.listAdmin = []
 this.axios
      .get(
        this.service+"/contact/v1_0/listAdministratorOrcids"
      )
      .then(response => {
        response.data.map(element => {
          
          this.axios
            .get(
              this.service+`/contact/v1_0/namebyorcid/`+element
            )
            .then(response => {
              this.listAdmin.push({
                name: response.data,
                orcid: element
              });
            });
        });
        this.loading=true
      });
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
          // this.authorized = true;
          if (this.authorized) {
            this.loadContent();
          }
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
    },
   

    deleteItem(item) {
      const index = this.listAdmin.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        this.axios.delete(
          this.service+`/contact/v1_0/administrator/${item.orcid}`
        ) && this.listAdmin.splice(index, 1);
    },

    close() {
      this.dialog = false;
    },

    addAdmin() {
      this.editedItem= JSON.parse(JSON.stringify(this.defaultItem));
      this.dialog = true;
     
    },
    saveAdmin() {
      this.saving = true
      let orcid = this.editedItem.orcid;
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',

      }
        this.axios
          .post(
            this.service+"/contact/v1_0/administrator", orcid, {
              headers: headers
            })
          .then(res => {
            this.snackbar = true
            this.saving = false
            this.dialog = false;
            this.loadContent()
          }).catch(error => {
            this.saving = false
            this.dialog = false;
            this.snackbarfail = true
          });


    }
  },

};
</script>

<style>
</style>
