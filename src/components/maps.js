$.extend(edges, {
    ////////////////////////////////////////////////////
    // Map implementation

    newMapView : function(params) {
        if (!params) { params = {} }
        edges.MapView.prototype = edges.newComponent(params);
        return new edges.MapView(params);
    },
    MapView : function(params) {
        //////////////////////////////////
        // parameters that can be passed in

        // field in the data which is the geo_point type
        this.geoPoint = params.geoPoint || "location";

        // type of data at the geo_point.  Can be one of:
        // * properties = lat/lon fields
        // * string - comma separated lat,lon
        // * geohash - not currently supported
        // * array - array of [lon, lat] (note the order)
        this.structure = params.structure || "properties";

        this.calculateCentre = params.calculateCentre || edges.MapCentreFunctions.pickFirst;

        this.defaultRenderer = params.defaultRenderer || "newMapViewRenderer";

        //////////////////////////////////
        // internal state

        // list of locations and the related object at those locations
        // of the form
        // {lat: <lat>, lon: <lon>, obj: {object}}
        this.locations = [];

        // lat/lon object which defines the centre point of the map
        // this default is somewhere in Mali, and is a decent default for the globe
        this.centre = {lat: 17, lon: 0};

        this.synchronise = function() {
            this.locations = [];
            this.centre = {lat: 17, lon: 0};

            // read the locations out of the results
            if (this.edge.result) {
                var results = this.edge.result.results();
                for (var i = 0; i < results.length; i++) {
                    var res = results[i];
                    var gp = this._getGeoPoint(res);
                    if (gp) {
                        var ll = this._getLatLon(gp);
                        ll["obj"] = res;
                        this.locations.push(ll);
                    }
                }
            }

            // set the centre point
            if (this.locations.length > 0) {
                this.centre = this.calculateCentre(this.locations);
            }
        };

        this._getLatLon = function(gp) {
            var ll = {};
            if (this.structure === "properties") {
                ll["lat"] = parseFloat(gp.lat);
                ll["lon"] = parseFloat(gp.lon);
            }
            return ll;
        };

        this._getGeoPoint = function(obj) {
            var parts = this.geoPoint.split(".");
            var context = obj;

            for (var i = 0; i < parts.length; i++) {
                var p = parts[i];
                var d = i < parts.length - 1 ? {} : false;
                context = context[p] !== undefined ? context[p] : d;
            }

            return context;
        }
    },
    MapCentreFunctions : {
        pickFirst : function(locations) {
            return {lat: locations[0].lat, lon: locations[0].lon}
        }
    }
});