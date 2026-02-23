import React from "react";
import {
  Trophy,
  Users,
  Vote,
  Shield,
  BarChart,
  Smartphone,
  Cloud,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  Lock,
  Play,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Assume these are your imported local assets
import heroBg from "../../assets/election/vote333.jpg";
import suiteBg from "../../assets/election/vote666.jpg";

// Helper Icons
const Building = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const GraduationCap = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const ElectionManagementPlatform = () => {
  const navigate = useNavigate();

  const features = [
    { icon: <Shield className="w-6 h-6 text-white" />, title: "Tamper-Proof Security", description: "End-to-end encryption and blockchain audit trails ensure every vote is verified.", color: "bg-blue-600" },
    { icon: <Globe className="w-6 h-6 text-white" />, title: "Vote From Anywhere", description: "Secure remote voting accessible via web and mobile apps.", color: "bg-indigo-600" },
    { icon: <BarChart className="w-6 h-6 text-white" />, title: "Live Analytics", description: "Watch results unfold in real-time with comprehensive dashboards.", color: "bg-violet-600" },
    { icon: <Smartphone className="w-6 h-6 text-white" />, title: "Mobile First Design", description: "Optimized experience for smartphones and tablets.", color: "bg-fuchsia-600" },
    { icon: <Lock className="w-6 h-6 text-white" />, title: "Multi-Factor Auth", description: "Advanced identity verification via OTP and Email.", color: "bg-pink-600" },
    { icon: <Cloud className="w-6 h-6 text-white" />, title: "99.9% Uptime", description: "Enterprise-grade cloud infrastructure that scales automatically.", color: "bg-rose-600" },
  ];

  const useCases = [
    { title: "Corporate", examples: ["Board Elections", "Shareholder Voting"], icon: <Building className="w-6 h-6 text-blue-600" />, bg: "bg-blue-50" },
    { title: "Education", examples: ["Student Council", "Faculty Senate"], icon: <GraduationCap className="w-6 h-6 text-indigo-600" />, bg: "bg-indigo-50" },
    { title: "Professional", examples: ["Association Boards", "Committees"], icon: <Users className="w-6 h-6 text-violet-600" />, bg: "bg-violet-50" },
    { title: "Awards", examples: ["Audience Choice", "Employee Polls"], icon: <Award className="w-6 h-6 text-fuchsia-600" />, bg: "bg-fuchsia-50" },
  ];

  const stats = [
    { label: "Elections Managed", value: "1,500+", icon: <Trophy className="w-5 h-5 text-amber-500" /> },
    { label: "Secure Votes Cast", value: "1M+", icon: <Vote className="w-5 h-5 text-blue-500" /> },
    { label: "Global Reach", value: "15+ Countries", icon: <Globe className="w-5 h-5 text-indigo-500" /> },
    { label: "Trust Rating", value: "99.9%", icon: <Star className="w-5 h-5 text-green-500" /> },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      
      {/* --- 1. Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="lg:w-1/2 z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
                    <Shield className="w-4 h-4 text-blue-600 fill-blue-600" />
                    <span className="text-sm font-bold text-blue-900 tracking-wide uppercase">Secure & Auditable</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                    Democracy, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Digitized.
                    </span>
                </h1>
                
                <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
                    The world's most secure platform for online elections. Run transparent, verifiable votes for any organization size.
                </p>

                {/* <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer group">
                        Start an Election
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 fill-slate-700" /> Demo
                    </button>
                </div> */}
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-blue-600 rounded-[3rem] transform rotate-3 opacity-10 blur-2xl"></div>
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                    <img 
                        src={heroBg} 
                        alt="Secure Voting Interface" 
                        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700" 
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-white max-w-xs">
                        <div className="bg-green-500/20 p-3 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">100% Verified</p>
                            <p className="text-xs text-blue-100">Blockchain backed records</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. Stats Strip --- */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        <div className="mb-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-100">{stat.icon}</div>
                        <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 3. Features Grid --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">Enterprise Grade Security</h2>
                <p className="text-slate-500 text-lg">Built on a foundation of trust, transparency, and technological excellence.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                        <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 4. Split Feature Section --- */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                
                {/* Visual Left */}
                <div className="lg:w-1/2 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-indigo-600 rounded-[2.5rem] rotate-2 opacity-5 transition-transform group-hover:rotate-6"></div>
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-[500px]">
                        <img src={suiteBg} alt="Dashboard View" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors"></div>
                        
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-8">
                            <Zap className="w-16 h-16 text-yellow-400 fill-yellow-400 mb-6 drop-shadow-lg" />
                            <h3 className="text-4xl font-black mb-2 drop-shadow-lg">Complete Suite</h3>
                            <p className="text-lg opacity-90 max-w-sm drop-shadow-md">Everything you need from nomination to certification.</p>
                        </div>
                    </div>
                </div>

                {/* Content Right */}
                <div className="lg:w-1/2">
                    <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6">Built for Every Organization</h2>
                    <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                        Whether you are a small club or a multinational corporation, our platform adapts to your specific governance needs.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        {useCases.map((useCase, index) => (
                            <div key={index} className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors cursor-default">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-lg ${useCase.bg}`}>{useCase.icon}</div>
                                    <h4 className="font-bold text-slate-900">{useCase.title}</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {useCase.examples.slice(0, 2).map((ex, i) => (
                                        <span key={i} className="text-xs font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-100">
                                            {ex}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* --- 5. Redesigned Premium Footer/CTA --- */}
      <div className="bg-slate-50 pb-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto relative rounded-[3rem] overflow-hidden bg-slate-900 shadow-2xl">
            
            {/* Abstract Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]"></div>

            <div className="relative z-10 px-8 py-20 lg:py-28 text-center">
                <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6">
                    Ready to Launch?
                </h2>
                <p className="text-blue-200 text-lg lg:text-xl max-w-2xl mx-auto mb-12">
                    Set up your secure election in 4 simple steps. No credit card required.
                </p>

                {/* Floating Steps Row */}
                <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-12">
                    {["Setup", "Invite", "Vote", "Result"].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                            <span className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-[10px] font-bold text-white">
                                {i + 1}
                            </span>
                            <span className="text-white font-medium">{step}</span>
                            {i < 3 && <div className="w-8 h-px bg-white/20 hidden lg:block ml-4"></div>}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 shadow-xl cursor-pointer">
                        Create Free Account
                    </button>
                    <button className="px-10 py-5 bg-transparent border border-slate-700 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all cursor-pointer">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default ElectionManagementPlatform;