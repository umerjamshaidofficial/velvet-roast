import { useState } from 'react';
import { MapPin, Edit3, Trash2, X, Globe, ArrowUpRight } from 'lucide-react';
import { BASE_URL } from '../../api/config';

const DestinationSection = ({ 
  addresses, 
  fetchUserData, 
  showToast, 
  loading, 
  setLoading,
  profile // Needed for the full_name in the API call
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    street_address: '',
    city: '',
    postal_code: '',
    label: 'Home'
  });

  const handleSaveAddress = async () => {
    if (!newAddress.street_address || !newAddress.city) {
      showToast("Please provide complete destination details.");
      return;
    }
    setLoading(true);
    const url = isEditingAddress 
      ? `${BASE_URL}/api/profile/addresses/${currentAddressId}` 
      : `${BASE_URL}/api/profile/addresses`;
    const method = isEditingAddress ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          full_name: `${profile.firstName} ${profile.lastName}`,
          street_address: newAddress.street_address,
          city: newAddress.city,
          postal_code: newAddress.postal_code,
          label: newAddress.label
        })
      });

      if (response.ok) {
        showToast(isEditingAddress ? "Destination Ritual Updated" : "Destination Added to Sanctuary");
        cancelEdit();
        fetchUserData();
      }
    } catch (err) {
      showToast("Connection Error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (addr) => {
    setIsEditingAddress(true);
    setCurrentAddressId(addr.id);
    setNewAddress({
      street_address: addr.street_address,
      city: addr.city,
      postal_code: addr.postal_code,
      label: addr.label || 'Home'
    });
    document.getElementById('address-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteAddress = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/profile/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        showToast("Destination Removed");
        fetchUserData();
      }
    } catch (err) {
      showToast("Error deleting destination");
    }
  };

  const cancelEdit = () => {
    setIsEditingAddress(false);
    setCurrentAddressId(null);
    setNewAddress({ street_address: '', city: '', postal_code: '', label: 'Home' });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white dark:bg-[#1A0A0A] rounded-[2.5rem] p-10 border border-[#3E2723]/5 shadow-sm">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-[#3E2723] dark:text-white">Ritual Destinations</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold">Your Secured Sanctuaries</p>
          </div>
          <div className="p-4 bg-[#3E2723]/5 dark:bg-white/5 rounded-full text-[#D4AF37]">
            <Globe size={20} />
          </div>
        </header>

        {/* Saved Addresses List */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div key={addr.id} className="group p-6 rounded-3xl bg-[#3E2723]/5 dark:bg-white/5 border border-transparent hover:border-[#D4AF37]/30 transition-all flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white dark:bg-[#2A1515] rounded-2xl shadow-sm">
                    <MapPin size={16} className="text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-black text-[#D4AF37] tracking-widest mb-0.5">{addr.label || 'Destination'}</p>
                    <p className="text-sm font-playfair dark:text-white">{addr.street_address}, {addr.city}</p>
                  </div>
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditClick(addr)} className="p-2 text-stone-400 hover:text-[#D4AF37] transition-colors">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-red-400/40 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-[#3E2723]/5 rounded-3xl border border-dashed border-[#3E2723]/10">
              <p className="text-[10px] uppercase tracking-widest text-[#3E2723]/40">No destinations secured yet.</p>
            </div>
          )}
        </div>

        {/* Address Form */}
        <div id="address-form" className="pt-10 border-t border-[#3E2723]/5 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#D4AF37]">
              {isEditingAddress ? "Modify Sanctuary Destination" : "Add New Ritual Destination"}
            </h3>
            {isEditingAddress && (
              <button onClick={cancelEdit} className="text-[10px] uppercase font-bold text-red-500 flex items-center gap-1 hover:underline">
                <X size={12}/> Cancel Edit
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 font-bold ml-2">Street Address</label>
              <input 
                type="text" 
                value={newAddress.street_address}
                onChange={(e) => setNewAddress({...newAddress, street_address: e.target.value})}
                className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 outline-none text-[#3E2723] dark:text-white focus:ring-1 ring-[#D4AF37] font-playfair"
                placeholder="123 Velvet Lane"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 font-bold ml-2">City</label>
                <input 
                  type="text" 
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                  className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-1 ring-[#D4AF37] font-playfair"
                  placeholder="Paris"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-[#3E2723]/40 font-bold ml-2">Postal Code</label>
                <input 
                  type="text" 
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                  className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-none rounded-2xl px-6 py-4 focus:ring-1 ring-[#D4AF37] font-playfair"
                  placeholder="75001"
                />
              </div>
            </div>

            <button 
              onClick={handleSaveAddress}
              disabled={loading || !newAddress.street_address}
              className="w-full flex items-center justify-center gap-3 py-5 bg-[#3E2723] dark:bg-[#4A0E0E] text-white rounded-[2rem] text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#D4AF37] transition-all shadow-xl disabled:opacity-50 mt-4"
            >
              <ArrowUpRight size={16} />
              {loading ? "Establishing Connection..." : (isEditingAddress ? "Update Ritual Site" : "Secure New Destination")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationSection;