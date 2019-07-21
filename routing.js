class Route {
    constructor(pos, dest, setRoute) {
        this.pos = pos;
        this.dest = dest;
        this.setRoute = setRoute;

    }

    getRoute() {
        let setRoute = this.setRoute;

        var request = new XMLHttpRequest();
        let apiKey = '5b3ce3597851110001cf62487047438327554bc38492d0c77626eeb2';
        let routeFetchURL = 'https://api.openrouteservice.org/v2/directions/driving-car?api_key=' + apiKey + '&start=' + this.pos + '&end=' + this.dest;

        request.open('GET', routeFetchURL);

        request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');

        request.send();

        request.onload = function() {
            let json = JSON.parse(request.response);
            setRoute(json.features[0]);
        }
    }
}

