// =======================================
// SB ENGLISH TUITION
// DIGITAL LIBRARY
// books.js (Part 1)
// =======================================

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

console.log("📚 Digital Library Started");

// =======================================
// Check Login
// =======================================

auth.onAuthStateChanged(async function(user){

    if(!user){

        window.location.href="index.html";
        return;

    }

    console.log("Logged in :",user.email);

});

// =======================================
// Category Cards
// =======================================

const categoryCards=document.querySelectorAll(".category-card");

categoryCards.forEach(function(card){

    card.addEventListener("click",function(){

        const selectedClass=this.dataset.class;

        loadBooks(selectedClass);

    });

});

// =======================================
// Search
// =======================================

window.searchBooks=function(){

    const keyword=document
    .getElementById("searchBook")
    .value
    .toUpperCase();

    const cards=document.getElementsByClassName("book-card");

    for(let i=0;i<cards.length;i++){

        const text=cards[i].innerText.toUpperCase();

        if(text.indexOf(keyword)>-1){

            cards[i].style.display="";

        }else{

            cards[i].style.display="none";

        }

    }

}

// =======================================
// Load Books
// =======================================

async function loadBooks(className){

    const container=document.getElementById("booksContainer");

    container.innerHTML="Loading...";

    try{

        const snapshot=await db
        .collection("library")
        .where("class","==",className)
        .get();

        if(snapshot.empty){

            container.innerHTML=`
            <div style="text-align:center;padding:40px;">
            <h2>📚</h2>
            <p>No Books Available</p>
            </div>
            `;

            return;

        }

        container.innerHTML="";

        snapshot.forEach(function(doc){

            const book=doc.data();

            container.innerHTML+=`

            <div class="book-card">

                <h3>${book.title}</h3>

                <p>${book.type}</p>

                <button>

                👁 Preview

                </button>

                <button>

                ⬇ Download

                </button>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}
