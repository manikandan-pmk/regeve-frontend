import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  PencilLine,
  Calendar,
  Users,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  X,
  Rocket,
  Type,
  Users2,
  Timer,
  CheckCircle2,
  IndianRupee,
  Settings2,
  Trash2,
  Info
} from "lucide-react";
import axios from "axios";

// 🔹 CONFIGURATION
const API_URL = "https://api.regeve.in/api/biddings";

export default function BiddingDashboard() {
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();
  const [biddings, setBiddings] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [successMessage, setSuccessMessage] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null); // Stores the bid object to delete
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBiddings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`${API_URL}/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let extractedData = [];
      const result = response.data;
      if (Array.isArray(result)) extractedData = result;
      else if (Array.isArray(result.data)) extractedData = result.data;
      else if (Array.isArray(result?.data?.data))
        extractedData = result.data.data;
      setBiddings(extractedData);
    } catch (error) {
      console.error("AXIOS ERROR:", error.response?.data || error.message);
      setBiddings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSingleBid = async (idToFetch) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${API_URL}/${idToFetch}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      setSelectedBid(result.data || result);
    } catch (error) {
      console.error("Error fetching single bid:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBid = (bid) => {
    // Instead of window.confirm, we just save the bid and show the UI
    setDeleteTarget(bid);
  };

  // 3. The actual API call triggered by the "Confirm" button in the popup
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("jwt");
      const id = deleteTarget.documentId || deleteTarget.id;

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeleteTarget(null); // Close popup
      fetchBiddings(); // Refresh list
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
      // You can add a "Error" state here to show an animated error message instead of alert
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      fetchSingleBid(documentId);
    } else {
      fetchBiddings();
      setSelectedBid(null);
    }
  }, [documentId]);

  const filteredAndSortedBiddings = biddings
    .filter(
      (bid) =>
        bid.nameOfBid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bid.biddingid?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "amount-high")
        return (parseInt(b.amount) || 0) - (parseInt(a.amount) || 0);
      if (sortBy === "amount-low")
        return (parseInt(a.amount) || 0) - (parseInt(b.amount) || 0);
      return 0;
    });

  const handleCardClick = (bid) => {
    const targetId = bid.documentId || bid.id;
    if (!targetId) return;
    navigate(`/${adminId}/bidding-dashboard/${targetId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => navigate(`/${adminId}/bidding-dashboard`);
  const currentView = documentId ? "detail" : "list";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[120px] animate-pulse-slower"></div>
      </div>

      {/* PROFESSIONAL DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop with a deeper blur */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-md overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
            {/* Top Warning Strip */}
            <div className="h-2 bg-red-500 w-full" />

            <div className="p-8">
              {/* Icon & Title Group */}
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
                  <Trash2 className="text-red-600" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Confirm Deletion
                  </h3>
                  <p className="text-slate-500 mt-1 text-sm leading-relaxed">
                    This action is permanent. All data associated with
                    <span className="font-semibold text-slate-800 ml-1">
                      "{deleteTarget.nameOfBid}"
                    </span>
                    will be removed from our servers.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-8">
                <button
                  disabled={isDeleting}
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-5 py-3 cursor-pointer rounded-xl text-slate-600 font-semibold hover:bg-slate-50 border border-slate-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  disabled={isDeleting}
                  onClick={confirmDelete}
                  className="flex-[1.5] px-5 cursor-pointer py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-red-400"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 cursor-pointer border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Delete Bidding"
                  )}
                </button>
              </div>
            </div>

            {/* Subtle Footer Note */}
            <div className="bg-slate-50 px-8 py-3 border-t border-slate-100 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                Secured Admin Action
              </span>
            </div>
          </div>
        </div>
      )}
      <Header
        adminId={adminId}
        onBack={handleBack}
        currentView={currentView}
        onCreate={() => setShowCreateModal(true)}
        hasItems={biddings.length > 0}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onRefresh={fetchBiddings}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-16">
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl shadow-sm animate-fade-in flex items-center gap-3">
            <span className="text-xl">✅</span> {successMessage}
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : currentView === "list" && biddings.length === 0 ? (
          <EmptyState onCreate={() => setShowCreateModal(true)} />
        ) : currentView === "list" ? (
          <DashboardOverview
            biddings={filteredAndSortedBiddings}
            onCardClick={handleCardClick}
            searchTerm={searchTerm}
            onEdit={(bid) => {
              setSelectedBid(bid);
              setShowCreateModal(true);
            }}
            onDelete={handleDeleteBid}
          />
        ) : (
          <SingleBiddingAdminPage
            bid={selectedBid}
            onBack={handleBack}
            adminId={adminId}
            navigate={navigate}
          />
        )}
      </main>

      {showCreateModal && (
        <CreateOrEditBiddingModal
          existingData={selectedBid}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedBid(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setSelectedBid(null);
            fetchBiddings();
          }}
        />
      )}
    </div>
  );
}

function Header({
  adminId,
  onBack,
  currentView,
  onCreate,
  hasItems,
  sortBy,
  onSortChange,
  onRefresh,
}) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={
              currentView === "detail"
                ? onBack
                : () => navigate(`/${adminId}/LuckyDrawHome`)
            }
            className="group cursor-pointer flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-indigo-50"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
            <span>{currentView === "detail" ? "Back" : "Dashboard"}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {currentView === "list" && hasItems && (
            <>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="hidden md:block cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="newest">Recent First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">High Value</option>
                <option value="amount-low">Low Value</option>
              </select>

              <button
                onClick={onRefresh}
                className="cursor-pointer p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100"
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
                    strokeWidth={2.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              <button
                onClick={onCreate}
                className="cursor-pointer flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>+</span>
                <span className="hidden sm:inline">New Bidding</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function DashboardOverview({
  biddings,
  onCardClick,
  searchTerm,
  onEdit,
  onDelete,
}) {
  return (
    <div className="space-y-8">
      {biddings.length === 0 ? (
        <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-xl font-medium">
            No matches found for "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {biddings.map((bid, index) => (
            <BiddingCard
              key={bid.documentId || bid.id || index}
              data={bid}
              index={index}
              onClick={() => onCardClick(bid)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BiddingCard({ data, index, onClick, onEdit, onDelete }) {
  // Added onDelete prop
  const {
    documentId, // Ensure you are using the ID needed for the API
    biddingid,
    nameOfBid,
    amount,
    maxPeople,
    durationUnit,
    durationValue,
  } = data;

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(data);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(data); // Call the delete function passed from parent
  };

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-[2rem] p-7 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500 cursor-pointer flex flex-col h-full overflow-hidden hover:-translate-y-1"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500" />

      {/* ACTION BUTTONS CONTAINER */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        {/* Trash/Delete Button */}
        <button
          onClick={handleDeleteClick}
          className="p-2.5 bg-red-50/80 backdrop-blur-md text-red-500 hover:text-white hover:bg-red-500 rounded-2xl shadow-sm border border-red-100 transition-all duration-300 cursor-pointer hover:rotate-12 active:scale-90"
          title="Delete Scheme"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>

        {/* Edit Button */}
        <button
          onClick={handleEditClick}
          className="p-2.5 bg-white/80 backdrop-blur-md text-slate-400 hover:text-indigo-600 hover:bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 cursor-pointer hover:rotate-12 active:scale-90"
          title="Edit Scheme"
        >
          <PencilLine size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Rest of your card content... */}
      <div className="relative z-10 flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
          <ShieldCheck size={28} />
        </div>
        <div>
          <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black tracking-widest uppercase mb-1">
            {biddingid?.split("-")[0] || "PREMIUM"}
          </span>
          <h3 className="text-xl font-bold text-slate-800 leading-tight">
            {nameOfBid}
          </h3>
        </div>
      </div>

      {/* Main Metric Area */}
      <div className="relative z-10 mb-8 p-5 bg-slate-50/80 rounded-[1.5rem] border border-white group-hover:bg-white group-hover:border-indigo-50 transition-all duration-500">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-1">
              Total Amount
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-slate-900">
                ₹{parseInt(amount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 flex items-center justify-between px-2 mb-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
              Duration
            </p>
            <p className="text-sm font-extrabold text-slate-700">
              {durationValue} {durationUnit}
            </p>
          </div>
        </div>
        <div className="h-8 w-px bg-slate-100" />
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={18} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
              Capacity
            </p>
            <p className="text-sm font-extrabold text-slate-700">
              {maxPeople} Slots
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between group/btn">
        <span className="text-sm font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
          Manage Scheme
        </span>
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900 text-white group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300">
          <ArrowRight size={20} />
        </div>
      </div>
    </div>
  );
}

// function CreateBiddingModal({ onClose, onSuccess }) {
//   const [formData, setFormData] = useState({
//     nameOfBid: "",
//     amount: "",
//     maxPeople: "",
//     durationValue: "",
//     durationUnit: "Monthly",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem("jwt");
//       const payload = {
//         data: {
//           nameOfBid: formData.nameOfBid.trim(),
//           amount: Number(formData.amount),
//           maxPeople: Number(formData.maxPeople),
//           durationValue: Number(formData.durationValue),
//           durationUnit: formData.durationUnit,
//         },
//       };
//       await axios.post(`${API_URL}/create`, payload, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       onSuccess();
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to create scheme");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (e) =>
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
//       <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border border-white">
//         <div className="px-10 py-8 bg-slate-900 text-white">
//           <h3 className="text-3xl font-black tracking-tight">Launch Scheme</h3>
//           <p className="text-slate-400 text-sm mt-1">
//             Configure your new chit fund parameters
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-10 space-y-6">
//           <div className="space-y-2">
//             <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
//               Scheme Title
//             </label>
//             <input
//               required
//               name="nameOfBid"
//               value={formData.nameOfBid}
//               onChange={handleChange}
//               className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
//               placeholder="Enter scheme name..."
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
//                 Total Amount (₹)
//               </label>
//               <input
//                 required
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
//                 placeholder="50,000"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
//                 Member Limit
//               </label>
//               <input
//                 required
//                 type="number"
//                 name="maxPeople"
//                 value={formData.maxPeople}
//                 onChange={handleChange}
//                 className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
//                 placeholder="20"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
//                 Duration
//               </label>
//               <input
//                 required
//                 type="number"
//                 name="durationValue"
//                 value={formData.durationValue}
//                 onChange={handleChange}
//                 className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
//                 placeholder="12"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-xs font-black text-slate-500 uppercase tracking-widest">
//                 Interval
//               </label>
//               <select
//                 name="durationUnit"
//                 value={formData.durationUnit}
//                 onChange={handleChange}
//                 className="w-full cursor-pointer px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
//               >
//                 <option value="Monthly">Monthly</option>
//                 <option value="Weekly">Weekly</option>
//               </select>
//             </div>
//           </div>

//           <div className="flex gap-4 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 cursor-pointer py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex-[2] cursor-pointer py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
//             >
//               {isSubmitting ? "Processing..." : "Create Scheme"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

function CreateOrEditBiddingModal({ onClose, onSuccess, existingData }) {
  const isEditMode = !!existingData?.documentId;

  // State for Form text data
  const [formData, setFormData] = useState({
    nameOfBid: existingData?.nameOfBid || "",
    amount: existingData?.amount || "",
    maxPeople: existingData?.maxPeople || "",
    durationValue: existingData?.durationValue || "",
    durationUnit: existingData?.durationUnit || "Monthly",
    Upi_Id: existingData?.Upi_Id || "",
  });

  // State for the uploaded media file
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState(existingData?.qrcode?.url || null);

  // State for UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear touched state for this field when user starts typing again
    if (touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQR = () => {
    setQrFile(null);
    setQrPreview(null);
    // Reset file input
    document.getElementById('qr-upload').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const requiredFields = ['nameOfBid', 'amount', 'maxPeople', 'durationValue', 'Upi_Id'];
    const missingFields = requiredFields.filter(field => !formData[field]?.toString().trim());
    
    if (missingFields.length > 0) {
      // Mark all fields as touched to show errors
      const newTouched = {};
      requiredFields.forEach(field => newTouched[field] = true);
      setTouched(newTouched);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("jwt");

      // Use FormData to handle file uploads
      const payload = new FormData();

      const jsonPayload = {
        nameOfBid: formData.nameOfBid.trim(),
        amount: Number(formData.amount),
        maxPeople: Number(formData.maxPeople),
        durationValue: Number(formData.durationValue),
        durationUnit: formData.durationUnit,
        Upi_Id: formData.Upi_Id.trim(),
      };

      // Append data object as string (Standard for Strapi/CMS media uploads)
      payload.append("data", JSON.stringify(jsonPayload));

      // Append file if selected
      if (qrFile) {
        payload.append("files.qrcode", qrFile);
      }

      const url = isEditMode
        ? `${API_URL}/${existingData.documentId}`
        : `${API_URL}/create`;

      const method = isEditMode ? "put" : "post";

      await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onSuccess();
    } catch (error) {
      console.error("EDIT ERROR:", error.response?.data || error.message);
      // Show user-friendly error message
      alert(error.response?.data?.error?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (fieldName) => {
    if (!touched[fieldName]) return null;
    const value = formData[fieldName];
    if (!value?.toString().trim()) return "This field is required";
    if (fieldName === 'amount' && value <= 0) return "Amount must be greater than 0";
    if (fieldName === 'maxPeople' && value <= 0) return "Member limit must be greater than 0";
    if (fieldName === 'durationValue' && value <= 0) return "Duration must be greater than 0";
    if (fieldName === 'Upi_Id' && !/^[\w.-]+@[\w.-]+$/.test(value)) return "Invalid UPI ID format";
    return null;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      {/* MAIN FORM MODAL */}
      <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex flex-col max-h-[96vh] overflow-hidden border border-slate-100">
        {/* HEADER */}
        <div className="relative px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white/80 rounded-xl transition-all hover:scale-105 active:scale-95"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              {isEditMode ? <Settings2 size={24} /> : <Rocket size={24} />}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEditMode ? "Modify Bidding" : "Launch New Bidding"}
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {isEditMode
                  ? "Update bidding pool parameters"
                  : "Configure your new bidding pool"}
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          id="bidding-form"
          className="px-8 py-6 overflow-y-auto space-y-5"
        >
          {/* Bidding Name - Full Width */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
              <span>Bidding Name</span>
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Type
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                required
                name="nameOfBid"
                value={formData.nameOfBid}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-base placeholder:text-slate-400 ${
                  getFieldError('nameOfBid') ? 'border-red-300 bg-red-50' : 'border-slate-100'
                }`}
                placeholder="e.g., Summer Special Bidding"
                aria-describedby="name-error"
              />
            </div>
            {getFieldError('nameOfBid') && (
              <p id="name-error" className="text-xs text-red-500 mt-1 ml-1 font-medium">
                {getFieldError('nameOfBid')}
              </p>
            )}
          </div>

          {/* Amount and Member Limit - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <span>Total Pool (₹)</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1"
                  step="1"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-base placeholder:text-slate-400 ${
                    getFieldError('amount') ? 'border-red-300 bg-red-50' : 'border-slate-100'
                  }`}
                  placeholder="50,000"
                />
              </div>
              {getFieldError('amount') && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">
                  {getFieldError('amount')}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <span>Member Limit</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users2
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  required
                  type="number"
                  name="maxPeople"
                  value={formData.maxPeople}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1"
                  step="1"
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-base placeholder:text-slate-400 ${
                    getFieldError('maxPeople') ? 'border-red-300 bg-red-50' : 'border-slate-100'
                  }`}
                  placeholder="20"
                />
              </div>
              {getFieldError('maxPeople') && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">
                  {getFieldError('maxPeople')}
                </p>
              )}
            </div>
          </div>

          {/* Duration and UPI ID - 2 columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <span>Duration</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <Timer
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    type="number"
                    name="durationValue"
                    value={formData.durationValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                    step="1"
                    className={`w-full pl-10 pr-3 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-base placeholder:text-slate-400 ${
                      getFieldError('durationValue') ? 'border-red-300 bg-red-50' : 'border-slate-100'
                    }`}
                    placeholder="12"
                  />
                </div>
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className="px-3 py-3 bg-slate-100 border-2 border-slate-200 rounded-xl outline-none font-semibold text-slate-700 text-base cursor-pointer focus:border-indigo-500 focus:bg-white transition-all"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
              {getFieldError('durationValue') && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">
                  {getFieldError('durationValue')}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1">
                <span>UPI ID</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
                <input
                  required
                  name="Upi_Id"
                  value={formData.Upi_Id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-base placeholder:text-slate-400 ${
                    getFieldError('Upi_Id') ? 'border-red-300 bg-red-50' : 'border-slate-100'
                  }`}
                  placeholder="example@okhdfcbank"
                />
              </div>
              {getFieldError('Upi_Id') && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">
                  {getFieldError('Upi_Id')}
                </p>
              )}
            </div>
          </div>

          {/* QR Code File Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
              QR Code Image {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <div className="space-y-3">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <input
                  id="qr-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                />
              </div>
              
              {/* QR Code Preview */}
              {(qrPreview || existingData?.qrcode?.url) && (
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border-2 border-slate-100">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border-2 border-slate-200">
                    <img 
                      src={qrPreview || existingData?.qrcode?.url} 
                      alt="QR Code Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      {qrFile ? qrFile.name : 'Existing QR Code'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {qrFile 
                        ? `${(qrFile.size / 1024).toFixed(1)} KB`
                        : 'Previously uploaded'
                      }
                    </p>
                  </div>
                  {qrFile && (
                    <button
                      type="button"
                      onClick={handleRemoveQR}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      aria-label="Remove QR code"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              )}

              {isEditMode && !qrFile && existingData?.qrcode && (
                <p className="text-xs text-slate-500 ml-1 font-medium flex items-center gap-1">
                  <Info size={14} />
                  Leave empty to keep existing QR code.
                </p>
              )}
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 cursor-pointer hover:bg-red-500 hover:text-white rounded-xl bg-white border-2 border-slate-200 text-slate-600 text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="bidding-form"
            disabled={isSubmitting}
            className="flex-[2] py-3 px-4 rounded-xl cursor-pointer bg-slate-900 text-white text-sm font-bold hover:bg-indigo-600 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>{isEditMode ? "Save Changes" : "Create Bid"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
// Helpers for Single Page and States
function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-24 h-24 bg-indigo-50 text-4xl flex items-center justify-center rounded-3xl mb-8">
        ✨
      </div>
      <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
        Empty Dashboard
      </h2>
      <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
        You haven't launched any bidding schemes yet. Ready to start your first
        one?
      </p>
      <button
        onClick={onCreate}
        className="cursor-pointer bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-2xl"
      >
        Launch New Scheme
      </button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-[2rem] p-8 h-80 animate-pulse border border-slate-100"
        >
          <div className="w-14 h-14 bg-slate-100 rounded-2xl mb-6"></div>
          <div className="h-6 bg-slate-100 rounded-lg w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-10"></div>
          <div className="h-20 bg-slate-50 rounded-2xl"></div>
        </div>
      ))}
    </div>
  );
}

// Keep your existing SingleBiddingAdminPage component here (Logic remains unchanged)
function SingleBiddingAdminPage({ bid, onBack, adminId, navigate }) {
  if (!bid)
    return (
      <div className="text-center py-20 font-bold text-slate-400">
        Loading details...
      </div>
    );

  // Logic for calculations
  const winners =
    bid.bidding_participants?.filter((p) => p.is_winned_candidate === true) ||
    [];
  const totalRounds = bid.durationValue || 0;
  const completedRounds = winners.length || 0;
  const participantCount = bid.maxPeople || 0;

  return (
    <div className="space-y-8 animate-slide-in">
      {/* 1. Hero Section (Already in your code, styled slightly for consistency) */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-10">
          <div>
            <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">
              {bid.biddingid || "SCHEME"}
            </span>
            <h1 className="text-5xl font-black text-slate-900 mt-2 tracking-tighter">
              {bid.nameOfBid}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              Total Amount
            </p>
            <p className="text-4xl font-black text-indigo-600 tracking-tighter">
              ₹{parseInt(bid.amount || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() =>
              navigate(`/${adminId}/bidding-participants/${bid.documentId}`)
            }
            className="cursor-pointer px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
          >
            Manage Members
          </button>
          <button
            onClick={() =>
              navigate(`/${adminId}/admin-bidding-dashboard/${bid.documentId}`)
            }
            className="cursor-pointer px-8 py-3 bg-slate-200 border-2 border-slate-500  text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
          >
            Open Admin Panel
          </button>
        </div>
      </div>

      {/* 2. Three Cards Section (Statistics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Bidding Progress */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-100/50 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              📈
            </div>
            <h3 className="font-black text-slate-800 tracking-tight text-lg">
              Bidding Progress
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                Total Rounds
              </span>
              <span className="font-black text-slate-900 text-lg">
                {totalRounds}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                Completed
              </span>
              <span className="font-black text-indigo-600 text-lg">
                {completedRounds}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Latest Winner */}
        {/* Card 2: Winners Ratio */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-100/50 flex flex-col justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              🏆
            </div>
            <h3 className="font-black text-slate-800 tracking-tight text-lg">
              Winners
            </h3>
          </div>
          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black text-slate-900 tracking-tighter">
                {winners.length}
              </p>
              <p className="text-2xl font-bold text-slate-400">
                / {participantCount}
              </p>
            </div>
            <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest mt-2">
              Total Crowned
            </p>
          </div>
        </div>

        {/* Card 3: Participants */}
        <div
          onClick={() =>
            navigate(
              `/${adminId}/bidding-dashboard/${bid.documentId}/participants`,
            )
          }
          className="group bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-100/50 flex flex-col justify-between cursor-pointer hover:border-indigo-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              👥
            </div>
            <h3 className="font-black text-slate-800 tracking-tight text-lg">
              Participants
            </h3>
          </div>
          <div className="mt-8">
            <p className="text-5xl font-black text-slate-900 tracking-tighter">
              {participantCount}
            </p>
            
          </div>
        </div>
      </div>

      {/* Winners Section */}
      {/* 3. Winners Section (Enhanced) */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-amber-200">
              🏆
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                Hall of Fame
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">
                Verified winning participants across all rounds
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {winners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-4 grayscale opacity-40">🏅</div>
            <p className="text-slate-500 font-bold text-lg">
              No winners crowned yet
            </p>
            <p className="text-slate-400 text-sm mt-1">
              The first winner will appear here after the draw.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner, index) => {
              let cardBg = "bg-white hover:bg-slate-50 border-slate-100";
              let badgeColor = "bg-slate-100 text-slate-600";
              let icon = "🏅";

              return (
                <div
                  key={winner.documentId}
                  className={`group relative flex flex-col p-6 rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1.5 cursor-default ${cardBg}`}
                >
                  {/* Avatar & Rank Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-xl font-black text-slate-700 border border-slate-100/80">
                        {winner.name
                          ? winner.name.charAt(0).toUpperCase()
                          : "👤"}
                      </div>
                      <div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest mb-1 ${badgeColor}`}
                        >
                          Round {index + 1}
                        </span>
                        <h4
                          className="font-black text-slate-900 text-lg leading-none truncate max-w-[130px]"
                          title={winner.name}
                        >
                          {winner.name}
                        </h4>
                      </div>
                    </div>
                    <div className="text-4xl drop-shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all origin-bottom">
                      {icon}
                    </div>
                  </div>

                  {/* Winner Metadata */}
                  <div className="space-y-3 mt-auto pt-5 border-t border-black/5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                        Candidate ID
                      </span>
                      <span className="font-black text-slate-700 font-mono text-xs bg-white/60 px-2 py-1 rounded-md border border-slate-200/50">
                        {winner.candidateid || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                        Contact
                      </span>
                      <span className="font-bold text-slate-700 text-xs">
                        {winner.phonenumber || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                        Won On
                      </span>
                      <span className="font-bold text-slate-700 text-xs">
                        {winner.winned_date
                          ? new Date(winner.winned_date).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "TBD"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
// Injected CSS
const styles = `
  @keyframes cardFadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .animate-fade-in { animation: fadeInUp 0.5s ease-out; }
  .animate-slide-in { animation: slideIn 0.5s ease-out; }
  .animate-scale-up { animation: scaleUp 0.3s ease-out; }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-pulse-slow { animation: pulse 6s infinite; }
  .animate-pulse-slower { animation: pulse 8s infinite; }

  @keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
.animate-in {
  animation: zoomIn 0.2s ease-out forwards;
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
