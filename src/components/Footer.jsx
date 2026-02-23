import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ArrowRight,
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const footerLinks = {
    company: {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Our Team", path: "/team" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
      ],
    },
    services: {
      title: "Services",
      links: [
        { name: "Event Registration", path: "/service/registration" },
        { name: "Lucky Draw System", path: "/service/luckydraw-system-page" },
        { name: "Food Management", path: "/service/food-management" },
        { name: "Event Dashboard", path: "/service/dashboard-system-page" },
        { name: "Election Management", path: "/electionManagementplatform" },
      ],
    },
    support: {
      title: "Support",
      links: [
        { name: "Help Center", path: "/help" },
        { name: "Contact Us", path: "/contact" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
      ],
    },
  };

  // Social links with specific brand colors for hover effects
  const socialLinks = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      href: "#", 
      color: "hover:bg-[#1877F2] hover:border-[#1877F2]" 
    },
    { 
      name: "Twitter", 
      icon: Twitter, 
      href: "#", 
      color: "hover:bg-[#1DA1F2] hover:border-[#1DA1F2]" 
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      href: "#", 
      color: "hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:border-transparent" 
    },
    { 
      name: "LinkedIn", 
      icon: Linkedin, 
      href: "#", 
      color: "hover:bg-[#0A66C2] hover:border-[#0A66C2]" 
    },
  ];

  const contactInfo = [
    { icon: MapPin, text: "Vadapalani, Chennai, Tamil Nadu 600026", href: "#" },
    { icon: Phone, text: "+91 98432 75075", href: "tel:9843275075" },
    { icon: Mail, text: "regeveindia@gmail.com", href: "mailto:regeveindia@gmail.com" },
  ];

  return (
    <footer className="bg-black text-white font-sans border-t border-white/10 relative overflow-hidden">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* --- Brand Column (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-8">
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all duration-300 shadow-lg shadow-white/5">
                 <img 
                   src={Logo} 
                   alt="Regeve Logo" 
                   className="w-8 h-8 object-contain brightness-0 invert" 
                 />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tighter leading-none">
                  REGEVE
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">
                  Event Solutions
                </span>
              </div>
            </div>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Creating unforgettable event experiences with seamless registration, interactive lucky draws, and smart food management solutions.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 pt-2">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-start gap-4 group text-sm text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all">
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="mt-1.5">{item.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* --- Links Columns (8 Cols) --- */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-10 lg:gap-4 lg:pl-12">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h4 className="text-white font-bold text-lg mb-6 capitalize flex items-center gap-2">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="group relative flex items-center text-sm text-gray-400 hover:text-white transition-colors duration-300 text-left w-full cursor-pointer py-1.5"
                      >
                        {/* Animated Arrow (Reveals on Hover) */}
                        <span className="absolute left-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                           <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </span>
                        
                        {/* Link Text (Slides right on Hover) */}
                        <span className="transform group-hover:translate-x-5 transition-transform duration-300 ease-out">
                          {link.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* --- Bottom Bar --- */}
        <div className="border-t border-white/10 mt-20 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
          
          {/* Copyright */}
          <div className="text-gray-500 text-sm flex items-center gap-1">
            <span>© {currentYear} Regeve. Made with</span>
            <motion.div 
              whileHover={{ scale: 1.2, color: "#ef4444" }} 
              className="text-gray-400 cursor-default flex items-center"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
            </motion.div> 
            <span>in India.</span>
          </div>

          {/* Animated Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-white/10 ${social.color}`}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;