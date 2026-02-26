import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Gift,
  Utensils,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BarChart,
} from "lucide-react";
import Img1 from "../assets/hero_section/img1.jpg";
import Img2 from "../assets/hero_section/img2.jpg";
import Img3 from "../assets/hero_section/img3.jpg";
import Img4 from "../assets/election/vote333.jpg";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("jwt") !== null;

  const slides = [
    {
      id: 1,
      title: "Event Registration",
      subtitle: "Seamless digital passes, custom forms & real-time analytics.",
      buttonText: "Get Started",
      icon: Users,
      bgImage: Img1,
      path: "/event-form",
    },
    {
      id: 2,
      title: "Lucky Draw",
      subtitle: "Engage your guests with an interactive live spin experience.",
      buttonText: "Spin Now",
      icon: Gift,
      bgImage: Img2,
      path: "/luckydraw",
    },
    {
      id: 3,
      title: "Food Counters",
      subtitle: "Smart tracking for Veg/Non-Veg consumption to reduce waste.",
      buttonText: "Manage Food",
      icon: Utensils,
      bgImage: Img3,
      path: "/dashboard",
    },
    {
      id: 4,
      title: "Live Elections",
      subtitle: "Secure, transparent, and real-time voting management.",
      buttonText: "Launch Vote",
      icon: BarChart,
      bgImage: Img4,
      path: "/electionManagementplatform",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index) => setCurrentSlide(index);

  const IconComponent = slides[currentSlide].icon;

  return (
    // Changed h-screen to min-h-[100dvh] for better mobile browser support
    <section className="relative w-full min-h-[100dvh] overflow-hidden bg-black text-white font-sans flex flex-col">
      
      {/* --- 1. Background Image Layer --- */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
          />
          {/* Overlay gradient adjustment for mobile readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 lg:to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* --- 2. Main Content Wrapper --- */}
      {/* Added pt-20 for mobile top spacing and flex-grow to push footer down */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 h-full flex flex-grow flex-col justify-center pt-24 lg:pt-0">
        
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-20 w-full">
          
          {/* Left: Typography */}
          <motion.div 
            key={`text-${currentSlide}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left pb-20 lg:pb-0"
          >
            {/* Minimal Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 lg:px-4 lg:py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mx-auto lg:mx-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_white]" />
              <span className="text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-white/90">Regeve Platform</span>
            </div>

            {/* Responsive Text Size */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter leading-[1.1] lg:leading-[0.9]">
              <span className="font-light block text-white/90">{slides[currentSlide].title.split(" ")[0]}</span>
              <span className="font-bold block">{slides[currentSlide].title.split(" ").slice(1).join(" ")}</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-white/80 font-light max-w-md mx-auto lg:mx-0 leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>

            {isLoggedIn && (
              <div className="pt-4 flex justify-center lg:justify-start">
                <button 
                  onClick={() => navigate(slides[currentSlide].path)}
                  className="group relative px-8 py-3 lg:px-10 lg:py-4 bg-white text-black rounded-full font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center gap-2 lg:gap-3 overflow-hidden"
                >
                  <span className="relative z-10">{slides[currentSlide].buttonText}</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Right: Glass Visual */}
          <motion.div 
            key={`icon-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-4 lg:mt-0"
          >
            {/* Frosted Glass Circle - Scaled for Mobile */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex items-center justify-center group cursor-default">
              {/* Inner Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-30" />
              
              <IconComponent 
                strokeWidth={0.5} 
                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 text-white drop-shadow-xl transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Slow Elegant Orbit */}
              <motion.div 
                className="absolute -inset-4 sm:-inset-6 lg:-inset-8 border border-white/5 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              >
                <div className="absolute top-0 left-1/2 w-3 h-3 lg:w-4 lg:h-4 bg-white rounded-full blur-[2px] shadow-[0_0_20px_white]" />
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* --- 3. Minimal Footer Controls --- */}
      <div className="relative z-20 w-full px-6 py-6 lg:py-8 border-t border-white/10 bg-black/20  lg:border-none lg:bg-transparent lg:absolute lg:bottom-0">
        <div className="container mx-auto flex items-center justify-between">
          
          {/* Slide Counter */}
          {/* <div className="text-xs lg:text-sm font-mono text-white/60">
            <span className="text-white font-bold">0{currentSlide + 1}</span> / 0{slides.length}
          </div> */}

          {/* Progress Lines - Hidden on very small screens if needed, or scaled */}
          <div className="flex gap-2 lg:gap-3">
             {slides.map((_, idx) => (
               <button
                 key={idx}
                 onClick={() => goToSlide(idx)}
                 className={`h-[2px] transition-all duration-500 rounded-full ${idx === currentSlide ? "w-8 lg:w-16 bg-white shadow-[0_0_10px_white]" : "w-4 lg:w-6 bg-white/20 hover:bg-white/40"}`}
               />
             ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-4">
            <button 
              onClick={prevSlide} 
              className="p-2 lg:p-3 hover:bg-white/10 rounded-full transition-colors group active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-white/70 group-hover:text-white" />
            </button>
            <button 
              onClick={nextSlide} 
              className="p-2 lg:p-3 hover:bg-white/10 rounded-full transition-colors group active:scale-90"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-white/70 group-hover:text-white" />
            </button>
          </div>

        </div>
      </div>

    </section>
  );
};

export default HeroSection;