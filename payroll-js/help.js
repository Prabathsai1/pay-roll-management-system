import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get, push, remove, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
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
let UID = null;
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "../payroll-html/sign-in.html";
    return;
  }
  UID = user.uid;
  loadUser();
});


function loadUser() {
  const userRef = ref(db, `users/${UID}`);
  onValue(userRef, (snap) => {
    if (snap.exists()) {
      document.getElementById("username").textContent =
        snap.val().company;
       document.getElementById("usernames").textContent =
        snap.val().company;
       document.getElementById("user id").textContent =
        `user id = ${UID}`;
    }
  });
}

