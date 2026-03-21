import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-24 bg-[#FDFCF8] dark:bg-[#1A0A0A] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Image Side with Decorative Frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-[#3E2723]/10">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80" 
                alt="Crafting Coffee" 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-[#D4AF37] p-8 rounded-2xl shadow-2xl hidden lg:block">
              <p className="text-white font-playfair italic text-xl">Est. 2026</p>
            </div>
          </motion.div>

          {/* Text Side */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold"
            >
              Our Philosophy
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-playfair font-bold text-[#3E2723] dark:text-white leading-tight"
            >
              Beyond the Cup, <br />
              <span className="italic text-[#D4AF37]">The Ritual.</span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#3E2723]/60 dark:text-white/40 leading-relaxed text-lg"
            >
              Velvet was born from the idea that coffee isn't just a drink—it's a moment of connection. Whether it's a quiet morning to yourself or a "Gift Ritual" sent to a loved one, we believe in the beauty of the pause.
            </motion.p>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <h4 className="font-playfair font-bold text-[#3E2723] dark:text-white text-xl">Ethically Sourced</h4>
                <p className="text-sm text-[#3E2723]/50 dark:text-white/30">Direct trade with growers.</p>
              </div>
              <div>
                <h4 className="font-playfair font-bold text-[#3E2723] dark:text-white text-xl">Artisan Roasted</h4>
                <p className="text-sm text-[#3E2723]/50 dark:text-white/30">Small batches only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;