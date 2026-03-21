import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-[#FDFCF8] dark:bg-[#1A0A0A]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-[#3E2723] dark:bg-[#2A1515] rounded-[3rem] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-5" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Info Side */}
            <div className="p-12 lg:p-20 space-y-12 relative z-10">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white leading-tight">
                Connect with the <br /> <span className="text-[#D4AF37] italic">Roastery</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#D4AF37]/20 transition-all">
                    <Mail className="text-[#D4AF37]" size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Email Us</p>
                    <p className="text-white text-lg font-playfair">hello@velvetroast.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#D4AF37]/20 transition-all">
                    <MapPin className="text-[#D4AF37]" size={20} />
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Visit Us</p>
                    <p className="text-white text-lg font-playfair">Artisan Alley, Coffee District</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Form Side */}
            <div className="bg-white/5 p-12 lg:p-20 backdrop-blur-sm relative z-10">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#D4AF37] transition-all text-sm" />
                  <input type="text" placeholder="Last Name" className="bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#D4AF37] transition-all text-sm" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#D4AF37] transition-all text-sm" />
                <textarea placeholder="Your Message" className="w-full bg-transparent border-b border-white/10 py-3 text-white outline-none focus:border-[#D4AF37] transition-all text-sm h-32 resize-none" />
                
                <button className="w-full bg-[#D4AF37] text-[#1A0A0A] py-4 rounded-xl text-[10px] uppercase font-bold tracking-[0.3em] hover:scale-[1.02] transition-all duration-500">
                  Send Ritual Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;