osmMap = (function () {

    let searchBar = document.getElementById('search-bar');

    /*

    let myPos = new ol.geom.Point([0, 0]);

    let myPosMarker = new ol.Feature({
        geometry: myPos,
    });
    myPosMarker.setStyle(mapStyles.marker);
    console.log(myPosMarker.getStyle());

    //myPosMarker.setId('myPositionMarker');
    let destinationMarker = new ol.Feature({
        geometry: new ol.geom.Point([0, 0])
    });

    //destinationMarker.setId('destinationMarker');
    let navigationRoute = new ol.Feature({
        id: 'route',
        type: 'route',
    });
    navigationRoute.setStyle(mapStyles.route);

    let vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [myPosMarker, destinationMarker, navigationRoute]
        })
    });

    */

    let map = new mapboxgl.Map({
      container: 'map',
      style: 'https://maps.tilehosting.com/styles/basic/style.json?key=krA7AaiD6YOc6KJVbdfr',
      center: [0, -0],
      zoom: 1.28
    });

    let geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
        trackUserLocation: true
    });

    map.addControl(geolocate);

    map.on('load', function() {
        geolocate.trigger();
    });

    /*

    let geolocation = new ol.Geolocation({
        // take the projection to use from the map's view
        tracking: true,
        trackingOptions: {
            enableHighAccuracy: true
        }
    });

    // listen to changes in position
    geolocation.on('change', function () {
        let projPos = ol.proj.fromLonLat(geolocation.getPosition());
        myPos.setCoordinates(projPos);
        console.log(projPos);
    });

    function setDestinationMarker(destination) {
        destinationMarker.getGeometry().setCoordinates(destination.coords);
        let newRoute = new Route(myPos.getCoordinates(), destination.coords);
        newRoute.then(function (polyRoute) {
            navigationRoute.setGeometry(polyRoute);
            cameraAnim(myPos.getCoordinates(), destination.coords);
        });
    }

    function cameraAnim(from, to) {
        let ext = ol.extent.boundingExtent([from, to]);
        map.getView().fit(ext, {duration: 1000, padding: [50, 50, 50, 50]});
    }

    return {
        setDestination: async function () {
            searchBar.blur();
            let destination = await new Destination(searchBar.value);
            await setDestinationMarker(destination);
        }
    };
    */
})();