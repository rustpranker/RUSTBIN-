// Отслеживаем авторизацию пользователя
auth.onAuthStateChanged(user => {
  const authButtons = document.getElementById('auth-buttons');
  const backButton = document.getElementById('back-button');

  if (user) {
    authButtons.innerHTML = `
      Logged in as ${user.displayName || user.email || user.uid} 
      <button onclick="logout()">Logout</button>
    `;
    backButton.style.display = 'inline-block';
  } else {
    authButtons.innerHTML = `
      <button onclick="window.location.href='login.html'">Login</button>
      <button onclick="window.location.href='register.html'">Register</button>
    `;
    backButton.style.display = 'none';
  }
});

// Logout функция
function logout() {
  auth.signOut()
    .then(() => {
      window.location.href = 'index.html';
    })
    .catch(err => {
      console.error('Logout error:', err);
    });
}

// Back кнопка возвращает на главную
document.getElementById('back-button').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Загрузка паст из Firestore
function loadPastes() {
  const pastesList = document.getElementById('pastes-list');
  pastesList.innerHTML = 'Loading...';

  db.collection('pastes').get()
    .then(snapshot => {
      pastesList.innerHTML = '';
      snapshot.forEach(doc => {
        const paste = doc.data();
        const div = document.createElement('div');
        div.textContent = paste.title || 'Untitled';
        pastesList.appendChild(div);
      });
    })
    .catch(err => {
      pastesList.innerHTML = 'Error loading pastes.';
      console.error(err);
    });
}

loadPastes();
