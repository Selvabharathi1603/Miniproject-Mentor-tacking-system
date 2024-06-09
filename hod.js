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
    getDoc,
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

  
  

document.getElementById("odreqpage").addEventListener("click",()=>{
    document.getElementById("odpage").style.display="block";
})

document.getElementById("leavereqpage").addEventListener("click",()=>{
    document.getElementById("leavepage").style.display="block";
})

document.getElementById("reqclose").addEventListener("click",()=>{
    document.getElementById("odpage").style.display="none";   
})

document.getElementById("reqleaveclose").addEventListener("click",()=>{
    document.getElementById("leavepage").style.display="none";   
})

document.getElementById("profilebtn").addEventListener("click", () => {
   document.getElementById("maincon").classList.toggle("click");
  });

  document.getElementById("logoutbtn").addEventListener("click",()=>{
    window.location.href = 'login.html'
  })


  let reqtable=document.getElementById("studentleaveReq");

  window.addEventListener('load', async (event) => {
    try{
        const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
//   const auth = getAuth();

    const db = getFirestore(app);
    const data = await getDocs(collection(db, "users"));
    let bodyInsert = document.getElementById("studentodReq");
    const userDetails = getUserDetails()
    let loginusername=userDetails.userName.toLocaleUpperCase()
    console.log(loginusername)
    if(loginusername.includes("CSE")){
        var reqDept="cse"
    }else if(loginusername.includes("IT")){
        var reqDept="it"
    }else if(loginusername.includes("ECE")){
        var reqDept="ece"
    }else if(loginusername.includes("AIDS")){
        var reqDept="aids"
    }else if(loginusername.includes("MECH")){
        var reqDept="mech"
    }else if(loginusername.includes("CSBS")){
        var reqDept="csbs"
    }

    data.forEach(async (info) => {
        let dataset = info.data();
  
        // Assuming your Firestore collection is named "odlist"
        let odlist=[];
        odlist = dataset.odlist;
        
        if(odlist!=null){
            console.log(odlist);
            for (const odRequest of odlist) {
                if (odRequest.hod == "pending" &&odRequest.mentor=="accepted" && odRequest.dept==reqDept) {
                  const rollno = odRequest.RollNo;
                  const name = odRequest.StudentName;
                  const subject = odRequest.Reason;
                  const fromdate = odRequest.OdFrom;
                  const todate = odRequest.odTo;
                  const docid = info.id; 
                  // Use info.id for the document ID
        
                  // Use unique class names for the buttons
                  let temp = `<tr>
                    <td>${name}</td>
                    <td>${rollno}</td>
                    <td>${subject}</td>
                    <td>${fromdate} to ${todate}</td>
                    <td style="width:200px;">
                      <button class="btn-outline-success btn accept" data-id="${docid}">Accept</button>
                      <button class="btn-outline-danger btn reject" data-id="${docid}">Reject</button>
                    </td>
                  </tr>`;
                  bodyInsert.innerHTML += temp;
                }
              }
        }

        const studentReq = document.getElementById("studentodReq");

    studentReq.addEventListener('click', async function (event) {
      const target = event.target;

      // Check if the clicked element is a button with the class "accept"
      if (target.classList.contains('accept')) {
        // Get the data-id attribute value for the specific button clicked
        const reqid = target.getAttribute('data-id');
        const parentRow = target.closest('tr');
        const tablesubject = parentRow.cells[2].textContent;
        const tabledate=parentRow.cells[3].textContent;

        console.log('Accepted ID:', reqid);

        // Now, you can use the reqid to retrieve data from Firestore and update the 'mentor' value to 'accepted'
        try {
          const docRef = doc(db, "users", reqid);
          const docSnapshot = await getDoc(docRef);
          console.log(docSnapshot);

          if (docSnapshot.exists()) {
            // Document exists, retrieve its data
            const data = docSnapshot.data();
            let name = data.username;
            let password = data.password;
            let odlist = data.odlist;
            let leavelist=data.leavelist;

            const updatedOdlist = [];

              for (const odRequest of odlist) {
                const rollno = odRequest.RollNo;
                const name = odRequest.StudentName;
                const subject = odRequest.Reason;
                const fromdate = odRequest.OdFrom;
                const todate = odRequest.odTo;

                // Check if the subject matches the given value
                if (subject === tablesubject && tabledate==`${fromdate} to ${todate}`) {
                  // If the subject matches, update the 'mentor' value to 'accepted'
                  odRequest.hod = "accepted";
                }

                // Push the modified or unmodified odRequest into the updatedOdlist array
                updatedOdlist.push(odRequest);
              }

            // Now 'updatedOdlist' contains the modified 'odlist' with 'mentor' values updated as needed.
            console.log(updatedOdlist);

            // Update the Firestore document with the modified 'odlist'
            await setDoc(docRef, { username: name, password: password, odlist: updatedOdlist, leavelist:leavelist}, { merge: true });
            console.log('Document updated successfully');
            parentRow.remove()
          } else {
            console.log('Document does not exist.');
          }
        } catch (error) {
          console.error('Error retrieving or updating document:', error);
        }
      } else if (target.classList.contains('reject')) {
        // Get the data-id attribute value for the specific button clicked
        const reqid = target.getAttribute('data-id');
        const parentRow = target.closest('tr');
        const tablesubject = parentRow.cells[2].textContent;
        const tabledate=parentRow.cells[3].textContent;

        console.log('Rejected ID:', reqid);

        // Now, you can use the reqid to retrieve data from Firestore and update the 'mentor' value to 'reject'
        try {
          const docRef = doc(db, "users", reqid);
          const docSnapshot = await getDoc(docRef);
          console.log(docSnapshot);

          if (docSnapshot.exists()) {
            // Document exists, retrieve its data
            const data = docSnapshot.data();
            let name = data.username;
            let password = data.password;
            let odlist = data.odlist;
            let leavelist= data.leavelist;

            const updatedOdlist = [];

            for (const odRequest of odlist) {
              const rollno = odRequest.RollNo;
              const name = odRequest.StudentName;
              const subject = odRequest.Reason;
              const fromdate = odRequest.OdFrom;
              const todate = odRequest.odTo;

              // Check if the subject matches the given value
              if (subject === tablesubject && tabledate==`${fromdate} to ${todate}`) {
                // If the subject matches, update the 'mentor' value to 'rejected'
                odRequest.mentor = "rejected  by hod";
                odRequest.hod="rejected"
                // odRequest.principal="rejected by mentor"
              }

              // Push the modified or unmodified odRequest into the updatedOdlist array
              updatedOdlist.push(odRequest);
            }

            // Now 'updatedOdlist' contains the modified 'odlist' with 'mentor' values updated as needed.
            console.log(updatedOdlist);

            // Update the Firestore document with the modified 'odlist'
            await setDoc(docRef, { username: name, password: password, odlist: updatedOdlist,leavelist:leavelist }, { merge: true });
            console.log('Document updated successfully');
            parentRow.remove()
          } else {
            console.log('Document does not exist.');
          }
        } catch (error) {
          console.error('Error retrieving or updating document:', error);
        }
      }
    });
        
      });


    }catch{

    }
  });


  window.addEventListener('load', async (event) => {
    try{
        const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
//   const auth = getAuth();

    const db = getFirestore(app);
    const data = await getDocs(collection(db, "users"));
    let bodyInsert = document.getElementById("studentleaveReq");
    const userDetails = getUserDetails()
    let loginusername=userDetails.userName.toLocaleUpperCase()
    console.log(loginusername)
    if(loginusername.includes("CSE")){
        var reqDept="cse"
    }else if(loginusername.includes("IT")){
        var reqDept="it"
    }else if(loginusername.includes("ECE")){
        var reqDept="ece"
    }else if(loginusername.includes("AIDS")){
        var reqDept="aids"
    }else if(loginusername.includes("MECH")){
        var reqDept="mech"
    }else if(loginusername.includes("CSBS")){
        var reqDept="csbs"
    }

    data.forEach(async (info) => {
        let dataset = info.data();
  
        // Assuming your Firestore collection is named "odlist"
        let leavelist=[];
        leavelist = dataset.leavelist;
        
        if(leavelist!=null){
            console.log(leavelist);
            for (const odRequest of leavelist) {
                if (odRequest.mentor == "accepted" && odRequest.hod=="pending" && odRequest.dept==reqDept) {
                  const rollno = odRequest.RollNo;
                  const name = odRequest.StudentName;
                  const subject = odRequest.Reason;
                  const fromdate = odRequest.leaveFrom;
                  const link=odRequest.leavelink;
                  const todate = odRequest.leaveTo;
                  const docid = info.id; // Use info.id for the document ID
        
                  // Use unique class names for the buttons
                  let temp = `<tr>
                    <td>${name}</td>
                    <td>${rollno}</td>
                    <td>${subject}</td>
                    <td><a href="${link}" target="_blank">${link}</a></td>
                    <td style="width:200px;">
                      <button class="btn-outline-success btn accept" data-id="${docid}">Accept</button>
                      <button class="btn-outline-danger btn reject" data-id="${docid}">Reject</button>
                    </td>
                  </tr>`;
                  bodyInsert.innerHTML += temp;
                }
              }
        }

        const studentReq = document.getElementById("studentleaveReq");

    studentReq.addEventListener('click', async function (event) {
      const target = event.target;

      // Check if the clicked element is a button with the class "accept"
      if (target.classList.contains('accept')) {
        // Get the data-id attribute value for the specific button clicked
        const reqid = target.getAttribute('data-id');
        const parentRow = target.closest('tr');
        const tablesubject = parentRow.cells[2].textContent;
        const tabledate=parentRow.cells[3].textContent;

        console.log('Accepted ID:', reqid);

        // Now, you can use the reqid to retrieve data from Firestore and update the 'mentor' value to 'accepted'
        try {
          const docRef = doc(db, "users", reqid);
          const docSnapshot = await getDoc(docRef);
          console.log(docSnapshot);

          if (docSnapshot.exists()) {
            // Document exists, retrieve its data
            const data = docSnapshot.data();
            let name = data.username;
            let password = data.password;
            let odlist = data.odlist;
            let leavelist=data.leavelist;

            const updatedleavelist = [];

              for (const odRequest of leavelist) {
                const rollno = odRequest.RollNo;
                const name = odRequest.StudentName;
                const subject = odRequest.Reason;
                const fromdate = odRequest.leaveFrom;
                const todate = odRequest.leaveTo;
                const link=odRequest.leavelink;

                // Check if the subject matches the given value
                if (subject === tablesubject && tabledate== link) {
                  // If the subject matches, update the 'mentor' value to 'accepted'
                  odRequest.hod = "accepted";
                }

                // Push the modified or unmodified odRequest into the updatedOdlist array
                updatedleavelist.push(odRequest);
              }

            // Now 'updatedOdlist' contains the modified 'odlist' with 'mentor' values updated as needed.
            console.log(updatedleavelist);

            // Update the Firestore document with the modified 'odlist'
            await setDoc(docRef, { username: name, password: password, odlist: odlist, leavelist:updatedleavelist}, { merge: true });
            console.log('Document updated successfully');
            parentRow.remove()
          } else {
            console.log('Document does not exist.');
          }
        } catch (error) {
          console.error('Error retrieving or updating document:', error);
        }
      } else if (target.classList.contains('reject')) {
        // Get the data-id attribute value for the specific button clicked
        const reqid = target.getAttribute('data-id');
        const parentRow = target.closest('tr');
        const tablesubject = parentRow.cells[2].textContent;
        const tabledate=parentRow.cells[3].textContent;

        console.log('Rejected ID:', reqid);

        // Now, you can use the reqid to retrieve data from Firestore and update the 'mentor' value to 'reject'
        try {
          const docRef = doc(db, "users", reqid);
          const docSnapshot = await getDoc(docRef);
          console.log(docSnapshot);

          if (docSnapshot.exists()) {
            // Document exists, retrieve its data
            const data = docSnapshot.data();
            let name = data.username;
            let password = data.password;
            let odlist = data.odlist;
            let leavelist= data.leavelist;

            const updatedleavelist = [];

            for (const odRequest of leavelist) {
              const rollno = odRequest.RollNo;
              const name = odRequest.StudentName;
              const subject = odRequest.Reason;
              const fromdate = odRequest.leaveFrom;
              const todate = odRequest.leaveTo;
              const link=odRequest.leavelink;

              // Check if the subject matches the given value
              if (subject === tablesubject && tabledate==link) {
                // If the subject matches, update the 'mentor' value to 'rejected'
                odRequest.mentor = "rejected by hod";
                odRequest.hod="rejected"
                // odRequest.principal="rejected by mentor"
              }

              // Push the modified or unmodified odRequest into the updatedOdlist array
              updatedleavelist.push(odRequest);
            }

            // Now 'updatedOdlist' contains the modified 'odlist' with 'mentor' values updated as needed.
            console.log(updatedleavelist);

            // Update the Firestore document with the modified 'odlist'
            await setDoc(docRef, { username: name, password: password, odlist: odlist,leavelist:updatedleavelist }, { merge: true });
            console.log('Document updated successfully');
            parentRow.remove()
          } else {
            console.log('Document does not exist.');
          }
        } catch (error) {
          console.error('Error retrieving or updating document:', error);
        }
      }
    });
        
      });


    }catch{

    }
  });

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


  