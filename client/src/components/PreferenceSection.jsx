import { useState } from 'react';
import { Bell, Eye, Shield } from 'lucide-react';
import { BASE_URL } from '../api/config';

const PreferenceSection = () => {
  // Maintaining the exact state structure for your UI features
  const [preferences, setPreferences] = useState([
    { id: 'notifications', icon: <Bell size={18} />, label: "Ritual Echoes", desc: "Receive notifications for gifts and orders", status: true },
    { id: 'stealth', icon: <Eye size={18} />, label: "Stealth Mode", desc: "Hide your presence in the lounge", status: false },
    { id: 'biometric', icon: <Shield size={18} />, label: "Biometric Access", desc: "Secure sanctuary with device auth", status: true }
  ]);

  const togglePreference = async (index) => {
    const updatedPrefs = [...preferences];
    const target = updatedPrefs[index];
    const newStatus = !target.status;

    // Optimistic UI update
    updatedPrefs[index].status = newStatus;
    setPreferences(updatedPrefs);

    // Focused BASE_URL update for persistence
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`${BASE_URL}/api/user/preferences`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          preferenceId: target.id, 
          status: newStatus 
        })
      });
    } catch (error) {
      console.error("Failed to sync preference with sanctuary server", error);
      // Rollback on failure
      updatedPrefs[index].status = !newStatus;
      setPreferences([...updatedPrefs]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] p-10 border border-[#3E2723]/5 shadow-sm">
        <h2 className="text-2xl font-playfair font-bold text-[#3E2723] dark:text-white mb-8">Experience Settings</h2>
        
        <div className="space-y-4">
          {preferences.map((pref, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-6 rounded-2xl bg-[#3E2723]/5 dark:bg-white/5 transition-all duration-500 hover:bg-[#3E2723]/10 dark:hover:bg-white/10 group"
            >
              <div className="flex items-center gap-5">
                <div className={`transition-colors duration-500 ${pref.status ? 'text-[#D4AF37]' : 'text-[#3E2723]/40 dark:text-white/40'}`}>
                  {pref.icon}
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#3E2723] dark:text-white">{pref.label}</h4>
                  <p className="text-[10px] text-[#3E2723]/40 dark:text-white/40">{pref.desc}</p>
                </div>
              </div>

              {/* Toggle Switch */}
              <div 
                onClick={() => togglePreference(i)}
                className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-500 shadow-inner ${
                  pref.status ? 'bg-[#D4AF37]' : 'bg-[#3E2723]/20 dark:bg-white/10'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500 ease-in-out ${
                  pref.status ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferenceSection;