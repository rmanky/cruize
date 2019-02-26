osmMap = (function () {

    let searchBar = document.getElementById('search-bar');

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
        map.fitBounds([myPos, destination.coords], {
            padding: 50
        });
    }
    /*

    function cameraAnim(from, to) {
        let ext = ol.extent.boundingExtent([from, to]);
        map.getView().fit(ext, {duration: 1000, padding: [50, 50, 50, 50]});
    }
    */

    return {
        setDestination: async function () {
            let destination = await new Destination(searchBar.value);
            await setDestinationMarker(destination);
        }
    };
})();