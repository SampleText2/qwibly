const auth = firebase.auth();

document.getElementById("signup-form").addEventListener("submit", function (e) {
  //e.preventDefault();

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

  // Sign up with Firebase Auth
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Account created successfully! 🎉");
      // Redirect or do more setup
      document.getElementById("signup-form").reset();
    })
    .catch((error) => {
      alert(error.message);
    });
});