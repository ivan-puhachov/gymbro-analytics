if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL environment variable is missing. Check your .env file or deployment config.");
}

const BASE_URL = import.meta.env.VITE_API_URL;

function createApiError(message, status, details = null) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

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
    if (!res.ok) throw createApiError('Login failed', res.status);
    return res.json();
  },

  async getMe(token) {
    const res = await fetch(BASE_URL + '/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!res.ok) throw createApiError('Failed to fetch user', res.status);
    return res.json();
  },

  async getReport(endpoint, token) {
    const res = await fetch(BASE_URL + '/reports/' + endpoint, {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!res.ok) throw createApiError(`Failed to fetch ${endpoint}`, res.status, endpoint);
    return res.json();
  },

  async getAnalytics(endpoint, token, queryParams = {}) {
    const url = new URL(BASE_URL + '/analytics/' + endpoint);
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });
    
    const res = await fetch(url.toString(), {
      headers: { 'Authorization': 'Bearer ' + token },
    });
    if (!res.ok) throw createApiError(`Failed to fetch analytics: ${endpoint}`, res.status, endpoint);
    return res.json();
  }
};
