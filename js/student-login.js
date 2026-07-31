// ============================================
// SB English Tuition
// Student Login System
// Version : 1.0
// Part : 1
// ============================================


// ============================================
// Firebase Configuration
// ============================================

const firebaseConfig = {

    apiKey: "AIzaSyDIOg_0tsEnh5oItSXA8j6EgrkWBdi07Nk",

    authDomain: "sb-english-tuition.firebaseapp.com",

    projectId: "sb-english-tuition",

    storageBucket: "sb-english-tuition.firebasestorage.app",

    messagingSenderId: "162778343838",

    appId: "1:162778343838:web:f21008cab298e19fa48e8f"

};


// ============================================
// Initialize Firebase
// ============================================

if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}

const db = firebase.firestore();


// ============================================
// Global Elements
// ============================================

const studentIdInput =
document.getElementById("studentId");

const passwordInput =
document.getElementById("password");

const loginBtn =
document.getElementById("loginBtn");

const loginMsg =
document.getElementById("loginMsg");

const togglePassword =
document.getElementById("togglePassword");

const forgotBtn =
document.getElementById("forgotBtn");


// ============================================
// Helper Function
// ============================================

function showMessage(text,color){

    loginMsg.textContent = text;

    loginMsg.style.color = color;

}


// ============================================
// Show / Hide Password
// ============================================

togglePassword.addEventListener("click",function(){

    if(passwordInput.type==="password"){

        passwordInput.type="text";

        togglePassword.textContent="🙈";

    }

    else{

        passwordInput.type="password";

        togglePassword.textContent="👁";

    }

});


// ============================================
// Login Button
// ============================================

loginBtn.addEventListener("click",studentLogin);


// ============================================
// Placeholder
// ============================================

async function studentLogin(){

    showMessage(
        "Login system loading...",
        "green"
    );

    console.log(
        "Student Login Started"
    );

}


// ============================================
// End
// ============================================

console.log(
"Student Login JS v1.0 Loaded"
);

