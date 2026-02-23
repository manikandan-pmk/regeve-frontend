import React from 'react';
import { BarChart2, Users, TrendingUp, Clock, Download, CheckCircle, Activity, PieChart, Layers, ArrowUpRight } from 'lucide-react';

const DashboardSystemPage = () => {
  const stats = [
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      value: "1,845",
      label: "Checked-in Attendees",
      bg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      value: "87%",
      label: "Registration Rate",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      icon: <Clock className="w-6 h-6 text-amber-600" />,
      value: "09:15 AM",
      label: "Peak Entry Time",
      bg: "bg-amber-50",
      border: "border-amber-100"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-violet-600" />,
      value: "99.9%",
      label: "System Uptime",
      bg: "bg-violet-50",
      border: "border-violet-100"
    }
  ];

  const features = [
    {
      title: "Live Check-in Monitoring",
      description: "Track attendee check-ins in real-time across all entry points with instant updates.",
      items: ["Queue length monitoring", "Scanner throughput", "Multiple entry points"],
      icon: <Activity className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Attendance Analytics",
      description: "Comprehensive reporting on attendance patterns and participation metrics.",
      items: ["Session attendance tracking", "Demographic analysis", "Engagement metrics"],
      icon: <PieChart className="w-5 h-5 text-purple-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-sans text-slate-900 selection:bg-blue-200">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-up cursor-default">
              <Layers className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">Real-time Insights</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Event <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800">
              Dashboard.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Comprehensive overview of your event with real-time metrics, attendance tracking, and performance analytics in one centralized view.
          </p>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`p-6 bg-white border ${stat.border} rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* --- Main Content Split --- */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 mb-24 items-start">
          
          {/* Left: Features */}
          <div className="lg:col-span-7 space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-default">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                    </div>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        {feature.description}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {feature.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
              ))}
          </div>

          {/* Right: Monitoring & Actions */}
          <div className="lg:col-span-5 space-y-8">
              <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden group cursor-default">
                  {/* Decor */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  
                  <h3 className="text-xl font-bold mb-6 relative z-10">System Health</h3>
                  <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                              <Activity className="w-5 h-5 text-emerald-400" />
                              <span className="font-medium">Live Updates</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                              <TrendingUp className="w-5 h-5 text-blue-400" />
                              <span className="font-medium">Scanner Status</span>
                          </div>
                          <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">Online</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-violet-400" />
                              <span className="font-medium">Entry Points</span>
                          </div>
                          <span className="text-xs font-bold text-slate-300">All Active</span>
                      </div>
                  </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h3>
                  <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer">
                      <Download className="w-5 h-5" />
                      <span>Export Full Report</span>
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                      Formats: PDF, CSV, Excel
                  </p>
              </div>
          </div>

        </div>

        {/* --- Bottom Grid --- */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
                { title: "Registration Analytics", desc: "Live tracking of sign-ups vs check-ins." },
                { title: "Session Heatmaps", desc: "Visualize crowded areas in real-time." },
                { title: "Device Performance", desc: "Monitor battery & connectivity of scanners." }
            ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-200 transition-colors cursor-default group">
                    <h4 className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {item.title} <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default DashboardSystemPage;