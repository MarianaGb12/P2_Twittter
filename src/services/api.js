const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  if (token) {
    config.headers['x-access-token'] = token;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const loginUser = (credentials) => apiRequest('/users/login', 'POST', credentials);
export const registerUser = (credentials) => apiRequest('/users', 'POST', credentials);