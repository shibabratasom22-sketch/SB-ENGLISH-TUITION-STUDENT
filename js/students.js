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
// ===============================
// Edit Mode
// ===============================

let editingDocId = null;
// ===============================
// Test
// ===============================

console.log("Students Module Loaded Successfully");
// ===============================
// Save Student
// ===============================

saveBtn.addEventListener("click", saveStudent);

async function saveStudent(){

    const name = document.getElementById("studentName").value.trim();
    const guardian = document.getElementById("guardianName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const studentClass = document.getElementById("studentClass").value;
    const monthlyFee = document.getElementById("monthlyFee").value;

    // Validation
    if(name === "" || guardian === "" || phone === "" || studentClass === "" || monthlyFee === ""){

        msg.style.color = "red";
        msg.textContent = "Please fill all fields.";
        return;

    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

 try{

    if(editingDocId){

        await db.collection("students").doc(editingDocId).update({

            name: name,
            guardian: guardian,
            phone: phone,
            studentClass: studentClass,
            monthlyFee: Number(monthlyFee)

        });

        msg.style.color = "green";
        msg.textContent = "Student updated successfully.";

        editingDocId = null;

        saveBtn.textContent = "➕ Save Student";

    }else{

        const studentId = await generateStudentId();

        await db.collection("students").add({

            studentId: studentId,
            name: name,
            guardian: guardian,
            phone: phone,
            studentClass: studentClass,
            monthlyFee: Number(monthlyFee),
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        msg.style.color = "green";
        msg.textContent = "Student added successfully.";

    }

    await loadStudents();

    document.getElementById("studentName").value = "";
    document.getElementById("guardianName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("studentClass").value = "";
    document.getElementById("monthlyFee").value = "";

}catch(error){

    console.error(error);

    msg.style.color = "red";
    msg.textContent = error.message;

 }

      
    saveBtn.disabled = false;
    saveBtn.textContent = "Save Student";

}
// ===============================
// Load Students
// ===============================

async function loadStudents() {

    const table = document.getElementById("studentTable");

    table.innerHTML = "<tr><td colspan='4' align='center'>Loading...</td></tr>";

    try {

        const snapshot = await db.collection("students")
            .orderBy("createdAt", "desc")
            .get();

const studentCount = document.getElementById("studentCount");
studentCount.innerHTML = `<b>Total Students: ${snapshot.size}</b>`;
      
        if (snapshot.empty) {

            table.innerHTML =
            "<tr><td colspan='4' align='center'>No Students Found</td></tr>";

            return;
        }

        table.innerHTML = "";

        snapshot.forEach(function(doc) {

            const student = doc.data();

            table.innerHTML += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.studentClass}</td>
                <td>
                    <button onclick="editStudent('${doc.id}')">✏️ Edit</button>
<button onclick="deleteStudent('${doc.id}')">🗑️ Delete</button>
                </td>
            </tr>
            `;

        });

    } catch (error) {

        console.error(error);

        table.innerHTML =
        "<tr><td colspan='4' align='center'>Failed to load students</td></tr>";

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

    }catch(error){

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

    }catch(error){

        console.error(error);

        alert("Failed to delete student.");

    }

};
