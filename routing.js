class Route {
    constructor(pos, dest) {
        let orsDirections = new Openrouteservice.Directions({
            api_key: '5b3ce3597851110001cf6248a488307605e94252ab6ba375cc36a86e'
        });
        return (async () => {
            return await orsDirections.calculate({
                coordinates: [pos, dest],
                profile: 'driving-car',
                format: 'geojson',
            }).then(function (json) {
                let geoJson = json.features[0];
                return Promise.resolve(geoJson);
            }).catch(function (err) {
                console.error(err);
            });
        })();
    }
}