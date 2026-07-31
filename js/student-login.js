// ============================================
// SB ENGLISH TUITION
// Student Login System
// Version : 2.0
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

studentIdInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        passwordInput.focus();

    }

});


passwordInput.addEventListener("keypress",function(e){

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
// Placeholder Functions
// ============================================

async function studentLogin(){

    console.log("Student Login");

}


function forgotPassword(){

    alert(
        "Forgot Password Module Coming Next"
    );

}


// ============================================
// Version
// ============================================

console.log(
"Student Login v2.0 Part 1 Loaded"
);

// ============================================
// Student Login System
// Version : 2.0
// Part : 2
// Login Verification
// ============================================


// ============================================
// Student Login
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

    showMessage(
        "",
        "green"
    );

    try{

        const snapshot =
        await db
        .collection("students")
        .where(
            "studentId",
            "==",
            studentId
        )
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
                "Account is inactive.",
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

        // =====================================
        // Save Session
        // =====================================

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

        showMessage(
            "Login Successful.",
            "green"
        );

        // =====================================
        // Part 3
        // Redirect Logic
        // =====================================

        console.log(student);

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

        loginBtn.textContent=
        "Login";

    }

}

// ============================================
// Student Login System
// Version : 2.0
// Part : 3
// Redirect & Session
// ============================================


// ============================================
// Redirect After Login
// ============================================

function redirectStudent(student){

    // First Login

    if(student.mustChangePassword===true){

        window.location.href=
        "change-password.html";

        return;

    }

    // Normal Login

    window.location.href=
    "student-dashboard.html";

}


// ============================================
// Save Complete Session
// ============================================

function saveStudentSession(docId,student){

    sessionStorage.setItem(
        "studentDocId",
        docId
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

}


// ============================================
// Auto Login Check
// ============================================

window.addEventListener("load",function(){

    const id=
    sessionStorage.getItem("studentId");

    if(id){

        console.log(
            "Student Session Found"
        );

    }

});


// ============================================
// IMPORTANT
// ============================================

/*

Part 4 এ

studentLogin()

Function-এর ভিতরে

sessionStorage.setItem()

গুলোর পরিবর্তে

শুধু

saveStudentSession(doc.id,student);

লিখবে

এবং

showMessage(
"Login Successful.",
"green"
);

এর নিচে

redirectStudent(student);

যোগ করব।

*/

