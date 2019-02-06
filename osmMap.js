(function () {

    let myPosMarker = new ol.Feature({
        id: 'myPositionMarker'
    });

    let map = new ol.Map({
        target: 'map',
        layers: [new ol.layer.Tile({
            source: new ol.source.OSM()
        }), new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [myPosMarker]
            })
        })],
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
        myPosMarker.setGeometry(new ol.geom.Point(projPos));
        console.log(projPos);
    });

    /*

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

    let myPos = ol.proj.fromLonLat(defaultCenter);

    let myMarker = new ol.Feature({
        geometry: new ol.geom.Point(myPos)
    });

    let markerClosest = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(defaultCenter))
    });
    markerClosest.setStyle(styles.x)







    let route = new ol.Feature({
        id: 'route',
        type: 'route',
        style: styles.route
    });
    route.setStyle(styles.route);
    vectorSource.addFeature(route);

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

    function findDestination(name) {
        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + name).then(function (response) {
            return response.json();
        }).then(function (json) {
            // clear out results
            for (let i = 0; i < json.length; i++) {
                let listItem = document.createElement('li');
                let dest = [json[i].lon, json[i].lat];
                dest = ol.proj.fromLonLat(dest.map(Number));
                listItem.innerHTML = json[i].display_name;
                listItem.onclick = function () {
                    clearChildren();
                    setDestination(dest);
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
    */

})();