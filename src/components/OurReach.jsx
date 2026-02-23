import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Users, ArrowUpRight, Globe, TrendingUp } from 'lucide-react';

import img1 from "../assets/OurReach/chennai.webp";
import img2 from "../assets/OurReach/Hyderabad.webp";
import img3 from "../assets/OurReach/bangalore.webp";
import img4 from "../assets/OurReach/coimbatore.webp";
import img5 from "../assets/OurReach/delhi.webp";
import img6 from "../assets/OurReach/goa.webp";
import img7 from "../assets/OurReach/kolkata.webp";
import img8 from "../assets/OurReach/mumbai.webp";

const OurReach = () => {

    // Removed 'size' property to keep everything uniform
    const cities = [
        { id: 1, name: 'Chennai', image: img1, },
        { id: 2, name: 'Mumbai', image: img8, },
        { id: 3, name: 'Delhi', image: img5, },
        { id: 4, name: 'Bangalore', image: img3, },
        { id: 5, name: 'Hyderabad', image: img2, },
        { id: 6, name: 'Goa', image: img6, },
        { id: 7, name: 'Coimbatore', image: img4, },
        { id: 8, name: 'Kolkata', image: img7, },
    ];

    const stats = [
        { number: '1,150+', label: 'Events Executed', icon: Calendar, color: 'bg-blue-50 text-blue-600' },
        { number: '8', label: 'Major Hubs', icon: MapPin, color: 'bg-indigo-50 text-indigo-600' },
        { number: '4.8', label: 'Client Rating', icon: Star, color: 'bg-amber-50 text-amber-600' },
        { number: '50k+', label: 'Happy Attendees', icon: Users, color: 'bg-emerald-50 text-emerald-600' }
    ];

    return (
        <section className="bg-white font-sans text-slate-900 py-16 md:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* --- 1. Centered Header Section --- */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 md:mb-6"
                    >
                        <Globe className="w-3 h-3" /> National Presence
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6"
                    >
                        OUR FOOTPRINT
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-lg leading-relaxed font-medium px-4"
                    >
                        From metropolises to emerging hubs, we deliver seamless on-ground execution across India's most vibrant cities.
                    </motion.p>
                </div>

                {/* --- 2. Stats Bar --- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 md:p-6 rounded-2xl border border-slate-100 bg-white hover:shadow-lg transition-shadow duration-300 group text-center"
                        >
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${stat.color} flex items-center justify-center mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
                            <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* --- 3. Uniform Grid (All Images Same Size) --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cities.map((city, index) => (
                        <motion.div
                            key={city.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative rounded-3xl overflow-hidden cursor-pointer aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            {/* Image Background */}
                            <img 
                                src={city.image} 
                                alt={city.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                                <div className="flex justify-end">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 transition-all duration-300">
                                        <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                </div>

                                <div>
                                    
                                    <h3 className="text-2xl font-bold text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{city.name}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

               

            </div>
        </section>
    );
};

export default OurReach;