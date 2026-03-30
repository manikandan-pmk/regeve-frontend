import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Receipt,
  ArrowRight,
  ShieldCheck,
  X,
  Copy,
  Download,
  CheckCircle2,
  TicketCheck,
  MessageCircle,
  CreditCard,
  QrCode
} from "lucide-react";
import axios from "axios";

// IMPORTANT: Match your backend URL
const BASE_URL = "https://api.regeve.in";

const EventTicketBookingForm = () => {
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();

  // --- Event & Loading State ---
  const [event, setEvent] = useState(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // --- Form & Success State ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    age: "",
    gender: "Male",
  });

  const [paymentPreview, setPaymentPreview] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Fetch Event Details ---
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setIsLoadingEvent(true);
        const response = await axios.get(
          `${BASE_URL}/api/event-ticket-bookings/${adminId}/${documentId}`
        );

        const resData = response.data?.data;
        if (Array.isArray(resData) && resData.length > 0) {
          setEvent(resData[0]);
        } else if (resData && typeof resData === "object") {
          setEvent(resData);
        }
      } catch (err) {
        console.error("Failed to fetch event details", err);
      } finally {
        setIsLoadingEvent(false);
      }
    };

    if (adminId && documentId) {
      fetchEventData();
    }
  }, [adminId, documentId]);

  // --- Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, setPreview, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (setPreview, setFile) => {
    setPreview(null);
    setFile(null);
  };

  const copyUpiToClipboard = () => {
    if (event?.Upi_Id) {
      navigator.clipboard.writeText(event.Upi_Id);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const downloadQRCode = async () => {
    if (!event?.QR_Code?.url) return;
    const imageUrl = event.QR_Code.url.startsWith("http") 
      ? event.QR_Code.url 
      : `${BASE_URL}${event.QR_Code.url}`;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${event.Event_Name.replace(/\s+/g, "_")}_UPI_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download QR code", error);
      window.open(imageUrl, "_blank");
    }
  };

  // --- Submit Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentFile) {
      alert("Please upload a Payment Screenshot.");
      return;
    }

    setIsSubmitting(true);

    try {
      let paymentProofId = null;

      if (paymentFile) {
        const paymentData = new FormData();
        paymentData.append("files", paymentFile);
        const paymentRes = await axios.post(`${BASE_URL}/api/upload`, paymentData);
        paymentProofId = paymentRes.data[0].id;
      }

      const payload = {
        Name: formData.name,
        Email: formData.email,
        WhatsApp_Number: `91${formData.whatsapp}`,
        Age: parseInt(formData.age, 10),
        Gender: formData.gender,
        Payment_Proof: paymentProofId
      };

      await axios.post(
        `${BASE_URL}/api/event-ticket-booking-participation/${adminId}/${documentId}`,
        payload
      );

      setIsSuccess(true);

    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.error?.message || error.response?.data || "Failed to submit registration. Please try again.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const qrUrl = event?.QR_Code?.url 
    ? (event.QR_Code.url.startsWith("http") ? event.QR_Code.url : `${BASE_URL}${event.QR_Code.url}`)
    : null;

  return (
    <div className="min-h-screen bg-[#f4f6f8] font-sans py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center selection:bg-indigo-100 selection:text-indigo-900">
      
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden relative transition-all duration-500 border border-slate-100">
        
        {/* --- CONDITIONAL RENDER: SUCCESS SCREEN vs FORM --- */}
        {isSuccess ? (
          <div className="p-12 sm:p-24 text-center flex flex-col items-center justify-center bg-white">
            
            <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-8 shadow-inner relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-50"></div>
              <CheckCircle2 className="w-14 h-14 text-emerald-500 relative z-10" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-5 tracking-tight">
              Registration Successful!
            </h2>
            
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-10 max-w-lg mx-auto shadow-sm">
              <div className="flex justify-center mb-4">
                <TicketCheck className="w-10 h-10 text-indigo-500" />
              </div>
              <p className="text-slate-700 font-semibold text-lg mb-4 leading-relaxed">
                Your ticket is booked and currently pending verification.
              </p>
              <div className="flex items-center justify-center gap-3 mt-4 text-emerald-700 bg-emerald-50 py-3 px-5 rounded-2xl border border-emerald-100">
                <MessageCircle className="w-6 h-6 shrink-0" />
                <p className="text-sm font-bold text-left">
                  We will send your official Ticket QR Code to your WhatsApp shortly.
                </p>
              </div>
            </div>

            
            
          </div>
        ) : (
          <>
            {/* Header Section */}
            <div className="bg-[#0f172a] p-10 sm:p-14 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-40 bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl rounded-full pointer-events-none"></div>
              
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight relative z-10">Complete Registration</h2>
              <p className="text-slate-400 mt-3 font-medium text-base relative z-10 max-w-xl mx-auto">
                {event?.Event_Name ? `Secure your spot for ${event.Event_Name}` : "Secure your spot. Please fill in your details accurately."}
              </p>
            </div>

            {/* Form Section */}
            <div className="p-8 sm:p-14">
              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* --- 1. Personal Details --- */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                    <h3 className="text-xl font-black text-slate-900">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 block">Full Name</label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 block">Email Address</label>
                      <div className="relative flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Number (+91 Default) */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 block">WhatsApp Number</label>
                      <div className="relative flex shadow-sm rounded-2xl">
                        <span className="inline-flex items-center px-5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-2xl text-slate-600 font-black text-sm">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="whatsapp"
                          required
                          maxLength="10"
                          pattern="[0-9]{10}"
                          title="Please enter a valid 10-digit mobile number"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          className="w-full pl-4 pr-12 py-4 bg-slate-50/50 border border-slate-200 rounded-r-2xl text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300"
                          placeholder="98765 43210"
                        />
                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Age & Gender Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">Age</label>
                        <div className="relative flex items-center">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-slate-400" />
                          </div>
                          <input
                            type="number"
                            name="age"
                            required
                            min="1"
                            max="120"
                            value={formData.age}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 shadow-sm"
                            placeholder="24"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 block">Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 shadow-sm appearance-none cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full"></div>

                {/* --- 2. Payment & Verification --- */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">2</div>
                    <h3 className="text-xl font-black text-slate-900">Payment & Verification</h3>
                  </div>

                  {event && (
                    <div className="bg-gradient-to-br from-indigo-50/80 to-white border border-indigo-100 rounded-[2rem] p-8 sm:p-10 flex flex-col lg:flex-row items-center gap-10 shadow-sm mb-10">
                      
                      <div className="flex-1 space-y-6 w-full">
                        <div>
                          <h3 className="text-2xl font-black text-slate-900">Payment Instructions</h3>
                          <p className="text-base text-slate-600 mt-2 font-medium">
                            Complete your payment using the UPI ID or QR Code, then upload the success screenshot below.
                          </p>
                        </div>

                        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm w-fit">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount to Pay</p>
                            <p className="text-3xl font-black text-emerald-600">₹{event.Price}</p>
                          </div>
                        </div>

                        {event.Upi_Id && (
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Transfer to UPI ID</label>
                            <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm w-full max-w-md">
                              <span className="font-mono text-slate-900 font-bold text-lg">{event.Upi_Id}</span>
                              <button
                                type="button"
                                onClick={copyUpiToClipboard}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                              >
                                {copiedUpi ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                {copiedUpi ? "Copied!" : "Copy"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {qrUrl && (
                        <div className="shrink-0 flex flex-col items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                          <div className="w-48 h-48 bg-white p-2 rounded-xl mb-4 relative group">
                            <img 
                              src={qrUrl} 
                              alt="Payment QR Code" 
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                               <QrCode className="w-10 h-10 text-indigo-600" />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={downloadQRCode}
                            className="flex items-center justify-center w-full gap-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Save QR Code
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* --- Upload Section (Centered single column now) --- */}
                  <div className="flex justify-center">
                    <div className="space-y-4 w-full max-w-lg">
                      <label className="text-sm font-bold text-slate-700 block text-center">Upload Payment Screenshot</label>
                      <div className="relative border-2 border-dashed border-emerald-200 rounded-[2rem] bg-emerald-50/30 hover:bg-emerald-50/80 transition-all duration-300 flex flex-col justify-center items-center h-64 overflow-hidden group cursor-pointer shadow-sm">
                        {paymentPreview ? (
                          <>
                            <img src={paymentPreview} alt="Payment Preview" className="w-full h-full object-cover" />
                            <button 
                              type="button" 
                              onClick={() => removeImage(setPaymentPreview, setPaymentFile)}
                              className="absolute top-4 right-4 bg-white text-red-500 p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-emerald-100 mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                              <Receipt className="w-8 h-8 text-emerald-500" />
                            </div>
                            <span className="text-base font-bold text-slate-700">Upload transaction receipt</span>
                            <span className="text-sm font-bold text-emerald-600 mt-1 bg-emerald-100 px-3 py-1 rounded-lg">₹{event?.Price || "Amount"}</span>
                            <input 
                              type="file" 
                              accept="image/*" 
                              required
                              onChange={(e) => handleImageChange(e, setPaymentPreview, setPaymentFile)}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- Submit Button --- */}
                <div className="pt-8">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full relative group overflow-hidden rounded-2xl p-[2px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300'}`}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <div className="relative flex items-center justify-center gap-3 bg-[#0f172a] hover:bg-[#1e293b] text-white py-5 rounded-2xl font-black text-xl transition-colors">
                      {isSubmitting ? (
                        <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ShieldCheck className="w-6 h-6" />
                          <span> Complete Registration</span>
                          <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </button>
                  <p className="text-center text-sm font-medium text-slate-400 mt-6 flex items-center justify-center gap-1.5">
                    By confirming, you agree to the Event Terms & Conditions.
                  </p>
                </div>

              </form>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default EventTicketBookingForm;