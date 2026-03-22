import { BASE_URL } from './config'; // Centralized source for sanctuary server URL

const API_URL = `${BASE_URL}/api/orders`;

/**
 * Fetches the history of rituals for the authenticated user.
 */
export const fetchUserOrders = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch personal orders');
  }

  return response.json();
};

/**
 * Creates a new coffee ritual order.
 * Handles standard, direct buy (single item), and gift-dedicated orders.
 */
export const createOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  
  /**
   * We map the items to ensure consistency between the 
   * Cart Context data and the Product Detail data.
   */
  const sanitizedItems = orderData.items.map(item => ({
    id: item.id,
    name: item.name,
    price: parseFloat(item.price.toString().replace('$', '')),
    quantity: item.quantity || 1,
    image_url: item.image_url || item.image // Ensures backend gets a valid image reference
  }));

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      customer: orderData.customer,
      items: sanitizedItems,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      total: orderData.total,
      addressId: orderData.addressId, 
      
      // Gift specific fields
      isGift: orderData.isGift,
      giftMessage: orderData.giftMessage,
      recipientEmail: orderData.recipientEmail,
      recipientId: orderData.recipientId // Used if the recipient is already a registered user
    })
  });

  if (!response.ok) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.error || 'Problem processing your ritual.');
  }

  return response.json();
};

/**
 * Fetches rituals dedicated TO the user (Received Gifts).
 */
export const fetchReceivedGifts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/received`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch rituals');
  return response.json();
};

/**
 * Marks a specific ritual as claimed by the recipient.
 */
export const claimGift = async (orderId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/received/${orderId}/claim`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.error || 'Could not claim ritual.');
  }
  
  return response.json();
};

/**
 * Fetches the count of unclaimed rituals to display on the profile/gift badge.
 */
export const fetchGiftCount = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/received/count`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return { count: 0 };
  return response.json();
};