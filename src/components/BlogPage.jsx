import React from "react";
import { Target, Users, TrendingUp, Lightbulb, Shield, BarChart, ArrowRight, Zap, Globe, BookOpen } from "lucide-react";

const BlogPage = () => {
  const features = [
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "Expert Strategy",
      description: "Proven frameworks from industry veterans with decades of experience.",
      color: "bg-blue-600"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      title: "Future Trends",
      description: "Deep dives into AI, VR, and the next generation of event tech.",
      color: "bg-purple-600"
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: "Tactical Advice",
      description: "Actionable checklists and templates you can use immediately.",
      color: "bg-amber-500"
    }
  ];

  const contentSections = [
    {
      title: "Digital Transformation",
      icon: <Zap className="w-6 h-6 text-blue-500" />,
      content: "Staying ahead requires adaptation. We offer deep insights into the evolving landscape, from small gatherings to international conferences.",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      title: "Modern Tech Stack",
      icon: <Globe className="w-6 h-6 text-emerald-500" />,
      content: "AI, VR, and analytics are reshaping execution. Understanding these tools is essential for creating memorable modern experiences.",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      title: "Human-Centric Design",
      icon: <Users className="w-6 h-6 text-purple-500" />,
      content: "Successful events are built on connection. We emphasize attendee psychology and creating environments where relationships flourish.",
      bg: "bg-purple-50",
      border: "border-purple-100"
    },
    {
      title: "Sustainable Events",
      icon: <Shield className="w-6 h-6 text-rose-500" />,
      content: "Eco-friendly planning without compromising quality. From waste reduction to ethical sourcing, we guide responsible choices.",
      bg: "bg-rose-50",
      border: "border-rose-100"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      
      {/* --- 1. Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] opacity-60 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] opacity-60 translate-y-1/3 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
            
            {/* Left Content */}
            <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up">
                    <BookOpen className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">The Regeve Blog</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                    Insights for the <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                        Modern Creator.
                    </span>
                </h1>
                
                <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
                    Expert knowledge, strategic guides, and industry trends to help you build world-class events.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 cursor-pointer">
                        Start Reading
                    </button>
                    <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2 group">
                        Subscribe <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Right Image Card */}
            <div className="lg:w-1/2 relative">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-700">
                    <img 
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                        alt="Event Insights" 
                        className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8 text-white">
                        <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">Featured</span>
                        <h3 className="text-2xl font-bold">The Future of Hybrid Events</h3>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- 2. Features Grid (Floating Cards) --- */}
      <section className="py-12 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <div key={index} className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden">
                    <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                    
                    {/* Hover Decoration */}
                    <div className={`absolute top-0 right-0 w-24 h-24 ${feature.color} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500`}></div>
                </div>
            ))}
        </div>
      </section>

      {/* --- 3. Content Grid (Bento Style) --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-20">
                <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-6">Deep Dive Topics</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">Explore comprehensive insights that transform your approach to event management.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {contentSections.map((section, index) => (
                    <div 
                        key={index}
                        className={`group p-10 rounded-[2.5rem] border ${section.border} ${section.bg} hover:shadow-lg transition-all duration-300 cursor-pointer`}
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                {section.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">{section.title}</h3>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            {section.content}
                        </p>
                        <div className="flex items-center text-sm font-bold text-slate-900 group-hover:gap-2 transition-all">
                            Read Article <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* --- 4. Newsletter CTA --- */}
      <section className="py-24 px-6 lg:px-12 bg-slate-50">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
            {/* Decor */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-50"></div>
            
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Join 10,000+ Event Pros</h2>
                <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">Get the latest strategies and tech trends delivered to your inbox weekly.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                    />
                    <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg cursor-pointer whitespace-nowrap">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
};

export default BlogPage;