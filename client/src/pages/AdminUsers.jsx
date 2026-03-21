import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, User, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <RefreshCcw className="animate-spin text-[#D4AF37]" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-[#D4AF37] font-bold text-[10px] mb-8 hover:gap-4 transition-all tracking-widest"
        >
          <ArrowLeft size={14} /> BACK TO DASHBOARD
        </button>

        <header className="mb-12">
          <h1 className="text-4xl font-playfair font-bold text-[#3E2723] dark:text-white">User Registry</h1>
          <p className="text-sm text-[#3E2723]/60 dark:text-white/40 mt-2">Manage and view all registered ritualists.</p>
        </header>

        <div className="bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] border border-[#3E2723]/5 dark:border-white/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#3E2723]/5 dark:bg-white/5">
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">User</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Email</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Username</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black opacity-40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3E2723]/5 dark:divide-white/5">
                {users.map((user, index) => (
                  <motion.tr 
                    key={user.id || index} 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-[#D4AF37]/5 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
                          {user.first_name ? user.first_name[0].toUpperCase() : <User size={14} />}
                        </div>
                        <span className="font-bold text-sm text-[#3E2723] dark:text-white/90">
                          {user.first_name || user.last_name 
                            ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
                            : (user.email ? user.email.split('@')[0] : 'Guest User')}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-xs font-medium text-[#3E2723]/70 dark:text-white/60">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-[#D4AF37]" /> {user.email || 'No email provided'}
                      </div>
                    </td>
                    <td className="p-6 text-xs font-mono font-bold text-[#D4AF37]">
                      @{user.username || 'n/a'}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black tracking-tighter ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-500' 
                          : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                      }`}>
                        {(user.role || 'USER').toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {users.length === 0 && !loading && (
            <div className="p-20 text-center opacity-40 italic text-sm text-[#3E2723] dark:text-white">
              No users found in the registry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;