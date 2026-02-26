import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BiddingForm = () => {
  const { documentId } = useParams();

  // 🔹 STATES
  const [biddingName, setBiddingName] = useState("");
  const [isFetchingInfo, setIsFetchingInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [realBiddingId, setRealBiddingId] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    whatsappnumber: "",
    age: "",
    gender: "Male",
  });

  // 🔹 FETCH BIDDING DETAILS (For Dynamic Header)
  useEffect(() => {
    const fetchBiddingDetails = async () => {
      if (!documentId) return;

      try {
        const response = await axios.get(
          `https://api.regeve.in/api/biddings/public/${documentId}`,
        );

        const result = response.data;

        if (result && result.data) {
          setRealBiddingId(result.data.id);
          setBiddingName(
            result.data.attributes?.nameOfBid || "Registration Form",
          );
        } else {
          setBiddingName("Registration Form");
        }
      } catch (error) {
        setBiddingName("Registration Form");
      } finally {
        setIsFetchingInfo(false);
      }
    };

    fetchBiddingDetails();
  }, [documentId]); // ✅ fixed

  // 🔹 AUTO-HIDE SUCCESS POPUP AFTER 5 SECONDS
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        setCandidateInfo(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  // 🔹 EARLY RETURN FOR INVALID LINK
  if (!documentId) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg shadow-red-100">
          ⚠️
        </div>
        <h2 className="text-2xl font-black text-slate-800">Invalid Link</h2>
        <p className="text-slate-500 mt-2">
          This registration link is broken or missing.
        </p>
      </div>
    );
  }

  // 🔹 HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Strict number-only constraint for phone fields
    if (name === "phonenumber" || name === "whatsappnumber") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // 1️⃣ STRICT VALIDATION
    if (formData.phonenumber.length !== 10) {
      setMessage({
        type: "error",
        text: "Phone Number must be exactly 10 digits.",
      });
      return;
    }

    if (formData.whatsappnumber.length !== 10) {
      setMessage({
        type: "error",
        text: "WhatsApp Number must be exactly 10 digits.",
      });
      return;
    }

    setLoading(true);

    const payload = {
      data: {
        biddingId: realBiddingId,
        name: formData.name,
        phonenumber: Number(formData.phonenumber),
        whatsappnumber: Number(formData.whatsappnumber),
        age: Number(formData.age),
        gender: formData.gender,
      },
    };

    try {
      const response = await axios.post(
        "https://api.regeve.in/api/bidding-participants/create",
        payload,
      );

      const result = response.data;
      console.log("API Response:", result);

      // ✅ Success - Show both message and popup
      const successMessage = `Registration successful! Your Candidate ID is ${result.data.candidateid}`;

      setMessage({
        type: "success",
        text: successMessage,
      });

      // Set candidate info for popup
      setCandidateInfo({
        name: formData.name,
        candidateId: result.data.candidateid,
        biddingName: biddingName,
      });

      // Show success popup
      setShowSuccessPopup(true);

      console.log("Submitting with ID:", realBiddingId);

      // Reset form
      setFormData({
        name: "",
        phonenumber: "",
        whatsappnumber: "",
        age: "",
        gender: "Male",
      });
    } catch (error) {
      // Axios error handling
      if (error.response) {
        const backendMessage =
          error.response.data?.error?.message ||
          error.response.data?.message ||
          "Failed to submit registration.";

        setMessage({
          type: "error",
          text: backendMessage,
        });
      } else {
        setMessage({
          type: "error",
          text: "Network error. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
    setCandidateInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-sans selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* 🔹 SUCCESS POPUP ANIMATION */}
      {/* 🔹 SUCCESS POPUP UI/UX */}
      {/* 🔹 MINIMALIST SUCCESS POPUP */}
      {showSuccessPopup && candidateInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 animate-fade-in">
          {/* Ultra-dark backdrop to make the ID pop */}
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={closePopup}
          ></div>

          {/* Popup Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transform animate-pop-in">
            {/* Success Indicator */}
            <div className="pt-8 pb-4 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">
                Registration Successful
              </h3>
            </div>

            {/* Candidate ID Display */}
            <div className="px-8 pb-10">
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">
                  Your Candidate ID
                </p>
                <div className="text-4xl font-black text-indigo-600 tracking-tight">
                  {candidateInfo.candidateId}
                </div>
              </div>

              <p className="text-center text-slate-500 text-sm mt-6 font-medium">
                Welcome,{" "}
                <span className="text-slate-900 font-bold">
                  {candidateInfo.name}
                </span>
              </p>

              <button
                onClick={closePopup}
                className="w-full mt-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 MAIN FORM (existing code) */}
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-slate-300/50 overflow-hidden border border-white">
        {/* 🔹 HEADER SECTION */}
        <div className="bg-slate-900 px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative z-10">
            {isFetchingInfo ? (
              <div className="h-8 w-3/4 bg-slate-800 rounded animate-pulse mx-auto mb-2"></div>
            ) : (
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
                {biddingName}
              </h2>
            )}
            <p className="text-indigo-200 text-xs font-bold tracking-[0.2em] uppercase">
              Official Participant Registration
            </p>
          </div>
        </div>

        {/* 🔹 FORM SECTION */}
        <form onSubmit={handleSubmit} className="px-8 py-10 space-y-7">
          {/* Notifications */}
          {message && (
            <div
              className={`p-4 rounded-xl text-sm font-bold flex items-start gap-3 animate-fade-in-up ${
                message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              <span className="text-lg">
                {message.type === "error" ? "⚠️" : "✅"}
              </span>
              <span className="pt-0.5">{message.text}</span>
            </div>
          )}

          {/* Personal Information Group */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium"
                placeholder="Enter your legal name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="18"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium"
                  placeholder="Minimum 18"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Contact Information Group */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 text-slate-500 font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  name="phonenumber"
                  required
                  value={formData.phonenumber}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-r-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-emerald-50 text-emerald-600 font-bold">
                  WA
                </span>
                <input
                  type="tel"
                  name="whatsappnumber"
                  required
                  value={formData.whatsappnumber}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-r-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none font-medium"
                  placeholder="10-digit WhatsApp number"
                />
              </div>
            </div>
          </div>

          {/* 🔹 SUBMIT BUTTON */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-4 rounded-xl shadow-lg text-white font-bold text-lg tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-3
                ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed shadow-none"
                    : "bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-[0.98]"
                }
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Registration"
              )}
            </button>
            <p className="text-center text-xs font-medium text-slate-400 mt-5">
              By submitting this form, your data will be securely processed.
            </p>
          </div>
        </form>
      </div>

      {/* 🔹 ADD CUSTOM CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default BiddingForm;
