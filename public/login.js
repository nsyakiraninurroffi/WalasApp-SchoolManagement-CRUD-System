
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  const message = document.getElementById('login-message');

if (response.ok) {
  localStorage.setItem('isLoggedIn', 'true');
  message.textContent = result.message;
  window.location.href = '/dashboard.html'; // arahkan ke dashboard
} else {
  message.textContent = result.message;
}
});

