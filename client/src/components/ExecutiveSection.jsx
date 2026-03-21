import { Crown, ShieldCheck, Star, Zap, Gem, Trophy } from 'lucide-react';

const ExecutiveSection = ({ isMember }) => {
  const benefits = [
    { icon: <Star size={18} />, title: "Priority Sourcing", desc: "Access to limited micro-lots and rare beans" },
    { icon: <Zap size={18} />, title: "Express Rituals", desc: "Complimentary priority shipping on all orders" },
    { icon: <Gem size={18} />, title: "Early Access", desc: "Access seasonal blends before public release" },
    { icon: <Trophy size={18} />, title: "Concierge Support", desc: "24/7 dedicated ritual assistance" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`p-10 rounded-[3rem] border relative overflow-hidden shadow-2xl transition-all duration-1000 ${
        isMember 
        ? 'border-[#D4AF37]/30 bg-[#1A0A0A]' 
        : 'border-[#3E2723]/10 bg-white dark:bg-[#1A0A0A]'
      }`}>
        
        {/* Shimmer Effect for Members */}
        {isMember && <div className="absolute inset-0 gift-toast-shimmer opacity-20 pointer-events-none" />}

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-12">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all ${
                isMember ? 'bg-[#D4AF37] rotate-6' : 'bg-[#3E2723]/5'
              }`}>
                <Crown size={32} className={isMember ? 'text-[#1A0A0A]' : 'text-[#3E2723]/20'} />
              </div>
              <div>
                <h2 className={`text-3xl font-playfair font-bold ${isMember ? 'text-white' : 'text-[#3E2723] dark:text-white'}`}>
                  {isMember ? "Executive Tier" : "Standard Access"}
                </h2>
                <p className={`text-[10px] uppercase tracking-[0.3em] font-black ${isMember ? 'text-[#D4AF37]' : 'text-[#3E2723]/40'}`}>
                  {isMember ? "Identity Verified • Active" : "Membership Inactive"}
                </p>
              </div>
            </div>
            {isMember && <ShieldCheck className="text-[#D4AF37]" size={40} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border transition-all hover:scale-[1.02] ${
                isMember 
                ? 'bg-white/5 border-white/10' 
                : 'bg-[#3E2723]/5 border-transparent'
              }`}>
                <div className={`mb-4 ${isMember ? 'text-[#D4AF37]' : 'text-[#3E2723]/40'}`}>
                  {benefit.icon}
                </div>
                <h4 className={`text-[11px] uppercase tracking-widest font-bold mb-2 ${isMember ? 'text-white' : 'text-[#3E2723]'}`}>
                  {benefit.title}
                </h4>
                <p className={`text-xs italic leading-relaxed ${isMember ? 'text-white/40' : 'text-[#3E2723]/60'}`}>
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>

          {!isMember && (
            <button className="w-full mt-10 py-5 bg-[#3E2723] text-white rounded-[2rem] text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-[#D4AF37] transition-all">
              Upgrade to Executive Tier
            </button>
          )}
        </div>

        {/* Decorative Background for Members */}
        {isMember && (
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px]" />
        )}
      </div>
    </div>
  );
};

export default ExecutiveSection;