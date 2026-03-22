import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { BASE_URL } from '../api/config'; // Centralized source for sanctuary server URL

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const auth = useAuth();
  const isMember = auth?.isMember || false; 
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('velvet_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '' });
  const [giftCount, setGiftCount] = useState(0);

  const FLAT_SHIPPING_RATE = 5.00;

  useEffect(() => {
    localStorage.setItem('velvet_cart', JSON.stringify(cart));
  }, [cart]);

  // Stable gift fetching logic using the centralized BASE_URL
  const fetchGiftCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        setGiftCount(0);
        return;
    }
    try {
      const response = await fetch(`${BASE_URL}/api/orders/received/count`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setGiftCount(data.count || 0);
      }
    } catch (err) {
      console.error("Could not sync gift rituals from sanctuary:", err);
    }
  }, []);

  useEffect(() => {
    fetchGiftCount();
    // 2-minute interval sync preserved
    const interval = setInterval(fetchGiftCount, 120000);
    return () => clearInterval(interval);
  }, [fetchGiftCount]);

  const showToast = (message) => {
    setToast({ isVisible: true, message });
    setTimeout(() => {
      setToast({ isVisible: false, message: '' });
    }, 3000);
  };

  /**
   * Enhanced addToCart
   * Normalizes incoming product data (prices and images) to prevent 
   * logic errors during checkout calculation.
   */
  const addToCart = (product) => {
    setCart((prevCart) => {
      // Normalize price to a number immediately
      const numericPrice = typeof product.price === 'string' 
        ? parseFloat(product.price.replace('$', '')) 
        : product.price;

      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      }

      // Ensure the new item has all required fields for Checkout.jsx
      const normalizedProduct = {
        ...product,
        price: numericPrice,
        quantity: 1,
        image: product.image || product.image_url 
      };

      return [...prevCart, normalizedProduct];
    });
    
    showToast(`${product.name} added to ritual`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('velvet_cart');
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setGiftCount(0);
    clearCart();
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) }
          : item
      )
    );
  };

  // Final totals calculation - Logic fully preserved
  const cartTotal = cart.reduce((acc, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace('$', '')) 
      : item.price;
    return acc + (price * (item.quantity || 1));
  }, 0);

  const shippingFee = cart.length === 0 ? 0 : (isMember ? 0 : FLAT_SHIPPING_RATE);
  const grandTotal = cartTotal + shippingFee;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal, 
      shippingFee,
      grandTotal,
      isCartOpen, 
      setIsCartOpen,
      toast,
      showToast,
      clearCart,
      logout,
      giftCount,
      fetchGiftCount,
      isMember,
      BASE_URL
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);