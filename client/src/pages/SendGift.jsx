import React from 'react';
import { motion } from 'framer-motion';
import GiftRitual from '../components/GiftRitual';
import { useCart } from '../context/CartContext';

const SendGift = () => {
    const { showToast } = useCart();

    return (
        <section className="bg-[#FDFCF8] dark:bg-velvet-bean min-h-screen pt-40 pb-20 px-6 transition-colors duration-700">
            <div className="container mx-auto max-w-3xl">
                <header className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-playfair font-bold text-[#3E2723] dark:text-white mb-6"
                    >
                        Share the <span className="italic text-[#D4AF37]">Sanctuary</span>
                    </motion.h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-8 bg-[#D4AF37]/30" />
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-[#3E2723]/40 dark:text-white/30">
                            Send a digital ritual to a fellow soul
                        </p>
                        <div className="h-[1px] w-8 bg-[#D4AF37]/30" />
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <GiftRitual showToast={showToast} />
                </motion.div>
            </div>
        </section>
    );
};

export default SendGift;