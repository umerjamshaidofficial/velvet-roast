import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Use Environment Variable for the API URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Sync state with localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      // Only set user if both the profile and token exist
      if (savedUser && token) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error("Auth initialization failed:", err);
          logout(); // Clear corrupted data
        }
      } else {
        // If one is missing, clear both to stay consistent
        logout();
      }
      setLoading(false);
    };

    initAuth();

    // 2. Sync between tabs (If I logout in Tab A, Tab B logs out too)
    const syncLogout = (e) => {
      if (e.key === 'token' && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  /**
   * Login handler
   * We use async/await here to ensure localStorage is updated 
   * before the rest of the app attempts to redirect or re-render.
   */
  const login = async (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    return true;
  };

  /**
   * Logout handler
   * Clears all sensitive data from storage and resets the user state.
   */
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  /**
   * Update user state (useful for updating preferences or member status)
   * Ensures the local storage stays updated alongside the React state.
   */
  const updateUser = (updatedFields) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      login, 
      logout, 
      updateUser, 
      loading,
      isAuthenticated: !!user,
      // Check for Executive status (supports both snake_case and camelCase from DB/API)
      isMember: user?.is_member === true || user?.isMember === true,
      // Check for Admin status (matches the 'role' column in your DB)
      isAdmin: user?.role === 'admin'
    }}>
      {/* 3. Prevents components from mounting until we know the auth state */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};