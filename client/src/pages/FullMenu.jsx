import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Coffee, ShieldCheck, Lock, Sparkles, ShoppingBag, Crown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FullMenu = () => {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRoast, setActiveRoast] = useState('All'); 
  const [viewMode, setViewMode] = useState('all'); 
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isMember } = useAuth();

  useEffect(() => {
    const fetchRituals = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rituals');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setRituals(data);
      } catch (err) {
        console.error("Failed to fetch rituals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRituals();
  }, []);

  /**
   * FILTERING LOGIC
   * 1. Excludes anything with visibility === 'hidden'
   * 2. Filters by Roast Preference (Light/Medium/Dark)
   * 3. Filters by View Mode (Public vs Vault)
   */
  const filteredRituals = useMemo(() => {
    return rituals.filter(item => {
      // Primary safety check: If admin hid it, it doesn't exist for the user
      if (item.visibility === 'hidden') return false;

      const matchesRoast = activeRoast === 'All' || item.preference === activeRoast;
      const matchesView = viewMode === 'all' 
        || (viewMode === 'public' && item.visibility === 'public')
        || (viewMode === 'vault' && item.visibility === 'vault');
      
      return matchesRoast && matchesView;
    });
  }, [rituals, activeRoast, viewMode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] dark:bg-[#0F0505]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Coffee className="text-[#D4AF37]" size={40} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen transition-colors duration-700">
      <header className="mb-16 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-black mb-4"
        >
          Curated Roasts
        </motion.p>
        <h1 className="text-6xl md:text-7xl font-playfair font-bold text-[#3E2723] dark:text-white mb-10">
          The Full Collection
        </h1>
        
        {/* Roast Filter Toggles */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['All', 'Light', 'Medium', 'Dark'].map((roast) => (
            <button 
              key={roast}
              onClick={() => setActiveRoast(roast)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border
                ${activeRoast === roast 
                  ? 'bg-[#3E2723] border-[#3E2723] text-[#D4AF37] shadow-xl scale-105' 
                  : 'bg-transparent border-[#3E2723]/10 text-[#3E2723]/40 dark:text-white/30 dark:border-white/10 hover:border-[#D4AF37]'}`}
            >
              {roast} {roast !== 'All' && 'Roast'}
            </button>
          ))}
        </div>

        {/* Visibility Filter Toggles */}
        <div className="flex justify-center gap-10 border-b border-[#3E2723]/5 dark:border-white/5 pb-8">
          <button 
            onClick={() => setViewMode('all')} 
            className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${viewMode === 'all' ? 'text-[#D4AF37]' : 'text-[#3E2723]/30 dark:text-white/20'}`}
          >
            All Offerings
          </button>
          <button 
            onClick={() => setViewMode('public')} 
            className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${viewMode === 'public' ? 'text-[#D4AF37]' : 'text-[#3E2723]/30 dark:text-white/20'}`}
          >
            Normal Products
          </button>
          <button 
            onClick={() => setViewMode('vault')} 
            className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors ${viewMode === 'vault' ? 'text-[#D4AF37]' : 'text-[#3E2723]/30 dark:text-white/20'}`}
          >
            <ShieldCheck size={14}/> Pro Products (Vault)
          </button>
        </div>
      </header>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <AnimatePresence mode='popLayout'>
          {filteredRituals.map((ritual) => {
            const isLocked = ritual.visibility === 'vault' && !isMember;
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={ritual.id}
                className="group relative cursor-pointer transform-gpu"
                onClick={() => !isLocked && navigate(`/ritual/${ritual.id}`)}
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-[#3E2723]/5 dark:border-white/5 bg-white dark:bg-[#1A0A0A] mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  
                  {/* Vault Badge */}
                  {ritual.visibility === 'vault' && (
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#D4AF37] text-[#1A0A0A] px-4 py-1.5 rounded-full text-[8px] uppercase font-black tracking-widest">
                      <Crown size={10} /> The Vault
                    </div>
                  )}

                  {/* Product Image */}
                  <img 
                    src={`http://localhost:5000/uploads/${ritual.image_url}`} 
                    alt={ritual.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-all duration-700 will-change-transform
                      ${isLocked ? 'blur-xl grayscale scale-110' : 'group-hover:scale-105 brightness-100 dark:brightness-90 group-hover:brightness-110'}
                    `}
                  />
                  
                  {/* Hover Overlay / Lock Screen */}
                  <div className={`absolute inset-0 transition-all duration-500 flex flex-col justify-end p-8 
                    ${isLocked 
                      ? 'bg-black/60 backdrop-blur-md' 
                      : 'bg-gradient-to-t from-[#3E2723]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100'
                    }
                  `}>
                    {isLocked ? (
                      <div className="text-center mb-4">
                        <Lock className="text-[#D4AF37] mx-auto mb-3" size={28} />
                        <p className="text-white text-[9px] uppercase tracking-[0.3em] font-bold mb-6">Executive Membership Required</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/membership');
                          }}
                          className="w-full bg-white text-[#1A0A0A] py-4 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-xl hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                        >
                          Unlock the Vault
                        </button>
                      </div>
                    ) : (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(ritual);
                        }}
                        className="w-full bg-[#D4AF37] dark:bg-[#3E2723] text-white py-4 rounded-full flex items-center justify-center gap-3 text-[10px] uppercase font-bold tracking-widest shadow-xl hover:bg-white hover:text-[#3E2723] transition-all duration-300"
                      >
                        {ritual.visibility === 'vault' ? <Crown size={14} /> : <ShoppingBag size={14} />} 
                        {ritual.visibility === 'vault' ? 'Pro Access' : 'Add to Cart'}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Product Metadata */}
                <div className="px-6">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
                      {ritual.preference} Roast
                    </p>
                    <span className="text-sm font-mono font-bold text-[#3E2723] dark:text-white/60">
                      ${Number(ritual.price).toFixed(2)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-playfair font-bold text-[#3E2723] dark:text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                    {ritual.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRituals.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-center py-40"
        >
          <Sparkles className="mx-auto text-[#D4AF37]/20 mb-6" size={48} />
          <p className="text-[#3E2723]/30 dark:text-white/20 uppercase tracking-widest font-bold">
            No rituals found in this category.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FullMenu;