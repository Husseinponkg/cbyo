const regform = document.getElementById('registerForm');
const loginform = document.getElementById('loginForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const phone = document.getElementById('phone');
const userlocation = document.getElementById('location');

if (regform) {
  regform.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = {
      username: username.value,
      email: email.value,
      password: password.value,
      phone: phone.value,
      location: userlocation.value,
    };
    try {
      const response = await fetch('/auth/create-user', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json();
        alert('Registration failed: ' + (data.message || response.statusText));
        return;
      }
      const data = await response.json();
      console.log(data);
      window.location.href = '/login.html';
    } catch (error) {
      console.error(error);
      alert('error in registration: ' + error);
    }
  });
}

if (loginform) {
  loginform.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/auth/login', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ username: username.value, password: password.value }),
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        alert(data.message);
      }
      window.location.href=data.redirect;
    } catch (error) {
      console.error(error);
      alert('error in login: ' + error);
    }
  });
}
