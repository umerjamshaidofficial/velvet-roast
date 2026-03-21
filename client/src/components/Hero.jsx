import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // CE: Increased initial offset to '70px' to ensure it doesn't touch the fixed Nav bar.
  // Original was: [0, -150]. Now it starts much lower and floats up less aggressively.
  const yImage = useTransform(scrollYProgress, [0, 1], [70, -100]);
  const rotateImage = useTransform(scrollYProgress, [0, 1], [0, 10]);

  return (
    // Background: Transitions from Cream to Deep Roasted Bean
    <section ref={containerRef} className="relative h-screen flex items-center justify-center bg-[#FDFCF8] dark:bg-velvet-bean transition-colors duration-700 overflow-hidden py-12 px-6">
      
      {/* Background Glow: Warm Gold in Light, Deep Oxblood in Dark */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 dark:bg-velvet-oxblood/20 rounded-full blur-[120px] z-0 transition-colors duration-1000" />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 max-w-6xl">
        
        {/* TEXT CONTENT */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 text-[#3E2723] dark:text-white/90 mt-12"
        >
          <div className="flex items-center gap-4 mb-10 mt-8"> 
            <span className="h-[1px] w-12 bg-[#D4AF37] dark:bg-velvet-cinnamon" />
            <span className="text-[#8C6A5E] dark:text-velvet-cinnamon text-[9px] uppercase tracking-[0.6em] font-bold">Premium Origin</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-playfair leading-[1.1] mb-6 tracking-tight text-[#3E2723] dark:text-white">
            The Sophistication of <br />
            {/* Gradient: Swaps to a "Craving" Cinnamon-Red in Dark Mode */}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#8C6A5E] to-[#D4AF37] dark:from-velvet-oxblood dark:to-velvet-cinnamon">
              Darker Blends
            </span>
          </h1>

          <p className="text-[#3E2723]/60 dark:text-white/40 text-[13px] font-inter leading-relaxed max-w-sm mb-10 tracking-wide">
            We don't just brew coffee; we craft an atmosphere. Experience a 
            curated ritual designed for the modern palate that appreciates 
            true depth in every drop.
          </p>

          <div className="flex flex-wrap gap-8 items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/menu')}
              className="px-8 py-4 border border-[#3E2723]/20 dark:border-white/10 rounded-full text-[9px] uppercase tracking-[0.3em] font-bold transition-all duration-500 text-[#3E2723] dark:text-white hover:bg-[#D4AF37] dark:hover:bg-velvet-oxblood hover:text-white"
            >
              Explore Collection
            </motion.button>
          </div>
        </motion.div>

        {/* FLOATING VISUALS */}
        <div className="lg:col-span-7 relative flex justify-center lg:justify-end mt-16">
          
          <motion.div 
            style={{ y: yImage, rotate: rotateImage }}
            className="relative w-full max-w-[420px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_50px_60px_rgba(62,39,35,0.1)] dark:shadow-[0_50px_60px_rgba(0,0,0,0.5)] border border-[#3E2723]/5 dark:border-white/5"
          >
            <img 
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=1974&auto=format&fit=crop" 
              alt="Coffee Pour" 
              className="w-full h-full object-cover transition-all duration-1000 scale-110 brightness-90 dark:brightness-75"
            />
            
            {/* Glassmorphism Detail */}
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute top-10 -right-8 bg-white/80 dark:bg-velvet-bean/80 backdrop-blur-2xl border border-white dark:border-white/10 p-6 rounded-2xl hidden xl:block w-56 shadow-xl"
            >
              {/* Updated to font-inter for numeric alignment */}
              <div className="text-[#D4AF37] dark:text-velvet-cinnamon text-2xl font-inter font-medium mb-1">98%</div>
              <p className="text-[#3E2723]/40 dark:text-white/30 text-[8px] uppercase tracking-widest leading-loose">
                User Satisfaction in <br /> Smoothness & Aroma
              </p>
            </motion.div>
          </motion.div>

          {/* Decorative Warm Pulse: Glows Red/Brown in Dark Mode */}
          <div className="absolute -z-10 w-[110%] h-[110%] bg-gradient-to-tr from-[#8C6A5E]/10 dark:from-velvet-oxblood/20 to-transparent rounded-full blur-[100px] opacity-30 animate-pulse" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-[1px] h-10 bg-[#3E2723]/10 dark:bg-white/10" />
        <span className="text-[7px] uppercase tracking-[0.4em] text-[#3E2723]/30 dark:text-white/20">Scroll</span>
      </motion.div>
    </section>
  );
};

export default Hero;