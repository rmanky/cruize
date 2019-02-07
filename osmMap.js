osmMap = (function () {

    let myPos = [0, 0];

    let myPosMarker = new ol.Feature({
        geometry: new ol.geom.Point(myPos)
    });
    //myPosMarker.setId('myPositionMarker');

    let destinationMarker = new ol.Feature({
        geometry: new ol.geom.Point(myPos),
        style: new ol.style.Style()
    });
    //destinationMarker.setId('destinationMarker');

    let navigationRoute = new ol.Feature({
        id: 'route',
        type: 'route'
    });

    let vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [myPosMarker, destinationMarker, navigationRoute]
        })
    });

    let map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({
            source: new ol.source.OSM()
        }), vectorLayer],
        view: new ol.View({
            center: ol.proj.fromLonLat([-96, 40]),
            zoom: 4
        })
    });

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
        myPos = projPos;
        myPosMarker.getGeometry().setCoordinates(myPos);
        console.log(projPos);
    });

    function setDestinationMarker(destination) {
        if(destinationMarker.getStyle() != null) {
            destinationMarker.setStyle(null);
            console.log('UNHIDE');
        }
        destinationMarker.getGeometry().setCoordinates(destination.coords);
        cameraAnim(myPos, destination.coords);
    }

    function cameraAnim(from, to) {
        let ext = ol.extent.boundingExtent([from, to]);
        let view = map.getView();
        view.fit(ext, map.getSize());
        view.setZoom(view.getZoom() - 0.5);
    }

    return {
        setDestination: async function (placeName) {
            let destination = await new Destination(placeName);
            setDestinationMarker(destination);
        }
    };

    /*
    function createRoute(polyline) {
        let newPolyline = polyline.map(function (pos, index) {
            pos = ol.proj.fromLonLat(pos);
            return [pos[0], pos[1], index]
        });
        let newRoute = new ol.geom.MultiLineString([newPolyline], 'XYM');
        route.setGeometry(newRoute);
        moveClosestMarker();
    }

    function moveClosestMarker() {
        let closestPoint = route.getGeometry().getClosestPoint(myPos);
        markerClosest.getGeometry().setCoordinates(closestPoint);
        console.log(Math.round(closestPoint[2]));
    }

    let destinationMarker = new ol.Feature({
        geometry: new ol.geom.Point([0, 0]),
    });
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
    */

})();