// =====================================
// SB ENGLISH TUITION
// students.js (Part 1)
// =====================================

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDIOg_0tsEnh5oItSXA8j6EgrkWBdi07Nk",
  authDomain: "sb-english-tuition.firebaseapp.com",
  projectId: "sb-english-tuition",
  storageBucket: "sb-english-tuition.firebasestorage.app",
  messagingSenderId: "162778343838",
  appId: "1:162778343838:web:f21008cab298e19fa48e8f"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// ===============================
// Admin Login Check
// ===============================

auth.onAuthStateChanged(function(user){

    if(!user){
        window.location.href = "index.html";
        return;
    }

    if(user.email !== "admin@sbenglishtuition.app"){
        window.location.href = "dashboard.html";
        return;
    }

});

// ===============================
// Generate Student ID
// ===============================

async function generateStudentId(){

    const snapshot = await db.collection("students").get();

    const count = snapshot.size + 1;

    return "SBET" + String(count).padStart(3,"0");

}

// ===============================
// Button Reference
// ===============================

const saveBtn = document.getElementById("saveStudentBtn");
const msg = document.getElementById("saveMsg");

// ===============================
// Test
// ===============================

console.log("Students Module Loaded Successfully");
