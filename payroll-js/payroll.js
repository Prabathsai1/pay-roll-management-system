import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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

const tbody = document.getElementById("employee-table");
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

function loadUser() {
  const userRef = ref(db, `users/${UID}`);
  onValue(userRef, (snap) => {
    if (snap.exists()) {
      document.getElementById("username").textContent = snap.val().company;
    }
  });
}

function loadEmployees() {
  const empRef = ref(db, `users/${UID}/employees`);
  onValue(empRef, (snap) => {
    tbody.innerHTML = "";
    if (!snap.exists()) return;

    snap.forEach((child) => {
      addRow(child.val());
    });
  });
}

function addRow(emp) {
  const basic = Number(emp.basicSalary);
  const hra = basic * 0.4;
  const gross = basic + hra;
  const pf = basic * 0.12;
  const esi = gross * 0.0175;
  const deduction = pf + esi;
  const net = gross - deduction;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${emp.idNo}</td>
    <td>${emp.name}</td>
    <td>${emp.department}</td>
    <td>₹${basic.toFixed(2)}</td>
    <td>₹${hra.toFixed(2)}</td>
    <td>₹${gross.toFixed(2)}</td>
    <td>₹${pf.toFixed(2)}</td>
    <td>₹${esi.toFixed(2)}</td>
    <td>₹${deduction.toFixed(2)}</td>
    <td><b>₹${net.toFixed(2)}</b></td>
    <td><button class="payslip-btn">Pay</button></td>
  `;

    let click=false;
  row.querySelector(".payslip-btn").onclick = () => {
    if(click==false){
      row.querySelector(".payslip-btn").innerHTML="Payslip"; 
      click=true;
    }
    else{
   openPayslipInNewTab(emp);
    }
  };

  tbody.appendChild(row);
}


window.openPayslipInNewTab = function (emp) {
  const basic = Number(emp.basicSalary);
  const hra = basic * 0.4;
  const gross = basic + hra;
  const pf = basic * 0.12;
  const esi = gross * 0.0175;
  const deduction = pf + esi;
  const net = gross - deduction;

  const payslipHTML = `
    <html>
      <head>
        <title>Payslip - ${emp.name}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top:20px; }
          th, td { border: 1px solid #444; padding: 10px; text-align: center; }
          h2 { text-align: center; color: #0288d1; }
        </style>
      </head>
      <body>

        <h2>Salary Payslip</h2>

        <p><b>Employee ID:</b> ${emp.idNo}</p>
        <p><b>Name:</b> ${emp.name}</p>
        <p><b>Department:</b> ${emp.department}</p>

        <table>
          <tr><th>Earnings</th><th>Amount (₹)</th></tr>
          <tr><td>Basic Salary</td><td>₹${basic.toFixed(2)}</td></tr>
          <tr><td>HRA (40%)</td><td>₹${hra.toFixed(2)}</td></tr>
          <tr><th>Gross Salary</th><th>₹${gross.toFixed(2)}</th></tr>

          <tr><th>Deductions</th><th>Amount (₹)</th></tr>
          <tr><td>PF (12%)</td><td>₹${pf.toFixed(2)}</td></tr>
          <tr><td>ESI (1.75%)</td><td>₹${esi.toFixed(2)}</td></tr>
          <tr><th>Total Deduction</th><th>₹${deduction.toFixed(2)}</th></tr>

          <tr><th>Net Salary</th><th>₹${net.toFixed(2)}</th></tr>
        </table>
      <button style=" margin:10px;font-size:20px;font-family:serif;margin-left:630px;padding: 8px 14px; border: none; border-radius: 6px;background-color: #f44336; color: white;cursor: pointer;"onclick="window.print()">print</button>

      </body>
    </html>
  `;

  const newTab = window.open("", "_self");
  newTab.document.write(payslipHTML);
  newTab.document.close();
};
