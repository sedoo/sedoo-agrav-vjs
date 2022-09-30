<template>
<v-app>

<v-snackbar v-model="notifier" top :color="notifierColor" :timeout="timeout"  >
      {{ notifierMessage }}
      <v-btn dark text  @click="notifier = false" > Close </v-btn>
</v-snackbar>

 <v-dialog v-model="newEmailDialog" max-width="700px">

            <v-card>
              <v-card-title>
              New email
              </v-card-title>

              <v-card-text>
                  <v-text-field
        v-model="newEmail"
        
        label="Email"
        single-line
        hide-details
      ></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error darken-1" text  @click="newEmailDialog = false">Cancel</v-btn>
                <v-btn color="blue darken-1" text :disabled="newEmail.length==0"  @click="newEmailDialog = false;editedItem.emails.push(newEmail)">Ok</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

 <v-dialog v-model="dialog" max-width="700px">

            <v-card>
              <v-card-title>
              Contact edition
              </v-card-title>

              <v-card-text>
                <v-container>
                  <div>
                      <b>Network code: </b>&nbsp; {{editedItem.name}} 
                  </div>
                  <div>
                      <b>Network year: </b>&nbsp; {{editedItem.year}} 
                  </div>
                    <div class="text-subtitle-1"><b>Emails</b></div>
                    <div v-if="!editedItem.emails || editedItem.emails.length == 0"> No emails </div>
                    <div v-else v-for="(email, index) in editedItem.emails" :key="email" >
                      {{email}}  <v-icon title="Delete" small @click="editedItem.emails.splice(index, 1)">
          mdi-delete
        </v-icon>
                    </div>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success darken-1" text :disabled="saving"  @click="newEmail='';newEmailDialog=true">Add new email</v-btn>
                <v-btn color="error darken-1" text :disabled="saving"   @click="dialog = false">Cancel</v-btn>
                <v-btn color="blue darken-1" text :disabled="saving" :loading="saving" @click="saveEditedItem">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

<tokenRefresher></tokenRefresher>
 

  <v-container v-if="loggedOrcid"  >

    <v-data-table v-if="authorized" :search="search" :loading="loading" dense :items-per-page="20" :footer-props="{'items-per-page-options':[20, 30, 50, 100, -1]}" :headers="headers" :items="networkRestrictedList">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Network Managers</v-toolbar-title>

          <v-spacer></v-spacer>
          <v-icon  class="" >
          mdi-magnify
        </v-icon>
          <v-text-field
        v-model="search"
        
        label="Filter"
        single-line
        hide-details
      ></v-text-field>
         <v-btn outlined color="primary" dark class="  ml-2" @click="logout" >Logout</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.name="{ item }">

        <v-chip small class="white--text mr-2 mt-2 mb-2" color="orange ">{{item.name}}</v-chip>

      </template>
      <template v-slot:item.emails="{ item }">
        <v-combobox class="ma-0 pa-0" :readonly="true" background-color="transparent" flat v-model="item.emails" chips multiple solo>
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip small color="blue" class="white--text">
              <a class="white--text" :href='`mailto:${item}`'>{{item}}</a>

            </v-chip>
          </template>
        </v-combobox>

      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" title="Edit" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <!--    <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon> -->
      </template>

    </v-data-table>

      <div v-else class="text-center pa-10 headline">
         You are not allowed to administrate this part of the application.
         <v-btn outlined color="primary" dark class="  ml-2" @click="logout" >Logout</v-btn>
    </div>
   
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

  name: "resif-network-manager",
  components:{
    resifOrcid, tokenRefresher
  },
  data: () => ({
    authorized:false,
    newEmailDialog: false,
    newEmail:'',
    search: null,
    saving: false,
    loading:false,
    dialog: false,
    displaying: false,
      timeout: 2000,
   	  notifier: false,
      notifierMessage: '',
      notifierColor: 'success',
    headers: [
      { text: "Name", value: "name" },
      { text: "Year", value: "year" },
      { text: "Contacts", value: "emails", sortable: false },
      { text: "Actions", value: "actions", sortable: false }
    ],
    saveMailList: [],
    displaySave: false,
    networkRestrictedList: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      year: '',
      emails: []
    },
    defaultItem: {
      name: '',
      year: '',
      emails: []
    },
    listAdmin: [],
    tab: null
  }),
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

  watch: {
    loggedOrcid: function() {
      this.checkIsAuthorized()
    }
  },

  created() {
    this.checkIsAuthorized()
  },
  methods: {

    editItem(item) {

      
      this.editedIndex = this.networkRestrictedList.indexOf(item);
      
      this.editedItem = JSON.parse(JSON.stringify(item));
      
      
      this.dialog = true;

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
           if (this.authorized) {
            this.loadContent();
          }
        })
    },


    loadContent() {

      this.loading = true

      this.axios
      .get(this.service+"/network/v1_0/list")
      .then(response => {
        
        response.data.permanentNetworks.map(pNetwork => {
          if (pNetwork.restricted) {

            
            this.networkRestrictedList.push({ name: pNetwork.code, year: pNetwork.startDate, emails: [] })
          }
        })
        response.data.temporaryNetworks.map(tNetwork => {
          if (tNetwork.restricted) {

            this.networkRestrictedList.push({ name: tNetwork.code, year: tNetwork.startDate.substring(0, 4), emails: [] })
          }
        })
        this.networkRestrictedList = this.networkRestrictedList.filter((item, pos) => {
          return this.networkRestrictedList.indexOf(item) == pos;
        })
        
        this.axios
          .get(this.service+"/contact/v1_0/listRestrictedNetworkInformation")
          .then(response => {
            
            this.networkRestrictedList.map(network => {
              response.data.map(name => {
                
                if (network.name === name.name) {
                  
                  if (name.emails) { network.emails.push(...name.emails) }
                  
                }
              })

            })
            this.loading=false
            
          });
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


    

    

   

    saveEditedItem() {
      this.saving = true;
const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      }
     
        
        this.axios
          .post(
            this.service+'/contact/v1_0/restrictedNetworkInformation', this.editedItem, {
              headers: headers
            })
          .then(res => {
            this.networkRestrictedList.splice(this.editedIndex, 1, res.data)
            this.displaySuccess("The contact has been saved.")
          }).catch(error => {
            this.displayError("An error has occured while saving: "+error.message)
          }).finally(() => {this.dialog=false; this.saving = false});

      
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


    saveadmin() {
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8',
      }
      this.saveMailList.map(mail => {
        
        this.axios
          .post(
            this.service+'/contact/v1_0/restrictedNetworkInformation', mail, {
              headers: headers
            })
          .then(res => {
            this.snackbar = true
            return res;
          }).catch(error => {
            this.snackbarfail = true
            return Promise.reject(

              error.response)
          });

      });

    }
  },

};
</script>

<style>
/* Commented for arrows to appear on select box */
/* .v-input__append-inner {
  display: none !important
}

.v-text-field__details {
  display: none !important
} */

.v-input__slot {
  margin-bottom: 0;
}
</style>
