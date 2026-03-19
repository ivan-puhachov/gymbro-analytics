if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL environment variable is missing. Check your .env file or deployment config.");
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const api = {
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const res = await fetch(BASE_URL + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async getMe(token) {
    const res = await fetch(BASE_URL + '/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async getReport(endpoint, token) {
    const res = await fetch(BASE_URL + '/reports/' + endpoint, {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!res.ok) throw new Error('Failed to fetch ' + endpoint);
    return res.json();
  }
};
