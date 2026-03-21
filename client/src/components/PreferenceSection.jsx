import { Bell, Eye, Volume2, Shield } from 'lucide-react';

const PreferenceSection = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] p-10 border border-[#3E2723]/5">
        <h2 className="text-2xl font-playfair font-bold text-[#3E2723] dark:text-white mb-8">Experience Settings</h2>
        
        <div className="space-y-4">
          {[
            { icon: <Bell size={18} />, label: "Ritual Echoes", desc: "Receive notifications for gifts and orders", status: true },
            { icon: <Eye size={18} />, label: "Stealth Mode", desc: "Hide your presence in the lounge", status: false },
            { icon: <Shield size={18} />, label: "Biometric Access", desc: "Secure sanctuary with device auth", status: true }
          ].map((pref, i) => (
            <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-[#3E2723]/5 dark:bg-white/5 transition-hover hover:bg-[#3E2723]/10">
              <div className="flex items-center gap-5">
                <div className="text-[#3E2723]/40 dark:text-white/40">{pref.icon}</div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#3E2723] dark:text-white">{pref.label}</h4>
                  <p className="text-[10px] text-[#3E2723]/40 dark:text-white/40">{pref.desc}</p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${pref.status ? 'bg-[#D4AF37]' : 'bg-[#3E2723]/20'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${pref.status ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferenceSection;