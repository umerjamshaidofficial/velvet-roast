import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Edit3, Eye, EyeOff, Crown, 
  Search, Coffee, Save, X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BASE_URL } from '../api/config'; // Centralized source for sanctuary server URL

const RitualList = () => {
  const [rituals, setRituals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); 
  const [editingId, setEditingId] = useState(null); 
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchRituals();
  }, []);

  const fetchRituals = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/rituals`);
      const data = await response.json();
      setRituals(data);
    } catch (err) {
      toast.error("Failed to sync inventory");
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---

  const handleEditInit = (ritual) => {
    setEditingId(ritual.id);
    setEditData({ ...ritual });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/rituals/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        setRituals(rituals.map(r => r.id === editingId ? editData : r));
        setEditingId(null);
        toast.success("Ritual parameters updated");
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const toggleVisibility = async (ritual) => {
    const newStatus = ritual.visibility === 'hidden' ? 'public' : 'hidden';
    try {
      const response = await fetch(`${BASE_URL}/api/rituals/${ritual.id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: newStatus }),
      });
      if (response.ok) {
        setRituals(rituals.map(r => r.id === ritual.id ? { ...r, visibility: newStatus } : r));
        toast.success(newStatus === 'hidden' ? "Archived to storage" : "Restored to menu");
      }
    } catch (err) {
      toast.error("Visibility toggle failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently remove this ritual from the database?")) return;
    try {
      const response = await fetch(`${BASE_URL}/api/rituals/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setRituals(rituals.filter(r => r.id !== id));
        toast.success("Ritual deleted");
      }
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const filteredRituals = rituals.filter(ritual => {
    const matchesSearch = ritual.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || ritual.visibility === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex h-64 items-center justify-center"><Coffee className="animate-bounce text-[#D4AF37]" /></div>;

  return (
    <div className="p-4 md:p-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-[#3E2723] dark:text-white">Ritual Registry</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Inventory Management Node</p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E2723]/30" size={14} />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              className="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-[#3E2723]/10 rounded-xl text-xs w-full focus:outline-none focus:border-[#D4AF37]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-white dark:bg-white/5 border border-[#3E2723]/10 rounded-xl px-4 text-[10px] font-bold uppercase tracking-widest outline-none"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Display All</option>
            <option value="public">Public Only</option>
            <option value="vault">The Vault</option>
            <option value="hidden">Hidden/Out</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredRituals.map((ritual) => {
            const isEditing = editingId === ritual.id;
            const isHidden = ritual.visibility === 'hidden';

            return (
              <motion.div
                key={ritual.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
                  isEditing 
                    ? 'bg-white dark:bg-[#1A0A0A] border-[#D4AF37] shadow-2xl' 
                    : 'bg-white dark:bg-[#1A0A0A] border-[#3E2723]/5 shadow-sm'
                } ${isHidden ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                {/* Main Row */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-[#3E2723]/5">
                      <img src={`${BASE_URL}/uploads/${ritual.image_url}`} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#3E2723] dark:text-white flex items-center gap-2">
                        {ritual.name}
                        {ritual.visibility === 'vault' && <Crown size={12} className="text-[#D4AF37]" />}
                        {isHidden && <span className="text-[8px] bg-red-500/10 text-red-500 px-2 rounded-full uppercase">Hidden</span>}
                      </h4>
                      <p className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 dark:text-white/40">
                        {ritual.preference} • ${ritual.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => toggleVisibility(ritual)}
                      className={`p-3 rounded-full transition-all ${isHidden ? 'text-red-500 bg-red-50' : 'text-[#3E2723]/30 hover:text-[#D4AF37]'}`}
                      title={isHidden ? "Show in Menu" : "Hide from Menu"}
                    >
                      {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    
                    <button 
                      onClick={() => isEditing ? setEditingId(null) : handleEditInit(ritual)}
                      className={`p-3 rounded-full transition-all ${isEditing ? 'bg-[#D4AF37] text-white' : 'text-[#3E2723]/30 hover:text-blue-500'}`}
                    >
                      {isEditing ? <X size={18} /> : <Edit3 size={18} />}
                    </button>

                    <button 
                      onClick={() => handleDelete(ritual.id)}
                      className="p-3 text-[#3E2723]/30 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-[#3E2723]/5 bg-[#FDFCFB]/50 dark:bg-white/5 p-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-black text-[#D4AF37]">Product Name</label>
                          <input 
                            type="text" 
                            value={editData.name} 
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="w-full bg-white dark:bg-[#0F0505] p-3 rounded-xl border border-[#3E2723]/10 outline-none focus:border-[#D4AF37] text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-black text-[#D4AF37]">Price ($)</label>
                          <input 
                            type="number" 
                            value={editData.price} 
                            onChange={(e) => setEditData({...editData, price: e.target.value})}
                            className="w-full bg-white dark:bg-[#0F0505] p-3 rounded-xl border border-[#3E2723]/10 outline-none focus:border-[#D4AF37] text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] uppercase font-black text-[#D4AF37]">Access Tier</label>
                          <select 
                            value={editData.visibility} 
                            onChange={(e) => setEditData({...editData, visibility: e.target.value})}
                            className="w-full bg-white dark:bg-[#0F0505] p-3 rounded-xl border border-[#3E2723]/10 outline-none focus:border-[#D4AF37] text-sm"
                          >
                            <option value="public">Standard Public</option>
                            <option value="vault">Exclusive Vault (Pro)</option>
                            <option value="hidden">Hidden Archive</option>
                          </select>
                        </div>
                        <div className="md:col-span-3 flex justify-end gap-3 pt-4">
                          <button 
                            onClick={() => setEditingId(null)}
                            className="px-6 py-2 rounded-full text-[10px] uppercase font-bold text-[#3E2723]/40 hover:text-[#3E2723]"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleUpdate}
                            className="px-8 py-2 bg-[#3E2723] text-white rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 hover:bg-[#D4AF37] transition-all"
                          >
                            <Save size={14} /> Commit Changes
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RitualList;