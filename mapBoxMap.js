mapBoxMap = (function() {

    let labelId = "background";

    let searchBar = document.getElementById('search-input');
    let beginNav = document.getElementById('begin-nav');

    let destinationMarker = new mapboxgl.Marker();

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/streets/style.json?key=krA7AaiD6YOc6KJVbdfr',
        center: [0, -0],
        zoom: 1.28,
        attributionControl: false
    });

    map.addControl(new mapboxgl.AttributionControl(), 'top-left');

    let myPos = [0, 0];

    let geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    });

    map.addControl(geolocate);

    geolocate.on('geolocate', (e) => {
        myPos = [e.coords.longitude, e.coords.latitude];
    });

    map.on('load', function() {
        geolocate.trigger();

        // find the first layer with symbols to draw route behind
        let layers = map.getStyle().layers;
        for(i = 0; i < layers.length; i++) {
            let layer = layers[i];
            if (layer.type == 'symbol') {
                labelId = layer.id;
                break;
            }
        }
    });

    function removeRoute() {
        // Check to see if there is an existing route and remove it
        if (map.getLayer('route') != undefined) {
            map.removeLayer('route');
            map.removeSource('route');
        }
        beginNav.classList.remove('beginNav');
    }

    function setMarker(destination, destinationName) {
        removeRoute();
        destinationMarker.setLngLat(destination);
        destinationMarker.addTo(map);

        beginNav.classList.add("beginNav");
        document.getElementById("destName").innerHTML = destinationName;
    }

    function setRoute(routes) {
        let geoJson = routes[0].geometry;
        let coordinates = geoJson.coordinates;
        let bounds = coordinates.reduce(function(bounds, coord) {
            return bounds.extend(coord);
        }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

        map.fitBounds(bounds, {
            padding: {
                top: 100,
                bottom: 200,
                left: 100,
                right: 100
            }
        });

        let routeLayer = map.addLayer({
            "id": "route",
            "type": "line",
            "source": {
                "type": "geojson",
                "data": geoJson
            },
            "paint": {
                'line-color': '#3887be',
                'line-width': {
                    base: 1,
                    stops: [[12, 3], [22, 12]]
                }
            }
        }, labelId);
    }

    function noDestination() {
        console.log("Destination Not Found");
        searchBar.classList.add('invalid');
        setTimeout(function() {
            searchBar.classList.remove('invalid');
        }, 500);
    }

    function noRoute() {
        console.log("Route Not Found");
    }

    return {
        setDestination: async function() {
            try {
                let destinationJson = await new Destination(searchBar.value);
                let firstDest = destinationJson.features[0];
                let dest = firstDest.center;
                setMarker(dest, firstDest.place_name);
                let routeJson = await new Route(myPos, dest, setRoute);
                setRoute(routeJson.routes);
            }
            catch (err) {
                noDestination();
                console.log(err);
            }
        }
    };
})();