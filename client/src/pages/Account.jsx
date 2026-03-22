import { useState, useEffect } from 'react';
import { MapPin, Crown, Settings, LogOut } from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/config'; // Centralized source for sanctuary server URL

import DestinationSection from '../components/DestinationSection';
import ExecutiveSection from '../components/ExecutiveSection';
import PreferenceSection from '../components/PreferenceSection';

const Account = () => {
  const navigate = useNavigate();
  const { isMember, showToast } = useCart();
  const { user, updateUser, logout } = useAuth(); 
  const [activeTab, setActiveTab] = useState('destinations'); 
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    profile_pic: user?.profilePic || "",
    preferredRoast: "Dark",
    brewMethod: "Pour Over",
    googleId: user?.googleId || null,
  });

  const [addresses, setAddresses] = useState([]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.warn("Authorization token missing from sanctuary storage.");
      return;
    }

    try {
      // Updated to use dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/api/profile/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.profile) {
          setProfile(prev => ({
            ...prev,
            ...data.profile,
            firstName: data.profile.firstName || "",
            lastName: data.profile.lastName || "",
            email: data.profile.email || ""
          }));
        }

        if (data.addresses) {
          const activeAddresses = data.addresses.filter(addr => addr.is_active !== false);
          setAddresses(activeAddresses);
        }
      } else if (response.status === 401) {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error("Sanctuary synchronization failed:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        ...user,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        profile_pic: user.profilePic || "",
        googleId: user.googleId || null
      }));
    }
  }, [user]);

  const menuItems = [
    { id: 'destinations', label: 'Destinations', icon: <MapPin size={18} /> },
    { id: 'executive', label: 'Executive Status', icon: <Crown size={18} /> },
    { id: 'preferences', label: 'Preferences', icon: <Settings size={18} /> },
    { id: 'logout', label: 'Exit', icon: <LogOut size={18} />, isAction: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] dark:bg-[#0F0505] pt-32 pb-20 px-6 text-[#3E2723]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <span className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold text-[#3E2723] dark:text-white">Member Portal</span>
          <h1 className="text-5xl font-playfair font-bold mt-2 dark:text-white">Your Sanctuary</h1>
        </header>

        <div className="flex flex-col md:flex-row gap-12">
          <aside className="w-full md:w-64 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={item.isAction ? handleLogout : () => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold transition-all
                  ${activeTab === item.id 
                    ? 'bg-[#3E2723] text-white shadow-xl' 
                    : item.isAction 
                      ? 'text-red-500/60 hover:bg-red-500/5 mt-4' 
                      : 'opacity-40 dark:text-white hover:bg-[#3E2723]/5'}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </aside>

          <main className="flex-1">
            {activeTab === 'destinations' && (
              <DestinationSection 
                addresses={addresses}
                fetchUserData={fetchUserData}
                showToast={showToast}
                loading={loading}
                setLoading={setLoading}
              />
            )}

            {activeTab === 'executive' && (
              <ExecutiveSection isMember={isMember} />
            )}

            {activeTab === 'preferences' && (
              <PreferenceSection 
                profile={profile}
                setProfile={setProfile}
                loading={loading}
                setLoading={setLoading}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;