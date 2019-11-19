class Route {
    constructor(pos, dest, setRoute) {
        return (() => {
            let options = "&overview=full&geometries=geojson&steps=true";
            let apiKey = 'pk.eyJ1Ijoicm1hbmt5MTIiLCJhIjoiY2szNHdmZ2R4MDAzazNob2RzdHg2ODVkbSJ9.aeyiII8rVSEJNilhvwXXcg';
            let routeFetchURL = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/';

            return fetch(routeFetchURL +  pos + ';' + dest + ".json?access_token=" + apiKey + options).then(
                response => response.json()
            ).then((json) => {
                console.log(json);
                return Promise.resolve(json);
            }).catch((err) => {
                return Promise.reject(err);
            })
        })();
    }
}