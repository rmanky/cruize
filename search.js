class Destination {
    constructor(placeName) {
        return (async () => {
            // All async code here
            return await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + placeName).then(
                response => response.json()
            ).then(function(json) {
                if(json[0] != undefined) {
                    let dest = [json[0].lon, json[0].lat];
                    dest = dest.map(Number);
                    return Promise.resolve(dest)
                }
            }).catch(function (err) {
                console.error(err);
            });
        })();
    }
}