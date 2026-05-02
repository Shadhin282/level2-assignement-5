const base = 'http://127.0.0.1:5000/api/v1/auth';
const user = { name: 'Test User', email: `testuser-${Date.now()}@example.com`, password: 'Abcd1234' };
(async () => {
  try {
    const reg = await fetch(`${base}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const regBody = await reg.json();
    console.log('register', reg.status, regBody);

    const login = await fetch(`${base}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password }),
    });
    const loginBody = await login.json();
    console.log('login', login.status, loginBody);

    const accessToken = loginBody.data?.accessToken;
    const authHeader = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

    const change = await fetch(`${base}/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ oldPassword: user.password, newPassword: 'Newpass123' }),
    });
    const changeBody = await change.json();
    console.log('change-password', change.status, changeBody);

    const logout = await fetch(`${base}/logout`, {
      method: 'POST',
      headers: authHeader,
    });
    const logoutBody = await logout.json();
    console.log('logout', logout.status, logoutBody);
  } catch (err) {
    console.error('error', err);
  }
})();
