import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  GraduationCap,
  Music,
  Globe,
  PartyPopper,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import img1 from "../assets/EventType/img1.avif";
import img2 from "../assets/EventType/img2.avif";
import img3 from "../assets/EventType/img3.avif";
import img4 from "../assets/EventType/img4.avif";
import img5 from "../assets/EventType/img5.avif";
import img6 from "../assets/EventType/img6.jpg";

const EventTypesSection = () => {
  // Default to the first item being active
  const [activeId, setActiveId] = useState(1);

  const eventTypes = [
    {
      id: 1,
      title: "Corporate",
      subtitle: "Strategy",
      description: "Networking summits, product launches, and high-stakes meetings.",
      icon: Building2,
      image: img1,
      color: "bg-blue-600",
    },
    {
      id: 2,
      title: "Social",
      subtitle: "Celebration",
      description: "Weddings, anniversaries, and grand social gatherings.",
      icon: Users,
      image: img2,
      color: "bg-emerald-600",
    },
    {
      id: 3,
      title: "Academic",
      subtitle: "Knowledge",
      description: "Graduations, science fairs, and educational showcases.",
      icon: GraduationCap,
      image: img3,
      color: "bg-violet-600",
    },
    {
      id: 4,
      title: "Entertainment",
      subtitle: "Spectacle",
      description: "Concerts, award nights, and immersive live performances.",
      icon: Music,
      image: img4,
      color: "bg-pink-600",
    },
    {
      id: 5,
      title: "Culture",
      subtitle: "Heritage",
      description: "Festivals and expos that celebrate tradition and community.",
      icon: Globe,
      image: img5,
      color: "bg-amber-600",
    },
    {
      id: 6,
      title: "Seasonal",
      subtitle: "Festivity",
      description: "Holiday galas and seasonal parties that bring cheer.",
      icon: PartyPopper,
      image: img6,
      color: "bg-red-600",
    },
  ];

  return (
    <section className="bg-white font-sans text-slate-900 py-24 relative overflow-hidden selection:bg-slate-900 selection:text-white">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl opacity-50"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider mb-6 shadow-xl shadow-slate-200"
            >
                <Sparkles className="w-3 h-3" /> Our Expertise
            </motion.div>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6"
            >
                Crafting experiences <br/> for every occasion.
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-500 font-medium"
            >
                Explore our specialized event categories tailored to your needs.
            </motion.p>
        </div>

        {/* --- Horizontal Accordion Gallery --- */}
        <div className="flex flex-col lg:flex-row gap-4 h-[800px] lg:h-[500px] w-full">
            {eventTypes.map((event) => {
                const isActive = activeId === event.id;
                return (
                    <motion.div
                        key={event.id}
                        layout
                        onClick={() => setActiveId(event.id)}
                        onHoverStart={() => setActiveId(event.id)}
                        className={`
                            relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                            ${isActive ? 'lg:flex-[3.5] flex-[3]' : 'lg:flex-[0.5] flex-[1]'}
                            group
                        `}
                    >
                        {/* Background Image */}
                        <img 
                            src={event.image} 
                            alt={event.title} 
                            className={`
                                absolute inset-0 w-full h-full object-cover transition-transform duration-700
                                ${isActive ? 'scale-100' : 'scale-125 grayscale group-hover:grayscale-0'}
                            `}
                        />
                        
                        {/* Dark Overlay */}
                        <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-black/40' : 'bg-black/60 group-hover:bg-black/50'}`} />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end text-white">
                            
                            {/* Inactive State: Vertical Text (Desktop) / Minimal (Mobile) */}
                            {!isActive && (
                                <div className="absolute inset-0 flex items-center justify-center lg:rotate-[-90deg] opacity-80 group-hover:opacity-100 transition-opacity">
                                    <span className="text-xl lg:text-2xl font-bold tracking-widest uppercase whitespace-nowrap">
                                        {event.title}
                                    </span>
                                </div>
                            )}

                            {/* Active State: Full Content */}
                            <div className={`transition-all duration-500 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 hidden'}`}>
                                <div className={`w-12 h-12 rounded-2xl ${event.color} flex items-center justify-center mb-6 shadow-lg`}>
                                    <event.icon className="w-6 h-6 text-white" />
                                </div>
                                
                                <h3 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                                    {event.title}
                                </h3>
                                
                                <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-md mb-6">
                                    {event.description}
                                </p>

                                <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest group-hover:gap-4 transition-all">
                                    Explore <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Active Indicator (Optional for clarity on small screens) */}
                        {isActive && (
                            <div className={`absolute top-0 left-0 w-full h-1 ${event.color} lg:hidden`} />
                        )}
                        
                    </motion.div>
                );
            })}
        </div>

      </div>
    </section>
  );
};

export default EventTypesSection;