import React, { useState, useEffect, useRef } from "react";
import {
  QrCode,
  ArrowRight,
  CheckCircle,
  Shield,
  Clock,
  Users,
  Smartphone,
  BarChart,
  Download,
  Play,
  Zap,
  Globe,
  Layers,
  Award
} from "lucide-react";

const EventRegistration = () => {
  // --- Counter Logic (Same as before) ---
  const [counters, setCounters] = useState({
    events: 0,
    attendees: 0,
    uptime: 0,
    support: 0,
  });

  const counterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const targetValues = {
      events: 500,
      attendees: 50000,
      uptime: 99.9,
      support: 24,
    };
    const duration = 2000;
    const startAnimation = () => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCounters({
          events: Math.floor(targetValues.events * easeOutQuart),
          attendees: Math.floor(targetValues.attendees * easeOutQuart),
          uptime: parseFloat((targetValues.uptime * easeOutQuart).toFixed(1)),
          support: Math.floor(targetValues.support * easeOutQuart),
        });
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    };
    startAnimation();
  }, [isVisible]);

  const features = [
    { icon: <QrCode />, title: "Lightning Fast Check-in", description: "Scan 50+ attendees per minute with our optimized scanner. No hardware needed." },
    { icon: <CheckCircle />, title: "Live Data Sync", description: "Multi-device synchronization instantly prevents duplicate entries and fraud." },
    { icon: <Shield />, title: "Bank-Grade Security", description: "AES-256 encryption ensures your attendee data is safer than a vault." },
    { icon: <Clock />, title: "Zero Downtime", description: "Engineered for 99.99% uptime, even during massive traffic spikes." },
    { icon: <Users />, title: "Bulk Operations", description: "Import 10,000+ guest lists via CSV or API in seconds." },
    { icon: <Smartphone />, title: "iOS & Android Ready", description: "Native apps for your staff to manage entry from any device." },
    { icon: <BarChart />, title: "Granular Analytics", description: "Track peak hours, drop-off rates, and attendee demographics live." },
    { icon: <Download />, title: "Instant Reporting", description: "Generate PDF/Excel reports for stakeholders with one click." },
  ];

  const howItWorks = [
    { step: "01", title: "Configure", desc: "Set up tickets, sessions, and branding in our drag-and-drop builder.", color: "bg-indigo-600" },
    { step: "02", title: "Distribute", desc: "Auto-send encrypted QR passes via Email, SMS, or WhatsApp.", color: "bg-violet-600" },
    { step: "03", title: "Validate", desc: "Staff scan codes instantly using our app or dedicated scanners.", color: "bg-fuchsia-600" },
    { step: "04", title: "Analyze", desc: "Get real-time insights on attendance and engagement.", color: "bg-pink-600" },
  ];

  const brands = ["TechCrunch", "Spotify", "Uber Events", "TEDx", "WebSummit", "Cannes Lions"];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-500/30">
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 lg:pt-32 pb-24">
        
        {/* --- Hero Section --- */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm mb-8 cursor-default hover:border-indigo-300 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-600 tracking-wide uppercase">v2.0 is Live</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              The Operating System for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
                Modern Events.
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Stop using spreadsheets and clunky scanners. Switch to the platform that powers the world's most innovative conferences and festivals.
            </p>
            
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 group cursor-pointer">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 cursor-pointer group">
                <Play className="w-4 h-4 fill-slate-700 group-hover:text-indigo-600 group-hover:fill-indigo-600 transition-colors" />
                See How It Works
              </button>
            </div> */}
          </div>

          {/* Hero Visual */}
          <div className="lg:w-1/2 relative group cursor-default">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 rounded-full blur-3xl -z-10 group-hover:opacity-100 transition-opacity opacity-75"></div>
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/50 p-2 rounded-3xl shadow-2xl shadow-indigo-500/10 transform rotate-[-2deg] group-hover:rotate-0 transition-all duration-500 ease-out">
               <div className="bg-slate-900 rounded-2xl p-6 aspect-[4/3] flex flex-col justify-between overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-[60px]"></div>
                  {/* Mock UI Header */}
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-[10px] text-slate-300 font-mono">Live Sync</span>
                    </div>
                  </div>
                  
                  {/* Mock QR Content */}
                  <div className="flex gap-6 items-center justify-center relative z-10">
                    <div className="bg-white p-4 rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500">
                      <QrCode className="w-24 h-24 text-slate-900" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-32 bg-slate-700 rounded-full"></div>
                      <div className="h-2 w-24 bg-slate-700 rounded-full"></div>
                      <div className="flex gap-2 mt-2">
                          <div className="h-8 w-20 bg-indigo-600 rounded-lg"></div>
                          <div className="h-8 w-8 bg-slate-700 rounded-lg"></div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Footer */}
                  <div className="mt-8 flex justify-between items-end relative z-10 border-t border-slate-800 pt-4">
                     <div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Attendee</div>
                        <div className="text-white text-sm font-bold">Alex Morgan</div>
                     </div>
                     <div className="text-green-400 text-xs font-mono flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded">
                        <CheckCircle className="w-3 h-3" /> Access Granted
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* --- Social Proof --- */}
        <div className="mb-24 border-y border-slate-200/60 py-8">
            <p className="text-center text-slate-400 text-sm font-semibold uppercase tracking-widest mb-6">Trusted by 500+ Industry Leaders</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {brands.map((brand, i) => (
                    <span key={i} className="text-xl font-bold text-slate-800 cursor-default hover:text-indigo-600 transition-colors">{brand}</span>
                ))}
            </div>
        </div>

        {/* --- Stats Section --- */}
        <div ref={counterRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {[
            { label: "Events Powered", value: counters.events + "+", color: "text-indigo-600", icon: Layers },
            { label: "Check-ins Processed", value: (counters.attendees / 1000).toFixed(0) + "k+", color: "text-violet-600", icon: Users },
            { label: "Uptime Guaranteed", value: counters.uptime + "%", color: "text-fuchsia-600", icon: Zap },
            { label: "Global Countries", value: counters.support + "+", color: "text-pink-600", icon: Globe },
          ].map((stat, idx) => (
            <div key={idx} className="group bg-white border border-slate-200 p-8 rounded-3xl text-center hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className={`mx-auto w-12 h-12 mb-4 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-indigo-50 transition-colors`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-4xl lg:text-5xl font-black mb-2 ${stat.color} tracking-tight`}>
                {stat.value}
              </div>
              <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* --- How It Works --- */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Workflow that makes sense.</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">We've removed the friction. Go from signup to scanning in minutes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => (
              <div key={i} className="relative group cursor-pointer">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-100 hover:-translate-y-2 transition-all duration-300 h-full relative overflow-hidden">
                  {/* Color Blob */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  <div className={`text-6xl font-black text-slate-100 mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:${item.color} transition-all duration-300`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Features Grid (Bento Style) --- */}
        <div>
          <div className="text-center mb-16">
             <div className="inline-block p-2 px-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-4">
                Feature Packed
             </div>
             <h2 className="text-3xl lg:text-5xl font-bold text-slate-900">Everything you need to scale.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className={`
                  group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden
                  ${idx === 0 || idx === 7 ? 'lg:col-span-2' : 'lg:col-span-1'}
                `}
              >
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-700 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:scale-110">
                    {React.cloneElement(feature.icon, { size: 24, strokeWidth: 2 })}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-600">{feature.description}</p>
                    
                    {/* Hover Arrow */}
                    <div className="mt-4 flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
                        Learn more <ArrowRight className="w-3 h-3" />
                    </div>
                </div>
                {/* Subtle Background pattern on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Closing CTA --- */}
        <div className="mt-32 relative rounded-[3rem] overflow-hidden bg-slate-900 text-white text-center px-6 py-20 lg:py-28 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[120px] opacity-40 animate-pulse"></div>

            <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">Ready to upgrade your events?</h2>
                <p className="text-indigo-200 text-lg lg:text-xl mb-10 font-medium">Join 500+ organizers who have switched to the modern standard of event management.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 shadow-xl cursor-pointer">
                        Get Started Now
                    </button>
                    <button className="px-10 py-5 bg-transparent border border-slate-600 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all cursor-pointer">
                        Talk to Sales
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default EventRegistration;