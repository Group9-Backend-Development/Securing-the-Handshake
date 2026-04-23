const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = {
  async getCsrfToken() {
    const res = await fetch(`${API_BASE_URL}/csrf-token`, {
      credentials: 'include',
    });

    const data = await res.json();
    return data.csrfToken;
  },

  async fetchWithCreds(url, options = {}) {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
      },
    });
  },

  async signup(username, password, csrfToken) {
    const res = await this.fetchWithCreds(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    return data;
  },

  async login(username, password, csrfToken) {
    const res = await this.fetchWithCreds(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('username', data.username);
    return data;
  },

  async logout(csrfToken) {
    const res = await this.fetchWithCreds(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken,
      },
    });

    if (!res.ok) throw new Error('Logout failed');
    localStorage.removeItem('username');
  },

  async checkAuth() {
    const res = await this.fetchWithCreds(`${API_BASE_URL}/auth/me`);
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async getContacts() {
    const res = await this.fetchWithCreds(`${API_BASE_URL}/contacts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch contacts');
    return data;
  },

  async addContact(contact, csrfToken) {
    const res = await this.fetchWithCreds(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
      },
      body: JSON.stringify(contact),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add contact');
    return data;
  },

  async deleteContact(contactId, csrfToken) {
    const res = await this.fetchWithCreds(`${API_BASE_URL}/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'x-csrf-token': csrfToken,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete contact');
    return data;
  },
};
