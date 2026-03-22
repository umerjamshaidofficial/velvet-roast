import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Plus, 
  Eye, 
  Lock, 
  DollarSign, 
  Coffee,
  CheckCircle2
} from 'lucide-react';
import { BASE_URL } from '../api/config'; // Centralized source for sanctuary server URL

const AddRitual = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    preference: 'Medium', // Default
    visibility: 'public', // 'public' or 'vault'
    description: '',
    image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('preference', formData.preference);
    data.append('visibility', formData.visibility);
    data.append('description', formData.description);
    data.append('image', formData.image);

    try {
      // Updated to use dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/api/admin/rituals/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Note: Do not set Content-Type header when sending FormData; 
          // the browser will set it automatically with the boundary.
        },
        body: data
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form after 2 seconds - logic fully preserved
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            name: '', price: '', preference: 'Medium', 
            visibility: 'public', description: '', image: null
          });
          setPreviewUrl(null);
        }, 2000);
      }
    } catch (err) {
      console.error("Error adding ritual to sanctuary:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-playfair font-bold text-[#3E2723] dark:text-white mb-2">Create New Ritual</h1>
        <p className="text-sm text-[#3E2723]/50 dark:text-white/40 uppercase tracking-[0.2em]">Curate a new experience for your members</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <label className="block text-[10px] uppercase tracking-widest font-black text-[#D4AF37] mb-4">Product Visual</label>
            <div 
              className="relative aspect-square rounded-3xl border-2 border-dashed border-[#3E2723]/10 dark:border-white/10 overflow-hidden group hover:border-[#D4AF37] transition-all duration-500 bg-[#3E2723]/5 dark:bg-white/5"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <Upload className="text-[#3E2723]/20 dark:text-white/20 mb-3" size={32} />
                  <p className="text-[10px] text-[#3E2723]/40 dark:text-white/30 uppercase tracking-tighter">Click to upload high-res image</p>
                </div>
              )}
              <input 
                type="file" 
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*"
                required
              />
            </div>
          </div>

          {/* Core Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#D4AF37] mb-2">Ritual Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#3E2723]/5 dark:bg-white/5 border border-[#3E2723]/10 dark:border-white/10 rounded-2xl px-6 py-4 text-[#3E2723] dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all placeholder:text-[#3E2723]/20 dark:placeholder:text-white/20"
                  placeholder="e.g. Midnight Silk Espresso"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#D4AF37] mb-2">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E2723]/30" size={16} />
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-[#3E2723]/5 dark:bg-white/5 border border-[#3E2723]/10 dark:border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[#3E2723] dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="24.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-[#D4AF37] mb-2">Roast Preference</label>
                <div className="relative">
                  <select 
                    value={formData.preference}
                    onChange={(e) => setFormData({...formData, preference: e.target.value})}
                    className="w-full bg-[#3E2723]/5 dark:bg-white/5 border border-[#3E2723]/10 dark:border-white/10 rounded-2xl px-6 py-4 text-[#3E2723] dark:text-white focus:outline-none focus:border-[#D4AF37] appearance-none cursor-pointer"
                  >
                    <option value="Light" className="bg-white dark:bg-[#1A0A0A]">Light Roast</option>
                    <option value="Medium" className="bg-white dark:bg-[#1A0A0A]">Medium Roast</option>
                    <option value="Dark" className="bg-white dark:bg-[#1A0A0A]">Dark Roast</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#3E2723]/30">
                    <Plus size={14} className="rotate-45" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-black text-[#D4AF37] mb-4">Availability</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, visibility: 'public'})}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                    formData.visibility === 'public' 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1A0A0A]' 
                    : 'bg-transparent border-[#3E2723]/10 dark:border-white/10 text-[#3E2723]/40 dark:text-white/40'
                  }`}
                >
                  <Eye size={18} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Visible to All</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, visibility: 'vault'})}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${
                    formData.visibility === 'vault' 
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-[#1A0A0A]' 
                    : 'bg-transparent border-[#3E2723]/10 dark:border-white/10 text-[#3E2723]/40 dark:text-white/40'
                  }`}
                >
                  <Lock size={18} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">The Vault (Members)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-black text-[#D4AF37] mb-2">Description / Tasting Notes</label>
            <textarea 
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-[#3E2723]/5 dark:bg-white/5 border border-[#3E2723]/10 dark:border-white/10 rounded-3xl px-6 py-4 text-[#3E2723] dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all resize-none placeholder:text-[#3E2723]/20 dark:placeholder:text-white/20"
              placeholder="Describe the aroma, body, and heritage of this ritual..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-5 rounded-full flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden relative
              ${success ? 'bg-green-500' : 'bg-[#D4AF37] hover:scale-[1.02] shadow-xl active:scale-95'}
            `}
          >
            {loading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Coffee size={20} className="text-[#1A0A0A]" />
              </motion.div>
            ) : success ? (
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 size={20} />
                <span className="text-[12px] uppercase font-black tracking-[0.3em]">Ritual Added</span>
              </div>
            ) : (
              <span className="text-[12px] uppercase font-black tracking-[0.3em] text-[#1A0A0A]">
                Publish Ritual
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRitual;