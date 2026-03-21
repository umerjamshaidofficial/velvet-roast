import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Mail, Sparkles, PenLine } from 'lucide-react';

const GiftRitualSection = ({ onGiftChange }) => {
  const [isGift, setIsGift] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (onGiftChange) {
      onGiftChange(isGift, { message, email });
    }
  }, [isGift, message, email]);

  return (
    <div className="mt-10 space-y-6">
      {/* Editorial Toggle Card */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsGift(!isGift)}
        className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-700 group relative overflow-hidden ${
          isGift 
          ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_20px_40px_rgba(212,175,55,0.08)]' 
          : 'border-[#3E2723]/10 hover:border-[#3E2723]/25 bg-white dark:bg-white/5'
        }`}
      >
        {/* Subtle Shimmer Effect for Gift Mode */}
        <AnimatePresence>
          {isGift && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" 
            />
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className={`p-4 rounded-2xl transition-all duration-700 ${isGift ? 'bg-[#D4AF37] text-white rotate-12' : 'bg-stone-100 dark:bg-white/10 text-stone-400 group-hover:text-[#3E2723] dark:group-hover:text-white'}`}>
              <Gift size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-playfair font-bold text-[#3E2723] dark:text-white uppercase tracking-[0.2em] text-[11px]">Dedicate as a Ritual</h4>
              <p className="text-[9px] text-[#3E2723]/40 dark:text-white/40 uppercase tracking-[0.15em] mt-1.5 font-bold">Surprise someone with a digital reveal</p>
            </div>
          </div>
          
          <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 ${isGift ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-stone-200 dark:border-white/10'}`}>
            {isGift ? <Sparkles size={12} className="text-white" /> : <div className="w-1.5 h-1.5 rounded-full bg-stone-200 dark:bg-white/10" />}
          </div>
        </div>
      </motion.div>

      {/* Expanded Dedication Form */}
      <AnimatePresence>
        {isGift && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-6 p-10 bg-[#FDFCF8]/50 dark:bg-white/2 rounded-[3rem] border border-[#D4AF37]/20 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Recipient Email</label>
                  <Mail size={12} className="text-[#D4AF37]/40" />
                </div>
                <div className="relative group">
                  <input 
                    type="email"
                    required={isGift}
                    placeholder="their-ritual@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-[#0A0A0A] border border-[#3E2723]/5 dark:border-white/5 rounded-2xl py-5 px-6 text-xs focus:outline-none focus:border-[#D4AF37] transition-all text-[#3E2723] dark:text-white placeholder:text-[#3E2723]/20 dark:placeholder:text-white/10 shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Your Dedication Message</label>
                  <PenLine size={12} className="text-[#D4AF37]/40" />
                </div>
                <div className="relative">
                  <textarea 
                    rows="4"
                    required={isGift}
                    maxLength={200}
                    placeholder="Write a brief note to accompany their coffee..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white dark:bg-[#0A0A0A] border border-[#3E2723]/5 dark:border-white/5 rounded-[2rem] py-6 px-8 text-[13px] focus:outline-none focus:border-[#D4AF37] transition-all resize-none italic font-playfair text-[#3E2723] dark:text-white placeholder:text-[#3E2723]/20 dark:placeholder:text-white/10 leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-6 text-[8px] font-bold uppercase tracking-widest text-[#D4AF37]/40">
                    {message.length} / 200
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-2 pt-2">
                <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
                <p className="text-[8px] uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20 font-bold">
                  They will receive a digital reveal once the beans are roasted.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftRitualSection;