import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, User, LogOut, Package, CircleUser, 
  ShoppingBag, Sun, Moon, Gift, Crown, Mail 
} from 'lucide-react'; 
import LoginModal from './LoginModal';
import MemberBadge from './MemberBadge'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isDark, setIsDark] = useState(false); 
  const [hasNewThanks, setHasNewThanks] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, isMember, logout: authLogout } = useAuth();
  const { cart, setIsCartOpen, logout: cartLogout, giftCount } = useCart();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Mapping specifically to the 'profile_pic' column
  const userPhoto = user?.profile_pic || user?.profilePic || user?.image;

  // Initialize Theme and Outside Clicks
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Detailed Notifications
  const fetchNotificationList = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const response = await fetch('http://localhost:5000/api/orders/notifications/list-detailed', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        handleLogout();
        return;
      }

      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load detailed messages", err);
    }
  };

  // Mark Notifications as Read
  const markAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) return;

    try {
      const response = await fetch('http://localhost:5000/api/orders/notifications/read-all', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setHasNewThanks(false);
      }
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  // Poll for Unread Notifications
  useEffect(() => {
    if (!user) {
      setHasNewThanks(false);
      return;
    }
    
    const checkNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/orders/notifications/unread', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          return;
        }

        const data = await response.json();
        setHasNewThanks(data.unreadCount > 0);
      } catch (err) {
        // Silent fail
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000); 
    return () => clearInterval(interval);
  }, [user]);

  const toggleTheme = () => {
    const newDarkState = !isDark;
    setIsDark(newDarkState);
    if (newDarkState) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cartLogout();
    authLogout();
    setDropdownOpen(false);
    navigate('/'); 
  };

  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Logic for manual login initials (e.g. Barike Dave -> BD)
  const getInitials = () => {
    const first = user?.firstName || user?.first_name || "";
    const last = user?.lastName || user?.last_name || "";
    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || "??";
  };

  // Restore Full Name Display (e.g. Rabbia Jamshaid)
  const firstName = user?.firstName || user?.first_name || "";
  const lastName = user?.lastName || user?.last_name || "";
  const displayName = (firstName && lastName) ? `${firstName} ${lastName}` : (user?.username || "Guest");

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[80] w-[95%] max-w-6xl"
      >
        <div className="bg-white/70 dark:bg-[#1A0A0A]/80 backdrop-blur-2xl border border-[#3E2723]/5 dark:border-[#4A0E0E]/30 px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(62,39,35,0.05)] flex items-center justify-between relative transition-colors duration-500">
          
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-[#8C6A5E]/10 dark:bg-[#4A0E0E]/20 rounded-lg group-hover:bg-[#D4AF37]/20 transition-all duration-500">
              <Coffee className="text-[#8C6A5E] dark:text-[#E27D60] group-hover:text-[#D4AF37] transition-colors" size={20} />
            </div>
            <span className="font-playfair font-bold text-2xl text-[#3E2723] dark:text-white tracking-tight">Velvet.</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-10 font-inter text-[9px] uppercase tracking-[0.5em] text-[#3E2723]/50 dark:text-white/30">
            <Link to="/" className="hover:text-[#D4AF37] dark:hover:text-[#E27D60] hover:tracking-[0.6em] transition-all duration-500">Home</Link>
            <a href="#menu" onClick={(e) => handleScroll(e, 'menu')} className="hover:text-[#D4AF37] dark:hover:text-[#E27D60] hover:tracking-[0.6em] transition-all duration-500">Collection</a>
            <Link to="/membership" className={`${isMember ? 'text-[#D4AF37]' : ''} hover:text-[#D4AF37] transition-all font-bold`}>
              {isMember ? 'Membership' : 'Join Executive'}
            </Link>
          </div>

          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-full bg-[#3E2723]/5 dark:bg-[#4A0E0E]/20 text-[#3E2723] dark:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <div className="relative">
                <button 
                  onClick={() => {
                    const nextState = !showNotifications;
                    setShowNotifications(nextState);
                    if (nextState) {
                      fetchNotificationList();
                      markAsRead();
                    }
                  }}
                  className="relative p-3 rounded-full bg-[#3E2723]/5 dark:bg-[#4A0E0E]/20 text-[#3E2723] dark:text-white hover:bg-[#D4AF37]/10 transition-colors group"
                >
                  <Mail 
                    size={18} 
                    className={`transition-colors ${hasNewThanks ? 'text-[#D4AF37]' : 'group-hover:text-[#D4AF37]'}`} 
                  />
                  {hasNewThanks && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-[#D4AF37]"></span>
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-6 w-80 bg-white dark:bg-[#1A0A0A] border border-[#D4AF37]/20 rounded-2xl shadow-2xl p-6 z-[100]"
                    >
                      <header className="text-center mb-6">
                        <h3 className="text-[12px] uppercase tracking-[0.5em] font-black text-[#D4AF37]">
                          Notifications
                        </h3>
                        <div className="h-[1px] w-12 bg-[#D4AF37]/20 mx-auto mt-3" />
                      </header>

                      <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-3 custom-scrollbar">
                        {notifications.length > 0 ? notifications.map((note) => (
                          <div key={note.id} className="flex gap-4 items-start p-4 bg-[#3E2723]/5 dark:bg-white/5 rounded-2xl border border-transparent hover:border-[#D4AF37]/20 transition-all">
                            <img 
                              src={note.sender_photo || '/path/to/default/avatar.png'} 
                              alt={note.sender_name} 
                              className="w-10 h-10 rounded-full object-cover mt-1 flex-shrink-0"
                            />
                            <div className="flex-1 space-y-2">
                               <span className="block text-[9px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]">
                                  {note.sender_name}
                               </span>
                               <p className="text-xs text-[#3E2723]/80 dark:text-white/70 italic leading-relaxed font-serif">
                                  "{note.gratitude_message}"
                               </p>
                               <div className="flex justify-end gap-3 text-[7px] uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20 mt-3 border-t border-[#3E2723]/5 dark:border-white/5 pt-2">
                                 <span>{new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                 <span>Order #VR-{note.id}</span>
                               </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-10">
                            <Mail size={24} className="mx-auto text-[#3E2723]/10 mb-3" />
                            <p className="text-[11px] text-[#3E2723]/40 uppercase tracking-[0.3em]">No new echoes</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {user && (
              <button 
                onClick={() => navigate('/received-rituals')}
                className="relative p-3 rounded-full bg-[#3E2723]/5 dark:bg-[#4A0E0E]/20 text-[#3E2723] dark:text-white hover:bg-[#D4AF37]/10 transition-colors group"
                title="Received Rituals"
              >
                <Gift size={18} className="group-hover:text-[#D4AF37] transition-colors" />
                {giftCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#D4AF37] text-[#1A0A0A] text-[9px] items-center justify-center border-2 border-white dark:border-[#1A0A0A] font-inter font-bold">
                      {giftCount}
                    </span>
                  </span>
                )}
              </button>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-full bg-[#3E2723]/5 dark:bg-[#4A0E0E]/20 text-[#3E2723] dark:text-white hover:bg-[#D4AF37]/10 transition-colors"
            >
              <ShoppingBag size={18} />
              {cartItemCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] dark:bg-[#E27D60] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-[#1A0A0A] font-inter font-bold"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="relative ml-2">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-4 px-5 py-2 rounded-full border transition-all cursor-pointer group
                    ${isMember 
                      ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : 'bg-[#3E2723]/5 dark:bg-white/5 border-[#3E2723]/5 dark:border-white/10 hover:border-[#D4AF37]/30'}
                  `}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border ${isMember ? 'border-[#D4AF37] bg-[#D4AF37]/20' : 'border-[#8C6A5E]/40 bg-[#8C6A5E]/20'}`}>
                    {userPhoto ? (
                      <img 
                        src={userPhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className={`text-[10px] font-black font-inter ${isMember ? 'text-[#D4AF37]' : 'text-[#8C6A5E]'}`}>
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-start min-w-[60px]">
                    <span className={`font-inter text-[10px] uppercase tracking-widest font-bold group-hover:text-[#3E2723] dark:group-hover:text-white ${isMember ? 'text-[#D4AF37]' : 'text-[#3E2723]/80 dark:text-white/80'}`}>
                      {displayName}
                    </span>
                    {isMember && (
                      <span className="text-[7px] uppercase tracking-[0.2em] text-[#D4AF37] font-black leading-none mt-0.5">Executive</span>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-6 w-60 bg-white dark:bg-[#2A1515] border border-[#3E2723]/5 dark:border-[#4A0E0E]/50 rounded-3xl shadow-xl p-2 z-[90]"
                    >
                      <div className="px-5 py-4 flex flex-col gap-1">
                        <span className="text-[8px] uppercase tracking-[0.2em] text-[#3E2723]/40 dark:text-white/30 font-bold">Status</span>
                        {isMember ? <MemberBadge /> : <span className="text-[10px] font-bold text-[#3E2723]/60 dark:text-white/50 italic">Standard Member</span>}
                      </div>
                      <div className="h-[1px] bg-[#3E2723]/5 dark:bg-white/5 my-1 mx-4" />
                      <button 
                        onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-4 px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-[#3E2723]/60 dark:text-white/40 hover:bg-[#D4AF37]/5 rounded-2xl transition-all"
                      >
                        <User size={16} className="text-[#8C6A5E]" />
                        My Sanctuary
                      </button>
                      <button 
                        onClick={() => { navigate('/my-orders'); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-4 px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-[#3E2723]/60 dark:text-white/40 hover:bg-[#3E2723]/5 dark:hover:bg-[#4A0E0E]/20 rounded-2xl transition-all"
                      >
                        <Package size={16} className="text-[#8C6A5E]" />
                        My Orders
                      </button>
                      <button 
                        onClick={() => { navigate('/membership'); setDropdownOpen(false); }}
                        className={`w-full flex items-center gap-4 px-5 py-3 text-[10px] uppercase tracking-widest font-bold rounded-2xl transition-all ${isMember ? 'text-[#D4AF37] hover:bg-[#D4AF37]/5' : 'text-[#3E2723]/60 dark:text-white/40 hover:bg-[#3E2723]/5'}`}
                      >
                        <Crown size={16} className={isMember ? 'text-[#D4AF37]' : 'text-[#8C6A5E]'} />
                        {isMember ? 'Pro Benefits' : 'Upgrade to Executive'}
                      </button>
                      <div className="h-[1px] bg-[#3E2723]/5 dark:bg-white/5 my-1 mx-4" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 text-[10px] uppercase tracking-widest font-bold text-red-600/70 hover:bg-red-500/5 rounded-2xl transition-all"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="ml-2 flex items-center gap-3 bg-[#3E2723] dark:bg-[#4A0E0E] text-white px-8 py-3 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] hover:scale-105 transition-all duration-500 shadow-lg"
              >
                <User size={14} />
                Login
              </button>
            )}
          </div>
        </div>
      </motion.nav>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;