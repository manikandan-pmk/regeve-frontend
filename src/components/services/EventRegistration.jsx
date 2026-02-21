// components/ServicesWebsite.jsx
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
  Cloud,
  Zap,
  Calendar,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const EventRegistration = () => {
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

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

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

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const startAnimation = () => {
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setCounters({
          events: Math.floor(targetValues.events * easeOutQuart),
          attendees: Math.floor(targetValues.attendees * easeOutQuart),
          uptime: parseFloat((targetValues.uptime * easeOutQuart).toFixed(1)),
          support: Math.floor(targetValues.support * easeOutQuart),
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    startAnimation();
  }, [isVisible]);

  const features = [
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "QR Code Registration",
      description:
        "Generate unique QR codes for each attendee for instant check-ins",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Real-time Validation",
      description:
        "Validate attendee credentials instantly at the registration desk",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Access Control",
      description: "Prevent unauthorized access with encrypted QR codes",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Check-in Process",
      description: "Reduce waiting time with 5-second check-in process",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Bulk Registration",
      description: "Register multiple attendees simultaneously with CSV upload",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile-Friendly",
      description: "Access registration system from any smartphone or tablet",
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Live Analytics",
      description:
        "Track registrations, check-ins, and attendance in real-time",
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Data",
      description:
        "Download attendee lists, reports, and analytics in multiple formats",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Event",
      description:
        "Set up your event details, dates, and registration form in minutes",
      icon: <Calendar className="w-8 h-8" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      step: "02",
      title: "Generate QR Codes",
      description:
        "System automatically creates unique QR codes for each registrant",
      icon: <QrCode className="w-8 h-8" />,
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      step: "03",
      title: "Share Registration Link",
      description:
        "Distribute registration link via email, social media, or website",
      icon: <Users className="w-8 h-8" />,
      bgColor: "bg-violet-100",
      textColor: "text-violet-600",
    },
    {
      step: "04",
      title: "Check-in Attendees",
      description: "Scan QR codes at venue for instant check-in and validation",
      icon: <CheckCircle className="w-8 h-8" />,
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg shadow-blue-500/20">
            <Sparkles className="w-4 h-4" />
            <span>Most Popular Event Registration Solution</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            QR-Powered Event
            <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Registration Made Easy
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Transform your event experience with our AI-powered QR registration
            platform. From instant check-ins to detailed analytics, we've got
            you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group bg-white text-gray-700 border-2 border-gray-200 px-10 py-4 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-3">
              <span>Watch Demo</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Animated Stats Section */}
        <div
          ref={counterRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          <div className="text-center p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl font-bold text-blue-600 mb-3">
              {counters.events}+
            </div>
            <div className="text-gray-700 font-medium">Events Managed</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl font-bold text-emerald-600 mb-3">
              {counters.attendees.toLocaleString()}+
            </div>
            <div className="text-gray-700 font-medium">
              Attendees Registered
            </div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-white to-violet-50 rounded-2xl shadow-lg border border-violet-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl font-bold text-violet-600 mb-3">
              {counters.uptime}%
            </div>
            <div className="text-gray-700 font-medium">Uptime Reliability</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-lg border border-amber-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl font-bold text-amber-600 mb-3">
              {counters.support}/7
            </div>
            <div className="text-gray-700 font-medium">Customer Support</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How It Works in{" "}
            <span className="text-blue-600">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Get your event registration up and running in minutes, not days
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-20 h-20 ${step.bgColor} ${step.textColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {step.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for{" "}
              <span className="text-blue-600">Seamless Registration</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Packed with powerful features to make your event registration
              effortless and efficient
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
