// ============================================
// SB ENGLISH TUITION
// Student Management System
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

if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}

const auth = firebase.auth();

const db = firebase.firestore();


// ============================================
// Global Variables
// ============================================

const saveBtn =
document.getElementById("saveStudentBtn");

const msg =
document.getElementById("saveMsg");

let editingDocId = null;


// ============================================
// Check Admin Login
// ============================================

auth.onAuthStateChanged(function(user){

    if(!user){

        window.location.href = "index.html";

        return;

    }

    if(user.email !== "admin@sbenglishtuition.app"){

        window.location.href = "dashboard.html";

        return;

    }

    loadStudents();

});


// ============================================
// Generate Student ID
// Example:
// SBET001
// SBET002
// SBET003
// ============================================

async function generateStudentId(){

    const snapshot = await db
        .collection("students")
        .get();

    const count = snapshot.size + 1;

    const studentId =
        "SBET" +
        String(count).padStart(3,"0");

    return studentId;

}


// ============================================
// Helper Function
// ============================================

function showMessage(text,color){

    msg.textContent = text;

    msg.style.color = color;

}


console.log("Student Module v2.0 Loaded");

// ============================================
// Save Student
// ============================================

saveBtn.addEventListener("click", saveStudent);

async function saveStudent(){
alert("NEW STUDENTS.JS RUNNING");
    const name =
    document.getElementById("studentName").value.trim();

    const guardian =
    document.getElementById("guardianName").value.trim();

    const phone =
    document.getElementById("phone").value.trim();

    const studentClass =
    document.getElementById("studentClass").value.trim();

    const monthlyFee =
    document.getElementById("monthlyFee").value.trim();


    if(
        !name ||
        !guardian ||
        !phone ||
        !studentClass ||
        !monthlyFee
    ){

        showMessage(
            "Please fill all fields.",
            "red"
        );

        return;

    }


    saveBtn.disabled = true;

    saveBtn.textContent = "Saving...";


    try{

        if(editingDocId){

            await db
            .collection("students")
            .doc(editingDocId)
            .update({

                name,
                guardian,
                phone,
                studentClass,
                monthlyFee:Number(monthlyFee)

            });

            showMessage(
                "Student updated successfully.",
                "green"
            );

            editingDocId = null;

        }

        else{

            const studentId =
            await generateStudentId();

            await db
            .collection("students")
            .add({

                studentId,

                password:"123456",

                mustChangePassword:true,

                name,

                guardian,

                phone,

                studentClass,

                monthlyFee:Number(monthlyFee),

                active:true,

                createdAt:
                firebase.firestore.FieldValue.serverTimestamp()

            });

            showMessage(
                "Student added successfully.",
                "green"
            );

        }

        await loadStudents();

        clearForm();

    }

    catch(error){

        console.error(error);

        showMessage(
            error.message,
            "red"
        );

    }

    saveBtn.disabled = false;

    saveBtn.textContent =
    "➕ Save Student";

}

// ============================================
// Load Students
// ============================================

async function loadStudents(){

    const container =
    document.getElementById("studentTable");

    container.innerHTML =
    "<p style='text-align:center;'>Loading students...</p>";

    try{

        const snapshot = await db
        .collection("students")
        .orderBy("createdAt","desc")
        .get();

        document.getElementById("studentCount").textContent =
        snapshot.size;

        if(snapshot.empty){

            container.innerHTML =
            "<p style='text-align:center;'>No Students Found</p>";

            return;

        }

        container.innerHTML = "";

        snapshot.forEach(doc=>{

            const student = doc.data();

            container.innerHTML += `

<div class="student-card">

    <div class="student-header">

        <div>

            <h3>👤 ${student.name}</h3>

            <small>${student.studentId}</small>

        </div>

        <span class="status-badge">

            ${student.active ? "🟢 Active" : "🔴 Inactive"}

        </span>

    </div>

    <p><b>🎓 Class:</b> ${student.studentClass}</p>

    <p><b>👨 Guardian:</b> ${student.guardian}</p>

    <p><b>📞 Phone:</b> ${student.phone}</p>

    <p><b>💰 Monthly Fee:</b> ₹${student.monthlyFee}</p>

    <p><b>🔑 Default Password:</b> ${student.password || "Not Set"}</p>

    <div class="student-actions">

        <button onclick="editStudent('${doc.id}')">
            ✏️ Edit
        </button>

        <button onclick="deleteStudent('${doc.id}')">
            🗑 Delete
        </button>

    </div>

</div>

`;

        });

    }

    catch(error){

        console.error(error);

        container.innerHTML =
        "<p style='text-align:center;color:red;'>Failed to load students.</p>";

    }

}

// ============================================
// Edit Student
// ============================================

window.editStudent = async function(docId){

    try{

        const docRef = await db
            .collection("students")
            .doc(docId)
            .get();

        if(!docRef.exists){

            alert("Student not found.");

            return;

        }

        const student = docRef.data();

        editingDocId = docId;

        document.getElementById("studentName").value =
        student.name;

        document.getElementById("guardianName").value =
        student.guardian;

        document.getElementById("phone").value =
        student.phone;

        document.getElementById("studentClass").value =
        student.studentClass;

        document.getElementById("monthlyFee").value =
        student.monthlyFee;

        saveBtn.textContent =
        "✏️ Update Student";

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

    catch(error){

        console.error(error);

        alert("Failed to load student.");

    }

};


// ============================================
// Delete Student
// ============================================

window.deleteStudent = async function(docId){

    const confirmDelete =
    confirm("Delete this student?");

    if(!confirmDelete){

        return;

    }

    try{

        await db
            .collection("students")
            .doc(docId)
            .delete();

        await loadStudents();

        alert("Student deleted successfully.");

    }

    catch(error){

        console.error(error);

        alert("Delete failed.");

    }

};

// ============================================
// Search Student
// ============================================

window.searchStudent = function(){

    const filter = document
        .getElementById("searchStudent")
        .value
        .toUpperCase();

    const cards =
        document.getElementsByClassName("student-card");

    for(let i=0;i<cards.length;i++){

        const text =
        cards[i].innerText.toUpperCase();

        if(text.indexOf(filter)>-1){

            cards[i].style.display="";

        }else{

            cards[i].style.display="none";

        }

    }

};


// ============================================
// Clear Form
// ============================================

function clearForm(){

    document.getElementById("studentName").value="";
    document.getElementById("guardianName").value="";
    document.getElementById("phone").value="";
    document.getElementById("studentClass").value="";
    document.getElementById("monthlyFee").value="";

    editingDocId = null;

    saveBtn.textContent =
    "➕ Save Student";

    msg.textContent="";

}


// ============================================
// Future Features Reserved
// ============================================

/*

Upcoming Features

✔ Student Photo

✔ Reset Password

✔ Activate / Deactivate

✔ Fee Status

✔ Attendance

✔ Exam Result

✔ Parent Mobile

✔ Email

✔ Profile View

*/


// ============================================
// End
// ============================================

console.log(
"SB English Tuition Student Management v2.0 Ready"
);
