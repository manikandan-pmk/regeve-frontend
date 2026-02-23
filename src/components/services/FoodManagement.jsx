import React from "react";
import {
  Utensils,
  Users,
  ClipboardList,
  PieChart,
  CheckCircle,
  BarChart3,
  Download,
  Shield,
  Leaf,
  ChefHat,
  ArrowRight
} from "lucide-react";

const FoodManagement = () => {
  const features = [
    {
      icon: <Utensils className="w-6 h-6 text-white" />,
      title: "Smart Menu Planning",
      description: "Organize meals across Veg, Non-Veg, Jain, and Vegan with AI-driven quantity estimates.",
      color: "bg-emerald-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Live Consumption Data",
      description: "Monitor food consumption live across all counters to prevent shortages or wastage.",
      color: "bg-blue-500"
    },
    {
      icon: <Shield className="w-6 h-6 text-white" />,
      title: "Allergen Safety",
      description: "Manage dietary restrictions with clear digital labeling and safe meal alternatives.",
      color: "bg-amber-500"
    },
    {
      icon: <Leaf className="w-6 h-6 text-white" />,
      title: "Waste Reduction",
      description: "Track waste patterns to optimize future ordering and support sustainability goals.",
      color: "bg-green-600"
    },
  ];

  const stats = [
    { value: "200k+", label: "Meals Managed", color: "text-emerald-600" },
    { value: "95%", label: "Waste Reduction", color: "text-blue-600" },
    { value: "50+", label: "Events Supported", color: "text-amber-600" },
    { value: "99.8%", label: "Accuracy Rate", color: "text-purple-600" },
  ];

  const processSteps = [
    {
      title: "Plan",
      desc: "Define menu & estimate quantities.",
      icon: <ClipboardList className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-100"
    },
    {
      title: "Serve",
      desc: "Real-time counter management.",
      icon: <ChefHat className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-100"
    },
    {
      title: "Analyze",
      desc: "Track consumption & waste trends.",
      icon: <PieChart className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-100"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans text-slate-900 selection:bg-emerald-200">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* --- Hero Section --- */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-8 animate-fade-in-up cursor-default">
              <Leaf className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">Sustainable Catering</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Smart Food <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500">
              Management.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Streamline your event catering with real-time tracking, waste reduction, and comprehensive meal management analytics.
          </p>

          {/* <div className="flex justify-center gap-4">
              <button className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all hover:scale-105 shadow-xl shadow-emerald-600/20 flex items-center gap-2 cursor-pointer group">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all cursor-pointer">
                  View Demo
              </button>
          </div> */}
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-100 shadow-sm text-center hover:shadow-md transition-all cursor-default">
                    <div className={`text-4xl font-black mb-2 ${stat.color} tracking-tight`}>{stat.value}</div>
                    <div className="text-slate-500 font-bold text-xs uppercase tracking-wider">{stat.label}</div>
                </div>
            ))}
        </div>

        {/* --- Features Grid --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* --- Main Content Split --- */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-24 items-start">
          
          {/* Left: How It Works */}
          <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden group cursor-default hover:border-emerald-200 transition-colors">
                  {/* Background Blob */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 relative z-10">Workflow</h3>
                  <div className="space-y-8 relative z-10">
                      {processSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-4 items-center">
                              <div className={`w-12 h-12 ${step.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                  {step.icon}
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-900 text-lg">{step.title}</h4>
                                  <p className="text-slate-500 text-sm">{step.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          {/* Right: Benefits & Use Cases */}
          <div className="lg:col-span-7 space-y-8">
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-lg">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-slate-900">Key Benefits</h3>
                      <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase">Impact</span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-emerald-50 hover:border-emerald-100 transition-colors cursor-default">
                          <div className="font-bold text-slate-900 mb-2">Cost Efficient</div>
                          <p className="text-slate-500 text-sm">Minimize food waste & optimize purchasing.</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-default">
                          <div className="font-bold text-slate-900 mb-2">Save Time</div>
                          <p className="text-slate-500 text-sm">Automate tracking & reduce manual counts.</p>
                      </div>
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-amber-50 hover:border-amber-100 transition-colors cursor-default">
                          <div className="font-bold text-slate-900 mb-2">Satisfaction</div>
                          <p className="text-slate-500 text-sm">Ensure dietary needs are met precisely.</p>
                      </div>
                  </div>
              </div>

              {/* Use Cases Pill Grid */}
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full blur-[100px] opacity-20"></div>
                  <h3 className="text-xl font-bold mb-6 relative z-10">Perfect for any scale</h3>
                  <div className="flex flex-wrap gap-3 relative z-10">
                      {["Conferences (500+)", "Weddings (200+)", "Corporate (1000+)", "Festivals (10k+)"].map((tag, i) => (
                          <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/10 hover:bg-white/20 transition-colors cursor-default">
                              {tag}
                          </span>
                      ))}
                  </div>
              </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FoodManagement;