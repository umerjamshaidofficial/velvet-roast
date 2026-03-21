import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

const MemberBadge = ({ variant = "default" }) => {
  const isLarge = variant === "large";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        relative overflow-hidden flex items-center justify-center gap-2 
        bg-gradient-to-br from-[#D4AF37] via-[#FBF4D9] to-[#B8860B]
        text-[#1A0A0A] font-bold uppercase tracking-[0.2em]
        shadow-[0_10px_20px_rgba(212,175,55,0.2)]
        ${isLarge ? 'px-6 py-3 rounded-2xl text-[10px]' : 'px-3 py-1 rounded-full text-[7px]'}
      `}
    >
      <motion.div
        animate={{ 
          x: ['-100%', '200%'],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "linear",
          repeatDelay: 2
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/2 -skew-x-12"
      />

      {isLarge ? <Crown size={14} /> : <Sparkles size={10} />}
      
      <span className="relative z-10">
        Executive
      </span>
    </motion.div>
  );
};

export default MemberBadge;