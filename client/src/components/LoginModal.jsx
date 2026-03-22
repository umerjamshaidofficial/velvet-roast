import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Globe, X } from 'lucide-react';
import { auth, googleProvider } from '../firebase'; 
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../api/config';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    firstName: '',
    lastName: '' 
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // --- URL PARAMETER LOGIC ---
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(location.search);
      const emailParam = params.get('email');
      const redirectParam = params.get('redirect');

      if (emailParam) {
        setFormData(prev => ({ ...prev, email: emailParam }));
        setIsRegistering(true);
      }

      if (redirectParam && !emailParam) {
        setIsRegistering(false);
      }
    }
  }, [isOpen, location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (statusMsg.text) setStatusMsg({ type: '', text: '' });
  };

  /**
   * handleAuthSuccess
   * Updated to be asynchronous to prevent race conditions during navigation.
   */
  const handleAuthSuccess = async (user, token) => {
    // Await the login to ensure localStorage and State are set
    await login(user, token);
    
    // Close the modal immediately after state update
    onClose();

    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirect');

    // Role-based navigation logic fully preserved
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (redirectTo) {
      navigate(`/${redirectTo}`);
    } else {
      // Force a reload for standard users to ensure all context providers sync
      window.location.reload();
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const nameParts = firebaseUser.displayName ? firebaseUser.displayName.split(' ') : [];

      // Using centralized BASE_URL for Google Auth
      const response = await fetch(`${BASE_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: firebaseUser.displayName || '',
          email: firebaseUser.email,
          profilePic: firebaseUser.photoURL || '',
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        }),
      });

      const data = await response.json();

      if (response.ok) {
        handleAuthSuccess(data.user, data.token);
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Sanctuary Access Denied' });
      }
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setStatusMsg({ type: 'error', text: 'Google Ritual Failed' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          setIsRegistering(false);
          setStatusMsg({ type: 'success', text: 'Ritual account created! Please sign in.' });
        } else {
          handleAuthSuccess(data.user, data.token);
        }
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Access Denied' });
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setStatusMsg({ type: 'error', text: 'Connection to sanctuary failed' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3E2723]/40 dark:bg-black/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[420px] bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] p-10 text-[#3E2723] dark:text-white shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-[#3E2723]/30 dark:text-white/30 hover:text-[#D4AF37] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-playfair mb-2">
                {isRegistering ? 'Join the Ritual' : 'Welcome Back'}
              </h2>
              <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-black">
                {isRegistering ? 'Step 1: Create Account' : 'Step 2: Sign In'}
              </p>
            </div>

            {/* Status Messaging */}
            {statusMsg.text && (
              <div className={`text-[9px] uppercase tracking-widest text-center mb-6 py-3 px-4 rounded-2xl border ${
                statusMsg.type === 'error' 
                ? 'text-red-500 border-red-500/20 bg-red-500/5' 
                : 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5'
              }`}>
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegistering && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="firstName"
                    type="text"
                    placeholder="FIRST"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-[#D4AF37] transition-all text-[#3E2723] dark:text-white"
                  />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="LAST"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-[#D4AF37] transition-all text-[#3E2723] dark:text-white"
                  />
                </div>
              )}

              {isRegistering && (
                <input
                  name="username"
                  type="text"
                  placeholder="USERNAME"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-[#D4AF37] transition-all text-[#3E2723] dark:text-white"
                />
              )}

              <input
                name="email"
                type="email"
                placeholder="EMAIL@DOMAIN.COM"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-[#D4AF37] transition-all text-[#3E2723] dark:text-white"
              />

              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-5 py-4 text-xs focus:ring-1 focus:ring-[#D4AF37] transition-all text-[#3E2723] dark:text-white"
              />

              <button className="w-full bg-[#3E2723] dark:bg-[#D4AF37] text-white dark:text-[#1A0A0A] py-4 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] mt-2 hover:opacity-90 transition-all shadow-lg active:scale-95">
                {isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full mt-6 text-[9px] uppercase tracking-widest font-bold text-[#3E2723]/40 dark:text-white/40 hover:text-[#D4AF37] transition-colors text-center"
            >
              {isRegistering ? 'Already a member? Sign In' : 'Need an account? Register First'}
            </button>

            <div className="relative my-8">
              <hr className="border-[#3E2723]/5 dark:border-white/5" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#1A0A0A] px-3 text-[7px] uppercase tracking-widest text-[#3E2723]/30 font-bold">OR</span>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              className="w-full border border-[#3E2723]/10 dark:border-white/10 py-3.5 rounded-full flex items-center justify-center gap-3 hover:bg-[#3E2723]/5 dark:hover:bg-white/5 transition-all group"
            >
              <Globe size={14} className="text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              <span className="text-[9px] uppercase tracking-widest font-bold">Continue with Google</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;