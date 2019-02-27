mapBoxMap = (function() {

    let searchBar = document.getElementById('search-input');

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

    function setDestinationMarker(destination) {
        destinationMarker.setLngLat(destination);
        destinationMarker.addTo(map);
        map.fitBounds([myPos, destination], {
            padding: 100
        });
    }

    function setRoute(geoJson) {
        // Check to see if there is an existing route
        if (map.getLayer('route') == undefined) {
            // If not, add a route to the map with our geoJson
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
        }
        // If the route layer exists, just set its data
        else {
            map.getSource('route').setData(geoJson);
            map.setLayoutProperty('route', 'visibility', 'visible');
        }
    }

    return {
        setDestination: async function() {
            let destination = await new Destination(searchBar.value);
            if (destination == undefined) {
                console.log("Destination Not Found");
                return;
            }
            setDestinationMarker(destination);
            let geoJson = await new Route(myPos, destination);
            if (geoJson == undefined) {
                console.log("No Route Found");
                if (map.getLayer('route') != undefined) {
                    map.setLayoutProperty('route', 'visibility', 'none');
                }
                return;
            }
            setRoute(geoJson);
        }
    };
})();