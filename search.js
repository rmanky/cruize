class Destination {
    constructor(placeName) {
        return (async () => {
            // All async code here
            let data = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + placeName).then(
                response => response.json()
            ).then(function(json) {
                let dest = [json[0].lon, json[0].lat];
                dest = dest.map(Number);
                dest = ol.proj.fromLonLat(dest);
                let name = json[0].display_name;
                return Promise.resolve([dest, name])
            }).catch(
                err => console.log(err)
            );

            this.coords = data[0];
            this.placeName = data[1];

            return this; // when done
        })();
    }
}