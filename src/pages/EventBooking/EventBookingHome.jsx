import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  Music,
  Type,
  Plus,
  ChevronLeft,
  PartyPopper,
  UploadCloud,
  AlignLeft,
  IndianRupee,
  Ticket,
  QrCode,
  Hash,
  DollarSign,
  Loader2,
  Eye,
  Trash2,
  Edit,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EventBookingHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form State mapped to Strapi Schema (ALL FIELDS)
  const [formData, setFormData] = useState({
    Event_Name: "",
    Event_Type: "",
    Description: "",
    Date_TIme: "",
    End_Date: "",
    Age_Limit: "",
    Language: "",
    Category: "",
    Location: "",
    Price: "",
    Capacity: "",
    Duration: "",
    Upi_Id: "",
  });

  const navigate = useNavigate();
  const { adminId } = useParams();

  const [coverImage, setCoverImage] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");

      const response = await axios.get(
        "https://api.regeve.in/api/event-ticket-bookings/findall",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setEvents(response.data.data || []);
    } catch (error) {
      setError("Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setEditingEvent(null);
    setFormData({
      Event_Name: "",
      Event_Type: "",
      Description: "",
      Date_TIme: "",
      End_Date: "",
      Age_Limit: "",
      Language: "",
      Category: "",
      Location: "",
      Price: "",
      Capacity: "",
      Duration: "",
      Upi_Id: "",
    });
    setCoverImage(null);
    setQrCodeImage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setCoverImage(null);
    setQrCodeImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "cover") {
        setCoverImage(e.target.files[0]);
      } else if (type === "qr") {
        setQrCodeImage(e.target.files[0]);
      }
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    const token = localStorage.getItem("jwt");
    console.log(token);

    const res = await axios.post("https://api.regeve.in/api/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: false,
    });

    return res.data[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("jwt");

      const payloadData = {
        ...formData,
        Price: parseInt(formData.Price) || 0,
        Capacity: parseInt(formData.Capacity) || 0,
      };

      // ✅ Upload images FIRST
      const cover = coverImage ? await uploadImage(coverImage) : null;
      const qr = qrCodeImage ? await uploadImage(qrCodeImage) : null;

      // ✅ Send IDs to Strapi
      const submitData = {
        data: {
          ...payloadData,
          Cover_Image: cover?.id,
          QR_Code: qr?.id,
        },
      };

      await axios.post(
        "https://api.regeve.in/api/event-ticket-bookings/create-event",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchEvents();
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const token = localStorage.getItem("jwt");

      await axios.delete(
        `https://api.regeve.in/api/event-ticket-bookings/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchEvents(); // refresh
    } catch (error) {
      console.error(error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      Music: "🎵",
      Workshops: "📝",
      Conferences: "💼",
      Sports: "⚽",
      "Food & Drinks": "🍔",
      Tech: "💻",
      Art: "🎨",
      Community: "👥",
      Festivals: "🎪",
      "Private Events": "🔒",
    };
    return icons[category] || "🎉";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-6 md:p-12 font-sans text-slate-900">
      <div className="w-full max-w-7xl mx-auto">
        {/* Back Navigation */}
        <button className="flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-12 uppercase tracking-wide">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] tracking-tight mb-4">
            Create Event Party
          </h1>
          <p className="text-base text-slate-500 leading-relaxed">
            Create and manage exciting party events with customized details,
            category support, and real-time tracking for your campaigns.
          </p>

          <button
            onClick={openModal}
            className="mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Party Event</span>
          </button>
        </div>

        {/* My Events Section */}
        <div className="w-full mt-10">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-[#0f172a]">My Events</h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage and monitor your event campaigns
              </p>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
              {events.length} Events
            </span>
          </div>

          {/* Conditional Rendering */}
          {isLoading && events.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchEvents}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-16 md:p-24 flex flex-col items-center justify-center shadow-sm">
              <div className="w-20 h-20 bg-[#e0f2fe] rounded-full flex items-center justify-center mb-6">
                <PartyPopper className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-slate-500 text-lg font-medium">
                No events created yet.
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Click the button above to start your first party campaign.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  onClick={() =>
                    navigate(
                      `/${adminId}/eventbooking-dashboard/${event.documentId}`,
                    )
                  }
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                >
                  {/* --- Card Image Section --- */}
                  <div className="h-56 bg-slate-100 w-full relative overflow-hidden">
                    {event.Cover_Image?.url ? (
                      <img
                        src={`https://api.regeve.in${event.Cover_Image.url}`}
                        alt={event.Event_Name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-slate-300 bg-slate-50">
                        <PartyPopper className="w-16 h-16 opacity-40" />
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      {event.Category && (
                        <span className="bg-white/95 backdrop-blur-md text-indigo-700 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                          {getCategoryIcon(event.Category)} {event.Category}
                        </span>
                      )}
                      <span className="bg-emerald-500/95 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                        {event.Available_Seats || event.Capacity} Seats
                      </span>
                    </div>

                    {/* Bottom Gradient Overlay for readability if needed */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  </div>

                  {/* --- Card Content Section --- */}
                  <div className="p-6 flex-1 flex flex-col bg-white">
                    {/* Title & Description */}
                    <div className="mb-5">
                      <h3
                        className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-indigo-600 transition-colors"
                        title={event.Event_Name}
                      >
                        {event.Event_Name}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {event.Description}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 mt-auto flex-1 bg-slate-50/50 rounded-2xl p-4 border border-slate-50">
                      <div className="flex items-center text-sm font-medium text-slate-700">
                        <Calendar className="w-4 h-4 mr-3 text-indigo-500 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(event.Date_TIme)}
                        </span>
                      </div>

                      {event.Duration && (
                        <div className="flex items-center text-sm font-medium text-slate-700">
                          <Clock className="w-4 h-4 mr-3 text-amber-500 flex-shrink-0" />
                          <span>{event.Duration} Hours Duration</span>
                        </div>
                      )}

                      <div className="flex items-center text-sm font-medium text-slate-700">
                        <MapPin className="w-4 h-4 mr-3 text-rose-500 flex-shrink-0" />
                        <span className="truncate">
                          {event.Location || "Location TBA"}
                        </span>
                      </div>

                      <div className="flex items-center text-sm font-medium text-slate-700">
                        <DollarSign className="w-4 h-4 mr-3 text-emerald-500 flex-shrink-0" />
                        <span>
                          {parseInt(event.Price) > 0 ? (
                            <>
                              <span className="text-xs font-bold text-emerald-600 mr-0.5">
                                ₹
                              </span>
                              {parseInt(event.Price).toLocaleString()}
                            </>
                          ) : (
                            <span className="text-emerald-600 font-bold">
                              Free Entry
                            </span>
                          )}
                        </span>
                      </div>

                      {event.Upi_Id && (
                        <div className="flex items-center text-sm font-medium text-slate-700">
                          <QrCode className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                          <span className="truncate text-slate-500">
                            UPI:{" "}
                            <span className="text-slate-700">
                              {event.Upi_Id}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer / Actions */}
                    <div className="mt-5 pt-5 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                          {event.Language || "Mixed"}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">
                          {event.Age_Limit}+ Yrs
                        </span>
                      </div>

                      <div className="flex gap-1">
                        <button
                          className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                          title="View Event"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                          title="Delete Event"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(event.id);
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-[#0f172a]">
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Fill in the details to get this party started.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-8 custom-scrollbar">
              <form
                id="event-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Event Poster Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Event Poster / Cover Image
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "cover")}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-105 transition-transform">
                      {coverImage ? (
                        <PartyPopper className="w-6 h-6 text-green-500" />
                      ) : (
                        <UploadCloud className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      {coverImage
                        ? coverImage.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-slate-500">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                </div>

                {/* Event Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Event Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Type className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="Event_Name"
                      value={formData.Event_Name}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Neon Beach Sunset Gig"
                      className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description *
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3.5 flex items-center pointer-events-none">
                      <AlignLeft className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      name="Description"
                      value={formData.Description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      placeholder="Tell people what to expect at the party..."
                      className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                    />
                  </div>
                </div>

                {/* Date & End Date Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Start Date & Time *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="datetime-local"
                        name="Date_TIme"
                        value={formData.Date_TIme}
                        onChange={handleInputChange}
                        required
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      End Date & Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="datetime-local"
                        name="End_Date"
                        value={formData.End_Date}
                        onChange={handleInputChange}
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration & Capacity Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Duration (hours)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="Duration"
                        value={formData.Duration}
                        onChange={handleInputChange}
                        placeholder="e.g., 6"
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Total Capacity *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="Capacity"
                        value={formData.Capacity}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., 500"
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Age Limit Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Ticket Price (₹) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="number"
                        name="Price"
                        value={formData.Price}
                        onChange={handleInputChange}
                        required
                        placeholder="0 for free"
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Age Limit
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>

                      <input
                        type="number"
                        name="Age_Limit"
                        value={formData.Age_Limit}
                        onChange={handleInputChange}
                        placeholder="Enter age limit (e.g., 18)"
                        min="0"
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Language Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Venue Location *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="Location"
                        value={formData.Location}
                        onChange={handleInputChange}
                        required
                        placeholder="Venue address..."
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Language
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="Language"
                        value={formData.Language}
                        onChange={handleInputChange}
                        placeholder="e.g., English, Hindi, Multilingual"
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Category & UPI ID Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Music className="h-5 w-5 text-slate-400" />
                      </div>
                      <select
                        name="Category"
                        value={formData.Category}
                        onChange={handleInputChange}
                        required
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        <option value="">Select Category</option>
                        <option value="Music">Music</option>
                        <option value="Workshops">Workshops</option>
                        <option value="Conferences">Conferences</option>
                        <option value="Sports">Sports</option>
                        <option value="Food & Drinks">Food & Drinks</option>
                        <option value="Tech">Tech</option>
                        <option value="Art">Art</option>
                        <option value="Community">Community</option>
                        <option value="Festivals">Festivals</option>
                        <option value="Private Events">Private Events</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      UPI ID (for payments)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <QrCode className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="Upi_Id"
                        value={formData.Upi_Id}
                        onChange={handleInputChange}
                        placeholder="example@upi"
                        className="pl-11 w-full bg-white border border-slate-300 text-slate-900 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* QR Code Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Payment QR Code (Optional)
                  </label>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "qr")}
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="bg-white p-2 rounded-full shadow-sm mb-2 group-hover:scale-105 transition-transform">
                      <QrCode className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-xs text-slate-600">
                      {qrCodeImage
                        ? qrCodeImage.name
                        : "Upload payment QR code"}
                    </p>
                  </div>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-gray-50 z-10">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="event-form"
                disabled={isLoading}
                className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Publishing..." : "Publish Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBookingHome;
