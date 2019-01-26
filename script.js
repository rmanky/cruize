let config = {
    apiKey: "AIzaSyAlBJ7jY4OW4M4_HtXRlqUzOFrbNK0IeXM",
    authDomain: "cruize-4dc36.firebaseapp.com",
    databaseURL: "https://cruize-4dc36.firebaseio.com",
    projectId: "cruize-4dc36",
    storageBucket: "cruize-4dc36.appspot.com",
    messagingSenderId: "684724289672"
};
console.log("Firebase: Begin!");
firebase.initializeApp(config);

document.getElementById("search-bar").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        let destination = document.getElementById("search-bar").value;
        console.log(destination);
    }
});

window.onload = function () {

    let orsDirections = new Openrouteservice.Directions({
        api_key: '5b3ce3597851110001cf6248a488307605e94252ab6ba375cc36a86e'
    });

    orsDirections.calculate({
        coordinates: [[-71.7142697, 42.16386300000002], [-71.0589, 42.3601]],
        profile: 'driving-car',
        extra_info: ['waytype', 'steepness'],
        geometry_format: 'encodedpolyline',
        format: 'json',
    }).then(function (json) {
            // Add your own result handling here
            console.log(JSON.stringify(json));
            createRoute(json.routes[0].geometry);
    }).catch(function (err) {
            console.error(err);
    });
};

let marker = new ol.Feature({
    geometry: new ol.geom.Point([0, 0])
});

let vectorSource = new ol.source.Vector({
    features: [marker]
});

let vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

styles = {
    route: new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 8, color: [72, 61, 139, 1.0]
        })
    })
};

function createRoute(polyline) {
    // route is ol.geom.LineString
    let route = new ol.format.Polyline({
        factor: 1e5
    }).readGeometry(polyline, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
    let feature = new ol.Feature({
        type: 'route',
        geometry: route
    });
    feature.setStyle(styles.route);
    vectorSource.addFeature(feature);
}

let baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

let view = new ol.View({
    center: [0, 0],
    zoom: 18
});

let map = new ol.Map({
    target: 'map',
    layers: [baseLayer, vectorLayer],
    view: view
});


let geolocation = new ol.Geolocation({
    // take the projection to use from the map's view
    tracking: true,
    projection: map.getView().getProjection()
});

// listen to changes in position
geolocation.on('change', function () {
    let pos = geolocation.getPosition();
    console.log(ol.proj.toLonLat(pos));
    map.getView().setCenter(pos)
    marker.getGeometry().setCoordinates(pos);
});