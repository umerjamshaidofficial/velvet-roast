import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, RefreshCcw, User, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BASE_URL } from '../api/config'; // Centralized source for sanctuary server URL

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      // Updated to use dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/api/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to fetch order registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'delivered' : 'pending';
    const token = localStorage.getItem('token');
    
    try {
      // Updated to use dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Order #${orderId} marked as ${newStatus}`);
        fetchOrders(); // Reload the list to show updated status
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <RefreshCcw className="animate-spin text-[#D4AF37]" size={32} />
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-[#D4AF37] font-bold text-[10px] mb-8 hover:gap-4 transition-all tracking-widest"
        >
          <ArrowLeft size={14} /> BACK TO DASHBOARD
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#3E2723] dark:text-white font-playfair">Order Registry</h1>
          <p className="text-sm text-[#3E2723]/60 mt-2">Oversee and manage all ritual fulfillments.</p>
        </header>

        <div className="bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] border border-[#3E2723]/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#3E2723]/5">
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Ritual ID</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Customer</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Shipping Address</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Total</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Status</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3E2723]/5">
                {orders.map((order, index) => (
                  <motion.tr 
                    key={order.id} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#D4AF37]/5 transition-colors"
                  >
                    <td className="p-6 font-mono font-bold text-[#D4AF37] text-xs">#VR-{order.id}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                          <User size={12} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-[#3E2723] dark:text-white">
                            {order.first_name || order.last_name 
                              ? `${order.first_name || ''} ${order.last_name || ''}`.trim() 
                              : 'Guest User'}
                          </span>
                          <span className="text-[10px] opacity-50">{order.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-start gap-2 max-w-[280px]">
                        <MapPin size={12} className="text-[#D4AF37] mt-1 shrink-0" />
                        <span className="text-[11px] leading-relaxed opacity-70 uppercase tracking-wider font-medium">
                          {order.address ? `${order.address}, ${order.city}` : 'No address'}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 font-bold text-sm">${parseFloat(order.total_amount || 0).toFixed(2)}</td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {(order.status || 'PENDING').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => handleStatusUpdate(order.id, order.status)}
                        className={`p-2 rounded-lg transition-all ${order.status === 'delivered' ? 'text-emerald-500' : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'}`}
                        title="Toggle Status"
                      >
                        <CheckCircle size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;