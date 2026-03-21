import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Crown, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal,
    shippingFee,
    grandTotal,
    isMember 
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-[#3E2723]/40 dark:bg-black/80 backdrop-blur-sm z-[150]"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-[#FDFCF8] dark:bg-velvet-bean shadow-2xl z-[160] flex flex-col transition-colors duration-700"
          >
            {/* Header */}
            <div className="p-8 border-b border-[#3E2723]/5 dark:border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-playfair text-[#3E2723] dark:text-white">Your Selection</h2>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mt-1 font-inter">
                  {cart.length} {cart.length === 1 ? 'Item' : 'Items'} Reserved
                </p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-[#3E2723]/5 dark:hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={24} className="text-[#3E2723] dark:text-white" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={48} className="mb-4 text-[#3E2723] dark:text-white" />
                  <p className="text-xs uppercase tracking-widest font-bold text-[#3E2723] dark:text-white">Your bag is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden bg-[#3E2723]/5 dark:bg-white/5 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-playfair text-lg text-[#3E2723] dark:text-white">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] uppercase tracking-tighter text-red-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 dark:text-white/30 font-bold mt-1">{item.origin || 'Velvet Selection'}</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-[#3E2723]/10 dark:border-white/10 rounded-full px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-[#3E2723] dark:text-white hover:text-[#D4AF37]"><Minus size={14}/></button>
                          <span className="px-4 text-xs font-bold text-[#3E2723] dark:text-white font-inter">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-[#3E2723] dark:text-white hover:text-[#D4AF37]"><Plus size={14}/></button>
                        </div>
                        <span className="font-inter text-sm font-bold text-[#8C6A5E] dark:text-velvet-cinnamon">
                          ${(parseFloat(typeof item.price === 'string' ? item.price.replace('$', '') : item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            <div className="p-8 bg-white dark:bg-[#1A0A0A] border-t border-[#3E2723]/5 dark:border-white/5 space-y-4">
              {/* Executive Benefit Alert */}
              {isMember && (
                <div className="flex items-center gap-3 bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-4 rounded-2xl">
                  <Crown size={18} className="text-[#D4AF37]" />
                  <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#D4AF37]">Executive Shipping Applied</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#3E2723]/40 dark:text-white/40">Subtotal</span>
                  <span className="text-sm font-inter font-medium text-[#3E2723] dark:text-white">${cartTotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#3E2723]/40 dark:text-white/40 flex items-center gap-2">
                    <Truck size={12} /> Shipping
                  </span>
                  <span className={`text-sm font-inter font-bold ${isMember ? 'text-green-600' : 'text-[#3E2723] dark:text-white'}`}>
                    {isMember ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#3E2723]/5 dark:border-white/5">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#3E2723] dark:text-white">Grand Total</span>
                  <span className="text-2xl font-inter font-medium text-[#3E2723] dark:text-white">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-[#3E2723] dark:bg-velvet-oxblood text-white py-5 rounded-full flex items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-[0.3em] shadow-xl hover:bg-[#D4AF37] dark:hover:bg-velvet-cinnamon transition-all duration-500 disabled:opacity-20 disabled:cursor-not-allowed group"
              >
                Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              {!isMember && (
                <p className="text-center mt-6 text-[8px] uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20 font-bold">
                  Complimentary shipping on orders over $50
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;