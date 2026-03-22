import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Flame, Zap } from 'lucide-react';
import { BASE_URL } from '../api/config';

const Process = () => {
  // Maintaining your exact default structure as initial state
  const [steps, setSteps] = useState([
    { 
      icon: <Leaf size={24} />, 
      title: "Ethical Sourcing", 
      desc: "Direct partnerships with local farmers to ensure 100% sustainable, hand-picked Arabica beans." 
    },
    { 
      icon: <Flame size={24} />, 
      title: "Precision Roast", 
      desc: "Roasted in small batches to extract deep, velvety notes of chocolate and toasted oak." 
    },
    { 
      icon: <Zap size={24} />, 
      title: "Peak Aroma", 
      desc: "Vacuum-sealed at the height of freshness and delivered within 48 hours of roasting." 
    }
  ]);

  // Focused BASE_URL update to fetch content from the sanctuary server
  useEffect(() => {
    const fetchProcessSteps = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/content/process-steps`);
        if (response.ok) {
          const data = await response.json();
          // Mapping icons back to the Lucide components if data comes from DB
          const iconMap = { Leaf: <Leaf size={24} />, Flame: <Flame size={24} />, Zap: <Zap size={24} /> };
          const formattedData = data.map(step => ({
            ...step,
            icon: iconMap[step.iconName] || <Leaf size={24} />
          }));
          setSteps(formattedData);
        }
      } catch (error) {
        console.error("Connection to sanctuary content failed, using defaults", error);
      }
    };

    fetchProcessSteps();
  }, []);

  return (
    <section id="process" className="relative bg-[#FDFCF8] dark:bg-velvet-bean py-32 px-6 overflow-hidden transition-colors duration-700">
      
      {/* Decorative Gradient Glow - The "Craving" Element */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-velvet-oxblood/10 blur-[120px] rounded-full opacity-0 dark:opacity-100 transition-opacity duration-1000" />

      {/* Subtle separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-[#3E2723]/5 dark:bg-white/5" />

      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              {/* Icon Container: Shifts to Oxblood/Cinnamon in Dark Mode */}
              <div className="text-[#8C6A5E] dark:text-velvet-cinnamon mb-8 p-5 w-fit rounded-2xl bg-[#3E2723]/5 dark:bg-velvet-oxblood/20 border border-[#3E2723]/5 dark:border-white/5 group-hover:bg-[#D4AF37] dark:group-hover:bg-velvet-oxblood group-hover:text-white transition-all duration-500 group-hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)] dark:group-hover:shadow-[0_20px_40px_rgba(74,14,14,0.4)]">
                {step.icon}
              </div>
              
              <h3 className="text-[#3E2723] dark:text-white font-playfair text-2xl mb-4 tracking-tight">
                {step.title}
              </h3>
              
              <p className="text-[#3E2723]/50 dark:text-white/40 text-sm font-inter leading-relaxed tracking-wide">
                {step.desc}
              </p>
              
              {/* Animated Underline: Gold in Light, Cinnamon in Dark */}
              <div className="mt-8 h-[1px] w-0 bg-[#D4AF37]/40 dark:bg-velvet-cinnamon/40 group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;