import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Minus, HelpCircle, Sparkles, 
  ArrowRight, Zap, ShieldCheck, Gift, Utensils 
} from 'lucide-react';

const FAQSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(1); 

  const faqData = [
    {
      id: 1,
      question: "How does event registration work?",
      answer: "Our registration process is streamlined for speed. Participants access a branded portal, fill out a custom form, and receive an instant QR-coded digital pass via email and SMS.",
      category: "Registration",
      icon: Zap
    },
    {
      id: 2,
      question: "Can participants register on-site?",
      answer: "Yes. Our 'Kiosk Mode' allows for rapid on-the-spot registrations. Walk-ins can scan a QR code, register in seconds, and get their badge printed instantly.",
      category: "Registration",
      icon: ShieldCheck
    },
    {
      id: 3,
      question: "How do I manage food counters?",
      answer: "We track dietary preferences at registration. The dashboard allocates distinct counters for Veg/Non-Veg and monitors consumption live to prevent wastage.",
      category: "Food",
      icon: Utensils
    },
    {
      id: 4,
      question: "Is the lucky draw fair?",
      answer: "Absolutely. We use a cryptographically secure random number generator. The selection logic is transparent and logs every draw for audit purposes.",
      category: "Lucky Draw",
      icon: Gift
    },
    {
      id: 5,
      question: "What payment gateways are supported?",
      answer: "We integrate natively with Stripe, Razorpay, and PayPal, allowing you to accept payments in 135+ currencies securely.",
      category: "Payments",
      icon: ShieldCheck
    }
  ];

  const handleToggle = (id) => {
    setActiveQuestion(activeQuestion === id ? null : id);
  };

  return (
    <section className="bg-white font-sans text-slate-900 py-16 md:py-24 px-4 sm:px-6 lg:px-12 selection:bg-blue-100 selection:text-blue-900 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header (Centered on Mobile, Left/Bottom Aligned on Desktop) --- */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-20 gap-6 md:gap-8 text-center md:text-left">
            <div className="max-w-2xl">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 md:mb-6 mx-auto md:mx-0"
                >
                    <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5" /> Knowledge Base
                </motion.div>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.9]"
                >
                    Common <br/> Queries.
                </motion.h2>
            </div>
            
            <div className="hidden md:block pb-2">
                <a href="#" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group cursor-pointer">
                    View full documentation 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </div>

        {/* --- Master-Detail Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-24 relative">
            
            {/* LEFT: Questions List */}
            <div className="lg:col-span-5 flex flex-col gap-3 md:gap-4">
                {faqData.map((item) => {
                    const isActive = activeQuestion === item.id;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onClick={() => handleToggle(item.id)}
                            className={`
                                group relative p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 border
                                ${isActive 
                                    ? 'bg-slate-900 border-slate-900 shadow-xl lg:scale-[1.02] z-10' 
                                    : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/30'}
                            `}
                        >
                            <div className="flex items-start md:items-center justify-between gap-4">
                                <h3 className={`text-base md:text-lg font-bold leading-tight transition-colors text-left ${isActive ? 'text-white' : 'text-slate-900'}`}>
                                    {item.question}
                                </h3>
                                <div className={`
                                    flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-colors mt-0.5 md:mt-0
                                    ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}
                                `}>
                                    {isActive ? <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                                </div>
                            </div>

                            {/* MOBILE ONLY: Accordion Content */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="lg:hidden overflow-hidden"
                                    >
                                        <div className="pt-4 mt-4 border-t border-white/10">
                                            <p className="text-slate-400 text-sm leading-relaxed text-left">
                                                {item.answer}
                                            </p>
                                            <div className="mt-4 flex items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Category:</span>
                                                <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded">{item.category}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* RIGHT: Detail Card (Hidden on Mobile, Visible on Desktop) */}
            <div className="hidden lg:col-span-7 lg:block relative">
                <div className="sticky top-32">
                    <AnimatePresence mode='wait'>
                        {faqData.map((item) => (
                            activeQuestion === item.id && (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                    transition={{ duration: 0.4, ease: "circOut" }}
                                    className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-12 h-[500px] flex flex-col justify-between shadow-2xl shadow-slate-200/50 overflow-hidden relative"
                                >
                                    {/* Abstract Background Decoration */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-[80px] opacity-60 pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8">
                                            <item.icon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        
                                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4 block">
                                            {item.category}
                                        </span>
                                        
                                        <h3 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                                            {item.question}
                                        </h3>
                                        
                                        <p className="text-xl text-slate-500 leading-relaxed font-medium">
                                            {item.answer}
                                        </p>
                                    </div>

                                    {/* --- Footer with Images --- */}
                                    <div className="relative z-10 pt-8 border-t border-slate-200 mt-auto flex items-center justify-between">
                                        <div className="flex -space-x-3">
                                            <img 
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" 
                                                alt="Support Team" 
                                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                            />
                                            <img 
                                                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" 
                                                alt="Support Team" 
                                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                            />
                                            <img 
                                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64" 
                                                alt="Support Team" 
                                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                            />
                                        </div>
                                        <button className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                                            Was this helpful?
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        ))}
                    </AnimatePresence>
                    
                    {/* Placeholder when nothing active */}
                    {!activeQuestion && (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 h-[500px] flex flex-col items-center justify-center text-center">
                            <HelpCircle className="w-16 h-16 text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">Select a question</h3>
                            <p className="text-slate-400">Click on any question on the left to view details.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>

        {/* --- Mobile Footer Link --- */}
        <div className="mt-12 md:hidden text-center">
             <a href="#" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                View full documentation 
                <ArrowRight className="w-4 h-4" />
            </a>
        </div>

      </div>
    </section>
  );
};

export default FAQSection;