class Route {
    constructor(pos, dest) {
        let orsDirections = new Openrouteservice.Directions({
            api_key: '5b3ce3597851110001cf6248a488307605e94252ab6ba375cc36a86e'
        });
        return (() => {
            return orsDirections.calculate({
                coordinates: [pos, dest],
                profile: 'driving-car',
                format: 'geojson',
            }).then(function (json) {
                if(json[0] != 'features') {
                    return json.features[0];
                }
            }).catch(() => {});
        })();
    }
}