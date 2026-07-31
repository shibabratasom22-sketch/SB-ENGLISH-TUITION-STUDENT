// ==========================
// SB English Tuition
// Student Login JS v1.0
// Part 3.1
// ==========================

// Elements

const loginForm = document.getElementById("studentLoginForm");

const studentId = document.getElementById("studentId");

const password = document.getElementById("password");

const togglePassword =
document.getElementById("togglePassword");


// ==========================
// Show / Hide Password
// ==========================

togglePassword.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";

        togglePassword.innerHTML =
        '<i class="fas fa-eye-slash"></i>';

    }

    else{

        password.type = "password";

        togglePassword.innerHTML =
        '<i class="fas fa-eye"></i>';

    }

});

// ==========================
// Basic Login Validation
// ==========================

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const id = studentId.value.trim().toUpperCase();
    const pass = password.value.trim();

    if (id === "") {
        alert("Please enter Student ID.");
        studentId.focus();
        return;
    }

    if (!/^SBET\d{3,}$/.test(id)) {
        alert("Student ID must be like SBET001");
        studentId.focus();
        return;
    }

    if (pass === "") {
        alert("Please enter Password.");
        password.focus();
        return;
    }

    // Loading Button

    const loginBtn = document.querySelector(".login-btn");

    loginBtn.disabled = true;
    loginBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    // Firestore Login will be added here
    // in the next part.

});

