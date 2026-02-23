import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Shield, Globe, Award, ArrowUpRight, LayoutTemplate } from 'lucide-react';
import img1 from "../assets/EventType/img1.avif";
import img2 from "../assets/EventType/img3.avif";

const About = () => {
  
  const stats = [
    { number: "500+", label: "Events" },
    { number: "50k", label: "Attendees" },
    { number: "98%", label: "Success" },
    { number: "8+", label: "Cities" }
  ];

  const values = [
    {
      title: "Innovation",
      desc: "We don't just use tech; we invent solutions.",
      icon: Zap,
      color: "text-blue-600"
    },
    {
      title: "Reliability",
      desc: "Systems built to handle the pressure of live events.",
      icon: Shield,
      color: "text-emerald-600"
    },
    {
      title: "Experience",
      desc: "Putting the user journey at the center of everything.",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Impact",
      desc: "Creating moments that leave a lasting impression.",
      icon: Target,
      color: "text-rose-600"
    }
  ];

  return (
    <div className="bg-white font-sans text-slate-900 overflow-hidden selection:bg-black selection:text-white">
      
      {/* --- 1. Asymmetrical Hero --- */}
      <section className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="relative">
          {/* Large decorative text behind */}
          <h1 className="text-[18vw] md:text-[12vw] leading-none font-black text-slate-100 absolute -top-6 md:-top-10 -left-4 md:-left-10 select-none z-0">
            REGEVE
          </h1>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end gap-8 md:gap-12 mt-12 md:mt-0">
            <div className="md:w-2/3">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="block text-blue-600 font-bold tracking-widest uppercase mb-3 md:mb-4 text-xs md:text-sm">Who We Are</span>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 md:mb-8">
                  Architects of <br/>
                  <span className="relative inline-block">
                    Digital Gatherings.
                    <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-blue-200/50 -z-10 transform -rotate-1"></span>
                  </span>
                </h2>
              </motion.div>
            </div>
            
            <div className="md:w-1/3 pb-0 md:pb-4">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-base md:text-lg text-slate-600 border-l-4 border-blue-600 pl-4 md:pl-6 leading-relaxed"
              >
                Regeve bridges the gap between complex logistics and seamless experiences. We are the operating system for modern events.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. Overlapping Image Section --- */}
      <section className="py-12 md:py-20 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="relative flex flex-col md:block items-center">
          
          {/* Main Image - Mobile: Full Width, Desktop: 3/4 Width */}
          <motion.div 
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            whileInView={{ clipPath: 'inset(0 0 0 0)' }}
            transition={{ duration: 1, ease: "circOut" }}
            viewport={{ once: true }}
            className="relative md:absolute right-0 top-0 w-full md:w-3/4 h-[300px] md:h-[600px] mb-8 md:mb-0"
          >
            <img src={img1} alt="Event Tech" className="w-full h-full object-cover rounded-2xl md:rounded-tl-[4rem] md:rounded-bl-[4rem] grayscale hover:grayscale-0 transition-all duration-700 shadow-lg md:shadow-none" />
          </motion.div>

          {/* Spacer for Desktop Layout */}
          <div className="hidden md:block h-[600px]"></div>

          {/* Floating Content Box - Mobile: Stacked, Desktop: Overlapping */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="relative z-10 bg-black text-white p-8 md:p-12 w-full md:max-w-lg shadow-2xl rounded-2xl md:rounded-tr-[3rem] md:rounded-br-lg md:ml-12 md:-mt-[450px]" // Negative margin to pull up on desktop
          >
            <LayoutTemplate className="w-8 h-8 md:w-10 md:h-10 text-blue-400 mb-4 md:mb-6" />
            <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Born from Necessity.</h3>
            <p className="text-slate-300 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
              We noticed a gap. Event organizers were brilliant at creativity but bogged down by administration. Regeve was built to automate the mundane so creators could focus on the magic.
            </p>
            
            <div className="grid grid-cols-2 gap-6 md:gap-8 border-t border-white/20 pt-6 md:pt-8">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-xl md:text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-[10px] md:text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- 3. Values Grid (Interactive) --- */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Core Values</h2>
            <button className="flex items-center gap-2 font-bold text-blue-600 hover:gap-4 transition-all text-sm md:text-base">
              View Principles <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 md:p-8 group hover:bg-black transition-colors duration-500 cursor-pointer border border-slate-100 hover:border-black rounded-xl md:rounded-none"
              >
                <div className={`mb-4 md:mb-6 p-2 md:p-3 rounded-lg bg-slate-50 w-fit group-hover:bg-white/10 transition-colors`}>
                  <val.icon className={`w-6 h-6 md:w-8 md:h-8 ${val.color} group-hover:text-white transition-colors`} />
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 group-hover:text-white transition-colors">{val.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* --- 4. Large Image CTA --- */}
      <section className="py-16 md:py-24 px-4 md:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center text-center">
          <div className="absolute inset-0">
            <img src={img2} alt="Crowd" className="w-full h-full object-cover brightness-50" />
          </div>
          
          <div className="relative z-10 max-w-3xl px-6">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-6 md:mb-8 leading-tight">
              Ready to create the <br/> extraordinary?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 md:px-10 py-3 md:py-4 bg-white text-black font-bold rounded-full hover:bg-blue-50 transition-colors cursor-pointer text-sm md:text-base">
                Start Planning
              </button>
              <button className="px-8 md:px-10 py-3 md:py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors cursor-pointer text-sm md:text-base">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;