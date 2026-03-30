import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Share2,
  CalendarDays,
  Clock,
  Hourglass,
  UserSquare2,
  Languages,
  MapPin,
  Ticket,
  Info,
  Check, // <-- Added Check icon for feedback
} from "lucide-react";
import axios from "axios";

// IMPORTANT: Replace this with your actual backend base URL (e.g., http://localhost:1337)
const BASE_URL = "https://api.regeve.in";

const EventBookingTicketPage = () => {
  const { adminId, documentId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false); // <-- State for share 
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/event-ticket-bookings/${adminId}/${documentId}`,
        );

        const resData = response.data?.data;

        if (Array.isArray(resData) && resData.length > 0) {
          setEvent(resData[0]);
        } else if (resData && typeof resData === "object") {
          setEvent(resData);
        } else {
          throw new Error("Event not found");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };

    if (adminId && documentId) {
      fetchEventData();
    }
  }, [adminId, documentId]);

  // --- Share Functionality ---
  const handleShare = async (e) => {
    e.preventDefault(); // Stops the button from causing any layout jumps
    e.stopPropagation();

    const currentUrl = window.location.href;
    const shareData = {
      title: event.Event_Name,
      text: `Check out ${event.Event_Name}!`,
      url: currentUrl,
    };

    // Fallback function to copy link and show the green checkmark
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Clipboard copy failed: ", err);
      }
    };

    // 1. Try Native Share
    if (
      navigator.share &&
      /mobile|android|iphone|ipad/i.test(navigator.userAgent)
    ) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Native share cancelled or failed. Falling back to copy.");
        // If they cancel the native share, just copy the link for them anyway!
        await copyToClipboard();
      }
    } else {
      // 2. Desktop or unsupported browser? Bypass native share and just copy the link.
      // This prevents the page from freezing on desktop browsers.
      await copyToClipboard();
    }
  };
  // --- Helper Functions for Formatting ---
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- Loading & Error States ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] text-slate-700">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Event Unavailable</h2>
          <p className="text-slate-500">
            {error || "Could not load event data."}
          </p>
        </div>
      </div>
    );
  }

  const imageUrl = event.Cover_Image?.url
    ? event.Cover_Image.url.startsWith("http")
      ? event.Cover_Image.url
      : `${BASE_URL}${event.Cover_Image.url}`
    : "https://via.placeholder.com/1200x600?text=Event+Banner";

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      {/* --- Immersive Hero Section --- */}
      <div className="relative w-full h-[60vh] min-h-[500px] bg-[#0b101e]">
        <img
          src={imageUrl}
          alt={event.Event_Name}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b101e] via-[#0b101e]/60 to-transparent"></div>

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-36 sm:pb-44">
            {/* Category Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="bg-[#1e293b]/80 backdrop-blur-sm text-indigo-200 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {event.Category}
              </span>
              <span className="bg-[#1e293b]/80 backdrop-blur-sm text-slate-300 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                {event.Event_Type}
              </span>
            </div>

            {/* Title & Location */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-5 leading-tight">
              {event.Event_Name}
            </h1>
            <div className="flex items-center text-slate-200 font-medium text-lg gap-2.5">
              <MapPin className="w-5 h-5 text-rose-500" />
              <span>{event.Location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content area (Overlapping the Hero) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Quick Stats Bar */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 p-6 sm:p-8 flex flex-wrap gap-4 justify-between items-center text-center">
              <div className="flex-1 min-w-[120px]">
                <p className="text-[#64748b] text-xs font-bold mb-2 uppercase tracking-widest">
                  Date
                </p>
                <p className="text-[#0f172a] font-black text-lg sm:text-xl">
                  {formatDate(event.Date_TIme)}
                </p>
              </div>

              <div className="hidden sm:block w-px h-12 bg-slate-200"></div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#64748b] text-xs font-bold mb-2 uppercase tracking-widest">
                  Time
                </p>
                <p className="text-[#0f172a] font-black text-lg sm:text-xl">
                  {formatTime(event.Date_TIme)}
                </p>
              </div>

              <div className="hidden sm:block w-px h-12 bg-slate-200"></div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#64748b] text-xs font-bold mb-2 uppercase tracking-widest">
                  Duration
                </p>
                <p className="text-[#0f172a] font-black text-lg sm:text-xl">
                  {event.Duration} Hours
                </p>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 sm:p-10">
              <h2 className="text-2xl font-black text-[#0f172a] mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-indigo-600" />
                About The Event
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {event.Description}
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Checkout Card (Two-tone design) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 lg:-mt-12">
            <div className="rounded-[2rem] shadow-2xl shadow-slate-300/50 overflow-hidden bg-white">
              {/* Header of Checkout Card - Dark Theme */}
              <div className="bg-[#0f172a] p-8 flex justify-between items-start text-white">
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-1">
                    Tickets Starting From
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight">
                      ₹{event.Price}
                    </span>
                  </div>
                </div>
                {/* --- SHARE BUTTON WITH FUNCTION --- */}
                <button
                  onClick={handleShare}
                  title="Share Event"
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10 cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-5 h-5 text-slate-300" />
                  )}
                </button>
              </div>

              {/* Details List - Light Theme */}
              <div className="p-8">
                <ul className="space-y-6 mb-8">
                  <li className="flex items-start text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                      <CalendarDays className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                        When
                      </p>
                      <span className="font-bold text-slate-900 text-sm">
                        {formatDate(event.Date_TIme)}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                        Where
                      </p>
                      <span className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                        {event.Location}
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                      <UserSquare2 className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                        Restriction
                      </p>
                      <span className="font-bold text-slate-900 text-sm">
                        Age {event.Age_Limit}+
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start text-slate-700">
                    <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center mr-4 shrink-0 mt-0.5">
                      <Languages className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                        Language
                      </p>
                      <span className="font-bold text-slate-900 text-sm">
                        {event.Language}
                      </span>
                    </div>
                  </li>
                </ul>

                {/* Main Action Button */}
                
                <button
                  onClick={() => navigate(`/${adminId}/checkout/${documentId}`)} // <--- Added onClick
                  className="w-full cursor-pointer relative group overflow-hidden rounded-xl p-[2px]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <div className="relative flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white py-3.5 rounded-xl font-bold text-base transition-colors">
                    <Ticket className="w-5 h-5" />
                    <span>Get Tickets Now</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBookingTicketPage;
