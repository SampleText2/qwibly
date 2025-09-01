
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
  import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAYpaRHLoqFis2d87ceLSAEERx3OOYMSCk",
    authDomain: "qwibly-85f67.firebaseapp.com",
    projectId: "qwibly-85f67",
    storageBucket: "qwibly-85f67.appspot.com",
    messagingSenderId: "119685972717",
    appId: "1:119685972717:web:a32124110eef5f59e542e4"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save email to Firestore under "users" collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date()
      });

      alert("Account created and saved to Firestore! 🎉");
      document.getElementById("signup-form").reset();
    } catch (error) {
      alert("Error: " + error.message);
    }
  });