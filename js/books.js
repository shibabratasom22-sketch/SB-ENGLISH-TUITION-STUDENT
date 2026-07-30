/* ==========================================
   SB English Tuition
   Digital Library v2.0
========================================== */

/* ==========================================
   Firebase Configuration
========================================== */

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"

};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

/* ==========================================
   GitHub Repository
========================================== */

const GITHUB_BASE =
"https://shibabratasom22-sketch.github.io/SB-ENGLISH-TUITION-STUDENT/library/";

/* ==========================================
   Global Variables
========================================== */

let selectedClass = "";
let isAdmin = false;

/* ==========================================
   DOM Elements
========================================== */

const uploadModal =
document.getElementById("uploadModal");

const uploadButton =
document.getElementById("uploadButton");

const closeUploadBtn =
document.getElementById("closeUploadBtn");

const uploadBookBtn =
document.getElementById("uploadBookBtn");

const resetBookBtn =
document.getElementById("resetBookBtn");

const searchBook =
document.getElementById("searchBook");

const booksContainer =
document.getElementById("booksContainer");

/* ==========================================
   Authentication
========================================== */

auth.onAuthStateChanged((user)=>{

    if(user){

        isAdmin = true;
        uploadButton.style.display = "flex";

    }else{

        isAdmin = false;
        uploadButton.style.display = "none";

    }

});

/* ==========================================
   Upload Modal
========================================== */

uploadButton.onclick = ()=>{

    uploadModal.classList.add("active");

};

closeUploadBtn.onclick = ()=>{

    uploadModal.classList.remove("active");

};

window.onclick = (e)=>{

    if(e.target===uploadModal){

        uploadModal.classList.remove("active");

    }

};

/* ==========================================
   Reset Form
========================================== */

resetBookBtn.onclick = ()=>{

    document.getElementById("bookTitle").value="";
    document.getElementById("bookClass").value="";
    document.getElementById("bookCategory").value="Grammar";
    document.getElementById("bookType").value="pdf";
    document.getElementById("bookFileName").value="";

};

/* ==========================================
   Class Selection
========================================== */

document.querySelectorAll(".category-card").forEach(card=>{

    card.addEventListener("click",()=>{

        document.querySelectorAll(".category-card")
        .forEach(c=>c.classList.remove("active"));

        card.classList.add("active");

        selectedClass = card.dataset.class;

        document.getElementById("selectedClassText").innerText =
        "Showing books for Class " + selectedClass;

        loadBooks();

    });

});

/* ==========================================
   Load Books
========================================== */

async function loadBooks(){

    booksContainer.innerHTML=`
        <div class="empty-library">
            <i class="fa-solid fa-spinner fa-spin"></i>
            <h2>Loading...</h2>
        </div>
    `;

    try{

        let query=db.collection("books");

        if(selectedClass!==""){

            query=query.where(
                "studentClass",
                "==",
                selectedClass
            );

        }

        query=query.orderBy(
            "createdAt",
            "desc"
        );

        const snapshot=await query.get();

        if(snapshot.empty){

            booksContainer.innerHTML=`
                <div class="empty-library">
                    <i class="fa-solid fa-book-open"></i>
                    <h2>No Books Found</h2>
                    <p>No study materials available.</p>
                </div>
            `;
            return;

        }

        booksContainer.innerHTML="";

        snapshot.forEach(doc=>{

            createBookCard(
                doc.id,
                doc.data()
            );

        });

    }

    catch(error){

        console.error(error);

        booksContainer.innerHTML=`
            <div class="empty-library">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h2>Error Loading Books</h2>
                <p>Please try again.</p>
            </div>
        `;

    }

}

/* ==========================================
   Live Search
========================================== */

function searchBooks(){

    const keyword=
    searchBook.value.toLowerCase();

    document.querySelectorAll(".book-card")
    .forEach(card=>{

        const text=
        card.innerText.toLowerCase();

        if(text.includes(keyword)){

            card.style.display="flex";

        }else{

            card.style.display="none";

        }

    });

}

/* ==========================================
   Initial Load
========================================== */

loadBooks();

/* ==========================================
   Save Book
========================================== */

uploadBookBtn.onclick = async ()=>{

    const title =
    document.getElementById("bookTitle").value.trim();

    const studentClass =
    document.getElementById("bookClass").value;

    const category =
    document.getElementById("bookCategory").value;

    const fileType =
    document.getElementById("bookType").value;

    const fileName =
    document.getElementById("bookFileName").value.trim();

    if(
        title==="" ||
        studentClass==="" ||
        fileName===""){
        alert("Please fill all fields.");
        return;
    }

    const fileUrl =
        GITHUB_BASE +
        studentClass +
        "/" +
        encodeURIComponent(fileName);

    try{

        uploadBookBtn.disabled=true;
        uploadBookBtn.innerHTML=
        '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

        await db.collection("books").add({

            title:title,
            studentClass:studentClass,
            category:category,
            fileType:fileType,
            fileName:fileName,
            fileUrl:fileUrl,
            createdAt:
            firebase.firestore.FieldValue.serverTimestamp()

        });

        alert("Book added successfully.");

        uploadModal.classList.remove("active");

        resetBookBtn.click();

        loadBooks();

    }

    catch(error){

        console.error(error);

        alert("Failed to save book.");

    }

    finally{

        uploadBookBtn.disabled=false;

        uploadBookBtn.innerHTML=
        '<i class="fa-solid fa-floppy-disk"></i> Save Book';

    }

};

/* ==========================================
   Create Book Card
========================================== */

function createBookCard(id,book){

    const icon =
    book.fileType==="pdf"
    ? "fa-file-pdf"
    : "fa-image";

    const badge =
    book.fileType==="pdf"
    ? "badge-pdf"
    : "badge-image";

    const badgeText =
    book.fileType==="pdf"
    ? "PDF"
    : "IMAGE";

    let deleteButton="";

    if(isAdmin){

        deleteButton=`
            <button
                class="delete-btn"
                onclick="deleteBook('${id}')">

                <i class="fa-solid fa-trash"></i>

                Delete

            </button>
        `;
    }

    booksContainer.innerHTML += `

    <div class="book-card">

        <div class="book-header">

            <div>

                <div class="book-title">
                    ${book.title}
                </div>

            </div>

            <div class="book-icon">

                <i class="fa-solid ${icon}"></i>

            </div>

        </div>

        <div class="badge-group">

            <span class="badge badge-class">
                Class ${book.studentClass}
            </span>

            <span class="badge badge-category">
                ${book.category}
            </span>

            <span class="badge ${badge}">
                ${badgeText}
            </span>

        </div>

        <div class="book-actions">

            <button
                class="read-btn"
                onclick="window.open('${book.fileUrl}','_blank')">

                <i class="fa-solid fa-book-open"></i>

                Read

            </button>

            <button
                class="download-btn"
                onclick="window.open('${book.fileUrl}')">

                <i class="fa-solid fa-download"></i>

                Download

            </button>

            ${deleteButton}

        </div>

    </div>

    `;

}

/* ==========================================
   Delete Book
========================================== */

async function deleteBook(id){

    if(!confirm("Delete this book?")){
        return;
    }

    try{

        await db.collection("books")
        .doc(id)
        .delete();

        alert("Book deleted successfully.");

        loadBooks();

    }

    catch(error){

        console.error(error);

        alert("Failed to delete book.");

    }

}

/* ==========================================
   Preview File
========================================== */

function previewBook(url,type){

    if(type==="image"){

        window.open(url,"_blank");

    }else{

        window.open(url,"_blank");

    }

}

/* ==========================================
   Download File
========================================== */

function downloadBook(url){

    window.open(url,"_blank");

}

/* ==========================================
   Refresh Library
========================================== */

function refreshLibrary(){

    loadBooks();

}

/* ==========================================
   Firestore Real-time Listener
========================================== */

let booksListener = null;

function startBooksListener(){

    if(booksListener){
        booksListener();
    }

    let query = db.collection("books");

    if(selectedClass!==""){

        query = query.where(
            "studentClass",
            "==",
            selectedClass
        );

    }

    query = query.orderBy(
        "createdAt",
        "desc"
    );

    booksListener = query.onSnapshot(

        ()=>{

            loadBooks();

        },

        (error)=>{

            console.error(error);

        }

    );

}

/* ==========================================
   Start Library
========================================== */

startBooksListener();

/* ==========================================
   Console Message
========================================== */

console.log(
"SB English Tuition Library v2.0 Loaded Successfully"
);
