import { motion } from 'framer-motion';
import { ShoppingCart, Lock, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isMember, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Logic: Is this a restricted "Vault" item?
  const isVaultItem = product.category === 'Vault';
  const isLocked = isVaultItem && !isMember;

  const handleAction = () => {
    if (isLocked) {
      // If locked, take them to the membership page
      navigate('/membership');
    } else {
      addToCart(product);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] p-6 border border-[#3E2723]/5 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Vault Badge */}
      {isVaultItem && (
        <div className="absolute top-8 left-8 z-20 flex items-center gap-2 bg-[#D4AF37] text-[#1A0A0A] px-3 py-1 rounded-full shadow-lg">
          <Sparkles size={12} fill="currentColor" />
          <span className="text-[9px] font-black uppercase tracking-widest">The Vault</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#FDFCF8] dark:bg-white/5 mb-6">
        <motion.img 
          src={product.image_url || "/api/placeholder/400/400"} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${isLocked ? 'blur-md grayscale' : ''}`}
        />
        
        {/* Overlay for Locked Items */}
        {isLocked && (
          <div className="absolute inset-0 bg-[#1A0A0A]/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-3">
              <Lock className="text-white" size={20} />
            </div>
            <p className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Inner Circle Exclusive</p>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2 px-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#D4AF37] text-[10px] uppercase tracking-widest font-bold mb-1">
              {product.origin || 'Premium Blend'}
            </p>
            <h3 className="font-playfair text-xl font-bold text-[#3E2723] dark:text-white group-hover:text-[#D4AF37] transition-colors">
              {product.name}
            </h3>
          </div>
          <div className="text-lg font-playfair font-bold text-[#3E2723] dark:text-white">
            ${parseFloat(product.price).toFixed(2)}
          </div>
        </div>

        <p className="text-[#3E2723]/50 dark:text-white/30 text-xs line-clamp-2 leading-relaxed h-8">
          {product.description || 'A unique ritual experience crafted for the discerning palate.'}
        </p>

        {/* Action Button */}
        <button
          onClick={handleAction}
          className={`w-full mt-6 py-4 rounded-full flex items-center justify-center gap-3 transition-all duration-300 text-[10px] font-bold uppercase tracking-widest
            ${isLocked 
              ? 'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0A0A]' 
              : 'bg-[#3E2723] dark:bg-[#D4AF37] text-white dark:text-[#1A0A0A] hover:scale-[1.02] shadow-lg shadow-black/10'
            }`}
        >
          {isLocked ? (
            <>Unlock Ritual</>
          ) : (
            <>
              <ShoppingCart size={14} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;