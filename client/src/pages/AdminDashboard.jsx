import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ShoppingBag, DollarSign, Package, 
  Clock, RefreshCcw, Menu, PlusCircle, 
  List, Gift, LayoutDashboard, X,
  CheckCircle
} from 'lucide-react';
import AdminGiftTrack from './AdminGiftTrack';
import { BASE_URL } from '../api/config'; // Centralized source for sanctuary server URL

const OverviewStats = ({ stats }) => {
  const navigate = useNavigate();
  
  const items = [
    { 
      title: 'Total Revenue', 
      value: `$${stats.totalRevenue || '0.00'}`, 
      icon: DollarSign 
    },
    { 
      title: 'Active Members', 
      value: stats.totalUsers || 0, 
      icon: Users, 
      clickable: true, 
      path: '/admin/users' 
    },
    { 
      title: 'Total Orders', 
      value: stats.totalOrders || 0, 
      icon: ShoppingBag, 
      clickable: true, 
      path: '/admin/orders' 
    },
    { 
      title: 'Total Rituals', 
      value: stats.totalRituals || 0, 
      icon: Package,
      clickable: true,
      path: '/admin/rituals'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => item.clickable && navigate(item.path)}
          className={`bg-white dark:bg-[#1A0A0A] p-6 rounded-[2.5rem] border border-[#3E2723]/5 dark:border-white/5 shadow-sm hover:border-[#D4AF37]/30 hover:shadow-md transition-all duration-300 ${item.clickable ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl">
              <item.icon size={20} className="text-[#D4AF37]" />
            </div>
            {item.clickable && <span className="text-[8px] font-black text-[#D4AF37] tracking-widest">VIEW ALL</span>}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#3E2723]/40 dark:text-white/30 font-bold mb-1">
              {item.title}
            </p>
            <h3 className="text-2xl font-mono font-bold text-[#3E2723] dark:text-white">
              {item.value}
            </h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Add Ritual', icon: PlusCircle, path: '/admin/add-ritual' },
    { name: 'Ritual List', icon: List, path: '/admin/rituals' },
    { name: 'Ritual Gift Track', icon: Gift, path: '/admin/gift-track' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    try {
      // Updated to use dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/api/admin/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setStats(data.stats || {});
      setOrders(data.recentOrders || []);
      setSubscriptions(data.recentSubscriptions || []);
    } catch (err) {
      console.error("Admin Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      // Updated to use dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchDashboardData(); 
      }
    } catch (err) {
      console.error("Status Update Failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] dark:bg-[#0F0505]">
        <RefreshCcw className="animate-spin text-[#D4AF37]" size={32} />
      </div>
    );
  }

  const isMainDashboard = location.pathname === '/admin';
  const isGiftTrackView = location.pathname === '/admin/gift-track';

  return (
    <div className="relative min-h-screen bg-[#FDFCFB] dark:bg-[#0F0505] overflow-x-hidden transition-colors duration-500">
      
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-[#0F0505]/60 backdrop-blur-sm z-[60] cursor-pointer"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-[#1A0A0A] z-[70] shadow-2xl border-r border-[#3E2723]/10 p-8 flex flex-col"
            >
              <div className="mb-12 flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-black">Command Menu</span>
                <button onClick={() => setIsSidebarOpen(false)}><X size={18} /></button>
              </div>

              <nav className="space-y-4 flex-grow">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => { navigate(link.path); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${location.pathname === link.path ? 'bg-[#D4AF37]/10' : 'hover:bg-[#D4AF37]/5'}`}
                  >
                    <link.icon size={20} className={location.pathname === link.path ? 'text-[#D4AF37]' : 'text-[#3E2723]/40'} />
                    <span className="text-sm font-bold">{link.name}</span>
                  </button>
                ))}
              </nav>

              <button onClick={handleLogout} className="w-full p-5 rounded-3xl bg-[#3E2723] text-white text-[11px] font-black uppercase tracking-widest">
                Terminate Session
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="pt-12 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="p-4 bg-white dark:bg-[#1A0A0A] rounded-2xl border shadow-sm">
              <Menu size={20} className="text-[#3E2723] dark:text-white" />
            </button>
            <h1 className="text-5xl font-bold text-[#3E2723] dark:text-white">
              {isMainDashboard ? "Dashboard" : "Management"}
            </h1>
          </div>
          <button onClick={fetchDashboardData} className="p-4 bg-white dark:bg-[#1A0A0A] rounded-full shadow-sm">
            <RefreshCcw size={18} />
          </button>
        </header>

        {children ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>{children}</motion.div>
        ) : isGiftTrackView ? (
          <AdminGiftTrack />
        ) : (
          <>
            <OverviewStats stats={stats} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] border p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-8">Recent Rituals</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-4 text-[9px] uppercase font-bold opacity-40">ID</th>
                        <th className="pb-4 text-[9px] uppercase font-bold opacity-40">Customer</th>
                        <th className="pb-4 text-[9px] uppercase font-bold opacity-40">Status</th>
                        <th className="pb-4 text-right text-[9px] uppercase font-bold opacity-40">Update</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orders.map((order) => (
                        <tr key={order.id} className="group hover:bg-black/[0.02]">
                          <td className="py-5 text-xs font-bold text-[#D4AF37]">#VR-{order.id}</td>
                          <td className="py-5 text-xs font-bold">{order.first_name || 'New Ritualist'}</td>
                          <td className="py-5">
                            <div className="flex items-center gap-2">
                              {order.status === 'delivered' ? (
                                <CheckCircle size={14} className="text-emerald-500" />
                              ) : (
                                <Clock size={14} className="text-amber-500" />
                              )}
                              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                {order.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-5 text-right">
                            <select 
                              className="bg-transparent text-[10px] font-bold outline-none cursor-pointer"
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            >
                              <option value="pending">PENDING</option>
                              <option value="delivered">DELIVERED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#3E2723] rounded-[2.5rem] p-8 text-white shadow-xl h-fit">
                <div className="flex items-center gap-3 mb-8">
                  <Clock size={20} className="text-[#D4AF37]" />
                  <h3 className="text-xl font-bold italic">Membership Users</h3>
                </div>
                <div className="space-y-10">
                  {subscriptions.length > 0 ? (
                    subscriptions.map((sub, i) => (
                      <div key={i} className="relative pl-6 border-l border-[#D4AF37]/20">
                        <div className="absolute top-0 left-[-4px] h-2 w-2 rounded-full bg-[#D4AF37]" />
                        <p className="text-[9px] text-[#D4AF37] font-bold uppercase mb-1">Membership Joined</p>
                        <p className="text-xs text-white/80">
                          <span className="text-white font-bold">{sub.first_name || 'Admin Command'}</span> activated Executive status.
                        </p>
                      </div>
                    ))
                  ) : <p className="text-xs italic opacity-40">No recent activations...</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;