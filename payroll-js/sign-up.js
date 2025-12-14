  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
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
 const auth=getAuth(app);
 const db=getDatabase(app);

function saveuser(uid,email,companyname){
    return set(ref(db,"users/"+uid),{
        email:email,
        company:companyname,
        employees:{}
        })
}




const login = document.getElementsByClassName("login")[0]
login.addEventListener("submit", (e) => {
        e.preventDefault();
    const company = document.getElementById("user-details").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const password = document.getElementById("user-password").value.trim();

    createUserWithEmailAndPassword(auth ,email,password)
    .then((data)=>saveuser(data.user.uid,email,company))
    .then(()=>{ 
        alert(" account created")

        window.location.href = "./sign-in.html"})
    .catch((error)=>
        alert(error.message)
            )

})

















    // if (user == "" || email == "" || password == "") {
    //     return (alert("Fill all fields"))
    // }
    //     if(localStorage.getItem(user))
    // {
    //         return alert("account already exist")}
    // else{
    //     const data={
    //                 username:user,
    //                 email:email,
    //                 password:password
    //                 }

    //     if (user.length <= 10 ) {
    //         return (alert("user name should me greater then 10"))
    //     }
    //     if( password.length <= 8){
    //         return (alert("password must be greater then 8"))
    //     }
    //     else if (user.length > 10 && password .length> 8) {
    //         localStorage.setItem(user, JSON.stringify(data))
    //         // window.location.href = "https://www.google.com/";
    //         //    window.location.href = "./home/home.html";
    //      window.location.href = "../home/home.html";



    //     }
    // }}
