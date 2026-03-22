import { BASE_URL } from './config'; // Centralized source for sanctuary server URL

const API_URL = `${BASE_URL}/api/profile`;

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  return response.json();
};

export const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};