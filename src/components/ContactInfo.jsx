import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Building,
  ArrowRight,
  Calendar, // Added missing import
} from "lucide-react";
import ContactBg from "../assets/ContactBg2.jpg";

const ContactInfo = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    venue: "",
    city: "",
    eventDate: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your inquiry! We will get back to you soon.");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      venue: "",
      city: "",
      eventDate: "",
      message: "",
    });
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.3 + (i * 0.1), duration: 0.5 }
    })
  };

  return (
    <section id="contact" className="min-h-screen flex flex-col lg:flex-row bg-white font-sans">
      
      {/* --- LEFT PANEL: Visuals (40%) --- */}
      <div className="lg:w-5/12 relative bg-slate-900 min-h-[400px] lg:min-h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: `url(${ContactBg})` }}
        />
        {/* Classic Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 mix-blend-multiply" />
        
        {/* Content Overlay */}
        <div className="absolute inset-0 p-10 lg:p-16 flex flex-col justify-end text-white z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="font-serif text-3xl lg:text-4xl leading-tight mb-4 text-white/90">
              "Great events are not just happening, they are created."
            </h3>
            <div className="h-1 w-20 bg-blue-500 mb-6"></div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Phone className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">Call Us</p>
                  <p className="text-lg font-medium">+91 98432 75075</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <Mail className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">Email Us</p>
                  <p className="text-lg font-medium">regeveindia@gmail.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- RIGHT PANEL: Form (60%) --- */}
      <div className="lg:w-7/12 bg-white flex flex-col justify-center py-16 px-6 sm:px-12 lg:px-24">
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl w-full mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-12">
            <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">
              Get in Touch
            </span>
            <h2 className="font-serif text-4xl lg:text-5xl text-slate-900 mb-4">
              Ready to start planning?
            </h2>
            <p className="text-slate-500 text-lg">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Name & Email Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={inputVariants} custom={0} className="relative group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                  Full Name
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-blue-600 transition-colors pb-2">
                  <User className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-base"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants} custom={1} className="relative group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                  Email Address
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-blue-600 transition-colors pb-2">
                  <Mail className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-base"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Phone & City Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={inputVariants} custom={2} className="relative group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                  Phone Number
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-blue-600 transition-colors pb-2">
                  <Phone className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-base"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants} custom={3} className="relative group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                  City
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-blue-600 transition-colors pb-2">
                  <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Bangalore"
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-base"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Venue & Date Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={inputVariants} custom={4} className="relative group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                  Venue (Optional)
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-blue-600 transition-colors pb-2">
                  <Building className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Hotel / Center"
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-base"
                  />
                </div>
              </motion.div>

              <motion.div variants={inputVariants} custom={5} className="relative group">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                  Date
                </label>
                <div className="flex items-center border-b border-slate-200 group-focus-within:border-blue-600 transition-colors pb-2">
                  <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-base"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Message Area */}
            <motion.div variants={inputVariants} custom={6} className="relative group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 transition-colors">
                Your Message
              </label>
              <div className="flex items-start border-b border-slate-200 group-focus-within:border-blue-600 transition-colors pb-2">
                <MessageSquare className="w-5 h-5 text-slate-400 mr-3 mt-1" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Tell us about your event requirements..."
                  className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-300 text-base resize-none"
                  required
                ></textarea>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={inputVariants} custom={7} className="pt-6">
              <button
                type="submit"
                className="group relative cursor-pointer inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-slate-900 font-lg rounded-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 w-full md:w-auto"
              >
                <span>Send Message</span>
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;