mapBoxMap = (function() {

    let searchBar = document.getElementById('search-input');
    let beginNav = document.getElementById('begin-nav');

    let destinationMarker = new mapboxgl.Marker();

    let map = new mapboxgl.Map({
        container: 'map',
        style: 'https://maps.tilehosting.com/styles/streets/style.json?key=krA7AaiD6YOc6KJVbdfr',
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
    });

    function removeRoute() {
        // Check to see if there is an existing route and remove it
        if (map.getLayer('route') != undefined) {
            map.removeLayer('route');
            map.removeSource('route');
        }
        beginNav.classList.remove('beginNav');
    }

    function setMarker(destination) {
        destinationMarker.setLngLat(destination);
        destinationMarker.addTo(map);
        map.fitBounds([myPos, destination], {
            padding: 100
        });
        removeRoute();
    }

    function setRoute(geoJson) {
        // Add a route to the map with our geoJson
        map.addLayer({
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
        });

        beginNav.classList.add('beginNav')
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

    function getRoute(destination) {
        let geoJson = new Route(myPos, destination, setRoute);
        geoJson.getRoute();
    }



    return {
        setDestination: async function() {
            try {
                let destination = await new Destination(searchBar.value);
                setMarker(destination);
                getRoute(destination);
            }
            catch (err) {
                noDestination();
                console.log(err);
            }
        }
    };


})();