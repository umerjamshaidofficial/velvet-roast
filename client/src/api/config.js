// src/api/config.js
/**
 * Project Velvet API Configuration
 * Vite uses import.meta.env to access environment variables.
 * We fall back to localhost if the variable isn't defined.
 */

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  RITUALS: `${BASE_URL}/api/rituals`,
  PROFILE: `${BASE_URL}/api/profile`,
  GIFTS: `${BASE_URL}/api/gifts`,
  ORDERS: `${BASE_URL}/api/orders`,
  ADMIN: `${BASE_URL}/api/admin`,
  AUTH: `${BASE_URL}/api/auth`,
};