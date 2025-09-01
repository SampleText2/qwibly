import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYpaRHLoqFis2d87ceLSAEERx3OOYMSCk",
    authDomain: "qwibly-85f67.firebaseapp.com",
    projectId: "qwibly-85f67",
    storageBucket: "qwibly-85f67.appspot.com",
    messagingSenderId: "119685972717",
    appId: "1:119685972717:web:a32124110eef5f59e542e4",
    measurementId: "G-3MKKN2FQJZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Please fill in both fields.");
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          alert("Login successful! 🎉");
          window.location.href = "home.html";
        })
        .catch((error) => {
          alert("Login failed: " + error.message);
        });
    });