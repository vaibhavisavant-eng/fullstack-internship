const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to retrieve stored JWT token from localStorage
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('userpulse_token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Helper to process HTTP responses
 */
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred');
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }
  return data;
};

export const api = {
  // 1. Get all users
  async getUsers(search = '') {
    const url = search
      ? `${API_BASE_URL}/users?search=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/users`;
    const response = await fetch(url, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  // 2. Get user by ID
  async getUserById(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  // 3. Create user
  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // 4. Update user
  async updateUser(id, userData) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // 5. Delete user
  async deleteUser(id) {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // 6. Register Auth
  async register(authData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData)
    });
    return handleResponse(response);
  },

  // 7. Login Auth
  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  // 8. Fetch Current Authenticated User Profile
  async getMe() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, { headers: getAuthHeaders() });
    return handleResponse(response);
  }
};
