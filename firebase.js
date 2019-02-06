function initFirebase() {
    const config = {
        apiKey: "AIzaSyAlBJ7jY4OW4M4_HtXRlqUzOFrbNK0IeXM",
        authDomain: "cruize-4dc36.firebaseapp.com",
        databaseURL: "https://cruize-4dc36.firebaseio.com",
        projectId: "cruize-4dc36",
        storageBucket: "cruize-4dc36.appspot.com",
        messagingSenderId: "684724289672"
    };
    console.log("Firebase: Begin!");
    firebase.initializeApp(config);
}

initFirebase();