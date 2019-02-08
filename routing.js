class Route {
    constructor(pos, dest) {
        let orsDirections = new Openrouteservice.Directions({
            api_key: '5b3ce3597851110001cf6248a488307605e94252ab6ba375cc36a86e'
        });
        return (async () => {
            pos = ol.proj.toLonLat(pos);
            dest = ol.proj.toLonLat(dest);
            return await orsDirections.calculate({
                coordinates: [pos, dest],
                profile: 'driving-car',
                geometry_format: 'polyline',
                format: 'json',
            }).then(function (json) {
                let newPolyline = json.routes[0].geometry.map(function (pos, index) {
                    pos = ol.proj.fromLonLat(pos);
                    return [pos[0], pos[1], index]
                });
                return Promise.resolve(new ol.geom.MultiLineString([newPolyline], 'XYM'));
            }).catch(function (err) {
                console.error(err);
            });
        })();
    }
}