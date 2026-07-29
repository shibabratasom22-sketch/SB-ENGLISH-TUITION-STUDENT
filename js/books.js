// =====================================
// SB ENGLISH TUITION
// books.js (GitHub Version - Part 1)
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

let currentUser = null;
let isAdmin = false;
let selectedClass = "";

// ===============================
// Authentication
// ===============================

auth.onAuthStateChanged(function(user){

    if(!user){
        window.location.href = "index.html";
        return;
    }

    currentUser = user;

    if(user.email === "admin@sbenglishtuition.app"){
        isAdmin = true;
        document.getElementById("uploadButton").style.display = "flex";
    }else{
        isAdmin = false;
        document.getElementById("uploadButton").style.display = "none";
    }

    loadBooks();

});

// ===============================
// Upload Modal
// ===============================

const uploadModal = document.getElementById("uploadModal");

document
.getElementById("uploadButton")
.addEventListener("click",function(){

    uploadModal.style.display="flex";

});

document
.getElementById("closeUploadBtn")
.addEventListener("click",function(){

    uploadModal.style.display="none";

});

window.addEventListener("click",function(e){

    if(e.target===uploadModal){

        uploadModal.style.display="none";

    }

});

// ===============================
// Category Selection
// ===============================

document
.querySelectorAll(".category-card")
.forEach(function(card){

    card.addEventListener("click",function(){

        selectedClass=this.dataset.class;

        loadBooks(selectedClass);

    });

});

console.log("Books Part 1 Loaded");

// ===============================
// Save Book
// ===============================

const uploadBookBtn =
document.getElementById("uploadBookBtn");

uploadBookBtn.addEventListener("click", saveBook);

async function saveBook(){

    const title =
    document.getElementById("bookTitle").value.trim();

    const studentClass =
    document.getElementById("bookClass").value;

    const fileType =
    document.getElementById("bookType").value;

    const fileUrl =
    document.getElementById("bookUrl").value.trim();

    if(!title || !studentClass || !fileType || !fileUrl){

        alert("Please fill all fields.");
        return;

    }

    uploadBookBtn.disabled = true;
    uploadBookBtn.textContent = "Saving...";

    try{

        await db.collection("books").add({

            title: title,
            studentClass: studentClass,
            fileType: fileType,
            fileUrl: fileUrl,
            uploadedBy: currentUser.email,
            createdAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });

        alert("Book added successfully.");

        document.getElementById("bookTitle").value = "";
        document.getElementById("bookClass").value = "";
        document.getElementById("bookType").value = "pdf";
        document.getElementById("bookUrl").value = "";

        uploadModal.style.display = "none";

        loadBooks(selectedClass);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    uploadBookBtn.disabled = false;
    uploadBookBtn.textContent = "Save Book";

}

console.log("Books Part 2 Loaded");

// ===============================
// Load Books
// ===============================

async function loadBooks(classFilter = ""){

    const container =
    document.getElementById("booksContainer");

    container.innerHTML =
    "<p style='text-align:center'>Loading Books...</p>";

    try{

        const snapshot =
        await db.collection("books")
        .orderBy("createdAt","desc")
        .get();

        container.innerHTML = "";

        if(snapshot.empty){

            container.innerHTML = `
            <div class="empty-library">
                <i class="fa-solid fa-book"></i>
                <h2>No Books Found</h2>
                <p>Add your first book.</p>
            </div>`;
            return;

        }

        snapshot.forEach(function(doc){

            const book = doc.data();

            if(classFilter && book.studentClass !== classFilter){
                return;
            }

            container.innerHTML += `

<div class="book-card">

<div class="book-top">

<div class="book-icon">
<i class="fa-solid ${
book.fileType==="pdf"
? "fa-file-pdf"
: "fa-image"
}"></i>
</div>

<div class="book-info">

<div class="book-title">
${book.title}
</div>

<div class="book-class">
Class ${book.studentClass}
</div>

</div>

</div>

<div class="book-actions">

<a
href="${book.fileUrl}"
target="_blank"
class="preview-btn">

Preview

</a>

<a
href="${book.fileUrl}"
target="_blank"
class="download-btn">

Download

</a>

${isAdmin
? `<button
class="delete-btn"
onclick="deleteBook('${doc.id}')">
Delete
</button>`
: ""}

</div>

</div>

`;

        });

        if(container.innerHTML===""){

            container.innerHTML=`
            <div class="empty-library">
                <i class="fa-solid fa-book"></i>
                <h2>No Books</h2>
                <p>No books available.</p>
            </div>`;

        }

    }

    catch(error){

        console.error(error);

        container.innerHTML =
        "<p style='color:red;text-align:center'>Failed to load books.</p>";

    }

}

// ===============================
// Delete Book
// ===============================

window.deleteBook = async function(docId){

    if(!confirm("Delete this book?")) return;

    try{

        await db.collection("books")
        .doc(docId)
        .delete();

        loadBooks(selectedClass);

        alert("Book deleted successfully.");

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

// ===============================
// Search Books
// ===============================

window.searchBooks = function(){

    const filter =
    document.getElementById("searchBook")
    .value
    .toUpperCase();

    const cards =
    document.getElementsByClassName("book-card");

    for(let i=0;i<cards.length;i++){

        const text =
        cards[i].innerText.toUpperCase();

        cards[i].style.display =
        text.indexOf(filter)>-1
        ? ""
        : "none";

    }

};

console.log("SB English Tuition Library Loaded Successfully");

