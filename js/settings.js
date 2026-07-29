// Check Login
auth.onAuthStateChanged(function(user){

    if(!user){
        window.location.href="index.html";
        return;
    }

    loadSettings();

});

// Save Settings
document.getElementById("saveBtn").addEventListener("click", function(){

    db.collection("settings").doc("general").set({

        tuitionName: document.getElementById("tuitionName").value,
        session: document.getElementById("session").value,
        teacherName: document.getElementById("teacherName").value,
        contact: document.getElementById("contact").value

    }).then(function(){

        alert("✅ Settings Saved Successfully.");

    }).catch(function(error){

        alert(error.message);

    });

});

// Load Settings
function loadSettings(){

    db.collection("settings").doc("general").get()

    .then(function(doc){

        if(doc.exists){

            const data = doc.data();

            document.getElementById("tuitionName").value = data.tuitionName || "";
            document.getElementById("session").value = data.session || "";
            document.getElementById("teacherName").value = data.teacherName || "";
            document.getElementById("contact").value = data.contact || "";

        }

    });

}
