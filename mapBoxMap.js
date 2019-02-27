mapBoxMap = (function () {

    let searchBar = document.getElementById('search-input');

    let map = new mapboxgl.Map({
      container: 'map',
      style: 'https://maps.tilehosting.com/styles/streets/style.json?key=krA7AaiD6YOc6KJVbdfr',
      center: [0, -0],
      zoom: 1.28
    });

    let destinationMarker = new mapboxgl.Marker().setLngLat([0,0]).addTo(map);

    let myPos = [0,0];

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
        destinationMarker.setLngLat(destination.coords);
        console.log(myPos);
    }

    return {
        setDestination: async function () {
            let destination = await new Destination(searchBar.value);
            await setDestinationMarker(destination);
            map.fitBounds([myPos, destination.coords], {
                padding: 100
            });
            let geoJson = await new Route(myPos, destination.coords);
            if(map.getLayer('route') == undefined) {
                map.addLayer({
                    "id": "route",
                    "type": "line",
                    "source": {
                        "type": "geojson",
                        "data": geoJson }
                });
            }
            else {
                 map.getSource('route').setData(geoJson);
            }
        }
    };
})();