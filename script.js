/**
 * Create google maps Map instance.
 * @param {number} lat
 * @param {number} lng
 * @return {Object}
 */
var config = {
    apiKey: "AIzaSyAlBJ7jY4OW4M4_HtXRlqUzOFrbNK0IeXM",
    authDomain: "cruize-4dc36.firebaseapp.com",
    databaseURL: "https://cruize-4dc36.firebaseio.com",
    projectId: "cruize-4dc36",
    storageBucket: "cruize-4dc36.appspot.com",
    messagingSenderId: "684724289672"
};
console.log("Firebase: Begin!");
firebase.initializeApp(config);

const createMap = ({ lat, lng }) => {
    return new google.maps.Map(document.getElementById('map'), {
        center: {lat, lng},
        disableDefaultUI: true,
        mapTypeId: 'satellite',
        tilt: 45,
        zoom: 20
    });
};

/**
 * Create google maps Marker instance.
 * @param {Object} map
 * @param {Object} position
 * @return {Object}
 */
const createMarker = ({ map, position }) => {
    let icon = {
        url: 'https://openclipart.org/image/2400px/svg_to_png/192456/car-black.png', // url
        scaledSize: new google.maps.Size(35,75),
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(35 / 2, 75 / 2) // anchor
    };
    return new google.maps.Marker({map, icon, position});
};

/**
 * Track the user location.
 * @param {Object} onSuccess
 * @param {Object} [onError]
 * @return {number}
 */
const trackLocation = ({ onSuccess, onError = () => { } }) => {
    if ('geolocation' in navigator === false) {
        return onError(new Error('Geolocation is not supported by your browser.'));
    }

    return navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
};

/**
 * Get position error message from the given error code.
 * @param {number} code
 * @return {String}
 */
const getPositionErrorMessage = code => {
    switch (code) {
        case 1:
            return 'Permission denied.';
        case 2:
            return 'Position unavailable.';
        case 3:
            return 'Timeout reached.';
    }
}

/**
 * Initialize the application.
 * Automatically called by the google maps API once it's loaded.
 */
function init() {
    const initialPosition = { lat: 59.32, lng: 17.84 };
    const map = createMap(initialPosition);
    const marker = createMarker({ map, position: initialPosition });

    let watchId = trackLocation({
        onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
            marker.setPosition({ lat, lng });
            map.panTo({ lat, lng });
        },
        onError: err => {
            console.log(`Error: ${err.message || getPositionErrorMessage(err.code)}`);
        }
    });
}