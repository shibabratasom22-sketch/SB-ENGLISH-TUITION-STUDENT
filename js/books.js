/* ==========================================
   SB English Tuition
   Digital Library v3.0
========================================== */

/* ==========================================
   Firebase
========================================== */

// firebase.js already initializes Firebase.
// Do NOT initialize Firebase again here.

const auth = firebase.auth();
const db = firebase.firestore();

/* ==========================================
   GitHub Library Base URL
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

const booksContainer =
document.getElementById("booksContainer");

const searchBook =
document.getElementById("searchBook");

const selectedClassText =
document.getElementById("selectedClassText");

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

uploadButton.addEventListener("click",()=>{

    uploadModal.classList.add("active");

});

closeUploadBtn.addEventListener("click",()=>{

    uploadModal.classList.remove("active");

});

window.addEventListener("click",(e)=>{

    if(e.target===uploadModal){

        uploadModal.classList.remove("active");

    }

});

/* ==========================================
   Reset Form
========================================== */

resetBookBtn.addEventListener("click",()=>{

    document.getElementById("bookTitle").value="";

    document.getElementById("bookClass").value="";

    document.getElementById("bookCategory").value="Grammar";

    document.getElementById("bookType").value="pdf";

    document.getElementById("bookFileName").value="";

});

/* ==========================================
   Class Selection
========================================== */

document.querySelectorAll(".category-card").forEach(card=>{

    card.addEventListener("click",()=>{

        document.querySelectorAll(".category-card")
        .forEach(c=>c.classList.remove("active"));

        card.classList.add("active");

        selectedClass = card.dataset.class;

        selectedClassText.innerHTML =
        "Showing books for <b>Class " +
        selectedClass +
        "</b>";

        loadBooks();

    });

});

/* ==========================================
   Load Books
========================================== */

async function loadBooks(){

    booksContainer.innerHTML = `

        <div class="empty-library">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <h2>Loading...</h2>

            <p>Please wait...</p>

        </div>

    `;

    try{

        let query = db.collection("books");

        if(selectedClass){

            query = query.where(
                "studentClass",
                "==",
                selectedClass
            );

        }

        const snapshot = await query.get();

        booksContainer.innerHTML = "";

        if(snapshot.empty){

            booksContainer.innerHTML = `

                <div class="empty-library">

                    <i class="fa-solid fa-book-open"></i>

                    <h2>No Books Found</h2>

                    <p>No study materials available.</p>

                </div>

            `;

            return;

        }

        const books = [];

        snapshot.forEach(doc=>{

            books.push({

                id:doc.id,

                ...doc.data()

            });

        });

        books.sort((a,b)=>{

            const ta =
            a.createdAt?.seconds || 0;

            const tb =
            b.createdAt?.seconds || 0;

            return tb-ta;

        });

        books.forEach(book=>{

            createBookCard(
                book.id,
                book
            );

        });

    }

    catch(error){

        console.error(error);

        booksContainer.innerHTML = `

            <div class="empty-library">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h2>Unable to Load Library</h2>

                <p>${error.message}</p>

            </div>

        `;

    }

}

/* ==========================================
   Search
========================================== */

function searchBooks(){

    const keyword =
    searchBook.value
    .toLowerCase()
    .trim();

    document
    .querySelectorAll(".book-card")
    .forEach(card=>{

        const text =
        card.innerText.toLowerCase();

        card.style.display =
        text.includes(keyword)
        ? "flex"
        : "none";

    });

}

/* ==========================================
   Initial Load
========================================== */

loadBooks();

/* ==========================================
   Save Book
========================================== */

uploadBookBtn.addEventListener("click", saveBook);

async function saveBook(){

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
        !title ||
        !studentClass ||
        !fileName
    ){

        alert("Please fill in all required fields.");

        return;

    }

    uploadBookBtn.disabled = true;
    uploadBookBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try{

        await db.collection("books").add({

            title,
            studentClass,
            category,
            fileType,
            fileName,
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

        alert(error.message);

    }

    finally{

        uploadBookBtn.disabled = false;

        uploadBookBtn.innerHTML =
        '<i class="fa-solid fa-floppy-disk"></i> Save Book';

    }

}

/* ==========================================
   Create Book Card
========================================== */

function createBookCard(id, book){

    const fileURL =
    GITHUB_BASE +
    encodeURIComponent(book.studentClass) +
    "/" +
    encodeURIComponent(book.fileName);

    const card =
    document.createElement("div");

    card.className = "book-card";

    card.innerHTML = `

        <div class="book-icon">

            <i class="fa-solid ${
                book.fileType==="image"
                ? "fa-image"
                : "fa-file-pdf"
            }"></i>

        </div>

        <div class="book-info">

            <h3>${book.title}</h3>

            <p>

                Class ${book.studentClass}

                •

                ${book.category}

            </p>

        </div>

        <div class="book-actions">

            <a
                href="${fileURL}"
                target="_blank"
                class="read-btn">

                Read

            </a>

            <a
                href="${fileURL}"
                download
                class="download-btn">

                Download

            </a>

            ${
            isAdmin
            ?

            `<button
                class="delete-btn"
                onclick="deleteBook('${id}')">

                Delete

            </button>`

            :

            ""

            }

        </div>

    `;

    booksContainer.appendChild(card);

}

/* ==========================================
   Delete Book
========================================== */

async function deleteBook(id){

    if(!isAdmin){

        return;

    }

    const ok = confirm(
        "Are you sure you want to delete this book?"
    );

    if(!ok){

        return;

    }

    try{

        await db
        .collection("books")
        .doc(id)
        .delete();

        loadBooks();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

/* ==========================================
   Search Events
========================================== */

searchBook.addEventListener("input", searchBooks);

/* ==========================================
   Firestore Realtime Listener
========================================== */

db.collection("books")
.onSnapshot(

(snapshot)=>{

    if(selectedClass){

        loadBooks();

    }

},

(error)=>{

    console.error(error);

}

);

/* ==========================================
   Initial UI State
========================================== */

if(uploadButton){

    uploadButton.style.display = "none";

}

booksContainer.innerHTML = `

    <div class="empty-library">

        <i class="fa-solid fa-book-open"></i>

        <h2>Select a Class</h2>

        <p>

            Choose a class above to view available books.

        </p>

    </div>

`;

/* ==========================================
   Make Functions Global
========================================== */

window.loadBooks = loadBooks;
window.deleteBook = deleteBook;
window.searchBooks = searchBooks;
