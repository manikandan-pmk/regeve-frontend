import React, { useState } from "react";
import { 
  Phone, Mail, MessageCircle, FileText, Users, 
  Settings, CreditCard, Shield, ChevronDown, Search 
} from "lucide-react";

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I set up QR code registration?",
      answer: "Navigate to the Event Registration section in your dashboard, click 'Create New Event', and follow the setup wizard. You can customize QR codes, set up attendee fields, and configure check-in settings.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      question: "Can I run multiple lucky draws?",
      answer: "Yes, our system supports multiple lucky draw sessions. You can schedule different draws for various prize categories or time slots throughout your event.",
      icon: <Users className="w-5 h-5" />
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. Enterprise customers can also request invoice-based billing.",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      question: "How secure is attendee data?",
      answer: "We use bank-level encryption and comply with global GDPR regulations. All data is stored securely and never shared with third parties.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "Offline scanner capabilities?",
      answer: "Our app has offline mode capability. Scans are stored locally and automatically sync when connectivity is restored.",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const contactMethods = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Average wait: 2 mins",
      availability: "Available 24/7",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Detailed inquiries",
      availability: "Response < 2 hours",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone",
      description: "Direct expert help",
      availability: "Mon-Fri, 9-6 EST",
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen mt-5 bg-[#F8FAFC] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            How can we <span className="text-blue-600">help?</span>
          </h1>
          <div className="max-w-2xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search for articles, guides, and more..."
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-600"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Accordion Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-600 rounded-full" />
              Popular Questions
            </h2>
            
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <button 
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {faq.icon}
                    </div>
                    <span className="font-semibold text-slate-700">{faq.question}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeIndex === index ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                  <p className="text-slate-600 leading-relaxed pl-12">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Get in Touch</h2>
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 ${method.color}`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{method.title}</h3>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{method.availability}</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-4">{method.description}</p>
                <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                  Connect
                </button>
              </div>
            ))}
            
            {/* Secondary CTA */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white text-center">
              <h3 className="font-bold mb-2">Need a custom solution?</h3>
              <p className="text-blue-100 text-sm mb-4">Our enterprise team is ready to build tailored event workflows for you.</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold text-sm shadow-lg">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;