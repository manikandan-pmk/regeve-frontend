import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Utensils,
  Gift,
  Trophy,
  BarChart3,
  Package,
  Vote,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  LayoutTemplate
} from "lucide-react";

const EventFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      title: "Registration",
      description: "Seamless entry management.",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-600 to-cyan-500",
      details: ["Custom Forms", "QR Check-in", "Auto-Emails"],
    },
    {
      id: 1,
      title: "Food Counters",
      description: "Smart dietary tracking.",
      icon: Utensils,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      gradient: "from-emerald-500 to-teal-500",
      details: ["Veg/Non-Veg", "Consumption Stats", "Waste Control"],
    },
    {
      id: 2,
      title: "Lucky Draw",
      description: "Live interactive spins.",
      icon: Gift,
      color: "text-violet-600",
      bg: "bg-violet-50",
      gradient: "from-violet-600 to-fuchsia-500",
      details: ["Live Wheel", "Fair Algorithms", "Instant Winners"],
    },
    {
      id: 3,
      title: "Winners Board",
      description: "Real-time celebration.",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
      gradient: "from-amber-500 to-orange-500",
      details: ["Live Updates", "Confetti Effects", "TV Mode"],
    },
    {
      id: 4,
      title: "Analytics",
      description: "Data-driven insights.",
      icon: BarChart3,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      gradient: "from-indigo-600 to-blue-500",
      details: ["Attendance Graph", "Peak Times", "Export Data"],
    },
    {
      id: 5,
      title: "Gifting",
      description: "Inventory tracking.",
      icon: Package,
      color: "text-rose-600",
      bg: "bg-rose-50",
      gradient: "from-rose-500 to-pink-500",
      details: ["Stock Levels", "Digital Receipts", "Claim Status"],
    },
    {
      id: 6,
      title: "Voting",
      description: "Secure elections.",
      icon: Vote,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      gradient: "from-cyan-600 to-blue-500",
      details: ["Secure Auth", "Live Results", "Audit Trail"],
    },
  ];

  return (
    <div className="bg-white font-sans text-slate-900 overflow-hidden relative selection:bg-slate-900 selection:text-white">
      
      {/* --- Decorative Background Text --- */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] z-0">
        <h1 className="text-[18vw] font-black leading-none text-slate-900 whitespace-nowrap -ml-10 select-none">
          FEATURES
        </h1>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pt-32 pb-24 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
          
          {/* --- LEFT PANEL: Sticky Navigation (Dark Theme) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-5/12 lg:sticky lg:top-32 bg-slate-950 text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col"
          >
            {/* Background Blob */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="mb-10 relative z-10">
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-6 border border-blue-400/20 px-3 py-1 rounded-full bg-blue-400/10">
                <LayoutTemplate className="w-3 h-3" /> Core Modules
              </div>
              <h2 className="text-4xl font-bold leading-tight mb-4 tracking-tight">
                Everything you need <br/> to run the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">perfect event.</span>
              </h2>
            </div>

            {/* Scrollable List for Mobile / Static for Desktop */}
            <div className="flex-grow space-y-3 overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {features.map((feature, index) => {
                const isActive = activeFeature === index;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(index)}
                    className={`
                      w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-left border cursor-pointer
                      ${isActive 
                        ? 'bg-white/10 border-white/20 shadow-lg backdrop-blur-sm' 
                        : 'bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-white'}
                    `}
                  >
                    <feature.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <div>
                      <span className={`block font-bold text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {feature.title}
                      </span>
                      {isActive && <span className="text-xs text-blue-300 block mt-0.5">{feature.description}</span>}
                    </div>
                    {isActive && <ArrowRight className="w-4 h-4 ml-auto text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* --- RIGHT PANEL: Dynamic Content (Light Theme) --- */}
          <div className="lg:w-7/12 w-full lg:sticky lg:top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-full min-h-[600px]"
              >
                
                {/* 1. Visual Header */}
                <div className={`relative h-72 w-full bg-gradient-to-br ${features[activeFeature].gradient} p-10 flex flex-col justify-end overflow-hidden`}>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)] [background-size:24px_24px]"></div>
                    
                    {/* Floating Giant Icon */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: 10, y: 50 }}
                        animate={{ opacity: 0.2, scale: 1, rotate: 0, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="absolute -bottom-10 -right-10"
                    >
                        {React.createElement(features[activeFeature].icon, { className: "w-80 h-80 text-white" })}
                    </motion.div>

                    {/* Title */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative z-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
                            Feature Highlight
                        </div>
                        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                            {features[activeFeature].title}
                        </h2>
                    </motion.div>
                </div>

                {/* 2. Content Body */}
                <div className="p-10 flex flex-col flex-grow">
                    
                    <p className="text-xl text-slate-600 leading-relaxed mb-10 font-medium">
                        {features[activeFeature].description} Our system ensures a smooth experience, allowing you to focus on the event while we handle the data.
                    </p>

                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" /> Key Capabilities
                    </h3>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
                        {features[activeFeature].details.map((detail, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (index * 0.1) }}
                                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-slate-200 hover:bg-white hover:shadow-md transition-all duration-300"
                            >
                                <div className={`p-2 rounded-xl bg-white shadow-sm ${features[activeFeature].color}`}>
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">{detail}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* 3. Footer / Progress */}
                    <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-slate-400 font-mono">
                            <span>0{activeFeature + 1}</span>
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                    layoutId="progressBar"
                                    className={`h-full bg-gradient-to-r ${features[activeFeature].gradient}`}
                                />
                            </div>
                            <span>0{features.length}</span>
                        </div>

                        <button className="flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer group">
                            Learn More 
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventFeatures;