<template>
<div>
 <v-radio-group
      v-model="media"
      row
    >
      <v-radio
        label="Dataselect"
        value="dataselect"
      ></v-radio>
      <v-radio
        label="Seedlink"
        value="seedlink"
      ></v-radio>
    </v-radio-group>
<span v-if="loading">
    <v-progress-linear indeterminate height="2"></v-progress-linear>
    <span class="overline">Loading ...</span>
</span>
<span v-else>

<div v-if="min && max" class="caption">
    Selected period: {{min | toDate}} - {{max | toDate}}
</div>
<div v-if="total" class="caption">
    Volume: {{total | toHRBytes}}
</div>
<div v-if="total" class="caption">
    Sources of downloads during this period
    <div>
  </div>
</div>
</span>
</div>

</template>

<script>
const prettyBytes = require('pretty-bytes');
export default {

  name: "resif-stat-timeserie",
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
    }
   },
   props: {

    url: {
      Type: String,
      default: ""
    },

    
  },
  watch: {
    url: function() {
      this.reload()
    },
    media:function() {
        this.reload()
    }
  },

  filters: {
  toDate: function (value) {
    let aux = new Date(value)
    return aux.toISOString().split('T')[0]
  },
  toHRBytes: function (value) {
    return prettyBytes(value)
  }
},

  data() {
    return {

mapChartOptions: {
  chart: {
    map: worldMap
  },
  title: {
    text: ''
  },

  tooltip: {
        formatter: function () {
            return 'Volume: '+prettyBytes(this.point.value);
        }
    },
  
  mapNavigation: {
    enabled: true,
    buttonOptions: {
      alignTo: 'spacingBox'
    }
  },
  colorAxis: {
    min: 0
  },
  series: [
    {
      name: 'Volume',
      states: {
        hover: {
          color: '#BADA55'
        }
      },
      dataLabels: {
        enabled: false,
        format: '{point.name}'
      },
      allAreas: false,
      data: [
        
      ]
    }
  ]
},

        serie: null,
        min: null,
        max: null,
        loading:false,
        allData : null,
        media:"dataselect",
        total: null,
        chartOptions: {
            
rangeSelector: {
    inputEnabled:false,
    buttons: [ {
        type: 'month',
        count: 3,
        text: '3m'
    }, {
        type: 'year',
        count: 1,
        text: '1y'
    }, {
        type: 'all',
        text: 'All'
    }]
},



tooltip: {
        formatter: function () {
            return 'Volume: '+prettyBytes(this.y);
        }
    },


      chart: {
                zoomType: 'x'
            },
      
      yAxis: {
                title: {
                    text: 'Volume'
                },

                labels: {
    formatter: function() {
      return prettyBytes(this.value);
    }
  }

            },
            legend: {
                enabled: false
            },


        xAxis: {
                type: 'datetime',
                events: {
                    setExtremes:  (e) => {
                  this.extremeChange(e)
                }
                },
                title: {
            text: 'Volume'
        }
            },

            title: {
                text: 'Global volume'
            },

        series: [{
          data: [[]]
        }]
      }
      
    }
  },
  
  mounted() {
    this.displaySerie();
    this.reload();
  },
  methods: {

       formatHRBytes: function (value) {
    return prettyBytes(value)
  },
      
      extremeChange(e) {
          this.min = e.min
          this.max = e.max
          this.computeTotal();
          this.computeMapData();
      },
    
    computeTotal() {
        if (!this.serie) {
            this.total = null
        }
        if (!this.min) {
            this.total = null
        }
        if (!this.max) {
            this.total = null
        }
        let result = 0
        for (let i =0; i< this.serie.length; i++) {
            let item = this.serie[i]
            if ((item[0]>= this.min) && (item[0]<= this.max)) {
                result = result+ item[1]
            }
        }
        this.total = result;
    },

    computeMapData() {
        let mapSerie = []
        if (!this.serie) {
            this.mapChartOptions.series = mapSerie;
        }
        else if (!this.min) {
            this.mapChartOptions.series = mapSerie;
        }
        else if (!this.max) {
            this.mapChartOptions.series = mapSerie;
        } else {

let aux = {};
       for (let i = 0;i < this.allData.length;i++) {
           let currentTime = new Date(this.allData[i].time).getTime()
           if ((currentTime >= this.min) && (currentTime <= this.max)) {
            if (aux[this.allData[i].country.toLowerCase()]) {
                aux[this.allData[i].country.toLowerCase()] = aux[this.allData[i].country.toLowerCase()]+ Number(this.allData[i].bytes) 
            } else {
                aux[this.allData[i].country.toLowerCase()] = Number(this.allData[i].bytes) 
            }
           }
       }
       let result = [];

       for (const [key, value] of Object.entries(aux)) {
            result.push([key, value])
        }

        let series =  [{
                name: 'Volume',
                 states: {
        hover: {
          color: '#BADA55'
        }
      },
      dataLabels: {
        enabled: false,
        format: '{point.name}'
      },
      allAreas: true,
                data: result
            }];
     
      this.mapChartOptions.series = series;
        }
        
      
    },

    computeTimeSerieData() {
       this.min = null;
       this.max = null;
       let aux = {};
       for (let i = 0;i < this.allData.length;i++) {
           if (aux[this.allData[i].time]) {
               aux[this.allData[i].time] = aux[this.allData[i].time]+ Number(this.allData[i].bytes) 
           } else {
               aux[this.allData[i].time] = Number(this.allData[i].bytes) 
           }
       }
       let result = [];

       for (const [key, value] of Object.entries(aux)) {
            result.push([new Date(key).getTime(), value])
        }

        let series =  [{
                name: 'Volume',
                data: result
            }];
      this.serie = result;
      this.chartOptions.series = series;
      this.min = new Date(this.allData[0].time).getTime();
      this.max = new Date(this.allData[this.allData.length-1].time).getTime();
      this.computeTotal()
      this.computeMapData();

    },
    
    displaySerie() {
    //   let data = []
     
    //     let serie = this.generateSerie();
        

    //      let series =  [{
    //             data: serie
    //         }];
    //   this.chartOptions.series = series;
    },

      reload() {
          this.loading = true
          if ((!this.url) || (this.url.length == 0)) {
              return
          }

          this.axios.get(this.url+"&media="+this.media).then(response => {
          if (!response.data.datasources) {
              return []
          } else {   
            this.allData = response.data.datasources
          }
          this.computeTimeSerieData()
      }).finally(() => {this.loading=false;})


      }
   
  }
};
</script>
