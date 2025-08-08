// register-script.js

const auth = firebase.auth();
const db = firebase.firestore();

const form = document.getElementById("register-form");
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");
const toLoginBtn = document.getElementById("to-login");

function validateUsername(username) {
  const re = /^[A-Za-z0-9]{4,20}$/;
  return re.test(username);
}

function validatePassword(password) {
  const re = /^[A-Za-z0-9]{8,20}$/;
  return re.test(password);
}

// Формируем email на базе username, чтобы Firebase Auth работал
function usernameToEmail(username) {
  return `${username}@rustbin.local`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";
  successMsg.textContent = "";

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const confirm = confirmInput.value;

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
  if (password !== confirm) {
    errorMsg.textContent = "Passwords do not match.";
    return;
  }

  const email = usernameToEmail(username);

  try {
    // Создаем пользователя в Firebase Auth
    await auth.createUserWithEmailAndPassword(email, password);

    // Сохраняем username в Firestore под uid пользователя
    const user = auth.currentUser;
    await db.collection("users").doc(user.uid).set({ username });

    successMsg.textContent = "Registration successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (err) {
    // Обрабатываем ошибки firebase
    if (err.code === "auth/email-already-in-use") {
      errorMsg.textContent = "Username already taken.";
    } else {
      errorMsg.textContent = err.message;
    }
  }
});

toLoginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});
