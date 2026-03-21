import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowUpRight, Lock, Crown, Coffee } from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isMember } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rituals');
        const data = await response.json();
        // Take only the first three products added by admin
        setProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch gallery products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProducts();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center bg-[#FDFCF8] dark:bg-velvet-bean">
        <Coffee className="animate-spin text-[#D4AF37]" size={32} />
      </div>
    );
  }

  return (
    <section id="menu" className="bg-[#FDFCF8] dark:bg-velvet-bean py-32 px-6 transition-colors duration-700">
      <div className="container mx-auto max-w-6xl">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-[#D4AF37] dark:text-velvet-cinnamon text-[10px] uppercase tracking-[0.6em] font-bold mb-4">Our Gallery</h2>
            <h3 className="text-5xl font-playfair text-[#3E2723] dark:text-white leading-tight">
              Curated Blends for <br /> <span className="italic font-light opacity-60 dark:opacity-40">The Modern Palate</span>
            </h3>
          </div>
          <motion.button 
            whileHover={{ x: 10 }}
            onClick={() => navigate('/menu')}
            className="flex items-center gap-4 text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] dark:hover:text-velvet-cinnamon text-[10px] uppercase tracking-[0.4em] transition-colors font-bold"
          >
            View Full Collection <ArrowUpRight size={16} />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.map((product) => {
            const isLocked = product.visibility === 'vault' && !isMember;

            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative cursor-pointer"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-[#3E2723]/5 dark:border-white/5 bg-white dark:bg-[#1A0A0A] mb-6 shadow-[0_30px_60px_rgba(62,39,35,0.08)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
                  
                  {product.visibility === 'vault' && (
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-[#D4AF37] text-[#1A0A0A] px-4 py-1.5 rounded-full text-[8px] uppercase font-black tracking-widest shadow-lg">
                      <Crown size={10} /> The Vault
                    </div>
                  )}

                  <img 
                    src={`http://localhost:5000/uploads/${product.image_url}`} 
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-1000 
                      ${isLocked ? 'blur-xl grayscale' : 'group-hover:scale-105 brightness-100 dark:brightness-90 group-hover:brightness-110 dark:group-hover:brightness-100'}
                    `}
                  />
                  
                  <div className={`absolute inset-0 transition-all duration-500 flex flex-col justify-end p-8 
                    ${isLocked 
                      ? 'bg-black/40 backdrop-blur-sm opacity-100' 
                      : 'bg-gradient-to-t from-[#3E2723]/60 dark:from-velvet-oxblood/80 via-transparent to-transparent opacity-0 group-hover:opacity-100'
                    }
                  `}>
                    {isLocked ? (
                      <div className="text-center mb-4">
                        <Lock className="text-white mx-auto mb-3 opacity-80" size={24} />
                        <p className="text-white text-[9px] uppercase tracking-[0.2em] font-bold mb-4">Executive Membership </p>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/membership')}
                          className="w-full bg-white text-[#1A0A0A] py-4 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-xl hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                        >
                          Unlock the Vault
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                        className="w-full bg-[#D4AF37] dark:bg-velvet-oxblood text-white py-4 rounded-full flex items-center justify-center gap-3 text-[10px] uppercase font-bold tracking-widest shadow-xl hover:bg-white hover:text-[#3E2723] dark:hover:bg-velvet-cinnamon transition-all duration-300"
                      >
                        {product.visibility === 'vault' ? <Crown size={14} /> : <ShoppingBag size={14} />} 
                        {product.visibility === 'vault' ? 'Pro Access' : 'Add to Cart'}
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="px-1">
                  <span className="text-[8px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] mb-1 block">
                    {product.preference} Roast
                  </span>
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-xl font-playfair text-[#3E2723] dark:text-white">{product.name}</h4>
                    <span className="text-sm font-inter font-medium text-[#3E2723]/60 dark:text-white/50">
                      ${product.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Collection;