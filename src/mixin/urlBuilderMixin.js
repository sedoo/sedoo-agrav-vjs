export default {
    methods: {

        upperCaseSelectedNetwork() {
            this.selectedNetwork = this.selectedNetwork.map(function(x) {
                return x.toUpperCase();
            });

        },

        upperCaseSelectedStation() {
            this.selectedStation = this.selectedStation.map(function(x) {
                return x.toUpperCase();
            });

        },

        upperCaseSelectedChannel() {
            this.selectedChannel = this.selectedChannel.map(function(x) {
                return x.toUpperCase();
            });

        },

        upperCaseSelectedLocation() {
            this.selectedLocation = this.selectedLocation.map(function(x) {
                return x.toUpperCase();
            });

        },


        updateFilteredNetwork() {
            let result = [];
            this.filteredTree.map(network => result.push(network.code));

            this.filteredNetwork = result;
        },

        updateFilteredStation() {
            let result = [];
            this.filteredTree.map(network =>
                network.station.map(sta => result.push(sta.code))
            );
            this.filteredStation = result.sort();
        },

        computeCompleteFilteredStation() {
            let result = [];
            this.filteredTree.map(network =>
                network.station.map(sta => result.push(sta))
            );
            this.completeFilteredStation = result;
        },

        updateFilteredChannel() {
            let result = [];
            this.filteredTree.map(network =>
                network.station.map(sta => {
                    if (sta.channels) {
                        sta.channels.map(chan => result.push(chan.code));
                    }
                })
            );
            this.filteredChannel = result.sort();
        },

        updateFilteredLocation() {
            let result = [];
            this.filteredTree.map(network =>
                network.station.map(sta => {
                    if (sta.locs) {
                        sta.locs.map(loc => result.push(loc));
                    }
                })
            );
            this.filteredLocation = result.sort();
        },

        updateFilteredTree() {
            let result = []
            for (let i = 0; i < this.networks.length; i++) {
                let aux = this.getCompatibleNetwork(this.networks[i]);
                if (aux != null) {
                    result.push(aux);
                }
            }
            this.filteredTree = result;
        },

        getCompatibleNetwork(network) {
            let newNetwork = {};
            newNetwork.code = network.code;
            let aux = this.isSelectedNetwork(network.code);
            if (aux == false) {
                return null
            } else {
                //We need to know if there are compatible stations
                let stations = this.getCompatibleStations(network.station);
                if (stations.length == 0) {
                    return null
                } else {
                    newNetwork.station = stations;
                    return newNetwork;
                }
            }
        },

        getCompatibleStations(stations) {
            let result = [];
            for (let i = 0; i < stations.length; i++) {
                let aux = this.isSelectedStation(stations[i].code);
                if (aux == false) {
                    //The station is filtered
                } else {
                    if (!stations[i].channels) {
                        stations[i].channels = []
                    }

                    if (!stations[i].locs) {
                        stations[i].locs = []
                    }

                    //We need to check channel and loc.
                    let channels = this.getCompatibleChannels(stations[i].channels);
                    if (channels.length > 0) {
                        let locations = this.getCompatibleLocations(stations[i].locs);
                        if (locations.length > 0) {
                            result.push(stations[i])
                        }
                    }
                }
            }

            return result;
        },

        getCompatibleChannels(channels) {
            let result = [];
            for (let i = 0; i < channels.length; i++) {
                let aux = this.isSelectedChannel(channels[i].code);
                if (aux == false) {
                    //The channel is filtered
                } else {
                    let newChannel = {}
                    newChannel.code = channels[i].code
                    result.push(newChannel)
                }
            }
            return result;
        },

        getCompatibleLocations(locations) {
            let result = [];
            for (let i = 0; i < locations.length; i++) {
                let aux = this.isSelectedLocation(locations[i]);
                if (aux == false) {
                    //The location is filtered
                } else {
                    result.push(locations[i])
                }
            }
            return result;
        },


        isSelectedStation(code) {
            if ((this.selectedStation == null) || this.selectedStation.length == 0) {
                return true;
            } else {
                for (let i = 0; i < this.selectedStation.length; i++) {
                    if (code.toLowerCase() == this.selectedStation[i].toLowerCase()) {
                        return true;
                    }
                    if (this.hasWilcards(this.selectedStation[i])) {
                        let aux = this.selectedStation[i].replace(/\?/g, '.').replace(/\*/g, '(.)*');

                        if (new RegExp("^" + aux.toLowerCase() + "$", 'g').test(code.toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        },

        isSelectedChannel(code) {
            if ((this.selectedChannel == null) || this.selectedChannel.length == 0) {
                return true;
            } else {
                for (let i = 0; i < this.selectedChannel.length; i++) {
                    if (code.toLowerCase() == this.selectedChannel[i].toLowerCase()) {
                        return true;
                    }
                    if (this.hasWilcards(this.selectedChannel[i])) {
                        let aux = this.selectedChannel[i].replace(/\?/g, '.').replace(/\*/g, '(.)*');

                        if (new RegExp("^" + aux.toLowerCase() + "$", 'g').test(code.toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        },

        isSelectedLocation(code) {
            if ((this.selectedLocation == null) || this.selectedLocation.length == 0) {
                return true;
            } else {
                for (let i = 0; i < this.selectedLocation.length; i++) {
                    if (code.toLowerCase() == this.selectedLocation[i].toLowerCase()) {
                        return true;
                    }
                    if (this.hasWilcards(this.selectedLocation[i])) {
                        let aux = this.selectedLocation[i].replace(/\?/g, '.').replace(/\*/g, '(.)*');

                        if (new RegExp("^" + aux.toLowerCase() + "$", 'g').test(code.toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        },

        openStationSelectionDialog() {
            this.computeCompleteFilteredStation();
            this.stationSelectionDialog = true;
        },

        cancelStationSelection() {
            this.stationSelectionDialog = false;
        },

        stationSelection(e) {
            this.selectedStation = e
            this.stationSelectionDialog = false;
        },

        isSelectedNetwork(code) {
            if ((this.selectedNetwork == null) || this.selectedNetwork.length == 0) {
                return true;
            } else {
                for (let i = 0; i < this.selectedNetwork.length; i++) {
                    if (code.toLowerCase() == this.selectedNetwork[i].toLowerCase()) {
                        return true;
                    }
                    if (this.hasWilcards(this.selectedNetwork[i])) {
                        let aux = this.selectedNetwork[i].replace(/\?/g, '.').replace(/\*/g, '(.)*');

                        if (new RegExp("^" + aux.toLowerCase() + "$", 'g').test(code.toLowerCase())) {
                            return true
                        }
                    }
                }
            }
            return false
        },

        hasWilcards(value) {
            if (value.indexOf("*") >= 0) {
                return true;
            }
            if (value.indexOf("?") >= 0) {
                return true;
            }

            return false;
        },

        resetPicker(ref) {
            let aux = this.$refs[ref];
            if (aux) {
                aux.resetPicker()
                aux.date = ''
                aux.time = '00:00:00'
            }
        },

        formatDate(date) {
            return this.dateToISOLikeButLocal(date)
        },

        dateToISOLikeButLocal(date) {
            if (date) {
                let offsetMs = date.getTimezoneOffset() * 60 * 1000;
                let msLocal = date.getTime() - offsetMs;
                let dateLocal = new Date(msLocal);
                let iso = dateLocal.toISOString();
                let isoLocal = iso.slice(0, 19);
                return isoLocal;
            } else {
                return "";
            }
        },


        loadTree: function() {
            this.loading = true;
            this.axios
                .get(this.service + "/tree/v1_0/networks")
                .then(response => {
                    this.networks = response.data;
                    this.filteredTree = this.networks;

                })
                .finally(() => { this.loading = false; });
        }
    },

    computed: {

        selectedLocationAsString() {
            if (!this.selectedLocation) {
                return "None";
            }
            if (this.selectedLocation.length == 0) {
                return "None";
            } else {
                return this.selectedLocation.join();
            }
        },

        selectedChannelAsString() {
            if (!this.selectedChannel) {
                return "None";
            }
            if (this.selectedChannel.length == 0) {
                return "None";
            } else {
                return this.selectedChannel.join();
            }
        },

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

        wsService() {
            if (this.storeWrapper) {
                return this.storeWrapper.getters.getResifWsService;
            }
            return null
        }
    },

    watch: {

        selectedNetwork: function() {
            console.log("Selected network changed")
            this.updateFilteredTree();
        },

        selectedStation: function() {
            console.log("Selected station changed")
            this.updateFilteredTree();
        },

        selectedLocation: function() {
            console.log("Selected location changed")
            this.updateFilteredTree();
        },

        selectedChannel: function() {
            console.log("Selected channel changed")
            this.updateFilteredTree();
        },

        filteredTree: function() {
            this.updateFilteredNetwork();
            this.updateFilteredStation();
            this.updateFilteredChannel();
            this.updateFilteredLocation();
        }


    },
    data: function() {
        return {
            selectedStation: [],
            selectedLocation: [],
            selectedChannel: [],
            selectedNetwork: [],
            filteredTree: [],
            filteredNetwork: [],
            filteredChannel: [],
            filteredLocation: [],
            filteredStation: [],
            completeFilteredStation: [],
            networks: [],
            loading: false,
            stationSelectionDialog: false,
            textFieldProps: {
                appendIcon: 'event'
            },
        }
    }
}