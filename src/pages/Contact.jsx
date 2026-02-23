import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, ArrowRight, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      id: 'phone',
      icon: Phone,
      label: 'Call Us',
      value: '+91 98432 75075',
      sub: 'Mon-Sat from 9am to 6pm',
      link: 'tel:+919843275075'
    },
    {
      id: 'email',
      icon: Mail,
      label: 'Email Us',
      value: 'regeveindia@gmail.com',
      sub: 'Online support 24/7',
      link: 'mailto:regeveindia@gmail.com'
    },
    {
      id: 'address',
      icon: MapPin,
      label: 'Visit Us',
      value: 'Vadapalani, Chennai',
      sub: 'Tamil Nadu 600026',
      link: '#map'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="bg-white font-sans text-slate-900 overflow-hidden relative selection:bg-black selection:text-white">
      
      {/* --- Decorative Background Text --- */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <h1 className="text-[18vw] font-black leading-none text-slate-900 whitespace-nowrap -ml-10 select-none">
          CONNECT
        </h1>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pt-32 pb-24 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-0 items-stretch">
          
          {/* --- LEFT PANEL: Contact Info (Dark Theme) --- */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-5/12 bg-slate-950 text-white p-10 md:p-16 rounded-3xl lg:rounded-r-none lg:rounded-l-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[600px]"
          >
            {/* Background Abstract Shapes */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600 rounded-full blur-[100px] opacity-20 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-10 transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs mb-8 border border-blue-400/20 px-3 py-1 rounded-full bg-blue-400/10">
                <MessageSquare className="w-3 h-3" /> Get in Touch
              </div>
              
              <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
                Let's start a <br/> conversation.
              </h2>
              
              <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-sm font-medium">
                Whether you have a question about features, pricing, or need a demo, our team is ready to answer all your questions.
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              {contactInfo.map((info) => (
                <a 
                  key={info.id} 
                  href={info.link}
                  className="group flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300 shadow-inner border border-white/5">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 group-hover:text-blue-300 transition-colors">{info.label}</h4>
                    <p className="text-lg font-bold text-white leading-tight">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* --- RIGHT PANEL: Form (Light Theme) --- */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-7/12 bg-white p-10 md:p-16 rounded-3xl lg:rounded-l-none lg:rounded-r-[3rem] border border-slate-100 shadow-xl lg:shadow-none flex flex-col justify-center"
          >
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-slate-900 mb-2">Send a Message</h3>
              <p className="text-slate-500">Fill out the form below and we'll get back to you shortly.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Name Input */}
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-slate-300 py-3 text-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  <label className="absolute left-0 -top-3.5 text-sm font-medium text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600">
                    Your Name
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className="peer w-full bg-transparent border-b border-slate-300 py-3 text-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                  />
                  <label className="absolute left-0 -top-3.5 text-sm font-medium text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600">
                    Email Address
                  </label>
                </div>
              </div>

              {/* Subject Input */}
              <div className="relative group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-slate-300 py-3 text-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600 transition-colors"
                />
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600">
                  Subject
                </label>
              </div>

              {/* Message Input */}
              <div className="relative group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-slate-300 py-3 text-lg font-medium text-slate-900 focus:outline-none focus:border-blue-600 transition-colors resize-none"
                ></textarea>
                <label className="absolute left-0 -top-3.5 text-sm font-medium text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-blue-600">
                  Tell us about your project
                </label>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 text-white text-sm font-bold tracking-widest uppercase rounded-xl overflow-hidden transition-all hover:bg-blue-600 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto cursor-pointer"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                        </>
                    ) : (
                        <>
                            Send Message
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>

        </div>
      </div>

      {/* --- Map Section (JGN Technologies Location) --- */}
      <section id="map" className="w-full h-[500px] relative overflow-hidden">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.760273454242!2d80.21260767381165!3d13.050925513136693!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267f622160271%3A0x3149fc03560d447!2sJGN%20Technologies!5e0!3m2!1sen!2sin!4v1769406766893!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-1000 w-full h-full"
          title="JGN Technologies Location"
        ></iframe>
        
        {/* Map Overlay Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-slate-100 text-center max-w-sm pointer-events-none">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Our Headquarters</h3>
          <p className="text-slate-500 font-medium">JGN Technologies, Vadapalani, Chennai</p>
        </div>
      </section>

    </div>
  );
};

export default Contact;