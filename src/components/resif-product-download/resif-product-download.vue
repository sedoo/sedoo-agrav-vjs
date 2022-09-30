<template>
<v-app>

 <v-container>
   
    <v-data-iterator :items="items" :items-per-page.sync="itemsPerPage" :page="page" :search="search" :sort-by="sortBy.toLowerCase()" :sort-desc="sortDesc" hide-default-footer>
      <template v-slot:header>

        <v-toolbar dark :color="colorPrimary" class="mb-1">
          <v-row>

          <!--   <v-col justify="center" cols="12" sm="6" md="4" lg="2">
               <v-text-field class="title" v-model="search" clearable flat hide-details prepend-inner-icon="search" label="Search"></v-text-field> 
            </v-col> -->
         <!--    <v-col cols="12" sm="6" md="4" lg="1">
              <v-select class="title" v-model="sortBy" flat hide-details :items="keys" label="Sort by"></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="1" class="mt-2 ">

              <v-btn x-small elevation=0 fab color="blue darken-3" @click="sortDescFalse">
                <v-icon style="font-size:15px;">mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn x-small elevation=0 fab color="blue darken-3" @click="sortDescTrue">
                <v-icon style="font-size:15px;">mdi-arrow-down</v-icon>
              </v-btn>

            </v-col> -->

            <v-col cols="12" sm="6" md="4" lg="5" class="mt-2 title ">
              <v-btn x-small elevation=0 fab dark :color="colorPrimary" @click="formerPage">
                <v-icon class="title">mdi-arrow-left</v-icon>
              </v-btn>
              <span class="white--text">
                Page {{ page }} of {{ numberOfPages }}
              </span>
              <v-btn x-small elevation=0 fab dark :color="colorPrimary" @click="nextPage">
                <v-icon class="title">mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>

            <v-col class="mt-2 " cols="12" sm="6" md="4" lg="3">
              <span class="white--text">Items per page</span>
              <v-menu center="rigth" justify="right">
                <template v-slot:activator="{ on }">
                  <v-btn class="" elevation=0 :color="colorPrimary" v-on="on">
                    {{ itemsPerPage }}
                    <v-icon class="white--text ">mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>

         
          </v-row>
        </v-toolbar>
      </template>

      <template v-slot:default="props">

        <v-row v-masonry transition-duration="0.3s" item-selector=".item" :origin-top="true" :horizontal-order="false">
          <v-col v-masonry-tile class="item" cols="12" sm="6" md="4" lg="6" v-for="item in props.items" :key="item.metaData.title">
            <v-card elevation="1">

              <v-card-title  :style="{background:colorPrimary,color:'white'}">

                <span class="title" style="word-break: normal">{{item.metaData.title}}</span>
              </v-card-title>

              <v-card-text class="mt-4">
                <p> {{item.metaData.abstract}}</p>

              </v-card-text>

              <v-dialog v-model="item.dialog" max-width="800">
                <v-card>
                  <v-card-title class="headline">Read Me</v-card-title>

                  <v-card-text style="white-space: pre-wrap;">
                    {{ item.readMe}}
                  </v-card-text>

                  <v-card-actions>
               
                    <v-row>

                      <!-- <v-col cols="12" sm="6" md="4" lg="3">
                        <v-btn v-clipboard="item.readMe" @click="snackbar= false" @success="handleSuccess" @error="handleError" color="green darken-1" text>
                          Copy to clipboard
                        </v-btn>
                      </v-col> -->

                      <v-col cols="12" sm="6" md="2" lg="10 ">
                        <v-btn color="green darken-1" text @click="download('ReadMe_'+item.metaData.title+'txt',item.readMe)">
                          download
                        </v-btn>

                      </v-col>
                      <v-col cols="12" sm="6" md="2" lg="2">
                        <v-btn :absolute="true" :rigth="true" color="green darken-1" text @click="item.dialog = false">
                          Ok
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-expansion-panels style="background-color:white">
                <v-expansion-panel style="color:rgba(0, 0, 0, 0.54) ">
                  <v-expansion-panel-header > <span>
                      <v-icon class="mb-1" medium :color="colorPrimary">stop</v-icon> <span  class="subtitle-1  mb-0 ">Contact</span>
                    </span></v-expansion-panel-header>
                  <v-expansion-panel-content>

                    <ul style="list-style-type: none; color:rgba(0, 0, 0, 0.54) " class="mb-2 " v-for=" contact in item.metaData.contact" :key="contact.name">
                      <li>
                        <v-icon >person</v-icon>
                        {{ contact.name }}
                        <ul class="pl-2 ml-3" style="list-style-type: none; border-left: 1px solid #bbb;">
                          <li>
                            <v-icon x-small>mail</v-icon>
                        <a :href='`mailto:${contact.email}`'>{{ contact.email }}</a>    
                          </li>
                        </ul>
                      </li>

                    </ul>

                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-row align="center" v-if="item.metaData.domains">
                <v-col style="color:rgba(0, 0, 0, 0.6)" class="subtitle  ml-2" cols="12" sm="6" md="4" lg="2">
                  Domains :
                </v-col>
                <v-col>
                  <v-chip class="caption mt-1 mr-1" :color="colorVchip" v-for="(keyW,index) in item.metaData.domains.split(',') " :key="index"> {{keyW}}</v-chip>
                </v-col>
              </v-row>

              <v-row align="center" v-if="item.metaData.formats">
                <v-col style="color:rgba(0, 0, 0, 0.6)" class="subtitle  ml-2" cols="12" sm="6" md="4" lg="2">
                  Formats :
                </v-col>
                <v-col>
                  <v-chip class="caption mt-1 mr-1" :color="colorVchip" v-for="(keyW,index) in item.metaData.formats.split(',') " :key="index"> {{keyW}}</v-chip>
                </v-col>
              </v-row>
              <v-row align="center" v-if="item.metaData.keywords">
                <v-col style="color:rgba(0, 0, 0, 0.6)" class="subtitle ml-2" cols="12" sm="6" md="4" lg="2">
                  Keyword :
                </v-col>
                <v-col>
                  <v-chip class="caption  mt-1 mr-1":color="colorVchip" v-for="(keyW,index) in item.metaData.keywords.split(',') " :key="index"> {{keyW}}</v-chip>
                </v-col>
              </v-row>

              <v-card-actions>
                <a style="color:white" :href="service+'/product/v1_0/download/?productName='+ item.name" target="_blank">
                  <v-btn style="color:white" elevation="0" :color="colorPrimary">Download ( {{bytesToSize(item.size) }} )
                    <v-icon right dark>get_app</v-icon>
                  </v-btn>
                </a>
                <v-btn elevation="0" :color="colorPrimary" :absolute="true " :right="true" dark @click.stop="item.dialog = true">
                  read me
                </v-btn>
              </v-card-actions>

            </v-card>
          </v-col>
        </v-row>
      </template>

    </v-data-iterator>
    <v-snackbar v-if="copyStat" v-model="snackbar" color="success" :timeout="1000" top="top"> Read me has been copied to your clipboard</v-snackbar>
    <v-snackbar v-else v-model="snackbar" color="error" :timeout="1000" top="top"> Error is attempting during the copy of the url </v-snackbar>
 

 </v-container>
</v-app>
</template>

<script>
export default {
  name: "resif-product-download",
  data: () => {
    return {

      dialog: false,
      snackbar: false,
      copyStat: false,
      productArray: [],
      items: [],
      search: "",
      select: "",
      itemsPerPageArray: [4, 8, 12],
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'name',
      colorPrimary:"#006e7f",
      colorVchip:"#FED381",
      keys: ['Name', 'Size'],
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


    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys() {
      
      return this.keys.filter(key => key !== `metaData.title`)
    },

    /*    filteredKeys() {
    
         if (this.search) {

           return this.productArray.filter(product => {
             
             return JSON.stringify(product).toLowerCase().includes(this.search.toLowerCase())
           })
         } else if (this.select) {
           
           return this.productArray.sort((productA, productB) => { return productA.name - productB.name })
         } else {
           return this.productArray
         }
       } */
  },
  created() {
    this.axios
      .get(this.service+"/product/v1_0/getproducts")
      .then(response => {
        this.items = response.data
        this.items.forEach((i) => {
          this.$set(i, 'dialog', false)
        })
        

      })

  },
  methods: {
    download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    bytesToSize(bytes) {
      let sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
      if (bytes == 0) return '0 Byte';
      let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    sortDescTrue() {
      this.sortDesc = true
    },
    sortDescFalse() {
      this.sortDesc = false
    },
    handleSuccess(e) {
      
      this.copyStat = true
      this.snackbar = true
    },
    handleError(e) {
      
      this.copyStat = false
    },
  }
}
</script>

<style scoped>
a:link, a:visited {
 
  color: white;
  padding: 14px 25px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
}

</style>
