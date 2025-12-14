import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, get, push, remove, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
const employee = document.getElementById("add-employees");
const details = document.getElementsByClassName("add-employee")[0];
const submit = document.getElementById("submit");
const cancel = document.getElementById("cancel");
const table = document.querySelector(".table");
const val = details.querySelectorAll("input");
const people = document.getElementById("totalemp");
const tbody = document.getElementById("employee-table");
const deduction = document.getElementById("totaldeductions");
let totaldeduction = 0;
let total = 0;
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
  loadEmployees();
  loadUser();
});

function loadEmployees() {
  const empRef = ref(db, `users/${UID}/employees`);

  onValue(empRef, (snap) => {
    tbody.innerHTML = "";
    totaldeduction = 0;
    deduction.innerText = "0";
    total = 0;
    if (!snap.exists()) {
      return (confirm("no employees found !"));
    }
    snap.forEach(child => {
      const key = child.key;
      const emp = child.val();
      addRow(emp, key);
    });

  });
}


function loadUser() {
  const userRef = ref(db, `users/${UID}`);
  onValue(userRef, (snap) => {
    if (snap.exists()) {
      document.getElementById("username").textContent =
        snap.val().company;
    }
  });
}


let inital = 0;
let deductiontime=0
function addRow(emp, key) {
  const basic = Number(emp.basicSalary);


  const hra = basic * 0.4;
  const gross = basic + hra;


  const pf = basic * 0.12;
  const esi = gross * 0.0175;
  const totalDeduction = pf + esi;

deductiontime+= 100;
  setTimeout(() => {
  totaldeduction += totalDeduction;
     deduction.innerText = "₹" + totaldeduction.toFixed(2);
  }, deductiontime)


  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${emp.idNo}</td>
    <td>${emp.name}</td>
    <td>${emp.email}</td>
    <td>${emp.designation}</td>
    <td>${emp.department}</td>
    <td>${emp.basicSalary}</td>
    <td>${emp.position}</td>
    <td>${emp.netSalary}</td>
    <td>${emp.accountNo}</td>
    <td>${emp.ifsc}</td>
    <td><button class="delete-btn" data-key="${key}">Delete</button></td>
  `;
  row.querySelector(".delete-btn").onclick = () => {
    if (confirm("Delete this employee?")) {
      remove(ref(db, `users/${UID}/employees/${key}`));
    }
  }
  tbody.appendChild(row);
  inital += 100;
  setTimeout(() => {
    total += 1;
    people.innerHTML = total;
  }, inital)

}

employee.addEventListener("click", () => {
  details.style.display = "grid"
})

details.addEventListener("submit", (e) => {
  e.preventDefault();
  const emp = {
    idNo: document.getElementById("Id").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    designation: document.getElementById("Designation").value,
    department: document.getElementById("Department").value,
    basicSalary: document.getElementById("salary").value,
    position: document.getElementById("Position").value,
    netSalary: document.getElementById("net").value,
    accountNo: document.getElementById("Account").value,
    ifsc: document.getElementById("IFSC").value
  };

  const empRef = ref(db, `users/${UID}/employees`);

  get(empRef)
    .then((data) => {
      let duplicate = false;

      data.forEach((child) => {
        if (child.val().idNo === emp.idNo) {
          duplicate = true;
        }
      });

      if (duplicate) {
        alert("Employee ID already exists! Enter a unique ID.");
        return;
      }
      if (!duplicate) {
        push(empRef, emp)
          .then(() => {
            alert("Employee added!");
            e.target.reset();
            details.style.display = "none"
          })
          .catch(err => {
            alert(err.message);
          });
      }
    })
})


cancel.addEventListener("click", () => {
  details.style.display = "none"
});