import { motion } from 'framer-motion';
import { Coffee, Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { BASE_URL } from '../api/config';

const Footer = () => {
  const navigate = useNavigate();

  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <footer className="bg-[#FDFCF8] dark:bg-velvet-bean pt-24 pb-12 px-6 border-t border-[#3E2723]/5 dark:border-white/5 transition-colors duration-700">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-8 group cursor-pointer">
              <div className="p-2 bg-[#8C6A5E]/10 dark:bg-velvet-oxblood/20 rounded-lg transition-all duration-500">
                <Coffee className="text-[#8C6A5E] dark:text-velvet-cinnamon" size={20} />
              </div>
              <span className="font-playfair font-bold text-2xl text-[#3E2723] dark:text-white tracking-tight">Velvet.</span>
            </Link>
            <p className="text-[#3E2723]/60 dark:text-white/40 text-xs leading-relaxed font-inter uppercase tracking-widest">
              Crafting a ritual out of your morning routine with ethically sourced, precision-roasted beans.
            </p>
          </div>

          <div>
            <h4 className="text-[#3E2723] dark:text-white font-playfair text-lg mb-8">The Experience</h4>
            <ul className="space-y-4">
              <li>
                <a href="#menu" onClick={(e) => handleScroll(e, 'menu')} className="text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  Collection
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  About the Ritual
                </a>
              </li>
              <li>
                <Link to="/menu" className="text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  Full Menu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#3E2723] dark:text-white font-playfair text-lg mb-8">Support</h4>
            <ul className="space-y-4">
              <li>
                <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/my-orders" className="text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/received-rituals" className="text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon text-[10px] uppercase tracking-[0.2em] font-bold transition-colors">
                  Gift Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-[#3E2723] dark:text-white font-playfair text-lg mb-8">Join the Ritual</h4>
            <div className="relative">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS"
                className="w-full bg-[#3E2723]/5 dark:bg-white/5 border-b border-[#3E2723]/10 dark:border-white/10 py-4 px-2 text-[10px] uppercase tracking-widest focus:outline-none focus:border-[#D4AF37] dark:focus:border-velvet-oxblood transition-colors dark:text-white placeholder:text-[#3E2723]/20 dark:placeholder:text-white/10"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3E2723]/40 dark:text-white/40 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon transition-colors">
                <ArrowRight size={18} />
              </button>
            </div>
            <p className="mt-6 text-[8px] uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20 font-bold leading-loose">
              Receive brewing guides and exclusive drops in your inbox.
            </p>
          </div>
        </div>

        <div className="pt-12 border-t border-[#3E2723]/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <Instagram size={16} className="text-[#3E2723]/30 dark:text-white/20 hover:text-velvet-oxblood cursor-pointer transition-colors" />
            <Facebook size={16} className="text-[#3E2723]/30 dark:text-white/20 hover:text-velvet-oxblood cursor-pointer transition-colors" />
            <Twitter size={16} className="text-[#3E2723]/30 dark:text-white/20 hover:text-velvet-oxblood cursor-pointer transition-colors" />
          </div>
          
          <div className="flex gap-10 text-[8px] uppercase tracking-[0.3em] font-bold text-[#3E2723]/20 dark:text-white/10">
            <span>© 2026 VELVET COFFEE ROASTERS</span>
            <a href="#" className="hover:text-[#3E2723] dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#3E2723] dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;