/* ==========================================
   SB English Tuition
   Firebase v2.0
========================================== */

/* ==========================================
   Firebase Configuration
========================================== */

const firebaseConfig = {

    apiKey: "AIzaSyDIOg_0tsEnh5oItSXA8j6EgrkWBdi07Nk",

    authDomain: "sb-english-tuition.firebaseapp.com",

    projectId: "sb-english-tuition",

    storageBucket: "sb-english-tuition.firebasestorage.app",

    messagingSenderId: "162778343838",

    appId: "1:162778343838:web:f21008cab298e19fa48e8f"

};

/* ==========================================
   Initialize Firebase
========================================== */

if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}

/* ==========================================
   Firebase Services
========================================== */

const db = firebase.firestore();

const auth = firebase.auth();

/* ==========================================
   Firestore Settings
========================================== */

db.settings({

    ignoreUndefinedProperties: true

});

/* ==========================================
   Authentication
========================================== */

auth.useDeviceLanguage();

/* ==========================================
   Global Timestamp Helpers
========================================== */

function serverTimestamp() {

    return firebase.firestore.FieldValue.serverTimestamp();

}

function timestampNow() {

    return firebase.firestore.Timestamp.now();

}

/* ==========================================
   Global Access
========================================== */

// Make Firebase services available everywhere

window.db = db;
window.auth = auth;
window.serverTimestamp = serverTimestamp;
window.timestampNow = timestampNow;

/* ==========================================
   Firebase Status
========================================== */

console.log("==================================");
console.log("SB English Tuition");
console.log("Firebase v2.0 Loaded");
console.log("Project :", firebaseConfig.projectId);
console.log("==================================");

/* ==========================================
   Network Status
========================================== */

window.addEventListener("online", () => {

    console.log("✅ Internet Connected");

});

window.addEventListener("offline", () => {

    console.log("❌ Internet Disconnected");

});

/* ==========================================
   Auth State Listener
========================================== */

auth.onAuthStateChanged((user) => {

    if (user) {

        console.log("Admin Logged In :", user.email);

    } else {

        console.log("Guest Mode");

    }

});
