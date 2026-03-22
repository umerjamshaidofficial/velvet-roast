import { BASE_URL } from './config'; // Centralized source for sanctuary server URL

export const submitOrder = async (orderData) => {
  const token = localStorage.getItem('token'); 
  
  // Updated to use dynamic BASE_URL and consistent endpoint
  const response = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to place order');
  }

  return response.json();
};