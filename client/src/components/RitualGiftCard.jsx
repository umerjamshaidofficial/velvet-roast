import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Mail, Calendar, CheckCircle2, HandHeart, Coffee, Sparkles, Zap, Moon, Sun } from 'lucide-react';
import GratitudeModal from './GratitudeModal';
import { BASE_URL } from '../api/config';

const RitualGiftCard = ({ gift, onClaimSuccess }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [isUnwrapped, setIsUnwrapped] = useState(gift.is_claimed);
  const [showGratitude, setShowGratitude] = useState(false);
  const [hasSentGratitude, setHasSentGratitude] = useState(gift.gratitude_sent || false);

  // Focused BASE_URL update for sender photos
  const senderPhoto = gift.sender_photo 
    ? (gift.sender_photo.startsWith('http') ? gift.sender_photo : `${BASE_URL}${gift.sender_photo.startsWith('/') ? '' : '/'}${gift.sender_photo}`) 
    : `https://ui-avatars.com/api/?name=${gift.sender_name || 'User'}&background=D4AF37&color=fff`;

  // Helper to determine icon based on item name
  const getRitualIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('coffee')) return <Coffee size={20} className="text-[#3E2723]/40" />;
    if (n.includes('tea')) return <Zap size={20} className="text-[#D4AF37]/40" />;
    if (n.includes('candle') || n.includes('light')) return <Sun size={20} className="text-[#D4AF37]/40" />;
    if (n.includes('night') || n.includes('sleep')) return <Moon size={20} className="text-[#3E2723]/40" />;
    return <Sparkles size={20} className="text-[#D4AF37]/40" />;
  };

  const handleClaim = async () => {
    if (gift.is_claimed || isClaiming) return;
    setIsClaiming(true);
    try {
      const token = localStorage.getItem('token');
      // Updated to use dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/api/orders/received/${gift.id}/claim`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsUnwrapped(true);
        if (onClaimSuccess) onClaimSuccess();
      }
    } catch (err) {
      console.error("Claim error at sanctuary server:", err);
    } finally {
      setIsClaiming(false);
    }
  };

  const ritualItems = gift.items || [];
  const senderName = gift.sender_name || 'A kindred soul';
  const senderNote = gift.personal_note || 'A quiet moment dedicated to you. Elevate your sanctuary.';

  return (
    <div className="group relative">
      <AnimatePresence mode="wait">
        {!isUnwrapped ? (
          /* CLOSED ENVELOPE STATE - UI PRESERVED */
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)', y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={handleClaim}
            className="relative cursor-pointer bg-[#FDFCF8] dark:bg-[#1A0A0A] border border-[#D4AF37]/30 rounded-[3rem] p-4 shadow-[0_40px_80px_-15px_rgba(212,175,55,0.15)] overflow-hidden group/env"
          >
            <div className="relative h-[350px] flex flex-col items-center justify-center border border-[#D4AF37]/10 rounded-[2.5rem] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L15 0H45L30 30Z' fill='%23D4AF37'/%3E%3C/svg%3E")` }} />
                
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="z-10 flex flex-col items-center"
                >
                  <motion.div 
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    className="w-20 h-20 rounded-full bg-[#3E2723] dark:bg-[#D4AF37] flex items-center justify-center shadow-2xl mb-6"
                  >
                    <Gift className="text-white dark:text-[#1A0A0A] w-8 h-8" />
                  </motion.div>
                  <h3 className="font-playfair text-2xl font-bold text-[#3E2723] dark:text-white italic text-center">A Gift for You</h3>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#D4AF37] mt-2">From {senderName}</p>
                </motion.div>

                <div className="absolute bottom-8 text-[9px] uppercase font-bold tracking-[0.3em] text-[#3E2723]/30 animate-pulse">
                  {isClaiming ? 'Unveiling Ritual...' : 'Tap to Uncover Ritual'}
                </div>
            </div>
          </motion.div>
        ) : (
          /* OPENED CARD STATE - UI PRESERVED */
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative overflow-hidden bg-white dark:bg-[#2A1515] border border-[#3E2723]/5 dark:border-white/5 rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(62,39,35,0.05)]"
          >
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex flex-col items-center gap-6 lg:w-32 lg:flex-shrink-0 text-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#3E2723]/10">
                  <img 
                    src={senderPhoto} 
                    alt={senderName} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = `https://ui-avatars.com/api/?name=${senderName}&background=D4AF37&color=fff`; 
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black text-[#D4AF37] block">Offering From</span>
                  <p className="font-playfair text-lg font-bold text-[#3E2723] dark:text-white leading-tight">{senderName}</p>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-[#3E2723]/40 dark:text-white/30 uppercase tracking-[0.2em] font-medium px-4 py-1.5 rounded-full border border-[#3E2723]/5 bg-[#3E2723]/2">
                  <Calendar size={11} />
                  {new Date(gift.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <header>
                  <h2 className="text-4xl lg:text-6xl font-playfair font-black text-[#3E2723] dark:text-white tracking-tight mb-2">
                     The <span className="italic text-[#D4AF37]">{gift.ritual_title || 'Sacred Morning Ritual'}</span>
                  </h2>
                  <div className="h-[1px] w-12 bg-[#D4AF37]/30 mt-4" />
                </header>

                <div className="relative py-10 mb-6 border-l-2 border-[#D4AF37]/20 pl-10 italic">
                   <p className="text-xl md:text-2xl font-playfair leading-relaxed text-[#3E2723]/80 dark:text-white/70">
                     "{senderNote}"
                   </p>
                   <div className="absolute -top-6 -left-4 opacity-[0.03] pointer-events-none text-[#3E2723]">
                      <Mail size={140} />
                   </div>
                </div>

                <div className="pt-8 border-t border-[#3E2723]/5">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#3E2723]/30 mb-6 block">Ritual Elements</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {ritualItems.map((item, idx) => (
                       <div key={idx} className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-[#FDFCF8] dark:bg-[#1A0A0A] border border-[#3E2723]/5 flex items-center justify-center">
                            {getRitualIcon(item.product_name)}
                         </div>
                         <div>
                           <p className="text-sm font-bold text-[#3E2723] dark:text-white">{item.product_name}</p>
                           <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold">Qty: {item.quantity}</p>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:w-56 lg:flex-shrink-0 lg:items-end">
                {hasSentGratitude ? (
                   <div className="flex items-center gap-3 px-10 py-4 rounded-full bg-[#3E2723]/5 text-[#3E2723]/40 text-[9px] uppercase font-bold tracking-[0.4em]">
                     <CheckCircle2 size={14} /> Gratitude Sent
                   </div>
                ) : (
                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => setShowGratitude(true)}
                     className="group relative flex items-center justify-center gap-4 border border-[#D4AF37] text-[#D4AF37] px-12 py-5 rounded-full text-[10px] uppercase font-black tracking-[0.3em] hover:bg-[#D4AF37] hover:text-white transition-all duration-500 overflow-hidden"
                   >
                      <span className="relative z-10">Share Gratitude</span>
                      <HandHeart size={14} className="relative z-10" />
                      <div className="absolute inset-0 bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-full" />
                   </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GratitudeModal 
        isOpen={showGratitude} 
        onClose={() => setShowGratitude(false)} 
        gift={gift} 
        onGratitudeSent={() => {
           setHasSentGratitude(true);
           setShowGratitude(false);
        }}
      />
    </div>
  );
};

export default RitualGiftCard;