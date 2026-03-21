import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  CheckCircle2, 
  MessageSquare, 
  Search, 
  RefreshCcw,
  ExternalLink,
  Mail,
  User,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminGiftTrack = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGiftData();
  }, []);

  const fetchGiftData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/gifts');
      const data = await response.json();
      setGifts(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to sync gift registry");
    } finally {
      setLoading(false);
    }
  };

  const filteredGifts = gifts.filter(gift => 
    (gift.sender_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (gift.sender_email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (gift.recipient_name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <RefreshCcw className="animate-spin text-[#D4AF37]" size={32} />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-[#3E2723]">Gift Ritual Tracker</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold mt-1">Admin Registry Overview</p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E2723]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search sender email or receiver name..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#3E2723]/10 rounded-2xl text-sm focus:outline-none focus:border-[#D4AF37] shadow-sm transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-6">
        <AnimatePresence>
          {filteredGifts.map((gift) => (
            <motion.div
              layout
              key={gift.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#3E2723]/5 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all border-l-4 border-[#D4AF37]"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Connection Section */}
                <div className="flex-[1.5] flex items-center gap-4">
                  {/* Sender Box */}
                  <div className="flex-1 p-5 bg-[#FDFCF8] rounded-2xl border border-[#3E2723]/5">
                    <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest block mb-1">Sender Email</span>
                    <p className="font-bold text-[#3E2723] text-lg leading-tight truncate">{gift.sender_name || 'User'}</p>
                    <p className="text-xs text-[#D4AF37] font-medium mt-1 truncate">{gift.sender_email}</p>
                  </div>

                  <div className="flex flex-col items-center opacity-30">
                    <ArrowRight size={16} />
                    <Gift size={20} className="my-1 text-[#3E2723]" />
                    <ArrowRight size={16} />
                  </div>

                  {/* Receiver Box */}
                  <div className="flex-1 p-5 bg-[#FDFCF8] rounded-2xl border border-[#3E2723]/5">
                    <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-widest block mb-1">Receiver Name</span>
                    <p className="font-bold text-[#3E2723] text-lg leading-tight">{gift.recipient_name}</p>
                    <p className="text-xs text-[#3E2723]/40 mt-1 truncate">{gift.recipient_email}</p>
                  </div>
                </div>

                {/* Message Section */}
                <div className="flex-1 flex flex-col justify-between lg:border-l border-[#3E2723]/10 lg:pl-8">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-[#3E2723]/30">
                      <MessageSquare size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Gift Message</span>
                    </div>
                    <p className="text-[#3E2723] text-sm leading-relaxed italic font-serif opacity-80">
                      "{gift.message}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#3E2723]/5">
                    <div className="flex gap-6">
                      <div>
                        <p className="text-sm font-bold text-[#3E2723]">{gift.days_ago || '0'}</p>
                        <p className="text-[8px] uppercase font-black text-[#D4AF37]">Days Ago</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#3E2723] uppercase">{gift.status}</p>
                        <p className="text-[8px] uppercase font-black text-[#D4AF37]">Status</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {gift.converted && (
                        <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <CheckCircle2 size={12} />
                          <span className="text-[9px] font-bold uppercase">Claimed</span>
                        </div>
                      )}
                      <button className="p-2.5 bg-[#3E2723] text-white rounded-full hover:bg-[#D4AF37] transition-colors shadow-sm">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredGifts.length === 0 && (
        <div className="text-center py-40 opacity-20">
          <Gift size={64} className="mx-auto mb-4" />
          <p className="uppercase tracking-[0.4em] font-black text-xs">Registry Empty</p>
        </div>
      )}
    </div>
  );
};

export default AdminGiftTrack;