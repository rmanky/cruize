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

let searchBar = document.getElementById('search-bar');

let searchList = document.getElementById('search-list');

searchBar.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        let name = document.getElementById("search-bar").value;
        findDestination(name);
    }
});

let orsDirections = new Openrouteservice.Directions({
    api_key: '5b3ce3597851110001cf6248a488307605e94252ab6ba375cc36a86e'
});

document.addEventListener("click", function (event) {
    // If user clicks inside the element, do nothing
    if (event.target.id === 'search-bar') {
        return;
    }
    if (searchBar === document.activeElement) {
        searchBar.blur();
    }
});

let myLocation = new ol.Feature({
    geometry: new ol.geom.Point([0, 0])
});

let vectorSource = new ol.source.Vector({
    features: [myLocation]
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

let feature = new ol.Feature({
    id: 'route',
    type: 'route'
});
feature.setStyle(styles.route);
vectorSource.addFeature(feature);

function createRoute(polyline) {
    // route is ol.geom.LineString
    let route = new ol.format.Polyline({
        factor: 1e5
    }).readGeometry(polyline, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    });
    feature.setGeometry(route);
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
    projection: view.getProjection()
});

// listen to changes in position
geolocation.on('change', function () {
    let pos = geolocation.getPosition();
    myLocation.getGeometry().setCoordinates(pos);
});

let destinationMarker = new ol.Feature({
    geometry: new ol.geom.Point([0, 0]),
});

function findDestination(name) {
    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + name).then(function (response) {
        return response.json();
    }).then(function (json) {
        // clear out results
        clearChildren();
        for (let i = 0; i < json.length; i++) {
            let listItem = document.createElement('li');
            listItem.innerHTML = json[i].display_name;
            listItem.onclick = function () {
                let dest = [json[i].lon, json[i].lat];
                dest = ol.proj.fromLonLat(dest.map(Number));
                setDestination(dest);
                calcRoute(dest);
                clearChildren();
            };
            searchList.appendChild(listItem);
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function clearChildren() {
    while (searchList.lastChild) {
        searchList.removeChild(searchList.lastChild);
    }
}

function setDestination(dest) {
    destinationMarker.getGeometry().setCoordinates(dest);
    if (!vectorSource.getFeatures().includes(destinationMarker)) {
        vectorSource.addFeature(destinationMarker);
    }
}

function calcRoute(dest) {
    let myPos = ol.proj.toLonLat(myLocation.getGeometry().getCoordinates());
    dest = ol.proj.toLonLat(dest);
    console.log(dest);
    console.log(myPos);
    orsDirections.calculate({
        coordinates: [myPos, dest],
        profile: 'driving-car',
        geometry_format: 'encodedpolyline',
        format: 'json',
    }).then(function (json) {
        // Add your own result handling here
        createRoute(json.routes[0].geometry);
    }).catch(function (err) {
        console.error(err);
    });

    cameraAnim(ol.proj.fromLonLat(dest), ol.proj.fromLonLat(myPos));
}

function cameraAnim(dest, myPos) {
    let ext = ol.extent.boundingExtent([dest, myPos]);
    view.fit(ext, map.getSize());
    view.setZoom(view.getZoom() - 0.5);
    setTimeout(function () {
        view.animate({
            center: myPos,
            zoom: 18,
            duration: 2500
        })
    }, 1500);
}