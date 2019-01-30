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

styles = {
    route: new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 8, color: [72, 61, 139, 1.0]
        })
    }),
    x: new ol.style.Style({
        image: new ol.style.RegularShape({
            stroke: new ol.style.Stroke({color: 'black', width: 2}),
            points: 4,
            radius: 10,
            radius2: 0,
            angle: Math.PI / 4
        })
    })
};

let defaultCenter = [-71.8023, 42.2626];

let myPos = ol.proj.fromLonLat(defaultCenter);

let myMarker = new ol.Feature({
    geometry: new ol.geom.Point(myPos)
});

let markerClosest = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(defaultCenter))
});
markerClosest.setStyle(styles.x)


let vectorSource = new ol.source.Vector({
    features: [myMarker, markerClosest]
});

let vectorLayer = new ol.layer.Vector({
    source: vectorSource
});


let route = new ol.Feature({
    id: 'route',
    type: 'route',
    style: styles.route
});
route.setStyle(styles.route);
vectorSource.addFeature(route);

function createRoute(polyline) {
    let newPolyline = polyline.map(function(pos, index)
    {
        pos = ol.proj.fromLonLat(pos);
        return [pos[0], pos[1], index]
    });
    let newRoute = new ol.geom.MultiLineString([newPolyline], 'XYM');
    route.setGeometry(newRoute);
}

let baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

let view = new ol.View({
    center: ol.proj.fromLonLat(defaultCenter),
    zoom: 10
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
geolocation.on('change', function ()
{
    myPos = geolocation.getPosition();
    myMarker.getGeometry().setCoordinates(myPos);
    if(route.getGeometry() !== undefined) {
        let closestPoint = route.getGeometry().getClosestPoint(myPos);
        markerClosest.getGeometry().setCoordinates(closestPoint);
        console.log(Math.round(closestPoint[2]));
    }
});

let destinationMarker = new ol.Feature({
    geometry: new ol.geom.Point([0, 0]),
});

function findDestination(name) {
    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + name).then(function (response) {
        return response.json();
    }).then(function (json) {
        // clear out results
        while (searchList.lastChild) {
            searchList.removeChild(searchList.lastChild);
        }
        for (let i = 0; i < json.length; i++) {
            let listItem = document.createElement('li');
            let dest = [json[i].lon, json[i].lat];
            dest = ol.proj.fromLonLat(dest.map(Number));
            listItem.innerHTML = json[i].display_name;
            listItem.onclick = function () {
                setDestination(dest);
            };
            searchList.appendChild(listItem);
        }
    }).catch(function (err) {
        console.log(err);
    });
}

function setDestination(dest) {
    destinationMarker.getGeometry().setCoordinates(dest);
    if (!vectorSource.getFeatures().includes(destinationMarker)) {
        vectorSource.addFeature(destinationMarker);
    }
    calcRoute(dest);
}

function calcRoute(dest) {
    let myPosConv = ol.proj.toLonLat(myPos);
    dest = ol.proj.toLonLat(dest);
    console.log(dest);
    console.log(myPosConv);
    orsDirections.calculate({
        coordinates: [myPosConv, dest],
        profile: 'driving-car',
        geometry_format: 'polyline',
        format: 'json',
    }).then(function (json) {
        // Add your own result handling here
        createRoute(json.routes[0].geometry);
    }).catch(function (err) {
        console.error(err);
    });

    cameraAnim(ol.proj.fromLonLat(dest), myPos);
}

function cameraAnim(from, to) {
    let ext = ol.extent.boundingExtent([from, to]);
    view.fit(ext, map.getSize());
    view.setZoom(view.getZoom() - 0.5);
    setTimeout(function () {
        centerView(to);
    }, 1000);
}

function centerView() {
    view.animate({
        center: myPos,
        zoom: 18,
        duration: 2000
    })
}