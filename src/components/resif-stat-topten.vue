<template>
<span>
<span v-if="loading">
    <v-progress-linear indeterminate height="2"></v-progress-linear>
    <span class="overline">Loading ...</span>
</span>
</span>
</template>

<script>
const prettyBytes = require('pretty-bytes');
export default {

  name: "resif-stat-topten",
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

    statService() {
      return this.service+"/stat/v1_0/topten"
    }
   },
   props: {
    label: {
      Type: String,
      default: ""
    },

    type: {
      Type: String,
      default: ""
    },

    period: {
      Type: String,
      default: ""
    },

    format: {
      Type: String,
      default: ""
    },

    random: {
      Type: String,
      default: ""
    }

  },
  watch: {
    
    format:function() {
        this.reload()
    },
     random:function() {
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
        serie: null,
        loading:false,
        chartOptions: {


chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: this.label
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.hry}</b>'
    },
    accessibility: {
        point: {
        }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>'
            }
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: []
    }]


        }
    }
  },
  
  created() {
    this.reload();
  },
  methods: {

       formatHRBytes: function (value) {
    return prettyBytes(value)
  },

  adapt: function(values) {
    for (let i=0; i < values.length; i++) {
      values[i].name= values[i].label;
      values[i].y = values[i].value;
      values[i].hry = this.formatHRBytes(values[i].value);
    }
    return values;
  },

  reload: function() {
      this.loading = true

          this.axios.get(this.statService+"?format="+this.format+"&period="+this.period+"&type="+this.type).then(response => {
            let result = this.adapt(response.data);

 let series =  [{
                name: 'Volume',
                data: result
            }];
      this.serie = result;
      this.chartOptions.series = series;

      }).finally(() => {this.loading=false;})
  }
      
  }
};
</script>
