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

    loadStudents();

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

let editingDocId = null;

console.log("Students Module Loaded");

// ===============================
// Save Student
// ===============================

saveBtn.addEventListener("click", saveStudent);

async function saveStudent(){

    const name = document.getElementById("studentName").value.trim();
    const guardian = document.getElementById("guardianName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();
    const monthlyFee = document.getElementById("monthlyFee").value.trim();

    if(!name || !guardian || !phone || !studentClass || !monthlyFee){

        msg.style.color="red";
        msg.textContent="Please fill all fields.";
        return;

    }

    saveBtn.disabled=true;
    saveBtn.textContent="Saving...";

    try{

        if(editingDocId){

            await db.collection("students").doc(editingDocId).update({

                name,
                guardian,
                phone,
                studentClass,
                monthlyFee:Number(monthlyFee)

            });

            msg.style.color="green";
            msg.textContent="Student updated successfully.";

            editingDocId=null;

            saveBtn.textContent="➕ Save Student";

        }else{

            const studentId=await generateStudentId();

            await db.collection("students").add({

                studentId,
                name,
                guardian,
                phone,
                studentClass,
                monthlyFee:Number(monthlyFee),
                active:true,
                createdAt:firebase.firestore.FieldValue.serverTimestamp()

            });

            msg.style.color="green";
            msg.textContent="Student added successfully.";

        }

        

        await loadStudents();

clearForm();
      
    }catch(error){

        console.error(error);

        msg.style.color="red";
        msg.textContent=error.message;

    }

    saveBtn.disabled=false;
    saveBtn.textContent="➕ Save Student";

}

// ===============================
// Load Students
// ===============================

async function loadStudents() {

    const container = document.getElementById("studentTable");

    container.innerHTML = "<p style='text-align:center'>Loading students...</p>";

    try {

        const snapshot = await db.collection("students")
            .orderBy("createdAt", "desc")
            .get();

        document.getElementById("studentCount").textContent = snapshot.size;

        if (snapshot.empty) {
            container.innerHTML = "<p style='text-align:center'>No Students Found</p>";
            return;
        }

        container.innerHTML = "";

        snapshot.forEach(function(doc){

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

    } catch(error){

        console.error(error);

        container.innerHTML =
        "<p style='text-align:center;color:red;'>Failed to load students.</p>";

    }

}

// ===============================
// Edit Student
// ===============================

window.editStudent = async function(docId){

    try{

        const doc = await db.collection("students").doc(docId).get();

        if(!doc.exists){
            alert("Student not found.");
            return;
        }

        const student = doc.data();

        editingDocId = docId;

        document.getElementById("studentName").value = student.name;
        document.getElementById("guardianName").value = student.guardian;
        document.getElementById("phone").value = student.phone;
        document.getElementById("studentClass").value = student.studentClass;
        document.getElementById("monthlyFee").value = student.monthlyFee;

        saveBtn.textContent = "✏️ Update Student";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch(error){

        console.error(error);
        alert("Failed to load student.");

    }

};

// ===============================
// Delete Student
// ===============================

window.deleteStudent = async function(docId){

    if(!confirm("Delete this student?")) return;

    try{

        await db.collection("students").doc(docId).delete();

        alert("Student deleted successfully.");

        loadStudents();

    } catch(error){

        console.error(error);

        alert("Failed to delete student.");

    }

};

// ===============================
// Search Student
// ===============================

window.searchStudent = function(){

    const filter = document
        .getElementById("searchStudent")
        .value
        .toUpperCase();

    const cards = document.getElementsByClassName("student-card");

    for(let i = 0; i < cards.length; i++){

        const text = cards[i].innerText.toUpperCase();

        if(text.indexOf(filter) > -1){
            cards[i].style.display = "";
        }else{
            cards[i].style.display = "none";
        }

    }

};

// ===============================
// Reset Form
// ===============================

function clearForm(){

    document.getElementById("studentName").value = "";
    document.getElementById("guardianName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("monthlyFee").value = "";

    editingDocId = null;

    saveBtn.textContent = "➕ Save Student";

    msg.textContent = "";

}

// ===============================
// End of students.js
// ===============================

console.log("SB English Tuition Student Module Loaded Successfully");
