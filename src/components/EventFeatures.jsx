import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Utensils,
  Gift,
  Trophy,
  BarChart3,
  Package,
  Vote,
  Sparkles,
  ChevronRight,
  CheckCircle,
} from "lucide-react";

const EventFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      title: "Registration",
      description: "Streamlined registration with instant confirmation",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      details: ["Custom forms", "Email automation", "QR check-in"],
    },
    {
      id: 1,
      title: "Food Management",
      description: "Track preferences & manage meal allocations",
      icon: Utensils,
      color: "from-emerald-500 to-green-500",
      details: ["Veg/Non-Veg tracking", "Meal planning", "Waste reduction"],
    },
    {
      id: 2,
      title: "Lucky Draw",
      description: "Interactive spin wheel for prize distribution",
      icon: Gift,
      color: "from-purple-500 to-pink-500",
      details: ["Real-time draws", "Multiple prize tiers", "Winner tracking"],
    },
    {
      id: 3,
      title: "Winners Board",
      description: "Live updates with celebratory animations",
      icon: Trophy,
      color: "from-amber-500 to-orange-500",
      details: ["Real-time updates", "Shareable results", "Photo capture"],
    },
    {
      id: 4,
      title: "Analytics",
      description: "Dashboard with real-time insights",
      icon: BarChart3,
      color: "from-indigo-500 to-blue-500",
      details: ["Attendance metrics", "Engagement scores", "Export reports"],
    },
    {
      id: 5,
      title: "Gift System",
      description: "Systematic prize distribution & tracking",
      icon: Package,
      color: "from-rose-500 to-pink-500",
      details: ["Inventory management", "Digital receipts", "Claim tracking"],
    },
    {
      id: 6,
      title: "Digital Voting",
      description: "Secure digital voting with live results",
      icon: Vote,
      color: "from-violet-500 to-purple-500",
      details: ["Secure authentication", "Live results", "Audit trails"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const ActiveIcon = features[activeFeature].icon; // <-- FIXED

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">

      {/* Header */}
      <motion.div
        className="text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-100 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-blue-700 font-medium text-xs sm:text-sm">
            Event Management Platform
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Event{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            Features
          </span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Streamline operations and enhance experiences with our comprehensive toolkit.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto">

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.button
                key={feature.id}
                variants={itemVariants}
                onClick={() => setActiveFeature(feature.id)}
                className={`relative group p-4 sm:p-5 rounded-xl border transition-all duration-300 ${
                  activeFeature === feature.id
                    ? "bg-white border-transparent shadow-lg scale-105"
                    : "bg-white/50 border-gray-200 hover:bg-white hover:shadow-md"
                }`}
              >
                {activeFeature === feature.id && (
                  <motion.div
                    className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}

                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                <div className="text-left">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>

                <ChevronRight
                  className={`w-4 h-4 text-gray-400 absolute bottom-3 right-3 transition-all duration-300 ${
                    activeFeature === feature.id
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                />
              </motion.button>
            );
          })}
        </motion.div>

        {/* DETAILS PANEL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">

              {/* FIXED ICON */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${
                  features[activeFeature].color
                } flex items-center justify-center shadow-lg`}
              >
                <ActiveIcon className="w-8 h-8 text-white" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {features[activeFeature].title}
                  </h2>

                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    Feature {activeFeature + 1}/{features.length}
                  </span>
                </div>

                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  {features[activeFeature].description}
                </p>

                {/* Details List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {features[activeFeature].details.map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                <span>Features</span>
                <span>
                  {activeFeature + 1}/{features.length}
                </span>
              </div>

              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${features[activeFeature].color}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((activeFeature + 1) / features.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-6">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveFeature(i)}
              className={`w-2 h-2 rounded-full ${
                activeFeature === i
                  ? "w-6 bg-gradient-to-r from-blue-500 to-cyan-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFeatures;
