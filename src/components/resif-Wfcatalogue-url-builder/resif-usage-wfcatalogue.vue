<template>
  
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr class="grey lighten-1 white--text font-weight-medium">
              <td colspan="2">Hierachical selection</td>
            </tr>
             <tr>
              <th>Network</th>
              <td>FDSN network code, wildcards or lists. e.g: FR.</td>
            </tr>
            <tr>
              <th>Station</th>
              <td>Up to 5 character station code, wildcards or lists. e.g: OGFO.</td>
            </tr>
            <tr>
              <th>Location</th>
              <td>2 character location identifier, wildcards or lists. e.g: 00. -- means : empty location code.</td>
            </tr>
            <tr>
              <th>Channel</th>
              <td>The network, station, location and channel fields may contain the * or ? wildcards with the following meaning:
                • * – matches zero to many characters
                • ? – matches a single character
              </td>
            </tr>
             <tr class="grey lighten-1 white--text font-weight-medium">
              <td colspan="2">Temporal selection</td>
            </tr>
            <tr>
              <th>Starttime</th>
              <td>Starttime for time window.</td>
            </tr>
            <tr>
              <th>Endtime</th>
              <td>Endtime for time window.</td>
            </tr>
             <tr class="grey lighten-1 white--text font-weight-medium">
              <td colspan="2">Request Options</td>
            </tr>
            <tr>
              <th>Lists</th>
              <td>The network, station, location and channel fields may contain a comma-separated list, examples include BHE,BHZ or BH*,LH*.</td>
            </tr>
            <tr>
              <th>Csegments</th>
              <td>Include continuous segments</td>
            </tr>
            <tr>
              <th>Format</th>
              <td>Response (json)</td>
            </tr>
            <tr>
              <th>Granularity</th>
              <td>Granularity of metrics (day)</td>
            </tr>
            <tr>
              <th>Include</th>
              <td>Level of detail (default, sample, header, all)</td>
            </tr>
            <tr>
              <th>Longestonly</th>
              <td>Limit to single continuous segment that is the longest</td>
            </tr>
            <tr>
              <th>Minimumlength</th>
              <td>Limit to continuous segment longer than this length</td>
            </tr>
            <tr class="grey lighten-1 white--text font-weight-medium">
              <td colspan="2">Record Options</td>
            </tr>
            <tr>
              <th>Encoding</th>
              <td>Waveform data encoding</td>
            </tr>
            <tr>
              <th>Num_records</th>
              <td>Number of records in document</td>
            </tr>
            <tr>
              <th>Quality</th>
              <td>SEED Quality code (D, R, Q, M)</td>
            </tr>
             <tr>
              <th>Record_length</th>
              <td>Record length</td>
            </tr>
            <tr>
              <th>Sample_rate</th>
              <td>Number of samples per second.</td>
            </tr>
            <tr class="grey lighten-1 white--text font-weight-medium">
              <td colspan="2">Sample Metric Options</td>
            </tr>
            <tr>
              <th>Max_gap</th>
              <td>Maximum gap length in seconds</td>
            </tr>
            <tr>
              <th>Max_overlap</th>
              <td>Maximum overlap length in seconds</td>
            </tr>
            <tr>
              <th>Num_gaps</th>
              <td>Number of gaps</td>
            </tr>
            <tr>
              <th>Num_overlaps</th>
              <td>Number of overlaps</td>
            </tr>
            <tr>
              <th>Num_samples</th>
              <td>Number of samples</td>
            </tr>
            <tr>
              <th>Percent_availability</th>
              <td>Percentage of available data
              </td>
            </tr>
            <tr>
              <th>Sample_max</th>
              <td>Maximum sample value
              </td>
            </tr>
            <tr>
              <th>Sample_min</th>
              <td>Minimum sample value
              </td>
            </tr>
            <tr>
              <th>Sample_mean</th>
              <td>Mean sample value
              </td>
            </tr>
            <tr>
              <th>Sample_rms</th>
              <td>Quadratic mean of samples
              </td>
            </tr>
            <tr>
              <th>Sample_stdev</th>
              <td>Standard deviation of samples
              </td>
            </tr>
            <tr>
              <th>Sample_lower_quartile</th>
              <td>25th percentile of samples
              </td>
            </tr>
             <tr>
              <th>Sample_median</th>
              <td>50th percentile of samples
              </td>
            </tr>
            <tr>
              <th>Sample_upper_quartile</th>
              <td>75th percentile of samples
              </td>
            </tr>
            <tr>
              <th>Sum_gaps</th>
              <td>Sum of data gaps in seconds
              </td>
            </tr>
            <tr>
              <th>Sum_overlaps</th>
              <td>Sum of data overlaps in seconds
              </td>
            </tr>


 <tr class="grey lighten-1 white--text font-weight-medium">
              <td colspan="2">Header Flag Options</td>
            </tr>
            <tr>
              <th>amplifier_saturation</th>
              <td>Data with quality flags bit 0 set</td>
            </tr>
            <tr>
              <th>calibration_signal</th>
              <td>Data with activity flags bit 0 set</td>
            </tr>
            <tr>
              <th>Clock_locked</th>
              <td>Data with io-and-clock flags bit 5 set</td>
            </tr>
            <tr>
              <th>Digital_filter_charging</th>
              <td>Data with data quality flags bit 6 set</td>
            </tr>
            <tr>
              <th>Digitizer_clipping</th>
              <td>Number of samples</td>
            </tr>
            <tr>
              <th>Start_time_series</th>
              <td>Data with io-and-clock flags bit 3 set
              </td>
            </tr>
            <tr>
              <th>End_time_series</th>
              <td>Data with io-and-clock flags bit 4 set
              </td>
            </tr>

            <tr>
              <th>Event_begin</th>
              <td>Data with activity flags bit 2 set
              </td>
            </tr>
            <tr>
              <th>Event_end</th>
              <td>Data with activity flags bit 3 set</td>
            </tr>

            <tr>
              <th>Event_in_progress</th>
              <td>Data with activity flags bit 6 set
              </td>
            </tr>
            <tr>
              <th>Glitches</th>
              <td>Data with data quality flags bit 3 set</td>
            </tr>

            <tr>
              <th>Long_record_read</th>
              <td>Data with io-and-clock flags bit 1 set
              </td>
            </tr>
            <tr>
              <th>Missing_padded_data</th>
              <td>Data with data quality flags bit 4 set</td>
            </tr>

            <tr>
              <th>Positive_leap</th>
              <td>Data with activity flags bit 4 set</td>
            </tr>

            <tr>
              <th>Short_record_read</th>
              <td>Data with io-and-clock flags bit 2 set
              </td>
            </tr>
            <tr>
              <th>Spikes</th>
              <td>Data with data quality flags bit 2 set</td>
            </tr>

            <tr>
              <th>Station_volume</th>
              <td>Data with io-and-clock flags bit 0 set</td>
            </tr>

             <tr>
              <th>Suspect_time_tag</th>
              <td>Data with data quality flags bit 7 set</td>
            </tr>

            <tr>
              <th>Telemetry_sync_error</th>
              <td>Data with data quality flags bit 5 set</td>
            </tr>

             <tr>
              <th>Time_correction_applied</th>
              <td>Data with activity flags bit 1 set</td>
            </tr>

            <tr class="grey lighten-1 white--text font-weight-medium">
              <td colspan="2">Timing Quality Options</td>
            </tr>
            <tr>
              <th>Timing_correction</th>
              <td>Data with header field 16 to non-zero</td>
            </tr>
            <tr>
              <th>Timing_quality_max</th>
              <td>Maximum timing quality value</td>
            </tr>
            <tr>
              <th>Timing_quality_min</th>
              <td>Minimum timing quality value</td>
            </tr>
            <tr>
              <th>Timing_quality_mean</th>
              <td>Mean timing quality value</td>
            </tr>
            <tr>
              <th>Timing_quality_median</th>
              <td>50th percentile of timing quality values</td>
            </tr>
            <tr>
              <th>Timing_quality_lower_quartile</th>
              <td>25th percentile of timing quality values
              </td>
            </tr>
            <tr>
              <th>Timing_quality_upper_quartile</th>
              <td>75th percentile of timing quality values
              </td>
            </tr>
            

          </tbody>
        </template></v-simple-table>
    
  

</template>

<script>
export default {
  name: "resif-wfcatalogue-usage"
};
</script>

<style>
</style>