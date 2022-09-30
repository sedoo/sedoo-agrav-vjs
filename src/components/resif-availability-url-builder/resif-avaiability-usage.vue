<template>
<v-simple-table>
  <template v-slot:default>
    <tbody>

      <tr>
        <th>Format</th>
        <td>Specify output format. Accepted values are text (the default), geocsv, json, request,sync,zip.
          The text format is meant to be human readable.
        </td>
      </tr>
      <tr>
        <th>Network</th>
        <td>FDSN network code, wildcards or lists. e.g: FR.</td>
      </tr>
      <tr>
        <th>Station</th>
        <td>Up to 5 character station code, wildcards or lists. e.g: OGFO.
        </td>
      </tr>
      <tr>
        <th>Location</th>
        <td>2 character location identifier, wildcards or lists. e.g: 00. -- means : empty location code.
        </td>
      </tr>
      <tr>
        <th>Channel</th>
        <td>3 character channel codes, wildcards or lists. e.g: HHN</td>
      </tr>
      <tr>
        <th>Quality</th>
        <td>Select data based on miniSEED data quality indicator, wildcards or lists. Accepted values are D,M, Q, R.</td>
      </tr>
      <tr>
        <th>Wildcards</th>
        <td>The network, station, location and channel fields may contain the * or ? wildcards with the following meaning:
          • * – matches zero to many characters
          • ? – matches a single character </td>
      </tr>
      <tr>
        <th>Lists</th>
        <td>The network, station, location and channel fields may contain a comma-separated list, examples include BHE,BHZ or BH*,LH*.</td>
      </tr>
      <tr>
        <th>Start Date</th>
        <td>Station information must start on or before the date specified.
          Specify dates as: YYYY-MM-DD (e.g. "2010-06-14") </td>
      </tr>
      <tr>
        <th>End Date</th>
        <td>Station information must end on or before the date specified.
          Specify dates as: YYYY-MM-DD (e.g. "2010-06-14")
        </td>
      </tr>
      <tr>
        <th>Merge</th>
        <td>If set to one or more of the following values, time spans are merged as described. Multiple values may be specified as a comma-delimited list, e.g. merge=samplerate,quality.
          samplerate: time spans from data with differing sample rates will be grouped together. If specified this field will be omitted from the result.
          quality: time spans from data with differing quality codes will be grouped together. If specified this field will be omitted from the result.
          overlap: time spans from data that overlap will be merged together. This option does not apply to the extent method. </td>
      </tr>
      <tr>
        <th>Order By</th>
        <td>Sort results by one of the following values in the order specified:
          nslc_time_quality_samplerate: network, station, location, channel, time-range, quality, sample-rate (default)
          latestupdate: update-date (past to present), network, station, location, channel, time-range, quality, sample-rate
          latestupdate_desc: update-date (present to past), network, station, location, channel, time-range, quality, sample-rate </td>
      </tr>
      <tr>
        <th>Limit</th>
        <td>Limit results to the specified number of timespans</td>
      </tr>
      <tr>
        <th>Merge Gaps</th>
        <td>If set, merge time spans that are separated by the specified tolerance in seconds.
        </td>
      </tr>
      <tr>
        <th>Include restricted data</th>
        <td>If true, all data are reported. If false, only data that can be openly accessed.
        </td>
      </tr>
      <tr>
        <th>Show</th>
        <td>Include additional information in output
          latestupdate: the latest times at which data contributing to the returned time spans were loaded into the repository are included in the result.
        </td>
      </tr>
      <tr>
        <th>Nodata</th>
        <td>If no data is returned by the service, return a 404 response rather than the default 204.
          Learn more about HTTP response codes.
        </td>
      </tr>

    </tbody>
  </template></v-simple-table>
</template>

<script>
export default {
  name: "resif-avaiability-usage"
};
</script>

<style>
</style>
