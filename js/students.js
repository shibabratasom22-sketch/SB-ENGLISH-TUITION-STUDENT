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
await loadStudents();
        // Reset Form
        document.getElementById("studentName").value = "";
        document.getElementById("guardianName").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("studentClass").selectedIndex = 0;
        document.getElementById("monthlyFee").value = "";

    }catch(error){

        console.error(error);

        msg.style.color = "red";
        msg.textContent = "Failed to save student.";

    }

    saveBtn.disabled = false;
    saveBtn.textContent = "Save Student";

}
// ===============================
// Load Students
// ===============================

async function loadStudents(){

    const table = document.getElementById("studentTable");

    table.innerHTML = "<tr><td colspan='3' align='center'>Loading...</td></tr>";

    try{

        const snapshot = await db.collection("students")
            .orderBy("createdAt","desc")
            .get();

        if(snapshot.empty){

            table.innerHTML = "<tr><td colspan='3' align='center'>No Students Found</td></tr>";

            return;

        }

        table.innerHTML = "";

        snapshot.forEach(function(doc){

            const student = doc.data();

            table.innerHTML += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.studentClass}</td>
            </tr>
            `;

        });

    }catch(error){

        console.error(error);

        table.innerHTML =
        "<tr><td colspan='3' align='center'>Failed to load students</td></tr>";

    }

}
