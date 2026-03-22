import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Clock, Coffee, MapPin, Gift, 
  MailOpen, Eye, Crown, ShieldCheck, RotateCcw,
  CheckCircle 
} from 'lucide-react';
import { fetchUserOrders } from '../api/orderService';
import { useCart } from '../context/CartContext';
import OrderDetailsModal from '../components/OrderDetailsModal';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isMember, addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, [navigate]);

  const handleReorder = (order) => {
    order.items.forEach(item => {
      const cartItem = {
        id: item.product_id || item.id,
        name: item.product_name || item.name,
        price: item.price,
        image: item.image,
        origin: item.origin || 'Velvet Selection'
      };
      
      for (let i = 0; i < item.quantity; i++) {
        addToCart(cartItem);
      }
    });
    setIsCartOpen(true);
  };

  const handleBackToShop = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-[#FDFCF8] dark:bg-velvet-bean min-h-screen pt-40 pb-20 px-6 transition-colors duration-700">
      <div className="container mx-auto max-w-4xl">
        <button 
          onClick={handleBackToShop}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] mb-12 transition-all hover:translate-x-[-4px]"
        >
          <ChevronLeft size={14} /> Back to Collection
        </button>

        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-playfair text-[#3E2723] dark:text-white mb-4"
            >
              Your Ritual History
            </motion.h1>
            <p className="text-sm text-[#3E2723]/60 dark:text-white/40 uppercase tracking-[0.2em]">Tracking your curated selections</p>
          </div>

          {isMember && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-6 py-3 rounded-2xl"
            >
              <Crown className="text-[#D4AF37]" size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Executive Member</span>
            </motion.div>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-10">
            {orders.length === 0 ? (
              <p className="text-center text-[#3E2723]/40 dark:text-white/30 font-inter uppercase tracking-widest text-[10px] py-20">No orders found in your history.</p>
            ) : (
              orders.map((order, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={order.id || order._id}
                  className={`bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] p-8 md:p-12 border shadow-sm overflow-hidden relative transition-all duration-500 hover:shadow-xl ${
                    (order.is_gift && order.is_claimed) || isMember
                    ? 'border-[#D4AF37]/30 shadow-[0_10px_40px_rgba(212,175,55,0.05)]' 
                    : 'border-[#3E2723]/5 dark:border-white/5'
                  }`}
                >
                  <div className="absolute top-0 right-0 flex">
                    {isMember && (
                      <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-6 py-2 flex items-center gap-2 border-l border-b border-[#D4AF37]/20">
                        <ShieldCheck size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Priority Prep</span>
                      </div>
                    )}
                    {order.is_gift && (
                      <div className={`px-6 py-2 flex items-center gap-2 transition-colors duration-500 ${
                        order.is_claimed ? 'bg-[#D4AF37] text-[#1A0A0A]' : 'bg-[#3E2723] text-white'
                      }`}>
                        {order.is_claimed ? <MailOpen size={12} /> : <Gift size={12} />}
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {order.is_claimed ? "Ritual Opened" : "Ritual Closed"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                      <span className="text-[10px] font-inter font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-2 block">Order #{order.id || order._id?.slice(-6)}</span>
                      <h3 className="text-lg font-inter font-medium text-[#3E2723] dark:text-white uppercase tracking-[0.05em]">
                        {new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </h3>
                      <button 
                        onClick={() => openOrderDetails(order)}
                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#3E2723]/40 dark:text-white/40 hover:text-[#D4AF37] transition-all mt-2"
                      >
                        <Eye size={14} /> View Ritual Details
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#D4AF37] text-[#D4AF37] text-[9px] font-black uppercase tracking-widest hover:bg-[#D4AF37] hover:text-white transition-all duration-500 group"
                      >
                        <RotateCcw size={12} className="group-hover:rotate-[-45deg] transition-transform" /> 
                        Re-order Ritual
                      </button>

                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${
                        order.status === 'delivered' 
                        ? 'bg-emerald-500/10 border-emerald-500/20' 
                        : 'bg-[#FDFCF8] dark:bg-white/5 border-[#3E2723]/5 dark:border-white/10'
                      }`}>
                        {order.status === 'delivered' ? (
                          <CheckCircle size={12} className="text-emerald-500" />
                        ) : (
                          <Clock size={12} className="text-[#D4AF37]" />
                        )}
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${
                          order.status === 'delivered' ? 'text-emerald-500' : 'text-[#3E2723]/60 dark:text-white/40'
                        }`}>
                          {order.status || 'Confirmed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-[#3E2723]/5 dark:border-white/5 pb-10 mb-10">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20">Selection Details</p>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Coffee size={14} className="text-[#D4AF37]" />
                            <span className="text-sm text-[#3E2723] dark:text-white/70 font-medium">{item.product_name || item.name}</span>
                            <span className="text-[10px] font-inter text-[#3E2723]/40 dark:text-white/30 tracking-widest uppercase ml-auto">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-left md:text-right flex flex-col justify-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20 mb-2">Total Investment</p>
                      <p className="text-5xl font-inter font-light text-[#3E2723] dark:text-white leading-none tracking-tighter">${order.total_amount || order.total}</p>
                    </div>
                  </div>

                  {order.is_gift && (
                    <div className="mb-10 space-y-4">
                      {order.gift_message && (
                        <div className="bg-[#FDFCF8] dark:bg-white/5 rounded-3xl p-6 border border-[#D4AF37]/20 border-dashed">
                          <div className="flex items-center gap-2 mb-4">
                            <MailOpen size={14} className="text-[#D4AF37]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">Personalized Message</span>
                          </div>
                          <p className="text-xs italic font-inter text-[#3E2723]/80 dark:text-white/60 leading-relaxed">
                            "{order.gift_message}"
                          </p>
                        </div>
                      )}
                      <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold ml-2">
                        Sent to: {order.recipient_email}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20 flex items-center gap-2">
                      <MapPin size={12} /> Shipping Destination
                    </p>
                    <p className="text-[11px] md:text-xs font-inter text-[#3E2723]/70 dark:text-white/60 leading-relaxed uppercase tracking-[0.1em] max-w-lg">
                      {order.first_name} {order.last_name} — {order.address}, {order.city}, {order.postal_code}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      <OrderDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        order={selectedOrder} 
      />
    </section>
  );
};

export default MyOrders;