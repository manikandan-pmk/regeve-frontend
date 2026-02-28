import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BiddingForm = () => {
  const { documentId } = useParams();

  // 🔹 STATES
  const [biddingName, setBiddingName] = useState("");
  const [isFetchingInfo, setIsFetchingInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // Replaced 'message' with floating 'toast'
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

  const [files, setFiles] = useState({
    Photo: null,
    id_Proof: null,
  });

  // 🔹 FETCH BIDDING DETAILS
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
  }, [documentId]);

  // 🔹 AUTO-HIDE TOAST ALERTS (3 SECONDS)
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  // 🔹 HANDLERS
  const showToast = (type, text) => setToast({ type, text });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phonenumber" || name === "whatsappnumber") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      if (onlyNums.length <= 10)
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles || !selectedFiles[0]) return;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
  };

  // 🔹 UPLOAD FILE TO STRAPI MEDIA LIBRARY
  const uploadFileToStrapi = async (file) => {
    const formData = new FormData();
    formData.append("files", file);

    const response = await axios.post(
      "https://api.regeve.in/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data[0].id; // return media ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);

    if (formData.phonenumber.length !== 10)
      return showToast("error", "Phone Number must be exactly 10 digits.");
    if (formData.whatsappnumber.length !== 10)
      return showToast("error", "WhatsApp Number must be exactly 10 digits.");
    if (!files.Photo) return showToast("error", "Please upload a Photo.");
    if (!files.id_Proof)
      return showToast("error", "Please upload an ID Proof.");

    setLoading(true);

    try {
      // 🔥 1️⃣ Upload files first
      const photoId = await uploadFileToStrapi(files.Photo);
      const idProofId = await uploadFileToStrapi(files.id_Proof);

      // 🔥 2️⃣ Then create participant
      const response = await axios.post(
        "https://api.regeve.in/api/bidding-participants/create",
        {
          data: {
            biddingId: realBiddingId,
            name: formData.name,
            phonenumber: Number(formData.phonenumber),
            whatsappnumber: Number(formData.whatsappnumber),
            age: Number(formData.age),
            gender: formData.gender,
            Photo: photoId, // 👈 attach media ID
            Id_Proof: idProofId, // 👈 attach media ID
          },
        },
      );

      const result = response.data;

      setCandidateInfo({
        name: formData.name,
        candidateId: result.data.candidateid,
        biddingName: biddingName,
      });

      setShowSuccessPopup(true);

      setFormData({
        name: "",
        phonenumber: "",
        whatsappnumber: "",
        age: "",
        gender: "Male",
      });

      setFiles({ Photo: null, id_Proof: null });
      e.target.reset();
    } catch (error) {
      showToast("error", "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!documentId) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-xl shadow-red-500/10 border border-red-100">
          ⚠️
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
          Invalid Link
        </h2>
        <p className="text-slate-500 mt-2 font-medium">
          This registration link is broken or missing.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 flex items-center justify-center font-sans relative overflow-hidden">
      {/* 🔹 BACKGROUND BLOBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* 🔹 FLOATING TOAST ALERT */}
      {toast && (
        <div className="fixed top-6 right-6 z-[200] animate-slide-in">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${toast.type === "error" ? "bg-red-500/90 border-red-400 text-white" : "bg-slate-900/90 border-slate-700 text-white"}`}
          >
            <span>{toast.type === "error" ? "⚠️" : "✨"}</span>
            <p className="font-semibold text-sm tracking-wide">{toast.text}</p>
          </div>
        </div>
      )}

      {/* 🔹 SUCCESS POPUP MODAL */}
      {showSuccessPopup && candidateInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => setShowSuccessPopup(false)}
          ></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden transform animate-pop-in">
            <div className="pt-10 pb-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-400 to-emerald-300 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <svg
                  className="w-10 h-10 text-white"
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
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.25em]">
                Success
              </h3>
            </div>
            <div className="px-8 pb-10">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100">
                <p className="text-slate-400 text-xs font-bold uppercase mb-2">
                  Candidate ID
                </p>
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                  {candidateInfo.candidateId}
                </div>
              </div>
              <p className="text-center text-slate-500 text-sm mt-6 font-medium">
                Welcome aboard,{" "}
                <span className="text-slate-900 font-bold">
                  {candidateInfo.name}
                </span>
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full mt-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-slate-900/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 MAIN FORM */}
      <div className="relative max-w-xl w-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden z-10">
        {/* HEADER */}
        <div className="bg-slate-900 px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            {isFetchingInfo ? (
              <div className="h-10 w-48 bg-slate-800 rounded-lg animate-pulse mb-3"></div>
            ) : (
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                {biddingName}
              </h2>
            )}
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold tracking-[0.15em] uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>{" "}
              Registration
            </span>
          </div>
        </div>

        {/* FORM FIELDS */}
        <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8">
          <div className="space-y-6">
            {/* FULL NAME */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <svg
                  className="absolute left-4 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold shadow-sm"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            {/* CUSTOM FILE UPLOADS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: "Photo", name: "Photo" },
                { label: "ID Proof", name: "id_Proof" },
              ].map((field) => (
                <div key={field.name} className="relative group">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                    {field.label}
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 bg-slate-50 rounded-2xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group-hover:shadow-sm">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      {files[field.name] ? (
                        <>
                          <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          </div>
                          <p className="text-xs font-bold text-slate-700 truncate max-w-[120px]">
                            {files[field.name].name}
                          </p>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-8 h-8 mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                            ></path>
                          </svg>
                          <p className="text-xs font-semibold text-slate-500">
                            Click to upload
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      name={field.name}
                      required
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* AGE & GENDER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="18"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold shadow-sm"
                  placeholder="18+"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-semibold shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200/60" />

          {/* CONTACT INFO */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Phone Number
              </label>
              <div className="flex shadow-sm rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-all border border-slate-200 bg-white">
                <span className="flex items-center justify-center px-4 bg-slate-50 border-r border-slate-200 text-slate-500 font-bold text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  name="phonenumber"
                  required
                  value={formData.phonenumber}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-transparent outline-none font-semibold text-slate-900 placeholder-slate-400"
                  placeholder="00000 00000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 ml-1">
                WhatsApp Number
              </label>
              <div className="flex shadow-sm rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500 transition-all border border-slate-200 bg-white">
                <span className="flex items-center justify-center px-4 bg-emerald-50 border-r border-slate-200 text-emerald-600 font-bold text-sm">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  WA
                </span>
                <input
                  type="tel"
                  name="whatsappnumber"
                  required
                  value={formData.whatsappnumber}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-transparent outline-none font-semibold text-slate-900 placeholder-slate-400"
                  placeholder="00000 00000"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`relative overflow-hidden w-full py-5 rounded-2xl font-black text-lg tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3 ${loading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 active:translate-y-0"}`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 text-slate-500"
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
                "Complete Registration"
              )}
            </button>
            <p className="text-center text-xs font-semibold text-slate-400 mt-6 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
              Secure 256-bit Encrypted Process
            </p>
          </div>
        </form>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideIn { 0% { opacity: 0; transform: translateX(50px); } 100% { opacity: 1; transform: translateX(0); } }
       
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-pop-in { animation: popIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default BiddingForm;
