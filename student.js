import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    setDoc,
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
//   const analytics = getAnalytics(app);
//   const auth = getAuth();

  const db = getFirestore(app);
  const data = await getDocs(collection(db, "users"));

document.getElementById("requestod").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("reqodpage").style.display="block";
})

document.getElementById("reqclose").addEventListener("click",()=>{
    document.getElementById("reqodpage").style.display="none";   
})

document.getElementById("historyod").addEventListener("click",(event)=>{
    event.preventDefault();
    document.getElementById("history").style.display="block";
})

document.getElementById("reqclosehistory").addEventListener("click",()=>{
    document.getElementById("history").style.display="none";   
})

document.getElementById("requestleave").addEventListener("click",(event)=>{
    event.preventDefault()
    document.getElementById("reqleave").style.display="block";
})

document.getElementById("reqclosebtn").addEventListener("click",()=>{
    document.getElementById("reqleave").style.display="none";   
})

document.getElementById("historyleavepage").addEventListener("click",(event)=>{
    event.preventDefault();
    document.getElementById("historyleave").style.display="block";
})

document.getElementById("reqclosehistoryleave").addEventListener("click",()=>{
    document.getElementById("historyleave").style.display="none";   
})

document.getElementById("logoutbtn").addEventListener("click",()=>{
  window.location.href = 'login.html'
})

function getUserDetails()
{
    var cookies = document.cookie.split(";"); // Split the cookies string into an array
    var myCookieValue = null;
    
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.startsWith("myCookie=")) {
        myCookieValue = cookie.substring("myCookie=".length);
        break; // Exit the loop once we find the myCookie
      }
    }

    return JSON.parse(myCookieValue)

}

document.getElementById("odsubmit").addEventListener("click",async()=>{
  let updatedleavelist=[]
    const odform=document.getElementById("odcontents")
    const odname=document.getElementById("odname").value;
    const odrollno=document.getElementById("odrollno").value;
    const odreason=document.getElementById("odreason").value;
    const odmentor=document.getElementById("odmentor").value;
    const odfromdate=document.getElementById("odfromdate").value;
    const odtodate=document.getElementById("odtodate").value;
    const odyear=document.getElementById("odyear").value;
    const oddept=document.getElementById("oddept").value;

    if (
        odname === "" ||
        odrollno === "" ||
        odreason === "" ||
        odmentor === "" ||
        odfromdate === "" ||
        odtodate === "" ||
        odyear === "" ||
        oddept=== ""
      ) {
        alert("Please fill out all the required fields.");
        return;
      }

      let odlist = [];
      const userDetails = getUserDetails()
    //   let username =  getUserDetails().userName.toUpperCase();
      try {
        data.forEach(async (info) => {
            let dataset = info.data();
            const docRef = doc(db, "users", info.id);
          if (dataset.username == userDetails.userName) {
            if (dataset.odlist) {
              odlist = dataset.odlist;
              odlist.push({
                StudentName: odname,
                RollNo: odrollno,
                Reason: odreason,
                mentorname:odmentor,
                OdFrom: odfromdate,
                odTo: odtodate,
                CurrentYear: odyear,
                dept: oddept,
                mentor: "pending",
                hod: "pending",
                // principal: "pending",
              });
            } else {
              odlist.push({
                StudentName: odname,
                RollNo: odrollno,
                Reason: odreason,
                mentorname:odmentor,
                OdFrom: odfromdate,
                odTo: odtodate,
                CurrentYear: odyear,
                dept: oddept,
                mentor: "pending",
                hod: "pending",
                // principal: "pending",
              });
            }
            if(dataset.leavelist){
              let leavelist=dataset.leavelist;
          
          for (const leaveRequest of leavelist) {
            // const rollno = odRequest.RollNo;
            // const sname = odRequest.StudentName;
            // const subject = odRequest.Reason;
            // const fromdate = odRequest.OdFrom;
            // const todate = odRequest.To;

            // // Check if the subject matches the given value
            // if (subject === tablesubject && tabledate==`${fromdate} to ${todate}`) {
            //   // If the subject matches, update the 'mentor' value to 'accepted'
            //   odRequest.mentor = "accepted";
            // }

            // Push the modified or unmodified odRequest into the updatedOdlist array
            updatedleavelist.push(leaveRequest);
          }
            }
            await setDoc(docRef, { username: dataset.username, password: dataset.password, odlist:odlist,leavelist: updatedleavelist}, { merge: true })
                .then(() => {
                  alert("OD Successfully applied");
                  odlist = [];
                  updatedleavelist=[];
                  location.reload();
                })
                .catch((error) => {
                  console.log(error);
                  odlist = [];
                  updatedleavelist=[];
                });
            
            
          }
        });

        odform.reset();
      } catch (error) {
        console.log("Upload error:", error);
      }
})

document.getElementById("historyod").addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    data.forEach(async (info) => {
      let dataset = info.data();
      // let login = document.cookie.split(",");
      const userDetails = getUserDetails()
      const docRef = doc(db, "users", info.id);
      if (dataset.username == userDetails.userName) {
        let odlist = dataset.odlist;
        for (const odRequest of odlist) {
            const reason = odRequest.Reason;
          const fromoddate = odRequest.OdFrom;
          const tooddate = odRequest.odTo;
          const mentorodstatus = odRequest.mentor;
          const hododstatus = odRequest.hod;
          // const principalstatus = odRequest.principal;

          var table = document.getElementById("odHistory");
          let temp = `
            <tr>
              <td id="reason">${reason}</td>
              <td id="mencho">${fromoddate} - ${tooddate}</td>
              <td id="princho"><div class="chip" id="myChip">${mentorodstatus}</div></td>
              <td id="princho"><div class="chip" id="myChip">${hododstatus}</div></td>
            </tr>`;
          table.innerHTML += temp;
          console.log("Mentor Status:", reason);

          // Access the "mentor" property within the current OD request object
          
        }
      }
    });
    const chips = document.querySelectorAll(".chip");
    chips.forEach((chip) => {
      if (chip.innerText === "accepted") {
        chip.style.backgroundColor = "rgb(0, 192, 0)";
        chip.style.color = "white";
      } else if (chip.innerText === "rejected" || chip.innerText === "rejected by mentor" || chip.innerText === "rejected by hod") {
        chip.style.backgroundColor = "rgb(255, 0, 0)";
        chip.style.color = "white";
      }else{
        chip.style.backgroundColor = "rgb( 150, 150, 150)";
        chip.style.color = "white";
      }
    });
  } catch (error) {
    console.log("Error:", error);
  }
}, { once: true });


document.getElementById("leavesubmit").addEventListener("click",async()=>{
  let updatedOdlist = [];
  const leaveform=document.getElementById("leavecontent")
  const leavename=document.getElementById("leavename").value;
  const leaverollno=document.getElementById("leaverollno").value;
  const leavereason=document.getElementById("leavereason").value;
  const leavementor=document.getElementById("leavementor").value;
  const leavefromdate=document.getElementById("leavefrom").value;
  const leavetodate=document.getElementById("leaveto").value;
  const leaveyear=document.getElementById("leaveyear").value;
  const leavedept=document.getElementById("leavedept").value;
  const leavelink=document.getElementById("linkletter").value;

  if (
    leavename === "" ||
    leaverollno === "" ||
    leavereason === "" ||
    leavementor === "" ||
    leavefromdate === "" ||
    leavetodate === "" ||
    leaveyear === "" ||
    leavedept=== ""||
    leavelink ===""
  ){
    alert("Please fill out all the required fields.");
        return;
  }
  let leavelist = [];
  const userDetails = getUserDetails()

  try {
    data.forEach(async (info) => {
        let dataset = info.data();
        const docRef = doc(db, "users", info.id);
      if (dataset.username == userDetails.userName) {
        if (dataset.leavelist) {
          leavelist = dataset.leavelist;
          leavelist.push({
            StudentName: leavename,
            RollNo: leaverollno,
            Reason: leavereason,
            mentorname:leavementor,
            leaveFrom: leavefromdate,
            leaveTo: leavetodate,
            CurrentYear: leaveyear,
            dept: leavedept,
            mentor: "pending",
            hod: "pending",
            leavelink:leavelink
            // principal: "pending",
          });
        } else {
          leavelist.push({
            StudentName: leavename,
            RollNo: leaverollno,
            Reason: leavereason,
            mentorname:leavementor,
            leaveFrom: leavefromdate,
            leaveTo: leavetodate,
            CurrentYear: leaveyear,
            dept: leavedept,
            mentor: "pending",
            hod: "pending",
            leavelink:leavelink
            // principal: "pending",
          });
        }
        console.log(leavelist)
        if(dataset.odlist){
          // let odlist=[];
          // odlist=dataset.odlist;
          let odlist=dataset.odlist;
          
          for (const odRequest of odlist) {
            // const rollno = odRequest.RollNo;
            const sname = odRequest.StudentName;
            // const subject = odRequest.Reason;
            // const fromdate = odRequest.OdFrom;
            // const todate = odRequest.To;

            // // Check if the subject matches the given value
            // if (subject === tablesubject && tabledate==`${fromdate} to ${todate}`) {
            //   // If the subject matches, update the 'mentor' value to 'accepted'
            //   odRequest.mentor = "accepted";
            // }

            // Push the modified or unmodified odRequest into the updatedOdlist array
            updatedOdlist.push(odRequest);
          }
        }
        await setDoc(docRef, { username: dataset.username, password: dataset.password, odlist: updatedOdlist,leavelist: leavelist}, { merge: true })
          .then(() => {
            alert("leave Successfully applied");
            leavelist = [];
            updatedOdlist=[];
            location.reload();
          })
          .catch((error) => {
            console.log(error);
            updatedOdlist = [];
            leavelist=[];
          });
        
      }
    });
  document.getElementById("leavename").value=""
  document.getElementById("leaverollno").value=""
  document.getElementById("leavereason").value=""
  document.getElementById("leavementor").value=""
  document.getElementById("leavefrom").value=""
  document.getElementById("leaveto").value=""
  document.getElementById("leaveyear").value=""
  document.getElementById("leavedept").value=""
  document.getElementById("linkletter").value=""
    leaveform.reset();
  } catch (error) {
    console.log("Upload error:", error);
  }
})


document.getElementById("historyleavepage").addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    data.forEach(async (info) => {
      let dataset = info.data();
      // let login = document.cookie.split(",");
      const userDetails = getUserDetails()
      const docRef = doc(db, "users", info.id);
      if (dataset.username == userDetails.userName) {
        let leavelist = dataset.leavelist;
        for (const leaveRequest of leavelist) {
            const reason = leaveRequest.Reason;
          const fromoddate = leaveRequest.leaveFrom;
          const tooddate = leaveRequest.leaveTo;
          const mentorodstatus = leaveRequest.mentor;
          const hododstatus = leaveRequest.hod;
          // const principalstatus = odRequest.principal;

          var table = document.getElementById("leavehistory");
          let temp = `
            <tr>
              <td id="reason">${reason}</td>
              <td id="mencho">${fromoddate} - ${tooddate}</td>
              <td id="princho"><div class="chip" id="myChip">${mentorodstatus}</div></td>
              <td id="princho"><div class="chip" id="myChip">${hododstatus}</div></td>
            </tr>`;
          table.innerHTML += temp;
          console.log("Mentor Status:", reason);

          // Access the "mentor" property within the current OD request object
          
        }
      }
    });
    const chips = document.querySelectorAll(".chip");
    chips.forEach((chip) => {
      if (chip.innerText === "accepted") {
        chip.style.backgroundColor = "rgb(0, 192, 0)";
        chip.style.color = "white";
      } else if (chip.innerText === "rejected" || chip.innerText === "rejected by mentor" || chip.innerText === "rejected by hod") {
        chip.style.backgroundColor = "rgb(255, 0, 0)";
        chip.style.color = "white";
      }else{
        chip.style.backgroundColor = "rgb( 150, 150, 150)";
        chip.style.color = "white";
      }
    });
  } catch (error) {
    console.log("Error:", error);
  }
}, { once: true });

// document.getElementById("rollno").value=username;
// document.getElementById("rollno").disabled=true;
// let username =  getUserDetails().userName.toUpperCase();
// document.getElementById("profilebtn").addEventListener("click",()=>{
//   document.getElementById("loginusername").innerText=username;
// })

// Assume getUserDetails() returns an object with a property userName

document.getElementById("profilebtn").addEventListener("click", () => {
  // Get the current username from the user details
  let username = getUserDetails().userName.toUpperCase();

  // Get the existing icon element
  let iconElement = document.getElementById("loginusername").querySelector("span svg");

  // Create a new span element with the updated username and the existing icon
  let newSpan = document.createElement("span");
  newSpan.innerHTML = `
    ${iconElement.outerHTML}
    <span style="position: relative; bottom: 4px; margin-right: 10px">${username}</span>
  `;

  // Replace the existing content with the new span
  document.getElementById("loginusername").innerHTML = "";
  document.getElementById("loginusername").appendChild(newSpan);
});
