import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ArrowRight, Loader2, Crown, Truck, Trash, Plus, MapPin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import GiftRitualSection from '../components/GiftRitualSection';
import { createOrder } from '../api/orderService';
import { BASE_URL } from '../api/config'; // Centralized source for sanctuary server URL

const Checkout = () => {
  const { cart, cartTotal, shippingFee, grandTotal, isMember, clearCart, removeFromCart, addToCart, showToast } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [giftData, setGiftData] = useState({ 
    isGift: location.state?.isGift || false, 
    message: '', 
    recipientEmail: '' 
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    label: 'Home'
  });

  // Handle "Buy Now" item addition to cart on mount
  useEffect(() => {
    if (location.state?.directBuyItem) {
      const item = location.state.directBuyItem;
      addToCart(item);
    }
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/profile/me`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (!response.ok) throw new Error("Failed to load");
        
        const data = await response.json();
        if (data.addresses && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          handleSelectAddress(data.addresses[0]);
        } else {
          setShowNewAddressForm(true);
        }
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setShowNewAddressForm(true);
      }
    };
    fetchAddresses();
  }, []);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setShowNewAddressForm(false);
    setFormData({
      firstName: addr.full_name?.split(' ')[0] || '',
      lastName: addr.full_name?.split(' ')[1] || '',
      address: addr.street_address,
      city: addr.city,
      postalCode: addr.postal_code,
      label: addr.label
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGiftChange = (isGift, details) => {
    setGiftData({ 
      isGift, 
      message: details.message, 
      recipientEmail: details.email 
    });
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    showToast("Item removed from ritual.");
  };

  const handleDeleteAddress = async (e, id) => {
    e.stopPropagation();
    try {
      const resp = await fetch(`${BASE_URL}/api/profile/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (resp.ok) {
        setSavedAddresses(prev => prev.filter(a => a.id !== id));
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
          setShowNewAddressForm(true);
        }
      }
    } catch (err) {
      showToast("Could not remove destination.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }
    if (giftData.isGift && !giftData.recipientEmail) {
      showToast("Please provide a recipient email.");
      return;
    }

    setLoading(true);

    try {
      let recipientStatus = { exists: false };
      if (giftData.isGift) {
        const checkRes = await fetch(`${BASE_URL}/api/gifts/check-recipient?email=${giftData.recipientEmail}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        recipientStatus = await checkRes.json();
      }

      const orderData = {
        customer: formData,
        items: cart,
        subtotal: cartTotal,
        shipping: (isMember || giftData.isGift) ? 0 : shippingFee,
        total: (giftData.isGift) ? cartTotal : grandTotal,
        isGift: giftData.isGift,
        giftMessage: giftData.isGift ? giftData.message : null,
        recipientEmail: giftData.isGift ? giftData.recipientEmail : null,
        recipientId: recipientStatus.exists ? recipientStatus.user.id : null,
        addressId: giftData.isGift ? null : selectedAddressId
      };

      const result = await createOrder(orderData);

      if (giftData.isGift && !recipientStatus.exists) {
        await fetch(`${BASE_URL}/api/gifts/send-ritual`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          },
          body: JSON.stringify({
            recipientEmail: giftData.recipientEmail,
            message: giftData.message
          })
        });
        showToast(`Invitation sent to ${giftData.recipientEmail}`);
      } else if (giftData.isGift && recipientStatus.exists) {
        showToast(`Ritual dedicated to ${recipientStatus.user.first_name}`);
      } else {
        showToast("Order Placed Successfully");
      }

      clearCart();
      navigate('/order-success', { 
        state: { 
          orderId: result.orderId,
          isGift: giftData.isGift,
          customer: formData 
        } 
      });
    } catch (error) {
      showToast(error.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToShop = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const inputStyles = "w-full bg-[#3E2723]/5 dark:bg-white/5 border border-[#3E2723]/10 dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-[#3E2723] dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-[#3E2723]/30 dark:placeholder:text-white/20 font-inter";
  const labelStyles = "block text-[10px] uppercase tracking-[0.2em] font-bold text-[#3E2723]/40 dark:text-white/40 mb-2 ml-2";

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#FDFCF8] dark:bg-velvet-bean min-h-screen pt-40 pb-20 px-6 transition-colors duration-700"
    >
      <div className="container mx-auto max-w-6xl">
        <button onClick={handleBackToShop} className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] mb-12 transition-all hover:translate-x-[-4px]">
          <ChevronLeft size={14} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-playfair text-[#3E2723] dark:text-white mb-4">
              {giftData.isGift ? "Gift Ritual" : "Shipping Details"}
            </h1>
            <p className="text-sm text-[#3E2723]/60 dark:text-white/40 mb-12 uppercase tracking-widest font-bold text-[9px]">
              {giftData.isGift ? "Prepare your sacred offering" : "Where should we deliver your ritual?"}
            </p>

            {!giftData.isGift && savedAddresses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {savedAddresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`group relative p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer ${
                      selectedAddressId === addr.id 
                      ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-lg' 
                      : 'border-[#3E2723]/10 dark:border-white/10 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-[#D4AF37]">
                        <MapPin size={14} />
                        <span className="text-[9px] uppercase font-black tracking-widest">{addr.label}</span>
                      </div>
                      <button onClick={(e) => handleDeleteAddress(e, addr.id)} className="opacity-0 group-hover:opacity-100 p-2 hover:text-red-500 transition-all">
                        <Trash size={14} />
                      </button>
                    </div>
                    <p className="text-sm font-playfair text-[#3E2723] dark:text-white">{addr.street_address}</p>
                    <p className="text-[10px] text-[#3E2723]/40 dark:text-white/40 uppercase tracking-tighter mt-1">{addr.city}, {addr.postal_code}</p>
                  </div>
                ))}
                
                <button 
                  type="button"
                  onClick={() => {
                    setShowNewAddressForm(true);
                    setSelectedAddressId(null);
                    setFormData({ firstName: '', lastName: '', address: '', city: '', postalCode: '', label: 'Home' });
                  }}
                  className="p-6 rounded-[2rem] border border-dashed border-[#3E2723]/20 flex flex-col items-center justify-center gap-2 text-[#3E2723]/40 hover:text-[#D4AF37] transition-all"
                >
                  <Plus size={20} />
                  <span className="text-[9px] uppercase font-bold tracking-widest">New Destination</span>
                </button>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {(showNewAddressForm || giftData.isGift) && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={labelStyles}>First Name</label>
                        <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className={inputStyles} />
                      </div>
                      <div>
                        <label className={labelStyles}>Last Name</label>
                        <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className={inputStyles} />
                      </div>
                    </div>
                    
                    {!giftData.isGift && (
                      <>
                        <div>
                          <label className={labelStyles}>Shipping Address</label>
                          <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className={inputStyles} />
                        </div>
                        <div className="grid grid-cols-2 gap-6 pb-4">
                          <div>
                            <label className={labelStyles}>City</label>
                            <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className={inputStyles} />
                          </div>
                          <div>
                            <label className={labelStyles}>Postal Code</label>
                            <input required name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" className={inputStyles} />
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <GiftRitualSection onGiftChange={handleGiftChange} />
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#1A0A0A] rounded-[3rem] p-10 border border-[#3E2723]/5 shadow-2xl h-fit lg:sticky lg:top-40">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-playfair text-[#3E2723] dark:text-white">Order Summary</h2>
              {isMember && <Crown className="text-[#D4AF37]" size={20} />}
            </div>
            
            <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image_url ? `${BASE_URL}/uploads/${item.image_url}` : item.image} 
                      alt={item.name} 
                      className="w-12 h-16 rounded-xl object-cover" 
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#3E2723] dark:text-white">{item.name}</h4>
                      <p className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 font-bold">Qty: {item.quantity || 1}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#8C6A5E]">
                        ${(parseFloat(item.price.toString().replace('$', '')) * (item.quantity || 1)).toFixed(2)}
                    </span>
                    <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[#3E2723]/20 hover:text-red-500 transition-all"
                    >
                        <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-[#3E2723]/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#3E2723]/40">Subtotal</span>
                <span className="text-sm font-bold text-[#3E2723] dark:text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#3E2723]/40 flex items-center gap-2"><Truck size={14} /> Shipping</span>
                <span className={`text-sm font-bold ${isMember || giftData.isGift ? 'text-green-600' : 'text-[#3E2723] dark:text-white'}`}>
                  {isMember || giftData.isGift ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-[#3E2723]/5">
                <span className="text-sm uppercase tracking-[0.3em] font-bold text-[#3E2723] dark:text-white">Total</span>
                <span className="text-4xl font-inter font-light text-[#3E2723] dark:text-white leading-none">
                  ${(giftData.isGift ? cartTotal : grandTotal).toFixed(2)}
                </span>
              </div>
            </div>

            <button 
                type="submit" 
                form="checkout-form" 
                disabled={loading || cart.length === 0} 
                className="w-full bg-[#3E2723] text-white py-6 rounded-full mt-10 flex items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-[0.4em] hover:bg-[#D4AF37] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>{giftData.isGift ? "Send Ritual" : "Confirm Selection"} <ArrowRight size={16} /></>}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Checkout;