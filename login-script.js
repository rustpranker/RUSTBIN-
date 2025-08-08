// login-script.js

const auth = firebase.auth();
const db = firebase.firestore();

const form = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const toRegisterBtn = document.getElementById("to-register");

function validateUsername(username) {
  const re = /^[A-Za-z0-9]{4,20}$/;
  return re.test(username);
}

function validatePassword(password) {
  const re = /^[A-Za-z0-9]{8,20}$/;
  return re.test(password);
}

function usernameToEmail(username) {
  return `${username}@rustbin.local`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  successMsg.textContent = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!validateUsername(username)) {
    errorMsg.textContent =
      "Username must be 4-20 characters long, Latin letters and digits only.";
    return;
  }
  if (!validatePassword(password)) {
    errorMsg.textContent =
      "Password must be 8-20 characters long, Latin letters and digits only.";
    return;
  }

  const email = usernameToEmail(username);

  try {
    // Логиним пользователя Firebase
    await auth.signInWithEmailAndPassword(email, password);
    successMsg.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1200);
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      errorMsg.textContent = "User not found.";
    } else if (err.code === "auth/wrong-password") {
      errorMsg.textContent = "Incorrect password.";
    } else {
      errorMsg.textContent = err.message;
    }
  }
});

toRegisterBtn.addEventListener("click", () => {
  window.location.href = "register.html";
});
