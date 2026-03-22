import React, { useState } from 'react';
import { Gift, Send } from 'lucide-react';
import { BASE_URL } from '../../api/config';

const GiftRitual = ({ showToast }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendGift = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/gifts/send-ritual`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({ recipientEmail: email, message })
            });
            const data = await response.json();
            if (response.ok) {
                showToast("Invitation Sent Successfully");
                setEmail(''); setMessage('');
            } else {
                showToast(data.message || "Error sending gift");
            }
        } catch (err) {
            showToast("Connection Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1A0A0A] p-8 rounded-[2rem] border border-[#3E2723]/5 shadow-xl">
            <h3 className="text-2xl font-playfair mb-6 flex items-center gap-3">
                <Gift className="text-[#D4AF37]" size={24} /> Share the Ritual
            </h3>
            <form onSubmit={handleSendGift} className="space-y-4">
                <input 
                    type="email" placeholder="Recipient's Email" required
                    className="w-full bg-transparent border-b border-[#3E2723]/10 py-3 outline-none focus:border-[#D4AF37] dark:text-white"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
                <textarea 
                    placeholder="A personal message for their journey..."
                    className="w-full bg-transparent border border-[#3E2723]/10 p-4 rounded-xl outline-none focus:border-[#D4AF37] h-32 dark:text-white resize-none"
                    value={message} onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                    disabled={loading}
                    className="w-full py-4 bg-[#3E2723] dark:bg-velvet-oxblood text-white rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-[#D4AF37] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {loading ? "Sending..." : <><Send size={14}/> Dispatch Invite</>}
                </button>
            </form>
        </div>
    );
};

export default GiftRitual;