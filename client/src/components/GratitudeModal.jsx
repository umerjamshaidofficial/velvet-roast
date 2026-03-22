import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, PenTool } from 'lucide-react';
import { BASE_URL } from '../api/config';

const GratitudeModal = ({ isOpen, onClose, gift, onGratitudeSent }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    
    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      // This endpoint will save the thanks and trigger the sender's nav notification
      const response = await fetch(`${BASE_URL}/api/orders/thank/${gift.id}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        onGratitudeSent();
        onClose();
        setMessage('');
      }
    } catch (err) {
      console.error("Error sending gratitude:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#3E2723]/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-[#FDFCF8] dark:bg-[#1A0A0A] rounded-[3rem] overflow-hidden shadow-2xl border border-[#D4AF37]/20"
          >
            <div className="p-12">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-[#3E2723]/30 dark:text-white/20 hover:text-[#D4AF37] transition-colors"
              >
                <X size={24} />
              </button>

              <header className="text-center mb-10">
                <div className="inline-flex p-4 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/10 mb-6">
                  <PenTool className="text-[#D4AF37]" size={24} />
                </div>
                <h3 className="font-playfair text-3xl font-bold text-[#3E2723] dark:text-white mb-2">
                  Send <span className="italic">Gratitude</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3E2723]/40 dark:text-white/30">
                  To {gift?.sender_name || 'A Kindred Soul'}
                </p>
              </header>

              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message of thanks here..."
                  className="w-full h-40 bg-white/50 dark:bg-white/[0.02] border border-[#3E2723]/5 dark:border-white/5 rounded-3xl p-6 text-sm text-[#3E2723] dark:text-white placeholder:text-[#3E2723]/20 dark:placeholder:text-white/10 focus:outline-none focus:border-[#D4AF37]/30 transition-all resize-none font-medium leading-relaxed shadow-inner"
                />
                <div className="absolute bottom-4 right-6 pointer-events-none">
                   <Sparkles size={16} className="text-[#D4AF37]/20" />
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={!message.trim() || isSending}
                className="w-full mt-8 flex items-center justify-center gap-3 bg-[#3E2723] dark:bg-[#D4AF37] text-white dark:text-[#1A0A0A] py-5 rounded-full text-[11px] uppercase font-black tracking-[0.4em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isSending ? 'Sending Spirit...' : 'Send Message'}
                <Send size={14} className={isSending ? 'animate-pulse' : ''} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GratitudeModal;
