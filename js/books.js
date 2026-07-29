// =====================================
// SB ENGLISH TUITION
// books.js (Part 1)
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
const storage = firebase.storage();

let currentUser = null;
let isAdmin = false;
let selectedClass = "";

// ===============================
// Authentication
// ===============================

auth.onAuthStateChanged(async function(user){

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

const uploadModal =
document.getElementById("uploadModal");

const uploadButton =
document.getElementById("uploadButton");

const closeUploadBtn =
document.getElementById("closeUploadBtn");

uploadButton.onclick = function(){

    uploadModal.style.display = "flex";

};

closeUploadBtn.onclick = function(){

    uploadModal.style.display = "none";

};

window.onclick = function(event){

    if(event.target === uploadModal){

        uploadModal.style.display = "none";

    }

};

// ===============================
// Category Click
// ===============================

document
.querySelectorAll(".category-card")
.forEach(function(card){

    card.addEventListener("click",function(){

        selectedClass =
        this.dataset.class;

        loadBooks(selectedClass);

    });

});

// ===============================
// Search
// ===============================

window.searchBooks = function(){

    const filter =
    document
    .getElementById("searchBook")
    .value
    .toUpperCase();

    const cards =
    document.getElementsByClassName("book-card");

    for(let i=0;i<cards.length;i++){

        const txt =
        cards[i].innerText.toUpperCase();

        if(txt.indexOf(filter)>-1){

            cards[i].style.display="";

        }else{

            cards[i].style.display="none";

        }

    }

};

console.log("Books Module Part 1 Loaded");

// ===============================
// Upload Book
// ===============================

const uploadBookBtn =
document.getElementById("uploadBookBtn");

const progressBar =
document.getElementById("uploadProgress");

uploadBookBtn.addEventListener("click", uploadBook);

async function uploadBook(){

    const title =
    document.getElementById("bookTitle").value.trim();

    const bookClass =
    document.getElementById("bookClass").value;

    const file =
    document.getElementById("bookFile").files[0];

    if(!title || !bookClass || !file){

        alert("Please fill all fields.");
        return;

    }

    uploadBookBtn.disabled = true;
    uploadBookBtn.textContent = "Uploading...";

    try{

        const fileName =
        Date.now() + "_" + file.name;

        const storageRef =
        storage.ref("library/" + bookClass + "/" + fileName);

        const uploadTask =
        storageRef.put(file);

        uploadTask.on(

            "state_changed",

            function(snapshot){

                const percent = Math.round(

                    (snapshot.bytesTransferred /
                    snapshot.totalBytes) * 100

                );

                progressBar.value = percent;

            },

            function(error){

                console.error(error);

                alert(error.message);

                uploadBookBtn.disabled = false;
                uploadBookBtn.textContent = "⬆ Upload";

            },

            async function(){

                const downloadURL =
                await uploadTask.snapshot.ref.getDownloadURL();

                const fileType =
                file.type.includes("pdf")
                ? "pdf"
                : "image";

                await db.collection("books").add({

                    title: title,
                    studentClass: bookClass,
                    fileName: file.name,
                    fileType: fileType,
                    fileUrl: downloadURL,
                    uploadedBy: currentUser.email,
                    createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()

                });

                alert("Book uploaded successfully.");

                document.getElementById("bookTitle").value = "";
                document.getElementById("bookClass").value = "";
                document.getElementById("bookFile").value = "";

                progressBar.value = 0;

                uploadModal.style.display = "none";

                uploadBookBtn.disabled = false;
                uploadBookBtn.textContent = "⬆ Upload";

                loadBooks(selectedClass);

            }

        );

    }

    catch(error){

        console.error(error);

        alert(error.message);

        uploadBookBtn.disabled = false;
        uploadBookBtn.textContent = "⬆ Upload";

    }

}

console.log("Books Module Part 2 Loaded");

// ===============================
// Load Books
// ===============================

async function loadBooks(classFilter = ""){

    const container =
    document.getElementById("booksContainer");

    container.innerHTML =
    "<p style='text-align:center'>Loading books...</p>";

    try{

        let query =
        db.collection("books")
        .orderBy("createdAt","desc");

        const snapshot =
        await query.get();

        container.innerHTML = "";

        if(snapshot.empty){

            container.innerHTML = `
            <div class="empty-library">
                <i class="fa-solid fa-book"></i>
                <h2>No Books Found</h2>
                <p>Books will appear here after upload.</p>
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
        download
        class="download-btn">

        Download

        </a>

        ${
            isAdmin
            ?
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
                <p>No books available in this class.</p>
            </div>`;

        }

    }

    catch(error){

        console.error(error);

        container.innerHTML =
        "<p style='color:red;text-align:center;'>Failed to load books.</p>";

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

        alert("Book deleted.");

        loadBooks(selectedClass);

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

};

console.log("Books Module Loaded Successfully");
