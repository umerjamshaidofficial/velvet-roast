import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const NavAuth = () => {
  const { isAuthenticated, logout } = useAuth();

  // If not logged in, don't show anything (or show your Login button)
  if (!isAuthenticated) return null;

  return (
    <button 
      onClick={logout}
      className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#3E2723]/60 dark:text-white/60 hover:text-[#D4AF37] transition-all group"
    >
      <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
      <span>Exit Ritual</span>
    </button>
  );
};

export default NavAuth;