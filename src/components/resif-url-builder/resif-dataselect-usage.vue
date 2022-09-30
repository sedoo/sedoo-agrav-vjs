<template>
<v-simple-table>
  <template v-slot:default>
    <tbody>

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
        <td>2 character location identifier, wildcards or lists. e.g: 00. -- means : empty location code.
        </td>
      </tr>
      <tr>
        <th>Channel</th>
        <td>3 character channel codes, wildcards or lists. e.g: HHN</td>
      </tr>
      <tr>
        <th>Wildcards</th>
        <td>The network, station, location and channel fields may contain the * or ? wildcards with the following meaning:
          * – matches zero to many characters
          ? – matches a single character</td>
      </tr>
      <tr>
        <th>Start Time</th>
        <td>Waveform start time
          YYYY-MM-DD HH:MM:SS format
          E.g. "2010-06-14 00:00:00".</td>
      </tr>
      <tr>
        <th>End Time</th>
        <td>Waveform end time
          YYYY-MM-DD HH:MM:SS format
          E.g. "2010-06-14 00:00:00".
        </td>
      </tr>
      <tr>
        <th>Quality</th>
        <td>Select data based on miniSEED data quality indicator. D,R,Q,M,B. M and B (default) are treated the same and indicate best available. </td>
      </tr>
      <tr>
        <th>Minimum Length</th>
        <td>Limit results to continuous data segments of a minimum length specified in seconds.
        </td>
      </tr>
      <tr>
        <th>Longest Only</th>
        <td>Limit results to the longest continuous segment per channel.</td>
      </tr>
      <tr>
        <th>Use Authentication</th>
        <td>Check the box to submit a request to the queryauth method of the service in order to submit a request with credentials.</td>
      </tr>
      <tr>
        <th>Nodata</th>
        <td>If no data is returned by the service, return a 404 response rather than the default 204.
          Learn more about HTTP response codes.</td>
      </tr>

    </tbody>
  </template></v-simple-table>
</template>

<script>
export default {
  name: "resif-dataselect-usage"
};
</script>

<style>
</style>
