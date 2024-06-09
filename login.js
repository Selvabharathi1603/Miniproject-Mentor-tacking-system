import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyALHRhxgnjFOuWhgkNpwnWgDRqZH-mCxPQ",
    authDomain: "leave-management-d96ef.firebaseapp.com",
    projectId: "leave-management-d96ef",
    storageBucket: "leave-management-d96ef.appspot.com",
    messagingSenderId: "992493113485",
    appId: "1:992493113485:web:c5431c001ddce9807e12c4",
    measurementId: "G-F50NF2FF48"
  };

  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

document.getElementById("signupbtn").addEventListener("click",async function(event){
    event.preventDefault();
    let username=document.getElementById("username").value
    let useremail=document.getElementById("useremail").value
    let userpassword=document.getElementById("userpassword").value
    let count=0;
    try{
    
    if(username!=="" && useremail!=="" && userpassword!==""){
            const db = getFirestore(app);
            const usersCollection = collection(db, "users");
            const data = await getDocs(collection(db, "users"));
            data.forEach(async(doc) => {
                let data=doc.data()
                let userdataname=data.username
                if (userdataname == username){
                  count +=1;
                }})
                if(count==0){
                    const userDoc = await addDoc(usersCollection, {
                    username: username,
                    mail:useremail,
                    password: userpassword,
                  });
                 document.getElementById("username").value=""
                document.getElementById("useremail").value="" 
                document.getElementById("userpassword").value="" 

                  }
              else{
                alert("username already exists")
                document.getElementById("username").value=""
                document.getElementById("useremail").value="" 
                document.getElementById("userpassword").value="" 
              }
    }else{
        alert("Dont leave any empty field");
    }}catch(error){
        console.log("Signup error:", error);
          
    }

})

document.getElementById("signinbtn").addEventListener("click",async function (event) {
        event.preventDefault();
        let signinname = document.getElementById("signinname").value;
        let signinpassword = document.getElementById("signinpassword").value;
        const db = getFirestore(app);
        const data = await getDocs(collection(db, "users"));
        data.forEach(async (doc) => {
            let data = doc.data();
            let userdataname = data.username;
            let userdatapassword = data.password;
            if (signinname == userdataname) {

              
                if (signinpassword == userdatapassword) {

                  const userDetails = {
                    name : signinname,
                    password : signinpassword
                  }
    
                  console.log(userDetails)
                  setCookie(userDetails)
                  
    // document.cookie = userDetails;
                    if(signinname.includes("mentor")){
                      window.location.href = 'mentorloginsample.html'
                    }else if(signinname.includes("hod")){
                      window.location.href = 'hod.html'
                    }else{
                      window.location.href = 'examplehome.html'
                    }
                } else {
                    alert("incorrect username password");
                }
            }
        });
    })

    function setCookie(userDetails) {
      // document.cookie = userDetails.name + "=" + (value || "")  + expires + "; path=/";
      document.cookie = "myCookie=" + JSON.stringify({userName: userDetails.name, password: userDetails.password});
    
    }