import React, { useState, useEffect } from "react";
import { 
  Shield, Lock, Eye, User, Database, Globe, 
  Clock, CheckCircle2, ChevronRight, Scale
} from "lucide-react";

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    {
      id: "collection",
      icon: <Database className="w-5 h-5" />,
      title: "Information We Collect",
      content: "We collect information that you provide directly to us, including name, email address, phone number, and event registration details. We also automatically collect certain information about your device and usage through cookies."
    },
    {
      id: "usage",
      icon: <Globe className="w-5 h-5" />,
      title: "How We Use Your Information",
      content: "We use your data to maintain our services, process transactions, and personalize your experience. Your data helps us ensure event security and provide technical support."
    },
    {
      id: "sharing",
      icon: <User className="w-5 h-5" />,
      title: "Information Sharing",
      content: "We do not sell your personal information. We only share data with trusted partners who assist in our operations or when required by law to protect our rights and safety."
    },
    {
      id: "security",
      icon: <Lock className="w-5 h-5" />,
      title: "Data Security",
      content: "We implement bank-grade encryption and organizational security measures to protect your data. While we strive for 100% security, no internet transmission is entirely foolproof."
    },
    {
      id: "rights",
      icon: <Eye className="w-5 h-5" />,
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your data. We respect your privacy choices and will respond to any data requests within 30 days."
    }
  ];

  const updates = [
    { date: "Dec 15, 2024", changes: "Current Version - General updates" },
    { date: "Jan 15, 2024", changes: "Updated data retention policies" },
    { date: "Aug 03, 2023", changes: "Enhanced security descriptions" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 mb-12">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Updated Dec 15, 2024</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Your privacy is our priority. We’re committed to being transparent about how we handle your data and keep it safe.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Sections</p>
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm transition-all text-sm font-medium group"
                >
                  <span className="text-slate-400 group-hover:text-blue-600">{s.icon}</span>
                  {s.title}
                </button>
              ))}
              <div className="mt-8 p-4 bg-blue-600 rounded-2xl text-white">
                <Scale className="w-6 h-6 mb-3 opacity-80" />
                <p className="text-sm font-semibold mb-1">GDPR Compliant</p>
                <p className="text-xs opacity-80 leading-relaxed">We adhere to the highest global data standards.</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-8">
            {/* Quick Summary Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                At a Glance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-sm text-slate-600">We <strong>never</strong> sell your personal data to third parties.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <p className="text-sm text-slate-600">You have full control over your data deletion at any time.</p>
                </div>
              </div>
            </div>

            {/* Policy Sections */}
            {sections.map((section) => (
              <section 
                id={section.id} 
                key={section.id} 
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {section.content}
                </p>
              </section>
            ))}

            {/* Revision History Timeline */}
            <div className="pt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Clock className="w-6 h-6 text-slate-400" />
                Revision History
              </h2>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200">
                {updates.map((update, idx) => (
                  <div key={idx} className="relative pl-12 pb-8 group">
                    <div className="absolute left-0 top-1 w-10 h-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center group-hover:border-blue-500 transition-colors">
                      <div className="w-2 h-2 bg-slate-300 rounded-full group-hover:bg-blue-500" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-blue-600 tracking-tight">{update.date}</span>
                      <p className="text-slate-600 mt-1">{update.changes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;