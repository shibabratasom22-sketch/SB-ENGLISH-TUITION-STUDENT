// =====================================
// SB ENGLISH TUITION
// books.js (GitHub Version)
// Part 1
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

const GITHUB_BASE =
"https://shibabratasom22-sketch.github.io/SB-ENGLISH-TUITION-STUDENT/library/";

let isAdmin = false;
let currentUser = null;
let selectedClass = "";

// ===============================
// Login Check
// ===============================

auth.onAuthStateChanged(function(user){

    if(!user){

        window.location.href="index.html";
        return;

    }

    currentUser=user;

    if(user.email==="admin@sbenglishtuition.app"){

        isAdmin=true;

        document
        .getElementById("uploadButton")
        .style.display="flex";

    }else{

        document
        .getElementById("uploadButton")
        .style.display="none";

    }

    loadBooks();

});

// ===============================
// Upload Modal
// ===============================

const uploadModal=
document.getElementById("uploadModal");

document
.getElementById("uploadButton")
.onclick=function(){

uploadModal.style.display="flex";

};

document
.getElementById("closeUploadBtn")
.onclick=function(){

uploadModal.style.display="none";

};

window.onclick=function(e){

if(e.target===uploadModal){

uploadModal.style.display="none";

}

};

// ===============================
// Class Selection
// ===============================

document
.querySelectorAll(".category-card")
.forEach(function(card){

card.onclick=function(){

selectedClass=this.dataset.class;

loadBooks(selectedClass);

};

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

    const fileName =
    document.getElementById("bookFileName").value.trim();

    if(!title || !studentClass || !fileType || !fileName){

        alert("Please fill all fields.");
        return;

    }

    const fileUrl =
    GITHUB_BASE +
    studentClass +
    "/" +
    encodeURIComponent(fileName);

    uploadBookBtn.disabled = true;
    uploadBookBtn.textContent = "Saving...";

    try{

        await db.collection("books").add({

            title: title,
            studentClass: studentClass,
            fileType: fileType,
            fileName: fileName,
            fileUrl: fileUrl,
            uploadedBy: currentUser.email,
            createdAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });

        alert("Book added successfully.");

        document.getElementById("bookTitle").value = "";
        document.getElementById("bookClass").value = "";
        document.getElementById("bookType").value = "pdf";
        document.getElementById("bookFileName").value = "";

        uploadModal.style.display = "none";

        loadBooks(selectedClass);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

    uploadBookBtn.disabled = false;
    uploadBookBtn.innerHTML =
    '<i class="fa-solid fa-floppy-disk"></i> Save Book';

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
book.fileType==="image"
? "fa-image"
: "fa-file-pdf"
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
class="preview-btn"
href="${book.fileUrl}"
target="_blank">

Preview

</a>

<a
class="download-btn"
href="${book.fileUrl}"
target="_blank">

Download

</a>

${isAdmin ?

`<button
class="delete-btn"
onclick="deleteBook('${doc.id}')">

Delete

</button>`

:

""

}

</div>

</div>

`;

        });

        if(container.innerHTML===""){

            container.innerHTML=`
            <div class="empty-library">
                <i class="fa-solid fa-book"></i>
                <h2>No Books</h2>
                <p>No books found for this class.</p>
            </div>`;

        }

    }

    catch(error){

        console.error(error);

        container.innerHTML =
        "<p style='text-align:center;color:red;'>Failed to load books.</p>";

    }

}

// ===============================
// Delete Book
// ===============================

window.deleteBook = async function(docId){

    if(!confirm("Delete this book?")) return;

    try{

        await db
        .collection("books")
        .doc(docId)
        .delete();

        alert("Book deleted successfully.");

        loadBooks(selectedClass);

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
    document
    .getElementById("searchBook")
    .value
    .toUpperCase();

    const cards =
    document
    .getElementsByClassName("book-card");

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
