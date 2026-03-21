import React from 'react';
import { motion } from 'framer-motion';
import GiftRitual from '../components/GiftRitual';
import { useCart } from '../context/CartContext';

const SendGift = () => {
    const { showToast } = useCart();

    return (
        <section className="bg-[#FDFCF8] dark:bg-velvet-bean min-h-screen pt-40 pb-20 px-6">
            <div className="container mx-auto max-w-3xl">
                <header className="text-center mb-16">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-playfair text-[#3E2723] dark:text-white mb-4"
                    >
                        Share the Sanctuary
                    </motion.h1>
                    <p className="text-sm text-[#3E2723]/60 uppercase tracking-widest">Send a digital ritual to a fellow soul</p>
                </header>

                <GiftRitual showToast={showToast} />
            </div>
        </section>
    );
};

export default SendGift;