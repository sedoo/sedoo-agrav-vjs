<template>
<v-app>
 <resifStationSelector :visible="stationSelectionDialog" @select="stationSelection"  @cancel="cancelStationSelection" :network="selectedNetwork.length> 0 ? selectedNetwork[0]: ''" :locations="selectedLocationAsString"  :currentselection="selectedStation" :stations="completeFilteredStation" :channels="selectedChannelAsString"></resifStationSelector>
  <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="headline">Usage</v-card-title>

        <v-card-text>
          <resif-wfcatalogue-usage></resif-wfcatalogue-usage>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

 <v-snackbar v-model="notifier" top :color="notifierColor" :timeout="timeout">
      {{ notifierMessage }}
      <v-btn dark text @click="notifier = false">Close</v-btn>
    </v-snackbar>

  <v-container fluid>
     <v-alert  :tile="false"  :sticky="true" class="pa-0 ma-0">
      <v-row>
        <v-col :class="{'pa-0': $vuetify.breakpoint.xs} " class="text-center" cols="12" lg="12" xl="12">
          <v-alert outlined color=" blue" style="word-break: break-all;" class="ma-0 title text-center text-wrap" :class="{'subtitle-2': $vuetify.breakpoint.xs}">
            <a v-if="!$vuetify.breakpoint.xs" target="_blank" :href="buildedUrl"><span v-if="!isValid" style="color:#ff5252">{{buildedUrl}}</span><span v-else>{{buildedUrl}}</span></a> 
            <a v-else :href="buildedUrl" target="_blank"> GO TO URL</a>
            <v-btn v-if="!isValid" title="Your request is not valid. You must indicate both start date and end date" text class="px-2"
    small color="error"
    
>
 <v-icon >
        mdi-alert
      </v-icon>
</v-btn>
            <v-btn title="Copy to clipboard" text class="px-2"
    v-clipboard="buildedUrl" small color="success"
    @success="displaySuccess('The url has been copied ti the clipboard.')"
>
 <v-icon >
        mdi-content-copy
      </v-icon>
</v-btn>
          </v-alert>
          </v-col>
          <v-col :class="{'pa-0': $vuetify.breakpoint.xs}" cols="6" lg="6" xl="6" v-show="!$vuetify.breakpoint.xs">
          
            <v-btn outlined style="color:white"  elevation="0" class="ml-2" color="blue" @click="resetParameters">Reset</v-btn>
          <v-btn outlined v-if="!$vuetify.breakpoint.xs" :elevation="0" class="white--text font-regular ml-2"  color="blue" @click.stop="dialog = true">Usage</v-btn>
          </v-col>
        </v-row>
      </v-alert>
  </v-container >
  <v-container fluid>
      <v-row>
<v-col cols="12" lg="3" md="6">

<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>HIERACHICAL SELECTION</v-toolbar-title>
      <v-spacer></v-spacer>

 <v-tooltip top>
      <template v-slot:activator="{ on}">
        <v-icon
          color="white"
          v-on="on"
        >
          help_outline
        </v-icon>
      </template>
      <span>These four criteria are dynamically linked</span>
    </v-tooltip>

    
    </v-toolbar>
          

          <v-col cols="12"  v-if="this.filteredTree.length==0">
            <v-alert v-if="loading"
      dense
      border="left"
      type="info"
    >Loading...</v-alert>
             <v-alert
      dense
      border="left"
      type="warning" v-else
    >Your selection is inconsistent.</v-alert>
          </v-col>

          <v-col cols="12" >

            <v-combobox prepend-icon="share" label="Network" v-model="selectedNetwork" :items="filteredNetwork" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedNetwork" @change="computeUrl">
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Network code .Wildcards (? or *) are authorized.Example: FR, R*</span>
              </v-tooltip>
            </v-combobox>


          </v-col>
          <v-col cols="12" >
            <v-combobox prepend-icon="fa-broadcast-tower" label="Station" v-model="selectedStation" :items="filteredStation" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedStation" @change="computeUrl">
               <section slot="append" >
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Station code.Wildcards (? or *) are authorized.Example: CH?F, A*</span>
              </v-tooltip>
              </section>

                <section slot="append-outer" >
                <v-tooltip top>
                <template v-slot:activator="{ on }">
             <v-btn  v-on="on" icon @click.prevent="openStationSelectionDialog">
                    <v-icon color="primary" :disabled="selectedNetwork.length != 1 || filteredStation.length==0">fa-map-marked</i></v-icon>
                  </v-btn>
               
                </template>
                <span>You can select your stations on a map if you have selected only one network and if your current selection is consistent</span>
              </v-tooltip>
              </section>


            </v-combobox>
          </v-col>
          <v-col cols="12" >
            <v-combobox prepend-icon="fa-map-marked" label="Location" v-model="selectedLocation" :items="filteredLocation" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedLocation()" @change="computeUrl">
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Location code.Wildcards (? or *) are authorized.</span>
              </v-tooltip>
            </v-combobox>
            <v-combobox prepend-icon="fa-wave-square" label="Channel" v-model="selectedChannel" :items="filteredChannel" autocomplete chips tags select multiple clearable deletable-chips @input="upperCaseSelectedChannel()" @change="computeUrl">
              <v-tooltip slot="append" top>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon color="grey lighten-1">help_outline</i></v-icon>
                  </v-btn>
                </template>
                <span>Channel code .Wildcards (? or *) are authorized.Example: BH?</span>
              </v-tooltip>
            </v-combobox>
          </v-col>
       </v-col>

<v-col cols="12" lg="3" md="6">
<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>TEMPORAL SELECTION</v-toolbar-title>
</v-toolbar>
 
<v-col cols="12" >
<span class="required" v-if="!temporal_constraints.starttime">
 <v-datetime-picker
                  v-model="temporal_constraints.starttime"
                  time-format="HH:mm:ss"
                  label="Start date (required)"
                    :text-field-props="textFieldProps"
                  ref="starttime"
                  :clearable="true"
                  
                ></v-datetime-picker>
  </span>
<span v-else>
<v-datetime-picker
                  v-model="temporal_constraints.starttime"
                  time-format="HH:mm:ss"
                  label="Start date (required)"
                    :text-field-props="textFieldProps"
                  ref="endtime"
                  :clearable="true"
                  
                ></v-datetime-picker>
</span>

<span class="required" v-if="!temporal_constraints.endtime">
  <v-datetime-picker 
                  v-model="temporal_constraints.endtime"
                  time-format="HH:mm:ss"
                  label="End date (required)"
                    :text-field-props="textFieldProps"
                  ref="endtime"
                  :clearable="true"
                  required
                ></v-datetime-picker>
   
</span>
<span v-else>
    <v-datetime-picker
                  
                  v-model="temporal_constraints.endtime"
                  time-format="HH:mm:ss"
                  label="End date"
                    :text-field-props="textFieldProps"
                  ref="endtime"
                  :clearable="true"
                  required
                ></v-datetime-picker>

  </span>
   </v-col>



    </v-col>
        
         <v-col cols="12" lg="3" md="6">
<v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>REQUEST OPTIONS</v-toolbar-title>
</v-toolbar>
 
<v-col cols="12" class="request-options">

<v-checkbox @change="computeUrl" v-model="request_options.csegments" label="Continuous Segments" color="indigo" persistent-hint hint="Include continuous segments"></v-checkbox>
<v-checkbox @change="computeUrl" v-model="request_options.longestonly" label="Longest Only" color="indigo" persistent-hint hint="Limit to single continuous segment that is the longest"></v-checkbox>
<v-select @change="computeUrl" v-model="request_options.format" :items="['json']" :menu-props="{ maxHeight: '400' }" label="Format" multiple hint="Response" persistent-hint></v-select>
<v-select @change="computeUrl" v-model="request_options.granularity" :items="['day']" :menu-props="{ maxHeight: '400' }" label="Granularity" multiple hint="Granularity of metrics" persistent-hint></v-select>
<v-select @change="computeUrl" v-model="request_options.include" :items="['default','sample','header',]" :menu-props="{ maxHeight: '400' }" label="Include" multiple hint="Level of detail" persistent-hint></v-select>
<v-text-field @input="computeUrl"  v-model="request_options.minimumlength" label="Minimum Length" type="number" persistent-hint hint="Limit to continuous segment longer than this length"></v-text-field>

   </v-col>



         </v-col>

<v-col cols="12" lg="3" md="6">
  
  <v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>RECORD OPTIONS</v-toolbar-title>
</v-toolbar>
      <v-col cols="12" class="record-options" >
        <v-select @change="computeUrl" v-model="record_options.encoding" :items="['encoding']" :menu-props="{ maxHeight: '400' }" label="Encoding" multiple hint="Waveform data encoding" persistent-hint></v-select>
        <v-text-field  @input="computeUrl" v-model="record_options.num_records" single-line chips label="Number of Records" type="number" persistent-hint hint="Number of records in document"></v-text-field>
        <v-select @change="computeUrl" v-model="record_options.quality" :items="['D','R','Q','M']" :menu-props="{ maxHeight: '400' }" label="Quality" multiple hint="SEED Quality code" persistent-hint></v-select>
        <v-text-field @input="computeUrl" v-model="record_options.record_length" label="Record Length" type="number" persistent-hint hint="Record length"></v-text-field>
        <v-text-field @input="computeUrl" v-model="record_options.sample_rate" label="Sample Rate" type="number" persistent-hint hint="Number of samples per second"></v-text-field>
      </v-col>
  

        </v-col>

        </v-row>

  
 <v-row>
<v-col cols="12"  >


  
  <v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>SAMPLE METRICS OPTIONS</v-toolbar-title>
</v-toolbar>
      <v-col cols="12" class="sample-metric-options" >
           <v-row>
              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Max Gap</span>
                <v-row  v-for="(max_gap, index) in sample_metric_options.max_gap" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="max_gap.filter" :items="filterValue" label="Operator" @change="computeUrl" ></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="max_gap.value" label="Value" @input="computeUrl"  persistent-hint hint="Maximum gap length in seconds" ></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.max_gap.length-1)" @click="sample_metric_options.max_gap.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.max_gap.length>1" @click="sample_metric_options.max_gap.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>
           
              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Max Overlap</span>
                <v-row  v-for="(max_overlap, index) in sample_metric_options.max_overlap" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="max_overlap.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="max_overlap.value" label="Value" @input="computeUrl" persistent-hint hint="Maximum overlap length in seconds"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.max_overlap.length-1)" @click="sample_metric_options.max_overlap.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.max_overlap.length>1" @click="sample_metric_options.max_overlap.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>
            
              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Number of Gaps</span>
                <v-row  v-for="(num_gaps, index) in sample_metric_options.num_gaps" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="num_gaps.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="num_gaps.value" label="Value" @input="computeUrl"  persistent-hint hint="Number of gaps"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.num_gaps.length-1)" @click="sample_metric_options.num_gaps.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.num_gaps.length>1" @click="sample_metric_options.num_gaps.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Number of Overlaps</span>
                <v-row  v-for="(num_overlaps, index) in sample_metric_options.num_overlaps" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="num_overlaps.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="num_overlaps.value" label="Value" @input="computeUrl"  persistent-hint hint="Number of overlaps"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.num_overlaps.length-1)" @click="sample_metric_options.num_overlaps.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.num_overlaps.length>1" @click="sample_metric_options.num_overlaps.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>
            
              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Number of Samples</span>
                <v-row  v-for="(num_samples, index) in sample_metric_options.num_samples" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="num_samples.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="num_samples.value" label="Value" @input="computeUrl"  persistent-hint hint="Number of samples"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.num_samples.length-1)" @click="sample_metric_options.num_samples.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.num_samples.length>1" @click="sample_metric_options.num_samples.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Percent Availability</span>
                <v-row  v-for="(percent_availability, index) in sample_metric_options.percent_availability" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="percent_availability.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="percent_availability.value" label="Value" @input="computeUrl"  persistent-hint hint="Percentage of available data"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.percent_availability.length-1)" @click="sample_metric_options.percent_availability.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.percent_availability.length>1" @click="sample_metric_options.percent_availability.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sample Minimum</span>
                <v-row  v-for="(sample_min, index) in sample_metric_options.sample_min" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_min.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_min.value" label="Value" @input="computeUrl"  persistent-hint hint="Minimum sample value"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_min.length-1)" @click="sample_metric_options.sample_min.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_min.length>1" @click="sample_metric_options.sample_min.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sample Maximum</span>
                <v-row  v-for="(sample_max, index) in sample_metric_options.sample_max" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_max.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_max.value" label="Value" @input="computeUrl"  persistent-hint hint="Maximum sample value"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_max.length-1)" @click="sample_metric_options.sample_max.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_max.length>1" @click="sample_metric_options.sample_max.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Mean Sample</span>
                <v-row  v-for="(sample_mean, index) in sample_metric_options.sample_mean" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_mean.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_mean.value" label="Value" @input="computeUrl"  persistent-hint hint="Mean Sample value"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_mean.length-1)" @click="sample_metric_options.sample_mean.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_mean.length>1" @click="sample_metric_options.sample_mean.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sample Rms</span>
                <v-row  v-for="(sample_rms, index) in sample_metric_options.sample_rms" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_rms.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_rms.value" label="Value" @input="computeUrl"  persistent-hint hint="Quadratic mean of samples"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_rms.length-1)" @click="sample_metric_options.sample_rms.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_rms.length>1" @click="sample_metric_options.sample_rms.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Standard deviation of samples</span>
                <v-row  v-for="(sample_stdev, index) in sample_metric_options.sample_stdev" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_stdev.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_stdev.value" label="Value" @input="computeUrl"  persistent-hint hint="Standard deviation of samples"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_stdev.length-1)" @click="sample_metric_options.sample_stdev.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_stdev.length>1" @click="sample_metric_options.sample_stdev.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sample Lower Quartile</span>
                <v-row  v-for="(sample_lower_quartile, index) in sample_metric_options.sample_lower_quartile" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_lower_quartile.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_lower_quartile.value" label="Value" @input="computeUrl"  persistent-hint hint="25th percentile of samples"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_lower_quartile.length-1)" @click="sample_metric_options.sample_lower_quartile.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_lower_quartile.length>1" @click="sample_metric_options.sample_lower_quartile.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sample Median</span>
                <v-row  v-for="(sample_median, index) in sample_metric_options.sample_median" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_median.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_median.value" label="Value" @input="computeUrl"  persistent-hint hint="50th percentile of samples"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_median.length-1)" @click="sample_metric_options.sample_median.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_median.length>1" @click="sample_metric_options.sample_median.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sample Upper Quartile</span>
                <v-row  v-for="(sample_upper_quartile, index) in sample_metric_options.sample_upper_quartile" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sample_upper_quartile.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sample_upper_quartile.value" label="Value" @input="computeUrl"  persistent-hint hint="75th percentile of samples"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sample_upper_quartile.length-1)" @click="sample_metric_options.sample_upper_quartile.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sample_upper_quartile.length>1" @click="sample_metric_options.sample_upper_quartile.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sum of Gaps</span>
                <v-row  v-for="(sum_gaps, index) in sample_metric_options.sum_gaps" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sum_gaps.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sum_gaps.value" label="Value" @input="computeUrl"  persistent-hint hint="Sum of data gaps in seconds"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sum_gaps.length-1)" @click="sample_metric_options.sum_gaps.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sum_gaps.length>1" @click="sample_metric_options.sum_gaps.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12"  md="3" class="no-padding-y">
                 <span class="text-overline">Sum of Overlaps</span>
                <v-row  v-for="(sum_overlaps, index) in sample_metric_options.sum_overlaps" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="sum_overlaps.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="sum_overlaps.value" label="Value" @input="computeUrl"  persistent-hint hint="Sum of data overlaps in seconds"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (sample_metric_options.sum_overlaps.length-1)" @click="sample_metric_options.sum_overlaps.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="sample_metric_options.sum_overlaps.length>1" @click="sample_metric_options.sum_overlaps.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col>

            </v-row>


      </v-col>
</v-col>
  
</v-row>



 <v-row>
<v-col cols="12"  >


  
  <v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>HEADER FLAG OPTIONS</v-toolbar-title>
</v-toolbar>
      <v-col cols="12" class="sample-metric-options" >
           <v-row>


             <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Amplifier Saturation</span>
                <v-row  v-for="(amplifier_saturation, index) in header_flag_options.amplifier_saturation" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="amplifier_saturation.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="amplifier_saturation.value" label="Value" @input="computeUrl" persistent-hint hint="Data with quality flags bit 0 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.amplifier_saturation.length-1)" @click="header_flag_options.amplifier_saturation.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.amplifier_saturation.length>1" @click="header_flag_options.amplifier_saturation.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Calibration Signal</span>
                <v-row  v-for="(calibration_signal, index) in header_flag_options.calibration_signal" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="calibration_signal.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="calibration_signal.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with activity flags bit 0 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.calibration_signal.length-1)" @click="header_flag_options.calibration_signal.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.calibration_signal.length>1" @click="header_flag_options.calibration_signal.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Clock Locked</span>
                <v-row  v-for="(clock_locked, index) in header_flag_options.clock_locked" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="clock_locked.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="clock_locked.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with io-and-clock flags bit 5 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.clock_locked.length-1)" @click="header_flag_options.clock_locked.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.clock_locked.length>1" @click="header_flag_options.clock_locked.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Digital Filter Charging</span>
                <v-row  v-for="(digital_filter_charging, index) in header_flag_options.digital_filter_charging" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="digital_filter_charging.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="digital_filter_charging.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with data quality flags bit 6 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.digital_filter_charging.length-1)" @click="header_flag_options.digital_filter_charging.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.digital_filter_charging.length>1" @click="header_flag_options.digital_filter_charging.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Digitizer Clipping</span>
                <v-row  v-for="(digitizer_clipping, index) in header_flag_options.digitizer_clipping" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="digitizer_clipping.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="digitizer_clipping.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with data quality flags bit 1 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.digitizer_clipping.length-1)" @click="header_flag_options.digitizer_clipping.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.digitizer_clipping.length>1" @click="header_flag_options.digitizer_clipping.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Start Time Series</span>
                <v-row  v-for="(start_time_series, index) in header_flag_options.start_time_series" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="start_time_series.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="start_time_series.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with io-and-clock flags bit 3 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.start_time_series.length-1)" @click="header_flag_options.start_time_series.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.start_time_series.length>1" @click="header_flag_options.start_time_series.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">End Time Series</span>
                <v-row  v-for="(end_time_series, index) in header_flag_options.end_time_series" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="end_time_series.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="end_time_series.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with io-and-clock flags bit 4 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.end_time_series.length-1)" @click="header_flag_options.end_time_series.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.end_time_series.length>1" @click="header_flag_options.end_time_series.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Event Begin</span>
                <v-row  v-for="(event_begin, index) in header_flag_options.event_begin" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="event_begin.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="event_begin.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with activity flags bit 2 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.event_begin.length-1)" @click="header_flag_options.event_begin.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.event_begin.length>1" @click="header_flag_options.event_begin.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Event End</span>
                <v-row  v-for="(event_end, index) in header_flag_options.event_end" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="event_end.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="event_end.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with activity flags bit 3 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.event_end.length-1)" @click="header_flag_options.event_end.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.event_end.length>1" @click="header_flag_options.event_end.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Event in Progress</span>
                <v-row  v-for="(event_in_progress, index) in header_flag_options.event_in_progress" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="event_in_progress.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="event_in_progress.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with activity flags bit 6 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.event_in_progress.length-1)" @click="header_flag_options.event_in_progress.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.event_in_progress.length>1" @click="header_flag_options.event_in_progress.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

            <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Glitches</span>
                <v-row  v-for="(glitches, index) in header_flag_options.glitches" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="glitches.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="glitches.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with data quality flags bit 3 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.glitches.length-1)" @click="header_flag_options.glitches.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.glitches.length>1" @click="header_flag_options.glitches.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>


              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Long Record Read</span>
                <v-row  v-for="(long_record_read, index) in header_flag_options.long_record_read" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="long_record_read.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="long_record_read.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with io-and-clock flags bit 1 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.long_record_read.length-1)" @click="header_flag_options.long_record_read.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.long_record_read.length>1" @click="header_flag_options.long_record_read.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Missing Padded Data</span>
                <v-row  v-for="(missing_padded_data, index) in header_flag_options.missing_padded_data" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="missing_padded_data.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="missing_padded_data.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with data quality flags bit 4 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.missing_padded_data.length-1)" @click="header_flag_options.missing_padded_data.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.missing_padded_data.length>1" @click="header_flag_options.missing_padded_data.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Positive Leap</span>
                <v-row  v-for="(positive_leap, index) in header_flag_options.positive_leap" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="positive_leap.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="positive_leap.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with activity flags bit 4 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.positive_leap.length-1)" @click="header_flag_options.positive_leap.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.positive_leap.length>1" @click="header_flag_options.positive_leap.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>


                <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Short Record Read</span>
                <v-row  v-for="(short_record_read, index) in header_flag_options.short_record_read" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="short_record_read.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="short_record_read.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with io-and-clock flags bit 2 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.short_record_read.length-1)" @click="header_flag_options.short_record_read.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.short_record_read.length>1" @click="header_flag_options.short_record_read.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Spikes</span>
                <v-row  v-for="(spikes, index) in header_flag_options.spikes" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="spikes.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="spikes.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with data quality flags bit 2 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.spikes.length-1)" @click="header_flag_options.spikes.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.spikes.length>1" @click="header_flag_options.spikes.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Station Volume</span>
                <v-row  v-for="(station_volume, index) in header_flag_options.station_volume" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="station_volume.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="station_volume.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with io-and-clock flags bit 0 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.station_volume.length-1)" @click="header_flag_options.station_volume.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.station_volume.length>1" @click="header_flag_options.station_volume.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Suspect Time Tag</span>
                <v-row  v-for="(suspect_time_tag, index) in header_flag_options.suspect_time_tag" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="suspect_time_tag.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="suspect_time_tag.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with data quality flags bit 7 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.suspect_time_tag.length-1)" @click="header_flag_options.suspect_time_tag.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.suspect_time_tag.length>1" @click="header_flag_options.suspect_time_tag.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Telemetry Sync Error</span>
                <v-row  v-for="(telemetry_sync_error, index) in header_flag_options.telemetry_sync_error" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="telemetry_sync_error.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="telemetry_sync_error.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with data quality flags bit 5 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.telemetry_sync_error.length-1)" @click="header_flag_options.telemetry_sync_error.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.telemetry_sync_error.length>1" @click="header_flag_options.telemetry_sync_error.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>
           
              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Time Correction applied</span>
                <v-row  v-for="(time_correction_applied, index) in header_flag_options.time_correction_applied" :key="index" align="center" >
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="time_correction_applied.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="time_correction_applied.value" label="Value" @input="computeUrl"  persistent-hint hint="Data with activity flags bit 1 set"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (header_flag_options.time_correction_applied.length-1)" @click="header_flag_options.time_correction_applied.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="header_flag_options.time_correction_applied.length>1" @click="header_flag_options.time_correction_applied.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                  
                </v-row>
                <v-divider></v-divider>
              </v-col>

             

            </v-row>


      </v-col>
</v-col>
  
</v-row>

 <v-row>
<v-col cols="12"  >


  
  <v-toolbar dense flat color="#e36629" class="white--text">
      <v-toolbar-title>TIMING QUALITY OPTIONS</v-toolbar-title>
</v-toolbar>
      <v-col cols="12" class="sample-metric-options" >
           <v-row>


             <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Timing Correction</span>
                <v-row  v-for="(timing_correction, index) in timing_quality_options.timing_correction" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="timing_correction.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="timing_correction.value" label="Value" @input="computeUrl" persistent-hint hint="Data with header field 16 to non-zero"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (timing_quality_options.timing_correction.length-1)" @click="timing_quality_options.timing_correction.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="timing_quality_options.timing_correction.length>1" @click="timing_quality_options.timing_correction.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Timing Quality Maximum</span>
                <v-row  v-for="(timing_quality_max, index) in timing_quality_options.timing_quality_max" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="timing_quality_max.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="timing_quality_max.value" label="Value" @input="computeUrl" persistent-hint hint="Maximum timing quality value"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (timing_quality_options.timing_quality_max.length-1)" @click="timing_quality_options.timing_quality_max.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="timing_quality_options.timing_quality_max.length>1" @click="timing_quality_options.timing_quality_max.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Timing Quality Minium</span>
                <v-row  v-for="(timing_quality_min, index) in timing_quality_options.timing_quality_min" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="timing_quality_min.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="timing_quality_min.value" label="Value" @input="computeUrl" persistent-hint hint="Minium timing quality value"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (timing_quality_options.timing_quality_min.length-1)" @click="timing_quality_options.timing_quality_min.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="timing_quality_options.timing_quality_min.length>1" @click="timing_quality_options.timing_quality_min.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Timing Quality Mean</span>
                <v-row  v-for="(timing_quality_mean, index) in timing_quality_options.timing_quality_mean" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="timing_quality_mean.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="timing_quality_mean.value" label="Value" @input="computeUrl" persistent-hint hint="Mean timing quality value"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (timing_quality_options.timing_quality_mean.length-1)" @click="timing_quality_options.timing_quality_mean.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="timing_quality_options.timing_quality_mean.length>1" @click="timing_quality_options.timing_quality_mean.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Timing Quality Median</span>
                <v-row  v-for="(timing_quality_median, index) in timing_quality_options.timing_quality_median" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="timing_quality_median.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="timing_quality_median.value" label="Value" @input="computeUrl" persistent-hint hint="50th percentile of timing quality values"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (timing_quality_options.timing_quality_median.length-1)" @click="timing_quality_options.timing_quality_median.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="timing_quality_options.timing_quality_median.length>1" @click="timing_quality_options.timing_quality_median.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

               <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Timing Quality Lower Quartile</span>
                <v-row  v-for="(timing_quality_lower_quartile, index) in timing_quality_options.timing_quality_lower_quartile" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="timing_quality_lower_quartile.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="timing_quality_lower_quartile.value" label="Value" @input="computeUrl" persistent-hint hint="25th percentile of timing quality values"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (timing_quality_options.timing_quality_lower_quartile.length-1)" @click="timing_quality_options.timing_quality_lower_quartile.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="timing_quality_options.timing_quality_lower_quartile.length>1" @click="timing_quality_options.timing_quality_lower_quartile.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

              <v-col cols="12" md="3"  class="no-padding-y">
                 <span class="text-overline">Timing Quality Upper Quartile</span>
                <v-row  v-for="(timing_quality_upper_quartile, index) in timing_quality_options.timing_quality_upper_quartile" :key="index" align="center" class="no-padding">
                  <v-col cols="4" class="no-padding">
                    <v-select v-model="timing_quality_upper_quartile.filter" :items="filterValue" label="Operator" @change="computeUrl"></v-select>
                  </v-col>
                  <v-col cols="6" class="no-padding">
                    <v-text-field v-model="timing_quality_upper_quartile.value" label="Value" @input="computeUrl" persistent-hint hint="75th percentile of timing quality values"></v-text-field>
                  </v-col justify="center">
                  <v-col cols="2" class="no-padding">
                   <v-btn class="mx-2" fab x-small color="primary" title="Add new item" v-if="index == (timing_quality_options.timing_quality_upper_quartile.length-1)" @click="timing_quality_options.timing_quality_upper_quartile.push({value:'', filter:''})"><v-icon dark> mdi-plus </v-icon> </v-btn>
                   <v-btn class="mx-2" fab x-small color="error" title="Delete" v-if="timing_quality_options.timing_quality_upper_quartile.length>1" @click="timing_quality_options.timing_quality_upper_quartile.splice(index, 1)"><v-icon dark> mdi-delete </v-icon> </v-btn>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
              </v-col> 

           </v-row>
      </v-col>
</v-col>
 </v-row>
       
       
       
       
 
  </v-container>
</v-app>
</template>

<script>
import resifWfcatalogueUsage from "./resif-usage-wfcatalogue"
import resifStationSelector from "../resif-station-selector"
import urlBuilderMixin from "../../mixin/urlBuilderMixin"

export default {
  name: "resif-wfcatalogue-url-builder",
  components: {
    resifWfcatalogueUsage, resifStationSelector
  },
  mixins: [urlBuilderMixin],
  created() {
    this.loadTree();
    this.computeUrl();
  },
  watch: {

    selectedStation: function() {
      this.computeUrl();
    },

    temporal_constraints_starttime: function() {
      this.computeUrl();
    },

    temporal_constraints_endtime: function() {
      this.computeUrl();
    }

    
  },
  data: () => ({
    buildedUrl:"",
    dialog: false,
     textFieldProps: {
        appendIcon: 'event'
      },
    timeout: 2000,
    notifier: false,
    notifierMessage: "",
    notifierColor: "success",
    snackbar: false,
    copyStat: false,
    panel: [],
    textPropsStartTime: {
      "prepend-icon": "far fa-calendar-alt",
      clearable: true,
      "persistent-hint": true,
      hint: "(Temporal Constraint) Start time for time window in UTC; ISO-8601 i.e. 2017-11-19T12:00:00Z"
    },
    textPropsEndTime: {
      "prepend-icon": "far fa-calendar-alt",
      clearable: true,
      "persistent-hint": true,
      hint: "(Temporal Constraint) End time for time window in UTC; ISO-8601 i.e. 2017-11-19T12:00:00Z"
    },
    timeProps: {
      "use-seconds": true
    },
    filterValue: [
      { text: 'none', value: '' },
      { text: 'Equal to', value: 'eq' },
      { text: 'Greater than', value: 'gt' },
      { text: 'Greater or equal to', value: 'ge' },
      { text: 'Less than', value: 'lt' },
      { text: 'Less or equal to', value: 'le' },
      { text: 'Not equal to', value: 'ne' }
    ],
    temporal_constraints: {
      starttime: "",
      endtime: ""
    },
    seed_identifiers: {
      network: "",
      station: "",
      location: "",
      channel: ""
    },
    request_options: {
      csegments: false,
      format: "",
      granularity: "",
      include: "",
      longestonly: "",
      minimumlength: ""
    },
    record_options: {
      encoding: "",
      num_records: "",
      quality: "",
      record_length: "",
      sample_rate: ""
    },
    sample_metric_options: {
      max_gap: [ {value: "", filter: ""} ],
      max_overlap: [{ value: "", filter: "" }],
      num_gaps: [{ value: "", filter: "" }],
      num_overlaps: [{ value: "", filter: "" }],
      num_samples: [{ value: "", filter: "" }],
      percent_availability: [{ value: "", filter: "" }],
      sample_max: [{ value: "", filter: "" }],
      sample_min: [{ value: "", filter: "" }],
      sample_mean: [{ value: "", filter: "" }],
      sample_rms: [{ value: "", filter: "" }],
      sample_stdev: [{ value: "", filter: "" }],
      sample_lower_quartile: [{ value: "", filter: "" }],
      sample_median: [{ value: "", filter: "" }],
      sample_upper_quartile: [{ value: "", filter: "" }],
      sum_gaps: [{ value: "", filter: "" }],
      sum_overlaps: [{ value: "", filter: "" }]
    },
    header_flag_options: {
      amplifier_saturation: [{ value: "", filter: "" }],
      calibration_signal: [{ value: "", filter: "" }],
      clock_locked: [{ value: "", filter: "" }],
      digital_filter_charging: [{ value: "", filter: "" }],
      digitizer_clipping: [{ value: "", filter: "" }],
      start_time_series: [{ value: "", filter: "" }],
      end_time_series: [{ value: "", filter: "" }],
      event_begin: [{ value: "", filter: "" }],
      event_end: [{ value: "", filter: "" }],
      event_in_progress: [{ value: "", filter: "" }],
      glitches: [{ value: "", filter: "" }],
      long_record_read: [{ value: "", filter: "" }],
      missing_padded_data: [{ value: "", filter: "" }],
      positive_leap: [{ value: "", filter: "" }],
      short_record_read: [{ value: "", filter: "" }],
      spikes: [{ value: "", filter: "" }],
      station_volume: [{ value: "", filter: "" }],
      suspect_time_tag: [{ value: "", filter: "" }],
      telemetry_sync_error: [{ value: "", filter: "" }],
      time_correction_applied: [{ value: "", filter: "" }]
    },
    timing_quality_options: {
      timing_correction: [{ value: "", filter: "" }],
      timing_quality_max: [{ value: "", filter: "" }],
      timing_quality_min: [{ value: "", filter: "" }],
      timing_quality_mean: [{ value: "", filter: "" }],
      timing_quality_median: [{ value: "", filter: "" }],
      timing_quality_lower_quartile: [{ value: "", filter: "" }],
      timing_quality_upper_quartile: [{ value: "", filter: "" }],
    },

  }),
  computed: {

    isValid() {
      if (!this.temporal_constraints.starttime) {
        return false
      }
      if (!this.temporal_constraints.endtime) {
        return false
      }
      return true
    },

    temporal_constraints_starttime() {
      return this.temporal_constraints.starttime;
    },

    temporal_constraints_endtime() {
      return this.temporal_constraints.endtime;
    },

     storeWrapper() {
      if (this.$store) {
        return this.$store
      } else {
        return this.store
      }
    },

    wsService() {
      if (this.storeWrapper) {
        return this.storeWrapper.getters.getResifWsService;
      }
      return null
    },
  },
  methods: {

    computeUrl: function() {
      let url = this.wsService+`/eidaws/wfcatalog/1/query?
      
       ${
         this.temporal_constraints.starttime != ""
           ? `&starttime=${this.formatDate(this.temporal_constraints.starttime)}`
           : ``
       }
         ${
         this.temporal_constraints.endtime != ""
           ? `&endtime=${this.formatDate(this.temporal_constraints.endtime)}`
           : ``
       }
        ${
         this.selectedNetwork.length > 0
           ? `&network=${this.selectedNetwork}`
           : ``
       }
       ${
         this.selectedStation.length > 0
           ? `&station=${this.selectedStation}`
           : ``
       }
       ${
         this.selectedLocation.length > 0
           ? `&location=${this.selectedLocation}`
           : ``
       }
       ${
         this.selectedChannel.length > 0
           ? `&channel=${this.selectedChannel}`
           : ``
       }
       ${
         this.request_options.csegments != ""
           ? `&csegments=${ this.request_options.csegments}`
           : ``
       } 
       ${
        this.request_options.format != ""
           ? `&format=${ this.request_options.format}`
           : ``
       } 
       ${
         this.request_options.granularity!= ""
           ? `&granularity=${ this.request_options.granularity}`
           : ``
       } 
       ${
        this.request_options.include != ""
           ? `&include=${ this.request_options.include}`
           : ``
       }
          ${
           this.request_options.minimumlength != ""
             ? `&minimumlength=${this.request_options.minimumlength}`
             : ``
         }
        ${
        this.request_options.longestonly != ""
           ? `&longestonly=${ this.request_options.longestonly}`
           : ``
       }
        ${
        this.record_options.encoding != ""
           ? `&encoding=${ this.record_options.encoding}`
           : ``
       }
        ${
        this.record_options.num_records != ""
           ? `&num_records=${ this.record_options.num_records}`
           : ``
       }
        ${
        this.record_options.quality != ""
           ? `&quality=${ this.record_options.quality}`
           : ``
       }
        ${
        this.record_options.record_length != ""
           ? `&record_length=${ this.record_options.record_length}`
           : ``
       }
        ${
        this.record_options.sample_rate != ""
           ? `&sample_rate=${ this.record_options.sample_rate}`
           : ``
       } 
       ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.max_gap)
           ? `${this.formatMultiCriterionFilter('max_gap',this.sample_metric_options.max_gap)}`
           : ``
       } 
       ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.max_overlap)
           ? `${this.formatMultiCriterionFilter('max_overlap',this.sample_metric_options.max_overlap)}`
           : ``
       } 
       ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.num_gaps)
           ? `${this.formatMultiCriterionFilter('num_gaps',this.sample_metric_options.num_gaps)}`
           : ``
       }
       ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.num_overlaps)
           ? `${this.formatMultiCriterionFilter('num_overlaps',this.sample_metric_options.num_overlaps)}`
           : ``
       } 
        ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.num_samples)
           ? `${this.formatMultiCriterionFilter('num_samples',this.sample_metric_options.num_samples)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.percent_availability)
           ? `${this.formatMultiCriterionFilter('percent_availability',this.sample_metric_options.percent_availability)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_min)
           ? `${this.formatMultiCriterionFilter('sample_min',this.sample_metric_options.sample_min)}`
           : ``
       } 

       ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_max)
           ? `${this.formatMultiCriterionFilter('sample_max',this.sample_metric_options.sample_max)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_mean)
           ? `${this.formatMultiCriterionFilter('sample_mean',this.sample_metric_options.sample_mean)}`
           : ``
       } 

         ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_rms)
           ? `${this.formatMultiCriterionFilter('sample_rms',this.sample_metric_options.sample_rms)}`
           : ``
       } 

      ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_stdev)
           ? `${this.formatMultiCriterionFilter('sample_stdev',this.sample_metric_options.sample_stdev)}`
           : ``
       } 

       ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_lower_quartile)
           ? `${this.formatMultiCriterionFilter('sample_lower_quartile',this.sample_metric_options.sample_lower_quartile)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_median)
           ? `${this.formatMultiCriterionFilter('sample_median',this.sample_metric_options.sample_median)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sample_upper_quartile)
           ? `${this.formatMultiCriterionFilter('sample_upper_quartile',this.sample_metric_options.sample_upper_quartile)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sum_gaps)
           ? `${this.formatMultiCriterionFilter('sum_gaps',this.sample_metric_options.sum_gaps)}`
           : ``
       } 

         ${
        !this.isEmptyMultiCriterion(this.sample_metric_options.sum_overlaps)
           ? `${this.formatMultiCriterionFilter('sum_overlaps',this.sample_metric_options.sum_overlaps)}`
           : ``
       } 


        ${
        !this.isEmptyMultiCriterion(this.header_flag_options.amplifier_saturation)
           ? `${this.formatMultiCriterionFilter('amplifier_saturation',this.header_flag_options.amplifier_saturation)}`
           : ``
       } 

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.calibration_signal)
           ? `${this.formatMultiCriterionFilter('calibration_signal',this.header_flag_options.calibration_signal)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.header_flag_options.clock_locked)
           ? `${this.formatMultiCriterionFilter('clock_locked',this.header_flag_options.clock_locked)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.header_flag_options.digital_filter_charging)
           ? `${this.formatMultiCriterionFilter('digital_filter_charging',this.header_flag_options.digital_filter_charging)}`
           : ``
       } 

        ${
        !this.isEmptyMultiCriterion(this.header_flag_options.digitizer_clipping)
           ? `${this.formatMultiCriterionFilter('digitizer_clipping',this.header_flag_options.digitizer_clipping)}`
           : ``
       } 

      ${
        !this.isEmptyMultiCriterion(this.header_flag_options.start_time_series)
           ? `${this.formatMultiCriterionFilter('start_time_series',this.header_flag_options.start_time_series)}`
           : ``
       } 
       
      ${
        !this.isEmptyMultiCriterion(this.header_flag_options.end_time_series)
           ? `${this.formatMultiCriterionFilter('end_time_series',this.header_flag_options.end_time_series)}`
           : ``
       } 

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.event_begin)
           ? `${this.formatMultiCriterionFilter('event_begin',this.header_flag_options.event_begin)}`
           : ``
       } 

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.event_end)
           ? `${this.formatMultiCriterionFilter('event_end',this.header_flag_options.event_end)}`
           : ``
       }
       
       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.event_in_progress)
           ? `${this.formatMultiCriterionFilter('event_in_progress',this.header_flag_options.event_in_progress)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.glitches)
           ? `${this.formatMultiCriterionFilter('glitches',this.header_flag_options.glitches)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.long_record_read)
           ? `${this.formatMultiCriterionFilter('long_record_read',this.header_flag_options.long_record_read)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.missing_padded_data)
           ? `${this.formatMultiCriterionFilter('missing_padded_data',this.header_flag_options.missing_padded_data)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.positive_leap)
           ? `${this.formatMultiCriterionFilter('positive_leap',this.header_flag_options.positive_leap)}`
           : ``
       }

        ${
        !this.isEmptyMultiCriterion(this.header_flag_options.short_record_read)
           ? `${this.formatMultiCriterionFilter('short_record_read',this.header_flag_options.short_record_read)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.spikes)
           ? `${this.formatMultiCriterionFilter('spikes',this.header_flag_options.spikes)}`
           : ``
       }

        ${
        !this.isEmptyMultiCriterion(this.header_flag_options.station_volume)
           ? `${this.formatMultiCriterionFilter('station_volume',this.header_flag_options.station_volume)}`
           : ``
       }

        ${
        !this.isEmptyMultiCriterion(this.header_flag_options.suspect_time_tag)
           ? `${this.formatMultiCriterionFilter('suspect_time_tag',this.header_flag_options.suspect_time_tag)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.telemetry_sync_error)
           ? `${this.formatMultiCriterionFilter('telemetry_sync_error',this.header_flag_options.telemetry_sync_error)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.header_flag_options.time_correction_applied)
           ? `${this.formatMultiCriterionFilter('time_correction_applied',this.header_flag_options.time_correction_applied)}`
           : ``
       }

        ${
        !this.isEmptyMultiCriterion(this.timing_quality_options.timing_correction)
           ? `${this.formatMultiCriterionFilter('timing_correction',this.timing_quality_options.timing_correction)}`
           : ``
       }

        ${
        !this.isEmptyMultiCriterion(this.timing_quality_options.timing_quality_max)
           ? `${this.formatMultiCriterionFilter('timing_quality_max',this.timing_quality_options.timing_quality_max)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.timing_quality_options.timing_quality_min)
           ? `${this.formatMultiCriterionFilter('timing_quality_min',this.timing_quality_options.timing_quality_min)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.timing_quality_options.timing_quality_mean)
           ? `${this.formatMultiCriterionFilter('timing_quality_mean',this.timing_quality_options.timing_quality_mean)}`
           : ``
       }

        ${
        !this.isEmptyMultiCriterion(this.timing_quality_options.timing_quality_median)
           ? `${this.formatMultiCriterionFilter('timing_quality_median',this.timing_quality_options.timing_quality_median)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.timing_quality_options.timing_quality_lower_quartile)
           ? `${this.formatMultiCriterionFilter('timing_quality_lower_quartile',this.timing_quality_options.timing_quality_lower_quartile)}`
           : ``
       }

       ${
        !this.isEmptyMultiCriterion(this.timing_quality_options.timing_quality_upper_quartile)
           ? `${this.formatMultiCriterionFilter('timing_quality_upper_quartile',this.timing_quality_options.timing_quality_upper_quartile)}`
           : ``
       }
       
         `
      url = url.replace(/\s/g, "");
      this.buildedUrl =  url.replace(/\?&/, "?");
    },

     displaySuccess: function(message) {
      this.notifierMessage = message;
      this.notifierColor = "success";
      this.timeout = 2000;
      this.notifier = true;
    },

     displayError: function(message) {
  		this.notifierMessage = message
  		this.notifierColor = 'error'
  		this.timeout=8000
  		this.notifier = true
    },

    resetParameters() {
      debugger
      this.selectedNetwork = [];
      this.selectedStation = [];
      this.selectedLocation = [];
      this.selectedChannel = [];


      let blank_temporal_constraints = {
        starttime: "",
        endtime: ""
      }

      if (this.temporal_constraints.starttime) {
        this.resetPicker("starttime")
      }
      if (this.temporal_constraints.endtime) {
        this.resetPicker("endtime")
      }

      let blank_request_options = {
        csegments: false,
        format: "",
        granularity: "",
        include: "",
        longestonly: "",
        minimumlength: "",
      }
      let blank_record_options = {
        encoding: "",
        num_records: "",
        quality: "",
        record_length: "",
        sample_rate: ""
      }
      let blank_sample_metric_options = {
        max_gap: [{ value: "", filter: "" }],
        max_overlap: [{ value: "", filter: "" }],
        num_gaps: [{ value: "", filter: "" }],
        num_overlaps: [{ value: "", filter: "" }],
        num_samples: [{ value: "", filter: "" }],
        percent_availability: [{ value: "", filter: "" }],
        sample_max: [{ value: "", filter: "" }],
        sample_min: [{ value: "", filter: "" }],
        sample_mean: [{ value: "", filter: "" }],
        sample_rms: [{ value: "", filter: "" }],
        sample_stdev: [{ value: "", filter: "" }],
        sample_lower_quartile: [{ value: "", filter: "" }],
        sample_median: [{ value: "", filter: "" }],
        sample_upper_quartile: [{ value: "", filter: "" }],
        sum_gaps: [{ value: "", filter: "" }],
        sum_overlaps: [{ value: "", filter: "" }]
      }
      let blank_header_flag_options = {
        amplifier_saturation: [{ value: "", filter: "" }],
        calibration_signal: [{ value: "", filter: "" }],
        clock_locked: [{ value: "", filter: "" }],
        digital_filter_charging: [{ value: "", filter: "" }],
        digitizer_clipping: [{ value: "", filter: "" }],
        start_time_series: [{ value: "", filter: "" }],
        end_time_series: [{ value: "", filter: "" }],
        event_begin: [{ value: "", filter: "" }],
        event_end: [{ value: "", filter: "" }],
        event_in_progress: [{ value: "", filter: "" }],
        glitches: [{ value: "", filter: "" }],
        long_record_read: [{ value: "", filter: "" }],
        missing_padded_data: [{ value: "", filter: "" }],
        positive_leap: [{ value: "", filter: "" }],
        short_record_read: [{ value: "", filter: "" }],
        spikes: [{ value: "", filter: "" }],
        station_volume: [{ value: "", filter: "" }],
        suspect_time_tag: [{ value: "", filter: "" }],
        telemetry_sync_error: [{ value: "", filter: "" }],
        time_correction_applied: [{ value: "", filter: "" }]
      }
      let blank_timing_quality_options = {
        timing_correction: [{ value: "", filter: "" }],
        timing_quality_max: [{ value: "", filter: "" }],
        timing_quality_min: [{ value: "", filter: "" }],
        timing_quality_mean: [{ value: "", filter: "" }],
        timing_quality_median: [{ value: "", filter: "" }],
        timing_quality_lower_quartile: [{ value: "", filter: "" }],
        timing_quality_upper_quartile: [{ value: "", filter: "" }]
      }
      Object.assign(this.temporal_constraints, blank_temporal_constraints)
      Object.assign(this.request_options, blank_request_options)
      Object.assign(this.record_options, blank_record_options)
      Object.assign(this.sample_metric_options, blank_sample_metric_options)
      Object.assign(this.header_flag_options, blank_header_flag_options)
      Object.assign(this.timing_quality_options, blank_timing_quality_options)
      this.computeUrl();

    },
    dateToISOLikeButLocal(date) {
      if (date) {
        const offsetMs = date.getTimezoneOffset() * 60 * 1000;
        const msLocal = date.getTime() - offsetMs;
        const dateLocal = new Date(msLocal);
        const iso = dateLocal.toISOString();
        const isoLocal = iso.slice(0, 19);
        return isoLocal;
      } else {
        return "";
      }
    },
    handleSuccess(e) {
      
      this.copyStat = true
      this.snackbar = true
    },
    handleError(e) {
      
      this.copyStat = false
    },

    isEmptyMultiCriterion(criteria) {
      if (!criteria) {
        return true;
      }
      if (criteria.length==0) {
        return true;
      }
      for (let i=0; i < criteria.length; i++) {
        if ((criteria[i].value) && (criteria[i].value.trim().length >0)) {
          return false;
        }
      }
      return true;
    },

    formatMultiCriterionFilter(name, criteria) {
      let result="";
      for (let i=0; i< criteria.length;i++){
          result= result+ "&"+name+this.formatFilter(criteria[i].filter)+"="+criteria[i].value;
      }
      return result;
    },

    formatFilter(filter) {
      if (filter) {
        return "_" + filter
      } else {
        return ""
      }

    }
  }

}
</script>

<style>

 .record-options .v-messages__message, .request-options .v-messages__message, .sample-metric-options .v-messages__message  {
  padding-top: 3px;
}

.sample-metric-options .no-padding {
  padding-top: 0px;
}

.sample-metric-options .no-padding-y {
  padding-top: 0px;
  padding-bottom: 0px;
}

.required label {
  color: #ff5252 !important;
    caret-color: #ff5252 !important;
}

.required i.v-icon {
  color: #ff5252 !important;
  caret-color: #ff5252 !important;
}

.required div.v-input__slot::after, .required div.v-input__slot::before {
  border-color: #ff5252 !important;
}

.required label.v-label--active {
  color: #ff5252 !important;
}


.v-application a:hover {
    color: #1976d2 !important;
}

.v-card,
.v-sheet,
.theme--light {}
</style>
