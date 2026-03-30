import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ParticipantTicketPage = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { adminId, participationId } = useParams();

  // Helper function to handle Strapi image URLs perfectly
  const getQrUrl = (qrPath) => {
    if (!qrPath) return "";
    // If it's already a full URL (like from Cloudinary/AWS), just return it
    if (qrPath.startsWith("http")) return qrPath;
    // Otherwise, append the domain, avoiding double slashes
    const baseUrl = "https://api.regeve.in";
    return qrPath.startsWith("/") ? `${baseUrl}${qrPath}` : `${baseUrl}/${qrPath}`;
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(
          `https://api.regeve.in/api/participant-ticket/${adminId}/${participationId}`
        );
        setTicket(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your ticket. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [adminId, participationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Generating your ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-gray-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-8">
      {/* --- Ticket Card --- */}
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Header / Event Details */}
        <div className="bg-indigo-600 text-white p-6 sm:p-8 text-center">
          <span className="uppercase tracking-widest text-xs font-semibold text-indigo-200">
            Admit One
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2 mb-1">
            {ticket.event?.name || "Event Name"}
          </h2>
          <p className="text-indigo-100 text-sm">
            {ticket.event?.date || "Date TBA"} • {ticket.event?.location || "Location TBA"}
          </p>
        </div>

        {/* Perforated Line Divider */}
        <div className="relative flex items-center px-4 -my-3 z-10">
          <div className="h-6 w-6 bg-gray-100 rounded-full shadow-inner absolute -left-3"></div>
          <div className="w-full border-t-2 border-dashed border-gray-300"></div>
          <div className="h-6 w-6 bg-gray-100 rounded-full shadow-inner absolute -right-3"></div>
        </div>

        {/* Body / Participant Details */}
        <div className="p-6 sm:p-8 pt-8">
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm sm:text-base mb-6">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Name</p>
              <p className="font-semibold text-gray-900 truncate">{ticket.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Phone</p>
              <p className="font-semibold text-gray-900 truncate">+      {ticket.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500 text-xs uppercase tracking-wider">Email</p>
              <p className="font-semibold text-gray-900 truncate">{ticket.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                ticket.status?.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {ticket.status || "Pending"}
              </span>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Payment</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                ticket.paymentStatus?.toLowerCase() === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {ticket.paymentStatus || "Unpaid"}
              </span>
            </div>
          </div>

          {/* QR Code Section */}
          {ticket.qr && (
            <div className="mt-4 flex flex-col items-center border-t border-gray-100 pt-6">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Scan at Entry</p>
              <button 
                onClick={() => setIsQrModalOpen(true)}
                className="hover:scale-105 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-100 rounded-xl"
              >
                <img
                  src={getQrUrl(ticket.qr)}
                  alt="Ticket QR Code"
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain p-2 border-2 border-gray-100 rounded-xl shadow-sm"
                />
              </button>
              <p className="text-xs text-gray-400 mt-2">Tap to enlarge</p>
            </div>
          )}
        </div>
      </div>

      {/* --- QR Code Modal Popup --- */}
      {isQrModalOpen && ticket.qr && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setIsQrModalOpen(false)} 
        >
          <div 
            className="bg-white rounded-2xl p-6 w-full max-w-sm relative shadow-2xl flex flex-col items-center transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 focus:outline-none"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-6 mt-2">Your Entry Code</h3>
            
            <img
              src={getQrUrl(ticket.qr)}
              alt="Enlarged QR Code"
              className="w-64 h-64 object-contain mb-4"
            />
            
            <p className="text-sm text-center text-gray-500">
              Show this QR code at the registration desk.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantTicketPage;