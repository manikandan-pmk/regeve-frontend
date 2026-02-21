 // components/EventDashboardPage.jsx
import React from 'react';
import { BarChart2, Users, TrendingUp, Clock, Download, CheckCircle } from 'lucide-react';

const DashboardSystemPage = () => {
  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      value: "1,845",
      label: "Checked-in Attendees",
      color: "green"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      value: "87%",
      label: "Registration Rate",
      color: "blue"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      value: "09:15 AM",
      label: "Peak Entry Time",
      color: "orange"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      value: "99.9%",
      label: "System Uptime",
      color: "purple"
    }
  ];

  const features = [
    {
      title: "Live Check-in Monitoring",
      description: "Track attendee check-ins in real-time across all entry points with instant updates",
      items: ["Queue length monitoring", "Scanner throughput", "Multiple entry points"]
    },
    {
      title: "Attendance Analytics",
      description: "Comprehensive reporting on attendance patterns and participation metrics",
      items: ["Session attendance tracking", "Demographic analysis", "Engagement metrics"]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: {
        bg: 'bg-green-50',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600'
      },
      blue: {
        bg: 'bg-blue-50',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'bg-orange-100 text-orange-600',
        text: 'text-orange-600'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'bg-purple-100 text-purple-600',
        text: 'text-purple-600'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white py-12 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <BarChart2 className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive overview of your event with real-time metrics, attendance tracking, 
            and performance analytics in one centralized view.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const colorClasses = getColorClasses(stat.color);
            return (
              <div key={index} className={`${colorClasses.bg} rounded-xl p-6 text-center`}>
                <div className={`w-12 h-12 ${colorClasses.icon} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Real-time Monitoring</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Live Updates</h4>
                    <p className="text-gray-600 text-sm">
                      Instant data synchronization across all event systems
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                    <p className="text-gray-600 text-sm">
                      Track key performance indicators and event success metrics
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Attendance Patterns</h4>
                    <p className="text-gray-600 text-sm">
                      Analyze attendee behavior and participation across sessions
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Export Event Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Dashboard Features</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { name: "Registration Analytics", count: "Live tracking" },
              { name: "Attendance Monitoring", count: "Real-time updates" },
              { name: "System Overview", count: "Performance metrics" }
            ].map((item, index) => (
              <div key={index} className="p-4">
                <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                <div className="text-sm text-gray-600">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Detailed Reports?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Generate comprehensive event reports with detailed analytics and insights.
            </p>
            <button className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              Generate Full Report
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardSystemPage;