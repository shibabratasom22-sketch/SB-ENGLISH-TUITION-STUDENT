// ===============================
// SB ENGLISH TUITION LOGIN
// ===============================

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", loginUser);

function loginUser() {

    const studentId = document.getElementById("studentId").value.trim().toUpperCase();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMsg");

    msg.innerHTML = "";

    if(studentId === "" || password === ""){
        msg.innerHTML = "Enter Student ID & Password";
        return;
    }

    let email;

    // Admin Login
    if(studentId === "ADMIN"){
        email = "admin@sbenglishtuition.app";
    }

    // Student Login
    else{
        email = studentId.toLowerCase() + "@sbenglishtuition.app";
    }

    auth.signInWithEmailAndPassword(email,password)

    .then(()=>{

        msg.style.color="green";
        msg.innerHTML="Login Successful...";

        setTimeout(()=>{
            window.location.href="dashboard.html";
        },1000);

    })

    .catch((error)=>{

        msg.style.color="red";
        msg.innerHTML="Invalid ID or Password";

    });

}
