import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Gift, ArrowRight, Sparkles, Crown, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext'; 

const OrderSuccess = () => {
  const { state } = useLocation();
  const { isMember } = useCart(); 
  const navigate = useNavigate();
  
  // Safe access to state with fallbacks
  const isGift = state?.isGift || false;
  const orderId = state?.orderId || "VR-000000";
  const customer = state?.customer || null; 

  // Navigation back to the home page with a smooth scroll to the menu
  const handleReturnHome = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const menuSection = document.getElementById('menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="bg-[#FDFCF8] dark:bg-velvet-bean min-h-screen pt-40 pb-20 px-6 flex items-center justify-center">
      <div className="container max-w-2xl text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`bg-white dark:bg-[#1A0A0A] rounded-[3rem] p-12 border shadow-2xl relative overflow-hidden ${
            isMember 
              ? 'border-[#D4AF37]/30 shadow-[#D4AF37]/5' 
              : 'border-[#3E2723]/5 dark:border-white/5'
          }`}
        >
          {/* Visual enhancements for Gifts or Executive members */}
          {(isGift || isMember) && (
            <div className="absolute inset-0 gift-toast-shimmer opacity-20 pointer-events-none" />
          )}
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-8 relative z-10 ${
              isMember ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20' : 
              isGift ? 'bg-[#D4AF37] text-white' : 
              'bg-[#3E2723] text-white'
            }`}
          >
            {isMember ? <Crown size={32} /> : isGift ? <Gift size={32} /> : <CheckCircle2 size={32} />}
          </motion.div>

          {isMember && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-4 flex items-center justify-center gap-2"
            >
              <span className="text-[9px] uppercase tracking-[0.4em] font-black text-[#D4AF37] bg-[#D4AF37]/10 px-4 py-1 rounded-full">
                Executive Selection
              </span>
            </motion.div>
          )}

          <h1 className="text-4xl font-playfair text-[#3E2723] dark:text-white mb-4 relative z-10">
            {isMember ? "Priority Ritual Secured" : isGift ? "Ritual Dedicated" : "Ritual Confirmed"}
          </h1>
          
          <p className="text-sm text-[#3E2723]/60 dark:text-white/40 mb-2 uppercase tracking-widest font-bold">
            Order ID: {orderId}
          </p>

          <p className="text-lg font-playfair italic text-[#3E2723]/80 dark:text-white/70 mb-8 max-w-md mx-auto relative z-10">
            {isMember 
              ? "Your Executive status has fast-tracked this ritual. Our master roasters are beginning preparation immediately."
              : isGift 
                ? "Your gift has been prepared. We have sent a digital invitation to the recipient to reveal their ritual."
                : "Your selection has been secured. We are preparing your coffee ritual with the utmost care."}
          </p>

          {/* Destination Summary Section */}
          {customer && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-[#3E2723]/5 dark:bg-white/5 rounded-2xl p-6 mb-10 inline-block text-left border border-[#3E2723]/5"
            >
              <div className="flex items-center gap-3 text-[#D4AF37] mb-2">
                <MapPin size={16} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Delivery Destination</span>
              </div>
              <p className="text-sm font-bold text-[#3E2723] dark:text-white">{customer.firstName} {customer.lastName}</p>
              <p className="text-xs text-[#3E2723]/60 dark:text-white/40">{customer.address}, {customer.city}</p>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <button 
              onClick={() => navigate('/my-orders')}
              className="px-10 py-5 rounded-full bg-[#3E2723] dark:bg-velvet-oxblood text-white text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-500 shadow-lg hover:shadow-xl"
            >
              Track Order
            </button>
            <button 
              onClick={handleReturnHome}
              className="px-10 py-5 rounded-full border border-[#3E2723]/10 dark:border-white/10 text-[#3E2723] dark:text-white text-[10px] uppercase font-bold tracking-[0.3em] hover:border-[#D4AF37] transition-all duration-500 flex items-center justify-center gap-2 group"
            >
              Return Home <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {(isGift || isMember) && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t border-[#D4AF37]/20 flex items-center justify-center gap-3 text-[#D4AF37]"
            >
              <Sparkles size={16} />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                {isMember ? "Enjoy your complimentary shipping & priority service" : "A special email is on its way"}
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default OrderSuccess;