class Destination {
    constructor(placeName) {
        return (() => {
            let apiKey = 'pk.eyJ1Ijoicm1hbmt5MTIiLCJhIjoiY2szNHdmZ2R4MDAzazNob2RzdHg2ODVkbSJ9.aeyiII8rVSEJNilhvwXXcg';
            let searchFetchURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + placeName + ".json" + "?access_token=" + apiKey;

            return fetch(searchFetchURL).then(
                response => response.json()
            ).then((json) => {
                return Promise.resolve(json);
            }).catch((err) => {
                return Promise.reject(err);
            })
        })();
    }
}