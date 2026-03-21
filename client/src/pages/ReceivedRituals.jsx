import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, ArrowLeft, Loader2, Inbox, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RitualGiftCard from '../components/RitualGiftCard';
import { useCart } from '../context/CartContext';
import { fetchReceivedGifts } from '../api/orderService';
import { toast } from 'react-hot-toast';

const ReceivedRituals = () => {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchGiftCount } = useCart();
  const hasSynced = useRef(false);

  const getRituals = async (isInitialLoad = true) => {
    try {
      if (isInitialLoad) setLoading(true);
      const data = await fetchReceivedGifts();

      const giftData = Array.isArray(data) ? data : (data?.gifts || []);
      
      // Sort logic: Unclaimed rituals first, then by date
      const sortedData = [...giftData].sort((a, b) => {
        if (a.is_claimed === b.is_claimed) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.is_claimed ? 1 : -1;
      });

      setRituals(sortedData);

      // Trigger magic toast only on first successful load if gifts exist
      if (isInitialLoad && sortedData.length > 0 && !hasSynced.current) {
        toast.success("A curated ritual has been found for your sanctuary!", {
          icon: '✨',
          duration: 5000,
          style: {
            borderRadius: '20px',
            background: '#3E2723',
            color: '#D4AF37',
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            border: '1px solid #D4AF37'
          },
        });
      }

      if (!hasSynced.current && fetchGiftCount) {
        setTimeout(() => { if (fetchGiftCount) fetchGiftCount(); }, 100);
        hasSynced.current = true;
      }
    } catch (err) {
      console.error("Failed to fetch rituals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRituals();
  }, [fetchGiftCount]);

  // Handler for when a gift is claimed to refresh the local list
  const handleClaimSuccess = () => {
    getRituals(false); // Refresh list without the full screen loader
    if (fetchGiftCount) fetchGiftCount();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCF8] dark:bg-velvet-bean gap-4">
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
        <p className="text-[#D4AF37] font-playfair italic text-lg text-center">Opening the Archive...</p>
      </div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#FDFCF8] dark:bg-velvet-bean min-h-screen pt-40 pb-20 px-6 transition-colors duration-700"
    >
      <div className="container mx-auto max-w-4xl">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] mb-12 transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Sanctuary
        </button>

        {/* Centered Header Section */}
        <header className="text-center mb-24 w-full">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center mb-8">
            <div className="bg-[#D4AF37]/10 p-5 rounded-full border border-[#D4AF37]/20">
              <Sparkles className="text-[#D4AF37]" size={28} />
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-playfair text-[#3E2723] dark:text-white mb-6 font-bold">
            Sacred <span className="italic text-[#D4AF37]">Offerings</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-[#D4AF37]/30" />
            <p className="text-[10px] uppercase tracking-[0.6em] font-black text-[#3E2723]/40 dark:text-white/30">
              Your Received Rituals
            </p>
            <div className="h-[1px] w-8 bg-[#D4AF37]/30" />
          </div>
        </header>

        <main className="relative min-h-[400px]">
          {rituals.length > 0 ? (
            <div className="grid grid-cols-1 gap-12">
              <AnimatePresence mode="popLayout">
                {rituals.map((ritual) => (
                  <motion.div 
                    key={ritual.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <RitualGiftCard 
                      gift={ritual} 
                      onClaimSuccess={handleClaimSuccess} 
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-32 px-10 border border-[#3E2723]/5 dark:border-white/5 rounded-[4rem] bg-white/30 dark:bg-white/[0.02] backdrop-blur-sm">
              <Inbox className="text-[#3E2723]/10 dark:text-white/10 mx-auto mb-8" size={32} />
              <h2 className="font-playfair text-2xl italic text-[#3E2723]/60 dark:text-white/40 mb-4">The air is still...</h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#3E2723]/30 dark:text-white/20 mb-8">No rituals have been dedicated to you yet.</p>
              <button onClick={() => navigate('/')} className="px-10 py-4 rounded-full bg-[#3E2723] dark:bg-[#D4AF37] text-white dark:text-[#3E2723] text-[9px] uppercase font-bold tracking-[0.4em] hover:scale-105 transition-transform active:scale-95">
                Explore Collection
              </button>
            </div>
          )}
        </main>
      </div>
    </motion.section>
  );
};

export default ReceivedRituals;