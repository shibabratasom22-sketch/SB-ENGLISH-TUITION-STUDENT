// ============================================
// SB ENGLISH TUITION
// Student Login System
// Version : 3.0
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

if(!firebase.apps.length){

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

const forgotBtn =
document.getElementById("forgotBtn");

const loginMsg =
document.getElementById("loginMsg");

const togglePassword =
document.getElementById("togglePassword");


// ============================================
// Helper Function
// ============================================

function showMessage(text,color){

    loginMsg.textContent=text;

    loginMsg.style.color=color;

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
// Enter Key Support
// ============================================

studentIdInput.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        passwordInput.focus();

    }

});

passwordInput.addEventListener("keydown",function(e){

    if(e.key==="Enter"){

        studentLogin();

    }

});


// ============================================
// Button Events
// ============================================

loginBtn.addEventListener(
    "click",
    studentLogin
);

forgotBtn.addEventListener(
    "click",
    forgotPassword
);


// ============================================
// Login Function
// ============================================

async function studentLogin(){

    // Part 2

}


// ============================================
// Forgot Password
// ============================================

function forgotPassword(){

    // Part 5

}


// ============================================
// Version
// ============================================

console.log(
"Student Login v3.0 Part 1 Loaded"
);

// ============================================
// Student Login System
// Version : 3.0
// Part : 2
// Complete Login Logic
// ============================================

async function studentLogin(){

    const studentId =
    studentIdInput.value
    .trim()
    .toUpperCase();

    const password =
    passwordInput.value
    .trim();

    if(studentId===""){

        showMessage(
            "Please enter Student ID.",
            "red"
        );

        studentIdInput.focus();

        return;

    }

    if(password===""){

        showMessage(
            "Please enter Password.",
            "red"
        );

        passwordInput.focus();

        return;

    }

    loginBtn.disabled=true;

    loginBtn.textContent=
    "Logging In...";

    showMessage("","green");

    try{

        const snapshot =
        await db
        .collection("students")
        .where("studentId","==",studentId)
        .limit(1)
        .get();

        if(snapshot.empty){

            showMessage(
                "Student ID not found.",
                "red"
            );

            return;

        }

        const doc =
        snapshot.docs[0];

        const student =
        doc.data();

        if(student.active===false){

            showMessage(
                "Your account is inactive.",
                "red"
            );

            return;

        }

        if(student.password!==password){

            showMessage(
                "Incorrect Password.",
                "red"
            );

            return;

        }

        sessionStorage.setItem(
            "studentDocId",
            doc.id
        );

        sessionStorage.setItem(
            "studentId",
            student.studentId
        );

        sessionStorage.setItem(
            "studentName",
            student.name
        );

        sessionStorage.setItem(
            "studentClass",
            student.studentClass
        );

        sessionStorage.setItem(
            "studentPhone",
            student.phone
        );

        sessionStorage.setItem(
            "studentGuardian",
            student.guardian
        );

        sessionStorage.setItem(
            "studentFee",
            student.monthlyFee
        );

        sessionStorage.setItem(
            "mustChangePassword",
            student.mustChangePassword
        );

        showMessage(
            "Login Successful...",
            "green"
        );

        // Redirect Part 3-এ হবে

    }

    catch(error){

        console.error(error);

        showMessage(
            error.message,
            "red"
        );

    }

    finally{

        loginBtn.disabled=false;

        loginBtn.textContent="Login";

    }

}
