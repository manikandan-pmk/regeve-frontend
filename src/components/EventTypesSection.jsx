import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  GraduationCap,
  Music,
  Globe,
  PartyPopper,
  ChevronRight,
  Calendar,
  MapPin,
  UsersRound,
} from "lucide-react";
import img1 from "../assets/EventType/img1.avif";
import img2 from "../assets/EventType/img2.avif";
import img3 from "../assets/EventType/img3.avif";
import img4 from "../assets/EventType/img4.avif";
import img5 from "../assets/EventType/img5.avif";
import img6 from "../assets/EventType/img6.jpg";




const EventTypesSection = () => {
  const eventTypes = [
    {
      id: 1,
      title: "Corporate Events",
      description:
        "Professional gatherings designed for business networking, conferences, product launches, and corporate meetings with strategic objectives.",
      icon: Building2,
      color: "from-blue-500 to-blue-700",
      bgColor: "bg-blue-50",
      examples: [
        "Conferences",
        "Seminars",
        "Product Launches",
        "Annual Meetings",
        "Team Building",
      ],
      features: [
        "Professional Networking",
        "Business Presentations",
        "Strategic Planning",
        "Brand Promotion",
      ],
      image: img1,
    },
    {
      id: 2,
      title: "Social Events",
      description:
        "Personal celebrations and gatherings focused on social interaction, entertainment, and building personal relationships.",
      icon: Users,
      color: "from-green-500 to-green-700",
      bgColor: "bg-green-50",
      examples: [
        "Weddings",
        "Birthday Parties",
        "Anniversaries",
        "Reunions",
        "Baby Showers",
      ],
      features: [
        "Social Networking",
        "Entertainment",
        "Celebration",
        "Personal Connections",
      ],
      image: img2,
    },
    {
      id: 3,
      title: "Educational Events",
      description:
        "Exciting school gatherings and celebrations that showcase student talents, promote healthy competition, and foster school community spirit.",
      icon: GraduationCap,
      color: "from-purple-500 to-purple-700",
      bgColor: "bg-purple-50",
      examples: [
        "Annual Day",
        "Sports Day",
        "Science Fair",
        "Cultural Fest",
        "Graduation Ceremony",
        "Parents-Teacher Meeting",
      ],
      features: [
        "Student Performance",
        "Talent Showcase",
        "Healthy Competition",
        "Community Building",
      ],
      image: img3,
    },
    {
      id: 4,
      title: "Entertainment Events",
      description:
        "Events focused on amusement, performances, and recreational activities for audience enjoyment and engagement.",
      icon: Music,
      color: "from-pink-500 to-pink-700",
      bgColor: "bg-pink-50",
      examples: [
        "Concerts",
        "Music Festivals",
        "Stand-up Comedy",
        "Movie Premieres",
        "Award Shows",
      ],
      features: [
        "Live Performances",
        "Audience Engagement",
        "Entertainment Production",
        "Media Coverage",
      ],
      image: img4,
    },
    {
      id: 5,
      title: "Cultural Events",
      description:
        "Celebrations of heritage, traditions, arts, and customs that showcase cultural diversity and artistic expressions.",
      icon: Globe,
      color: "from-amber-500 to-amber-700",
      bgColor: "bg-amber-50",
      examples: [
        "Art Exhibitions",
        "Cultural Festivals",
        "Heritage Celebrations",
        "Traditional Performances",
        "Museum Events",
      ],
      features: [
        "Cultural Preservation",
        "Artistic Expression",
        "Community Engagement",
        "Tradition Showcase",
      ],
      image: img5,
    },
    {
      id: 6,
      title: "Festive Events",
      description:
        "Seasonal and holiday celebrations marked by joy, tradition, and community participation in festive atmospheres.",
      icon: PartyPopper,
      color: "from-red-500 to-red-700",
      bgColor: "bg-red-50",
      examples: [
        "Christmas Parties",
        "Diwali Celebrations",
        "Eid Festivals",
        "New Year Eve",
        "Seasonal Carnivals",
      ],
      features: [
        "Seasonal Celebration",
        "Traditional Rituals",
        "Community Bonding",
        "Festive Atmosphere",
      ],
      image: img6,
    },
  ];

 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -5,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200 mb-6">
            <Calendar className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-blue-700 font-semibold text-sm">
              Event Categories
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Types of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Events We Manage
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From corporate gatherings to festive celebrations, we specialize in
            managing diverse events with professional excellence and creative
            flair.
          </p>
        </motion.div>

     
        {/* Event Types Grid */}
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {eventTypes.map((eventType, index) => (
            <motion.div
              key={eventType.id}
              variants={itemVariants}
              className={`flex flex-col lg:flex-row ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-12 items-center`}
            >
              {/* Event Content */}
              <motion.div
                className="lg:w-1/2"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 h-full">
                  {/* Icon and Header */}
                  <div className="flex items-start mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${eventType.color} shadow-lg mr-4`}
                    >
                      <eventType.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {eventType.title}
                      </h3>
                      <p className="text-gray-600">{eventType.description}</p>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Common Examples:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {eventType.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${eventType.bgColor} text-gray-700 border border-gray-200`}
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Key Features:
                    </h4>
                    <ul className="space-y-2">
                      {eventType.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-gray-600"
                        >
                          <ChevronRight
                            className={`w-4 h-4 mr-2 ${
                              eventType.color
                                .replace("from-", "text-")
                                .split(" ")[0]
                            }`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover Border Effect */}
                  <div
                    className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${eventType.color} group-hover:w-full transition-all duration-500 rounded-b-2xl`}
                  />
                </div>
              </motion.div>

              {/* Image Separator */}
              <div className="lg:w-1/2 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <div className="aspect-video w-full overflow-hidden rounded-2xl">
                    <img
                      src={eventType.image}
                      alt={eventType.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${eventType.color} opacity-20 mix-blend-overlay`}
                    />
                  </div>

                  {/* Overlay Text */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h4 className="text-white text-xl font-bold mb-2">
                      Professional Management
                    </h4>
                    <p className="text-gray-200 text-sm">
                      Complete end-to-end event planning and execution
                    </p>
                  </div>
                </div>

                {/* Decorative Element */}
                <div
                  className={`absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r ${eventType.color} opacity-10 rounded-full blur-xl`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

      
      </div>
    </div>
  );
};

export default EventTypesSection;