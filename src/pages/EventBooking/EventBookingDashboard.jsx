import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search,
  Receipt,
  Bell,
  Users,
  CheckCircle2,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  Wallet,
  XCircle,
  Building2,
  UserCheck,
  Ticket,
} from "lucide-react";
import axios from "axios";

// IMPORTANT: Replace with your actual backend URL
const BASE_URL = "https://api.regeve.in";

const EventBookingDashboard = () => {
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();

  // --- State Management ---
  const [eventDetails, setEventDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  

  // --- Fetch API Data ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("jwt");

        const response = await axios.get(
          `${BASE_URL}/api/event-ticket-bookings/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const resData = response.data?.data;
        const eventData =
          Array.isArray(resData) && resData.length > 0 ? resData[0] : resData;

        if (eventData) {
          setEventDetails(eventData);

          if (eventData.event_ticket_booking_participations) {
            const mappedParticipants =
              eventData.event_ticket_booking_participations.map((p) => ({
                id: p.documentId,
                name: p.Name,
                email: p.Email,
                whatsapp: `+${p.WhatsApp_Number}`,
                age: p.Age,
                gender: p.Gender,
                status: p.Participant_Status,
                photo: p.Photo?.url
                  ? `${BASE_URL}${p.Photo.url}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.Name)}&background=f8fafc&color=0f172a&bold=true`,
                paymentProof: p.Payment_Proof?.url
                  ? `${BASE_URL}${p.Payment_Proof.url}`
                  : "https://via.placeholder.com/400x600?text=Proof+Not+Available",
                isVerified: p.Payment_Status === "Paid",
              }));

            mappedParticipants.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
            setParticipants(mappedParticipants);
          }
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (adminId && documentId) {
      fetchDashboardData();
    }
  }, [adminId, documentId]);

  // --- Handlers ---
 const handleToggleVerify = async (participationId, currentVerifiedStatus) => {
  // ✅ Optimistic UI update
  setParticipants((prev) =>
    prev.map((p) =>
      p.id === participationId
        ? { ...p, isVerified: !currentVerifiedStatus }
        : p
    )
  );

  try {
    const token = localStorage.getItem("jwt");

    await axios.put(
      `${BASE_URL}/api/participation/verify-payment/${participationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setToast({
      show: true,
      message: currentVerifiedStatus
        ? "Verification revoked!"
        : "Payment verified!",
      type: "success",
    });

  } catch (error) {
    // ❌ revert if API fails
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participationId
          ? { ...p, isVerified: currentVerifiedStatus }
          : p
      )
    );

    setToast({
      show: true,
      message: "Failed to update payment status.",
      type: "error",
    });
  }
};

  const handleViewClick = (participant) => {
    setSelectedParticipant(participant);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedParticipant(null), 200);
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/#/${adminId}/events/${documentId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setToast({
          show: true,
          message: "Live Event URL copied!",
          type: "success",
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
      })
      .catch(() => {
        setToast({ show: true, message: "Failed to copy URL.", type: "error" });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
      });
  };

  // --- Dynamic Calculations ---
  const ticketPrice = eventDetails ? parseInt(eventDetails.Price, 10) : 0;
  const totalParticipants = participants.length;
  const verifiedCount = participants.filter((p) => p.isVerified).length;
  const pendingCount = totalParticipants - verifiedCount;
  const totalRevenue = verifiedCount * ticketPrice;
  const attendedCount = participants.filter((p) => p.status === "Approved" || String(p.status).toLowerCase() === "true").length; 
  

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold tracking-wide uppercase text-sm">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* --- Top Header --- */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-6 lg:px-10 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100/50 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                {eventDetails?.Event_Name || "Event Dashboard"}
              </h1>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Admin Panel • {totalParticipants} Registrations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={handleCopyUrl}
              className="hidden sm:flex items-center bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Event Page
            </button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
            <button className="text-slate-400 hover:text-slate-700 relative transition-colors p-2 rounded-full hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-2 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-slate-100">
              {eventDetails?.admin?.Company_Name?.charAt(0) || "AD"}
            </div>
          </div>
        </header>

        {/* --- Scrollable Content --- */}
        <div className="flex-1 overflow-auto p-6 lg:p-10">
          {/* Stats Grid */}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            
            {/* 1. Total Participants */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col relative z-10">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 border border-blue-100/50">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Total Registered
                </p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {totalParticipants}
                </p>
              </div>
            </div>

            {/* 2. Verified */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col relative z-10">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100/50">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Verified
                </p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {verifiedCount}
                </p>
              </div>
            </div>

            {/* 3. Pending */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col relative z-10">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4 border border-amber-100/50">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Pending Review
                </p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {pendingCount}
                </p>
              </div>
            </div>

            {/* 4. Attended */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col relative z-10">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 border border-purple-100/50">
                  <UserCheck className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Attended
                </p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {attendedCount}
                </p>
              </div>
            </div>

            {/* 5. Total Revenue */}
            <div className="bg-slate-900 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
              <div className="flex flex-col relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-4 border border-white/10 backdrop-blur-sm">
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                  Total Revenue
                </p>
                <p className="text-3xl font-black text-white mt-1">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

          </div>
          {/* Participants Table */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">
                Participant Roster
              </h2>
              <div className="flex items-center gap-2 text-sm bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/60">
                <Ticket className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-500">
                  Ticket Price:
                </span>
                <span className="font-black text-slate-900">
                  ₹{ticketPrice}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-4">Participant Info</th>
                    <th className="px-8 py-4">Contact Details</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Payment Action</th>
                    <th className="px-8 py-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <Users className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="font-semibold text-base text-slate-500">
                            No participants yet
                          </p>
                          <p className="text-sm mt-1">
                            Registrations will appear here.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    participants.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Photo & Basic Info */}
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={p.photo}
                              alt={p.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-200 bg-white shadow-sm"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                                {p.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="px-8 py-4">
                          <p className="text-slate-700 font-semibold">
                            {p.email}
                          </p>
                          <p className="text-slate-500 text-xs mt-1 font-mono">
                            {p.whatsapp}
                          </p>
                        </td>

                        {/* Status Badge */}
                        <td className="px-8 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wide border ${
                              p.isVerified
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                : "bg-amber-50 text-amber-700 border-amber-200/60"
                            }`}
                          >
                            {p.isVerified ? (
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            {p.isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>

                        {/* Toggle Switch */}
                        <td className="px-8 py-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={p.isVerified}
                              disabled={p.isVerified}
                              onChange={() =>
                                handleToggleVerify(p.id, p.isVerified)
                              }
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                            <span className="ml-3 text-xs font-bold text-slate-500 w-12">
                              {p.isVerified ? "Valid" : "Verify"}
                            </span>
                          </label>
                        </td>

                        {/* View Button */}
                        <td className="px-8 py-4 text-right">
                          <button
                            onClick={() => handleViewClick(p)}
                            className="inline-flex items-center justify-center w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* --- Participant Detail Modal Popup --- */}
      {isModalOpen && selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>

          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="text-xl font-black text-slate-800">
                Registration Details
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors border border-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-full overflow-hidden bg-slate-50/30">
              {/* Left Column: Personal Details */}
              <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100">
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img
                      src={selectedParticipant.photo}
                      alt={selectedParticipant.name}
                      className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-slate-200 bg-white"
                    />
                    <div
                      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${selectedParticipant.isVerified ? "bg-emerald-500" : "bg-amber-500"}`}
                    >
                      {selectedParticipant.isVerified ? (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      ) : (
                        <Clock className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                      {selectedParticipant.name}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Email Address
                    </p>
                    <p
                      className="font-semibold text-slate-900 truncate"
                      title={selectedParticipant.email}
                    >
                      {selectedParticipant.email}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      WhatsApp
                    </p>
                    <p className="font-semibold text-slate-900 font-mono">
                      {selectedParticipant.whatsapp}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Age
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedParticipant.age} Years
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                      Gender
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedParticipant.gender}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Proof */}
              <div className="w-full md:w-[400px] flex flex-col bg-white">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">
                      Payment Proof
                    </h5>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Amount: ₹{ticketPrice}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-indigo-500" />
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto flex items-center justify-center bg-slate-100/50">
                  <div className="w-full rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white relative group">
                    <img
                      src={selectedParticipant.paymentProof}
                      alt="Payment Proof"
                      className="w-full h-auto max-h-[300px] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleToggleVerify(selectedParticipant.id);
                      closeModal();
                    }}
                    className={`w-full py-4 px-4 text-sm font-bold text-white rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                      selectedParticipant.isVerified
                        ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                        : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                    }`}
                  >
                    {selectedParticipant.isVerified ? (
                      <>Revoke Verification</>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" /> Approve & Verify
                        Payment
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs font-semibold text-slate-400 mt-3">
                    {selectedParticipant.isVerified
                      ? `This removes ₹${ticketPrice} from Total Revenue.`
                      : `This adds ₹${ticketPrice} to Total Revenue.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Animated Toast Notification --- */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-out transform ${
          toast.show
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm ${
            toast.type === "success"
              ? "bg-emerald-50/95 border-emerald-200 text-emerald-800"
              : "bg-red-50/95 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500 shrink-0" />
          )}
          <span className="font-bold text-sm tracking-wide">
            {toast.message}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventBookingDashboard;
