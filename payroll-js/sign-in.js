import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth,   sendPasswordResetEmail,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAEE6aeHg8HSZV__fggC3GIFviWbFXgOMc",
    authDomain: "pay-roll-ee720.firebaseapp.com",
    databaseURL: "https://pay-roll-ee720-default-rtdb.firebaseio.com",
    projectId: "pay-roll-ee720",
    storageBucket: "pay-roll-ee720.firebasestorage.app",
    messagingSenderId: "792800135758",
    appId: "1:792800135758:web:119e4211d65b478f4b511f"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

function ensureUser(uid, email) {
  const userRef = ref(db, "users/" + uid);
  return get(userRef).then(snap => {
    if (!snap.exists()) {
      return set(userRef, { email: email, employees: {} });
    }
  });
}

document.querySelector(".login").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => ensureUser(cred.user.uid,email))
    .then(() => {
        console.log("redirecting");
      window.location.href = "../index-loading.html";  
    })
    .catch(err => {
      alert(err.message);    
    });
});

document.querySelector("#forgot-password").addEventListener("click",(e)=>{
  const emailInputs =document.getElementById("login-email").value.trim();
  e.preventDefault();
  sendPasswordResetEmail(auth,emailInputs )
    .then(()=>{
      alert("email sent")
    })
    .catch((error)=>{
      alert(error.code)
    })
})
