import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Coffee, ChevronLeft, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rituals/${id}`);
        const data = await res.json();
        setProduct(data.product);
        setRelated(data.related); // Assumes backend sends items with same roast preference
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  /**
   * UPDATED: handleBuyNow
   * Instead of just adding to cart, we pass the item directly 
   * to checkout via location state to bypass the global cart if desired.
   */
  const handleBuyNow = () => {
    navigate('/checkout', { 
      state: { 
        directBuyItem: { 
          ...product, 
          quantity: 1 
        } 
      } 
    });
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] dark:bg-velvet-bean">
        <Coffee className="animate-spin text-[#D4AF37]" size={32} />
      </div>
    );
  }

  return (
    <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <button 
        onClick={() => navigate('/menu')} 
        className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#3E2723]/40 dark:text-white/30 hover:text-[#D4AF37] mb-16 transition-all"
      >
        <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-2" /> 
        Return to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-40">
        {/* LARGE PRODUCT IMAGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="aspect-[4/5] rounded-[4rem] overflow-hidden bg-[#3E2723]/5 dark:bg-white/5 shadow-2xl relative"
        >
          <img 
            src={`http://localhost:5000/uploads/${product.image_url}`} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
          {product.visibility === 'vault' && (
            <div className="absolute top-10 left-10 bg-[#D4AF37] text-[#1A0A0A] px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              Vault Exclusive
            </div>
          )}
        </motion.div>

        {/* PRODUCT DETAILS */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
             <span className="text-[12px] font-black text-[#D4AF37] uppercase tracking-[0.5em]">{product.preference} Roast</span>
             <div className="h-px w-12 bg-[#D4AF37]/30" />
          </div>

          <h1 className="text-6xl md:text-7xl font-playfair font-bold text-[#3E2723] dark:text-white mb-8 leading-tight">
            {product.name}
          </h1>

          <p className="text-xl text-[#3E2723]/60 dark:text-white/60 leading-relaxed mb-12 font-medium">
            {product.description || "An artisanal ritual crafted for those who seek the extraordinary in every cup."}
          </p>
          
          <div className="flex items-baseline gap-4 mb-16">
            <span className="text-5xl font-mono font-bold text-[#3E2723] dark:text-white">${product.price}</span>
            <span className="text-[10px] uppercase tracking-widest text-[#3E2723]/30 dark:text-white/20 font-bold">Includes complimentary brewing guide</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => addToCart(product)}
              className="group flex-1 bg-transparent border-2 border-[#3E2723] dark:border-white/10 text-[#3E2723] dark:text-white py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-[#3E2723] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-3"
            >
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-[#D4AF37] text-[#1A0A0A] py-6 rounded-full font-black uppercase tracking-widest text-[11px] hover:shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              Buy Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS (ROAST MATCH) */}
      <section className="border-t border-[#3E2723]/5 dark:border-white/5 pt-20">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-playfair font-bold text-[#3E2723] dark:text-white">The {product.preference} Lineage</h2>
            <p className="text-[#D4AF37] text-[10px] uppercase font-black tracking-[0.3em] mt-3">Discover similar aromatic profiles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {related.length > 0 ? related.map((item) => (
            <Link key={item.id} to={`/ritual/${item.id}`} className="group block">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-[#3E2723]/5 dark:bg-white/5 mb-6 shadow-sm group-hover:shadow-xl transition-all">
                <img 
                  src={`http://localhost:5000/uploads/${item.image_url}`} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <h4 className="font-bold text-xl text-[#3E2723] dark:text-white group-hover:text-[#D4AF37] transition-colors">{item.name}</h4>
              <p className="text-sm font-mono text-[#3E2723]/40 dark:text-white/30 mt-1">${item.price}</p>
            </Link>
          )) : (
            <p className="text-xs italic text-[#3E2723]/30">Exploring more rituals like this...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;