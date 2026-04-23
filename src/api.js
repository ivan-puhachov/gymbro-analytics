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

function buildHeaders(token, includeAdmins = false) {
  const headers = {};

  if (includeAdmins) {
    headers['X-Include-Admins'] = 'true';
  }

  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }

  return headers;
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
      headers: { Authorization: 'Bearer ' + token },
    });
    if (!res.ok) throw createApiError('Failed to fetch user', res.status);
    return res.json();
  },

  async getReport(endpoint, token, includeAdmins = false) {
    const res = await fetch(BASE_URL + '/reports/' + endpoint, {
      headers: buildHeaders(token, includeAdmins),
    });
    if (!res.ok) throw createApiError(`Failed to fetch ${endpoint}`, res.status, endpoint);
    return res.json();
  },

  async getAnalytics(endpoint, token, queryParams = {}, includeAdmins = false) {
    const url = new URL(BASE_URL + '/analytics/' + endpoint);
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });
    
    const res = await fetch(url.toString(), {
      headers: buildHeaders(token, includeAdmins),
    });
    if (!res.ok) throw createApiError(`Failed to fetch analytics: ${endpoint}`, res.status, endpoint);
    return res.json();
  },

  async downloadAnalyticsReport(token, queryParams = {}, includeAdmins = false) {
    const url = new URL(BASE_URL + '/analytics/export-report');
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== undefined && queryParams[key] !== null) {
        url.searchParams.append(key, queryParams[key]);
      }
    });
    
    const res = await fetch(url.toString(), {
      headers: buildHeaders(token, includeAdmins),
    });
    
    if (!res.ok) throw createApiError('Failed to fetch analytics report', res.status);
    
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'gymbro_analytics_report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  }
};
