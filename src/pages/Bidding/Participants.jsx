import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Participants() {
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  // 🔹 NEW: Search State
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 NEW: Custom Toast State
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000,
    );
  };

  // 🔹 FETCH PARTICIPANTS
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("jwt");

      const res = await axios.get(
        `https://api.regeve.in/api/bidding-participants?documentId=${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setParticipants(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch participants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchParticipants();
    }
  }, [documentId]);

  // 🔹 VERIFY PARTICIPANT
  const verifyParticipant = async (candidateid) => {
    try {
      const token = localStorage.getItem("jwt");
      setProcessingId(candidateid);

      await axios.put(
        `https://api.regeve.in/api/bidding-participants/${candidateid}`,
        {
          data: {
            is_verified: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchParticipants();
      showToast("Participant successfully verified!", "success");
    } catch (error) {
      console.error("FULL ERROR:", error.response?.data || error.message);
      showToast("Error verifying participant.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleBack = () => {
    navigate(`/${adminId}/bidding-dashboard/${documentId}`);
  };

  // 🔹 COPY REGISTRATION LINK
  const copyLink = () => {
    const publicLink = `${window.location.origin}/#/${adminId}/bid/${documentId}`;
    navigator.clipboard.writeText(publicLink);
    showToast("Registration Link Copied to Clipboard!", "success");
  };

  // 🔹 EXPORT CSV
  const exportCSV = () => {
    if (participants.length === 0)
      return showToast("No data to export", "error");
    const headers = [
      "S.No",
      "Name",
      "Draw ID",
      "Phone Number",
      "WhatsApp",
      "Age",
      "Gender",
      "Status",
      "Winner",
    ];
    const csvRows = [headers.join(",")];

    participants.forEach((p, index) => {
      const row = [
        index + 1,
        `"${p.name || ""}"`,
        `"${p.candidateid || ""}"`,
        `"${p.phonenumber || ""}"`,
        `"${p.whatsappnumber || ""}"`,
        p.age || "",
        p.gender || "",
        p.is_verified ? "Verified" : "Pending",
        p.is_winned_candidate ? "Yes" : "No",
      ];
      csvRows.push(row.join(","));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants_${documentId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast("CSV Exported Successfully!", "success");
  };

  // 🔹 NEW: SEARCH LOGIC
  const filteredParticipants = participants.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.candidateid && p.candidateid.toLowerCase().includes(term)) ||
      (p.phonenumber && p.phonenumber.includes(term))
    );
  });

  // 🔹 METRICS
  const totalCount = participants.length;
  const verifiedCount = participants.filter((p) => p.is_verified).length;
  const winnersCount = participants.filter((p) => p.is_winned_candidate).length;
  const pendingCount = totalCount - verifiedCount;

  const displayBiddingId =
    participants[0]?.bidding?.biddingid ||
    documentId?.substring(0, 6).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] font-sans text-slate-900 pb-20 relative overflow-hidden">
      {/* 🔹 CUSTOM TOAST NOTIFICATION */}
      <div
        className={`fixed top-6 right-6 z-50 transform transition-all duration-500 ease-out ${toast.show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0 pointer-events-none"}`}
      >
        <div
          className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${toast.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-white border-emerald-100 text-emerald-700"}`}
        >
          <span className="text-xl">
            {toast.type === "error" ? "⚠️" : "🎉"}
          </span>
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* 🔹 TOP NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <button
          onClick={handleBack}
          className="cursor-pointer flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all duration-300 group mb-6"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Dashboard
        </button>

        {/* 🔹 PAGE HEADER & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-800 tracking-tight mb-3 drop-shadow-sm">
              Manage Participants
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-default">
                🎯 ID:{" "}
                <span className="text-indigo-600 font-black">
                  {displayBiddingId}
                </span>
              </span>
              <span className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-default">
                👥 {totalCount} Participants
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={copyLink}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                ></path>
              </svg>
              Copy Link
            </button>
            <button
              onClick={exportCSV}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-slate-800 hover:to-slate-700 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              <svg
                className="w-5 h-5 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* 🔹 STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Total Entries"
            count={totalCount}
            subtitle="All registered participants"
            icon="👥"
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
          <StatCard
            title="Verified"
            count={verifiedCount}
            subtitle="Successfully verified"
            icon="✅"
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            title="Winners"
            count={winnersCount}
            subtitle="Lucky drawn winners"
            icon="🏆"
            color="text-amber-500"
            bg="bg-amber-50"
          />
          <StatCard
            title="Pending"
            count={pendingCount}
            subtitle="Awaiting verification"
            icon="⏳"
            color="text-slate-500"
            bg="bg-slate-100"
          />
        </div>

        {/* 🔹 TABLE SECTION */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60">
          {/* 🔹 Table Header & Search */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800">
                Participant Roster
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Showing{" "}
                <span className="text-slate-900 font-bold">
                  {filteredParticipants.length}
                </span>{" "}
                results
              </p>
            </div>

            {/* 🔹 NEW: SEARCH BAR */}
            <div className="relative group w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full sm:w-80 pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 shadow-sm font-bold"
                placeholder="Search name, phone, or ID..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500 font-black">
                  <th className="px-6 py-5">S.No</th>
                  <th className="px-6 py-5">Participant</th>
                  <th className="px-6 py-5">Draw ID</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-center">Winner</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-slate-500"
                    >
                      <div className="flex justify-center mb-4">
                        <svg
                          className="animate-spin h-10 w-10 text-indigo-600 drop-shadow-md"
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
                      </div>
                      <span className="font-bold text-lg animate-pulse">
                        Loading participants...
                      </span>
                    </td>
                  </tr>
                ) : filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4 shadow-inner">
                        {searchTerm ? (
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-800">
                        {searchTerm
                          ? "No match found"
                          : "No participants found"}
                      </h3>
                      <p className="text-slate-500 font-medium mt-2">
                        {searchTerm
                          ? `No results for "${searchTerm}"`
                          : "Share the registration link to get started."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  // 🔹 Render Filtered List
                  filteredParticipants.map((p, index) => (
                    <tr
                      key={p.documentId}
                      className="hover:bg-indigo-50/40 transition-colors duration-300 group"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-extrabold text-slate-400 group-hover:text-indigo-400 transition-colors">
                        {index + 1 < 10 ? `0${index + 1}` : index + 1}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-black text-lg shadow-sm group-hover:shadow-md transition-shadow">
                            {p.name ? p.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-slate-900">
                              {/* Highlight Search match if needed, for now just text */}
                              {p.name || "Unknown"}
                            </p>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                              {p.phonenumber || "No Phone"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-extrabold text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-sm">
                          {p.candidateid || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {p.is_verified ? (
                          <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide border border-emerald-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>{" "}
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide border border-amber-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>{" "}
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-center">
                        {p.is_winned_candidate ? (
                          <span
                            className="inline-block text-2xl drop-shadow-md animate-bounce"
                            title="Winner"
                          >
                            🏆
                          </span>
                        ) : (
                          <span className="text-slate-300 font-bold text-sm">
                            -
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        {!p.is_verified ? (
                          <button
                            onClick={() => verifyParticipant(p.candidateid)}
                            disabled={processingId === p.documentId}
                            className="cursor-pointer inline-flex items-center justify-center px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-extrabold rounded-xl hover:from-indigo-700 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                          >
                            {processingId === p.documentId ? (
                              <span className="flex items-center gap-2">
                                <svg
                                  className="animate-spin h-4 w-4 text-white"
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
                                Verifying...
                              </span>
                            ) : (
                              "Verify Now"
                            )}
                          </button>
                        ) : (
                          <button className="cursor-not-allowed p-2.5 text-slate-300 rounded-xl bg-slate-50 border border-slate-100">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {!loading && participants.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 text-sm text-slate-500 flex justify-between items-center font-medium">
              <p>
                Showing{" "}
                <span className="font-black text-slate-800">
                  {filteredParticipants.length}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-800">{totalCount}</span>{" "}
                participants
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* 🔹 HELPER COMPONENTS (Unchanged) */
function StatCard({ title, count, subtitle, icon, color, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col group cursor-default">
      <div className="text-sm font-extrabold text-slate-500 mb-4 flex justify-between items-start uppercase tracking-wider">
        {title}
        <div
          className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
      <div className="text-4xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-indigo-900 transition-colors">
        {count}
      </div>
      <div className="text-xs font-bold text-slate-400">{subtitle}</div>
    </div>
  );
}
