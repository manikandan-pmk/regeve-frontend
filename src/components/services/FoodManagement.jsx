// components/FoodManagementPage.jsx
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
} from "lucide-react";

const FoodManagement = () => {
  const features = [
    {
      icon: <Utensils className="w-6 h-6" />,
      title: "Meal Category Management",
      description:
        "Organize meals across Veg, Non-Veg, Jain, Vegan, and special dietary requirements with precise tracking.",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real-time Consumption Tracking",
      description:
        "Monitor food consumption live across all counters with instant updates and alerts.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Dietary Safety Control",
      description:
        "Manage allergies and dietary restrictions with clear labeling and safe meal alternatives.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Waste Management Analytics",
      description:
        "Track food waste patterns and optimize quantities for future events to reduce costs.",
    },
  ];

  const stats = [
    { value: "200,000+", label: "Meals Managed" },
    { value: "95%", label: "Waste Reduction" },
    { value: "50+", label: "Events Supported" },
    { value: "99.8%", label: "Accuracy Rate" },
  ];

  return (
    <div className="min-h-screen bg-white py-12 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <Utensils className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Food Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Streamline your event catering with real-time tracking, waste
            reduction, and comprehensive meal management for events of any
            scale.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Comprehensive Food Management
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Process */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                How It Works
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Meal Planning
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Estimate quantities based on attendance and create
                      categorized meal plans.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <ClipboardList className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Counter Management
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Coordinate multiple serving counters with real-time stock
                      monitoring.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <PieChart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Consumption Analytics
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Track consumption patterns and optimize future event
                      planning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Key Benefits
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Cost Reduction
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Minimize food waste and optimize purchasing
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Time Efficiency
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Automate tracking and reduce manual counting
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Attendee Satisfaction
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Ensure dietary needs are met with precision
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Card */}
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Perfect For All Event Types
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { name: "Conferences", count: "500-5,000 attendees" },
              { name: "Corporate Events", count: "50-2,000 attendees" },
              { name: "Weddings", count: "100-1,000 guests" },
              { name: "Festivals", count: "1,000-10,000+ attendees" },
            ].map((event, index) => (
              <div key={index} className="p-4">
                <div className="font-semibold text-gray-900 mb-1">
                  {event.name}
                </div>
                <div className="text-sm text-gray-600">{event.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodManagement;