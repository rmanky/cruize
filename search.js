class Destination {
    constructor(placeName) {
        return (() => {
            // All async code here
            return fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + placeName).then(
                response => response.json()
            ).then(function(json) {
                if(json[0] != undefined) {
                    return Promise.resolve(json[0])
                }
            }).catch(function (err) {
                return Promise.reject(err)
            });
        })();
    }
}