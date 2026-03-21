import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Coffee, Gift, Heart, Calendar } from 'lucide-react';
import { fetchReceivedGifts, claimGift } from '../api/orderService'; // Ensure these are exported

const ClaimRitual = () => {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRitual, setSelectedRitual] = useState(null);

  useEffect(() => {
    loadRituals();
  }, []);

  const loadRituals = async () => {
    try {
      const data = await fetchReceivedGifts();
      setRituals(data);
    } catch (err) {
      console.error("Failed to load rituals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id) => {
    try {
      await claimGift(id);
      // Refresh list to update 'is_claimed' status
      loadRituals();
    } catch (err) {
      console.error("Error claiming ritual:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] dark:bg-velvet-bean">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
        <Coffee className="text-[#D4AF37]" size={32} />
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF8] dark:bg-velvet-bean pt-40 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/20 mb-6"
          >
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#D4AF37]">Your Ritual Inbox</span>
          </motion.div>
          <h1 className="text-5xl font-playfair text-[#3E2723] dark:text-white">Shared Moments</h1>
        </header>

        {rituals.length === 0 ? (
          <div className="text-center p-20 border-2 border-dashed border-[#3E2723]/10 rounded-[3rem]">
            <p className="font-playfair italic text-[#3E2723]/40 dark:text-white/40">No rituals have been dedicated to you yet.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {rituals.map((ritual) => (
              <motion.div
                key={ritual.id}
                layoutId={`card-${ritual.id}`}
                onClick={() => {
                    setSelectedRitual(ritual);
                    if (!ritual.is_claimed) handleClaim(ritual.id);
                }}
                className={`group cursor-pointer p-8 rounded-[2.5rem] border transition-all duration-500 ${
                  ritual.is_claimed 
                  ? 'bg-white/50 dark:bg-white/5 border-[#3E2723]/5' 
                  : 'bg-white dark:bg-[#1A0A0A] border-[#D4AF37]/30 shadow-xl shadow-[#D4AF37]/5'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                        <img 
                          src={ritual.sender_photo || 'https://via.placeholder.com/150'} 
                          className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          alt={ritual.sender_name}
                        />
                        {!ritual.is_claimed && (
                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#D4AF37] rounded-full border-4 border-white dark:border-[#1A0A0A]" />
                        )}
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl text-[#3E2723] dark:text-white">From {ritual.sender_name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] uppercase tracking-widest text-[#3E2723]/40 dark:text-white/40 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(ritual.created_at).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">
                          {ritual.items.length} {ritual.items.length === 1 ? 'Ritual' : 'Rituals'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="px-8 py-3 rounded-full bg-[#3E2723] dark:bg-white text-white dark:text-[#3E2723] text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-white transition-colors">
                    View Dedication
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* The Reveal Overlay */}
        <AnimatePresence>
          {selectedRitual && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedRitual(null)}
                className="absolute inset-0 bg-[#3E2723]/90 backdrop-blur-md"
              />
              <motion.div 
                layoutId={`card-${selectedRitual.id}`}
                className="relative w-full max-w-2xl bg-[#FDFCF8] dark:bg-[#1A0A0A] rounded-[3rem] overflow-hidden shadow-2xl"
              >
                <div className="p-12 text-center">
                  <Heart className="mx-auto text-[#D4AF37] mb-8" size={40} fill="currentColor" />
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-4">A Message for You</p>
                  <h2 className="text-3xl font-playfair italic text-[#3E2723] dark:text-white leading-relaxed mb-12">
                    "{selectedRitual.gift_message || "A quiet moment, just for you."}"
                  </h2>
                  
                  <div className="space-y-4 mb-12">
                    <p className="text-[10px] uppercase tracking-widest text-[#3E2723]/40 dark:text-white/40 font-bold mb-6">Your Dedicated Selection</p>
                    {selectedRitual.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white dark:bg-white/5 p-4 rounded-2xl border border-[#3E2723]/5">
                        <span className="font-playfair text-[#3E2723] dark:text-white">{item.product_name}</span>
                        <span className="text-[10px] font-bold text-[#D4AF37]">QTY: {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setSelectedRitual(null)}
                    className="w-full py-6 bg-[#3E2723] dark:bg-white text-white dark:text-[#3E2723] rounded-full text-[10px] uppercase tracking-[0.4em] font-bold"
                  >
                    Close Ritual
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClaimRitual;