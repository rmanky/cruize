mapStyles = {
    marker: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }),
    route: new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: 8, color: [72, 61, 139]
        })
    })
};