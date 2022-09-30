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
              <td>2 character location identifier, wildcards or lists. e.g: 00. -- means : empty location code.</td>
            </tr>
            <tr>
              <th>Channel</th>
              <td>The network, station, location and channel fields may contain the * or ? wildcards with the following meaning:
                • * – matches zero to many characters
                • ? – matches a single character
              </td>
            </tr>
            <tr>
              <th>Lists</th>
              <td>The network, station, location and channel fields may contain a comma-separated list, examples include BHE,BHZ or BH*,LH*.</td>
            </tr>
            <tr>
              <th>Start Date</th>
              <td>Station information must start on or before the date specified.
                Specify dates as: YYYY-MM-DD (e.g. "2010-06-14"). YYYY-MM-DD HH:MM:SS format</td>
            </tr>
            <tr>
              <th>End Date</th>
              <td>Station information must start on or after the date specified.
                Specify dates as: YYYY-MM-DD (e.g. "2010-06-14") YYYY-MM-DD HH:MM:SS format
              </td>
            </tr>
            <tr>
              <th>Level</th>
              <td>Choose the level of granularity for the information returned, can be network, station, channel or response level.</td>
            </tr>
            <tr>
              <th>Format</th>
              <td>Specify output format (xml or text)</td>
            </tr>
            <tr>
              <th>Start Before</th>
              <td>Station information must have started before the date specified. YYYY-MM-DD HH:MM:SS format
              </td>
            </tr>
            <tr>
              <th>Start After</th>
              <td>Station information must have started after the date specified. YYYY-MM-DD HH:MM:SS format
              </td>
            </tr>
            <tr>
              <th>End Before</th>
              <td>Station information must have ended before the date specified. YYYY-MM-DD HH:MM:SS format</td>
            </tr>
            <tr>
              <th>End After</th>
              <td>Station information must have ended after the date specified. I YYYY-MM-DD HH:MM:SS format</td>
            </tr>
            <tr>
              <th>Updated After</th>
              <td>Return events updated since the given date. YYYY-MM-DD HH:MM:SS format</td>
            </tr>
            <tr>
              <th>Lat/Lon Box</th>
              <td>Return events within a lat/lon range.
              </td>
            </tr>
            <tr>
              <th>Lat/Lon Radius</th>
              <td>Return events a given distance (in degrees) of a location.</td>
            </tr>
            <tr>
              <th>Include Restricted Channels</th>
              <td>Specify whether results should include information relating to restricted channels.
</td>
            </tr>
            <tr>
              <th>Match time Series</th>
              <td>Retrieve only metadata that is likely to match available time series data.
</td>
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
  name: "resif-satationUrlBuilder-usage"
};
</script>

<style>
</style>