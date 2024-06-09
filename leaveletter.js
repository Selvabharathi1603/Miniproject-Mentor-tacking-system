const firebaseConfig = {
    apiKey: "AIzaSyALHRhxgnjFOuWhgkNpwnWgDRqZH-mCxPQ",
    authDomain: "leave-management-d96ef.firebaseapp.com",
    projectId: "leave-management-d96ef",
    storageBucket: "leave-management-d96ef.appspot.com",
    messagingSenderId: "992493113485",
    appId: "1:992493113485:web:c5431c001ddce9807e12c4",
    measurementId: "G-F50NF2FF48"
};

firebase.initializeApp(firebaseConfig);

var filetext = document.querySelector(".filetext");
var uploadpercentage = document.querySelector(".uploadpercentage");
var progress = document.querySelector(".progress");
var percantageval;
var fileitem;
var filename;
// var link=document.getElementById("linkletter").value;

function getfile(e) {
    fileitem = e.target.files[0];
    filename = fileitem.name;
    filetext.innerHTML = filename;
}

function uploadimage() {
    let storageref = firebase.storage().ref("images/" + filename);
    let uploadtask = storageref.put(fileitem);

    uploadtask.on('state_changed',
        (snapshot) => {
            // Update progress here
            percantageval = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadpercentage.innerHTML = percantageval + "%";
            progress.value = percantageval;
        },
        (error) => {
            // Handle errors during upload
            console.error(error);
        },() => {
            // Handle upload completion
            // console.log("Upload complete!");
            uploadtask.snapshot.ref.getDownloadURL().then((url)=>{
                console.log("url",url);
                document.getElementById("linkletter").value=url;
            })

        }
    );
}