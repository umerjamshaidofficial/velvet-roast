import { motion, AnimatePresence } from 'framer-motion';
import { Check, Gift } from 'lucide-react';

const Toast = ({ message, isVisible, type }) => {
  const isGift = type === 'gift';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`fixed top-12 left-1/2 z-[999] flex items-center gap-4 border px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] min-w-[320px] overflow-hidden ${
            isGift 
              ? 'bg-[#3E2723] border-[#D4AF37]/30 text-[#D4AF37]' 
              : 'bg-white dark:bg-velvet-bean border-[#3E2723]/10 dark:border-velvet-oxblood/30 text-[#3E2723] dark:text-white'
          }`}
        >
          {/* Gold Shimmer Effect for Gifts - Logic fully preserved */}
          {isGift && <div className="absolute inset-0 gift-toast-shimmer pointer-events-none" />}

          <div className={`${isGift ? 'bg-[#D4AF37]/20' : 'bg-[#D4AF37] dark:bg-velvet-oxblood'} p-1.5 rounded-full shadow-inner relative z-10`}>
            {isGift ? <Gift size={14} className="text-[#D4AF37]" /> : <Check size={14} className="text-white" />}
          </div>

          <div className="flex flex-col relative z-10">
            <span className={`text-[10px] uppercase tracking-widest font-bold leading-none mb-1 ${isGift ? 'text-[#D4AF37]' : 'text-[#3E2723] dark:text-white'}`}>
              {message}
            </span>
            <span className={`text-[8px] uppercase tracking-[0.2em] font-bold ${isGift ? 'text-[#D4AF37]/60' : 'text-[#3E2723]/40 dark:text-white/30'}`}>
              {isGift ? "Ritual Dedication Sent" : "Added to your ritual"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;