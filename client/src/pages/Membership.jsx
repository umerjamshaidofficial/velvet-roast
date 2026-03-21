import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Crown, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Membership = () => {
  const { user, isMember, updateUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleMembershipAction = async (type = 'upgrade') => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    const endpoint = type === 'upgrade' ? 'upgrade' : 'cancel';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user); 
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (err) {
      console.error(`Membership ${type} failed:`, err);
    } finally {
      setIsProcessing(false);
    }
  };

  const perks = [
    {
      icon: <Truck className="text-[#D4AF37]" size={20} />,
      title: "Executive Shipping",
      desc: "Zero fees on all rituals, regardless of order size."
    },
    {
      icon: <Sparkles className="text-[#D4AF37]" size={20} />,
      title: "Pro Vault Access",
      desc: "Permission to purchase limited-release micro-lot beans."
    },
    {
      icon: <Crown className="text-[#D4AF37]" size={20} />,
      title: "Priority Roasting",
      desc: "Your selections are moved to the front of the roasting queue."
    },
    {
      icon: <ShieldCheck className="text-[#D4AF37]" size={20} />,
      title: "Elite Early Access",
      desc: "24-hour head start on all seasonal collection drops."
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-velvet-bean pt-32 pb-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold mb-6"
          >
            Elite Invitation
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-[#3E2723] dark:text-white mb-6"
          >
            The <span className="italic text-[#D4AF37]">Executive Tier</span>
          </motion.h1>
          <p className="text-[#3E2723]/60 dark:text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
            Executive Membership is more than a subscription. It is a commitment to the art of the ritual and the pursuit of the perfect cup.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {perks.map((perk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 + 0.3 }}
                className="p-8 rounded-[2.5rem] bg-white dark:bg-white/5 border border-[#3E2723]/5 dark:border-white/5"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center mb-6">
                  {perk.icon}
                </div>
                <h3 className="font-playfair text-xl text-[#3E2723] dark:text-white mb-3">{perk.title}</h3>
                <p className="text-[#3E2723]/50 dark:text-white/30 text-xs leading-relaxed">{perk.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-[#1A0A0A] rounded-[3rem] p-12 text-center relative overflow-hidden border border-[#D4AF37]/30 shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] -mr-32 -mt-32" />
              
              <div className="relative z-10">
                <h2 className="text-white/50 text-[10px] uppercase tracking-[0.5em] font-bold mb-10">Monthly Pro Access</h2>
                <div className="flex items-center justify-center gap-2 mb-10">
                  <span className="text-2xl text-[#D4AF37] font-playfair mt-[-20px]">$</span>
                  <span className="text-7xl font-playfair font-bold text-white">10</span>
                  <span className="text-white/30 text-xs uppercase tracking-widest ml-2">/ month</span>
                </div>

                <div className="space-y-4 mb-12">
                  {["Cancel Anytime", "Secure Simulated Payment", "Instant Activation"].map((text, i) => (
                    <div key={i} className="flex items-center justify-center gap-3 text-white/40 text-[10px] uppercase tracking-widest">
                      <CheckCircle2 size={14} className="text-[#D4AF37]" />
                      {text}
                    </div>
                  ))}
                </div>

                {isMember ? (
                  <div className="space-y-6">
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 py-5 rounded-full">
                      <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em]">
                        You are an Executive
                      </span>
                    </div>
                    <button 
                      onClick={() => handleMembershipAction('cancel')}
                      className="text-white/30 hover:text-red-400 text-[9px] uppercase tracking-widest underline underline-offset-8 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleMembershipAction('upgrade')}
                    disabled={isProcessing}
                    className="group w-full bg-[#D4AF37] text-[#1A0A0A] py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] hover:scale-105 transition-all duration-500 shadow-xl flex items-center justify-center gap-3"
                  >
                    {isProcessing ? "Processing Ritual..." : "Claim Pro Access"}
                    {!isProcessing && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                )}
                
                <p className="mt-8 text-white/20 text-[8px] uppercase tracking-widest">
                  By joining, you agree to the Velvet terms of service.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;