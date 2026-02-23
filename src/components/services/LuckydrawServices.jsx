import React from 'react';
import { Gift, Users, Shield, Award, Play, CheckCircle, Sparkles, Trophy, Zap, Star, ArrowRight } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';

const LuckydrawServices = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Smart Participant Pool",
      description: "Auto-sync with registration data or bulk import attendees instantly.",
      color: "bg-blue-500"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Provably Fair Logic",
      description: "Cryptographically secure random algorithms ensure 100% fairness.",
      color: "bg-purple-500"
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      title: "Winner Dashboard",
      description: "Track claims, verify identities, and manage prize distribution logs.",
      color: "bg-pink-500"
    },
    {
      icon: <Gift className="w-6 h-6 text-white" />,
      title: "Tiered Rewards",
      description: "Configure multiple prize tiers from Grand Prize to consolation gifts.",
      color: "bg-amber-500"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Configure",
      description: "Set rules, eligibility, and prize inventory.",
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      step: "02",
      title: "Spin",
      description: "Launch the immersive, animated draw screen.",
      color: "text-purple-600",
      bg: "bg-purple-100"
    },
    {
      step: "03",
      title: "Award",
      description: "Announce winners live and notify via SMS.",
      color: "text-pink-600",
      bg: "bg-pink-100"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans text-slate-900 selection:bg-purple-200">
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          
          {/* --- Hero Section --- */}
          <div className="text-center mb-24 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm mb-8 animate-fade-in-up cursor-default">
                <Sparkles className="w-4 h-4 text-purple-600 fill-purple-600" />
                <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">Gamify Your Event</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Fair, Fun, & Fast <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500">
                Lucky Draws.
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
              Turn passive attendees into active participants. Run automated, transparent lucky draws that keep your audience on the edge of their seats.
            </p>

            {/* <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 cursor-pointer group">
                    <Play className="w-4 h-4 fill-white group-hover:fill-purple-400 transition-colors" /> 
                    Live Demo
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2 group">
                    View Features
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div> */}
          </div>

          {/* --- Features Grid --- */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* --- Main Content Split --- */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-24 items-start">
            
            {/* Left: Value Prop */}
            <div className="lg:col-span-5 space-y-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden group cursor-default hover:border-purple-200 transition-colors">
                    {/* Background Blob */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 relative z-10">Why Organizers Love It</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Zero Manual Entry</h4>
                                <p className="text-slate-500 text-sm mt-1">Seamlessly pulls data from your registration list.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">High Drama Mode</h4>
                                <p className="text-slate-500 text-sm mt-1">Suspenseful animations that look great on big screens.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Audit Ready</h4>
                                <p className="text-slate-500 text-sm mt-1">Download logs to prove fairness to sponsors.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-900 rounded-3xl text-center text-white hover:scale-[1.02] transition-transform cursor-default">
                        <div className="text-3xl font-black mb-1 text-purple-400">100%</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Fair Play</div>
                    </div>
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl text-center shadow-sm hover:shadow-md transition-shadow cursor-default">
                        <div className="text-3xl font-black mb-1 text-slate-900">0s</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Lag Time</div>
                    </div>
                </div>
            </div>

            {/* Right: How It Works */}
            <div className="lg:col-span-7">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-lg">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-bold text-slate-900">Workflow</h3>
                        <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">3 Steps</span>
                    </div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-100 hidden sm:block"></div>

                        <div className="space-y-12">
                            {processSteps.map((step, idx) => (
                                <div key={idx} className="relative flex flex-col sm:flex-row gap-6 group cursor-pointer">
                                    <div className={`w-16 h-16 ${step.bg} rounded-2xl flex items-center justify-center flex-shrink-0 z-10 border-4 border-white shadow-md group-hover:scale-110 transition-transform`}>
                                        <span className={`text-xl font-black ${step.color}`}>{step.step}</span>
                                    </div>
                                    <div className="pt-2">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{step.title}</h4>
                                        <p className="text-slate-500 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

          </div>

          {/* --- Bottom CTA --- */}
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 py-20 px-6 text-center shadow-2xl cursor-default group">
                {/* Abstract Patterns */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600 rounded-full blur-[150px] opacity-30 group-hover:opacity-40 transition-opacity duration-700"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 mx-auto mb-6 animate-bounce" />
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to reward your crowd?</h2>
                    <p className="text-purple-200 text-lg mb-10">Setup your first lucky draw in under 5 minutes.</p>
                    <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200 cursor-pointer">
                        Launch Dashboard
                    </button>
                </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default LuckydrawServices;