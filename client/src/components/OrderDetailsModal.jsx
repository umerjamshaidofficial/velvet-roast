import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, MapPin, Calendar, Hash, Truck } from 'lucide-react';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  // Formatting helper for currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1A0A0A]/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-[#1A0A0A] w-full max-w-2xl rounded-[3rem] overflow-hidden border border-[#3E2723]/10 dark:border-white/10 shadow-2xl relative z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-[#3E2723]/5 dark:border-white/5 flex justify-between items-center bg-[#FDFCF8] dark:bg-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Hash size={14} className="text-[#D4AF37]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                    Ritual #{order.id || order._id?.slice(-6)}
                  </span>
                </div>
                <h2 className="text-2xl font-playfair text-[#3E2723] dark:text-white">Detailed Summary</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-4 rounded-full bg-[#3E2723]/5 dark:bg-white/5 text-[#3E2723] dark:text-white hover:bg-[#D4AF37] hover:text-white transition-all duration-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
              {/* Order Status & Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-[#FDFCF8] dark:bg-white/5 border border-[#3E2723]/5 dark:border-white/5">
                  <Calendar size={16} className="text-[#D4AF37] mb-3" />
                  <p className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 dark:text-white/40 font-bold">Placed On</p>
                  <p className="text-sm font-medium text-[#3E2723] dark:text-white">
                    {new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-[#FDFCF8] dark:bg-white/5 border border-[#3E2723]/5 dark:border-white/5">
                  <Truck size={16} className="text-[#D4AF37] mb-3" />
                  <p className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 dark:text-white/40 font-bold">Status</p>
                  <p className="text-sm font-medium text-[#3E2723] dark:text-white uppercase tracking-widest">{order.status || 'Processing'}</p>
                </div>
              </div>

              {/* Selection List */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#3E2723]/30 dark:text-white/30 mb-6 flex items-center gap-2">
                  <Coffee size={14} /> Curated Selections
                </h3>
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-[#3E2723]/5 dark:border-white/5 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-900 overflow-hidden border border-[#3E2723]/5">
                          <img 
                            src={item.image} 
                            alt={item.product_name} 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#3E2723] dark:text-white">{item.product_name || item.name}</p>
                          <p className="text-[9px] uppercase text-[#D4AF37] font-bold">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-inter font-bold text-[#3E2723] dark:text-white">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Destination */}
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#3E2723]/30 dark:text-white/30 mb-4 flex items-center gap-2">
                  <MapPin size={14} /> Sanctuary Destination
                </h3>
                <div className="p-6 rounded-3xl bg-[#3E2723] dark:bg-[#2A1515] text-white/90 border border-[#D4AF37]/20 shadow-lg">
                  <p className="text-sm font-playfair font-bold mb-1 tracking-wide">
                    {order.first_name} {order.last_name}
                  </p>
                  <p className="text-xs text-white/60 leading-relaxed uppercase tracking-[0.1em]">
                    {order.address}<br />
                    {order.city}, {order.postal_code}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-[#FDFCF8] dark:bg-white/5 border-t border-[#3E2723]/5 dark:border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-widest font-bold text-[#3E2723] dark:text-white">Total Investment</span>
                <span className="text-3xl font-inter font-light text-[#3E2723] dark:text-white tracking-tighter">
                  {formatCurrency(order.total_amount || order.total)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OrderDetailsModal;