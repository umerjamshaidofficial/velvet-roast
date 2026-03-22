import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import MemberBadge from './MemberBadge';

const NavAuth = () => {
    const { isAuthenticated, logout, user } = useAuth();

    // If not logged in, we return null as the LoginModal is usually triggered by a separate "Join" button in the Navbar
    if (!isAuthenticated) return null;

    return (
        <div className="flex items-center gap-6">
            {/* User Identification & Status */}
            <div className="flex items-center gap-3 border-r border-[#3E2723]/10 dark:border-white/10 pr-6">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-playfair font-bold text-[#3E2723] dark:text-white leading-none">
                        {user?.firstName || 'Kindred'} {user?.lastName || 'Soul'}
                    </p>
                    <p className="text-[7px] uppercase tracking-[0.2em] text-[#D4AF37] mt-1 font-black">
                        {user?.role || 'Seeker'}
                    </p>
                </div>
                
                {/* Visual indicator of Executive status if applicable */}
                {user?.role === 'executive' && <MemberBadge />}
            </div>

            {/* Logout Action */}
            <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#3E2723]/60 dark:text-white/60 hover:text-[#D4AF37] transition-all group"
            >
                <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden md:inline">Exit Ritual</span>
            </button>
        </div>
    );
};

export default NavAuth;