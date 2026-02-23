import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
      else if (Array.isArray(result?.data?.data)) extractedData = result.data.data;
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
        bid.biddingid?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "amount-high") return (parseInt(b.amount) || 0) - (parseInt(a.amount) || 0);
      if (sortBy === "amount-low") return (parseInt(a.amount) || 0) - (parseInt(b.amount) || 0);
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
        <CreateBiddingModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchBiddings();
            setSuccessMessage("New scheme launched successfully!");
            setTimeout(() => setSuccessMessage(""), 4000);
          }}
        />
      )}
    </div>
  );
}

function Header({ adminId, onBack, currentView, onCreate, hasItems, sortBy, onSortChange, onRefresh }) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/70 backdrop-blur-md border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={currentView === "detail" ? onBack : () => navigate(`/${adminId}/LuckyDrawHome`)}
            className="group cursor-pointer flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-indigo-50"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <button
                onClick={onCreate}
                className="cursor-pointer flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-slate-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>+</span>
                <span className="hidden sm:inline">New Scheme</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function DashboardOverview({ biddings, onCardClick, searchTerm }) {
  return (
    <div className="space-y-8">
      {biddings.length === 0 ? (
        <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 text-xl font-medium">No matches found for "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {biddings.map((bid, index) => (
            <BiddingCard
              key={bid.documentId || bid.id || index}
              data={bid}
              index={index}
              onClick={() => onCardClick(bid)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BiddingCard({ data, index, onClick }) {
  const { biddingid, nameOfBid, amount, maxPeople, durationUnit, durationValue } = data;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer bg-white rounded-[2rem] p-7 border border-slate-200/60 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 ease-out flex flex-col h-full overflow-hidden hover:-translate-y-2"
      style={{ animation: `cardFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both` }}
    >
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 group-hover:w-full"></div>
      
      <div className="relative z-10 flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          💰
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-wider">
          {biddingid?.split('-')[0] || "Active"}
        </span>
      </div>

      <div className="relative z-10 flex-1">
        <h3 className="text-2xl font-black text-slate-800 mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">
          {nameOfBid}
        </h3>
        <p className="text-slate-400 text-sm font-medium mb-6">ID: {biddingid || "CH-0000"}</p>

        <div className="space-y-4 pt-6 border-t border-slate-50">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Pool</span>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              ₹{parseInt(amount || 0).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
              <p className="font-bold text-slate-700 text-sm">{durationValue} {durationUnit}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Slots</p>
              <p className="font-bold text-slate-700 text-sm">{maxPeople} Members</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
        Manage Scheme <span className="ml-2">→</span>
      </div>
    </div>
  );
}

function CreateBiddingModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nameOfBid: "",
    amount: "",
    maxPeople: "",
    durationValue: "",
    durationUnit: "Monthly",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("jwt");
      const payload = {
        data: {
          nameOfBid: formData.nameOfBid.trim(),
          amount: Number(formData.amount),
          maxPeople: Number(formData.maxPeople),
          durationValue: Number(formData.durationValue),
          durationUnit: formData.durationUnit,
        },
      };
      await axios.post(`${API_URL}/create`, payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      onSuccess();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create scheme");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-up border border-white">
        <div className="px-10 py-8 bg-slate-900 text-white">
          <h3 className="text-3xl font-black tracking-tight">Launch Scheme</h3>
          <p className="text-slate-400 text-sm mt-1">Configure your new chit fund parameters</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Scheme Title</label>
            <input
              required name="nameOfBid" value={formData.nameOfBid} onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
              placeholder="Enter scheme name..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Amount (₹)</label>
              <input
                required type="number" name="amount" value={formData.amount} onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
                placeholder="50,000"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Member Limit</label>
              <input
                required type="number" name="maxPeople" value={formData.maxPeople} onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
                placeholder="20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Duration</label>
              <input
                required type="number" name="durationValue" value={formData.durationValue} onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-bold text-slate-700"
                placeholder="12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Interval</label>
              <select
                name="durationUnit" value={formData.durationUnit} onChange={handleChange}
                className="w-full cursor-pointer px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button" onClick={onClose}
              className="flex-1 cursor-pointer py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="flex-[2] cursor-pointer py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transform hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Create Scheme"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helpers for Single Page and States
function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-24 h-24 bg-indigo-50 text-4xl flex items-center justify-center rounded-3xl mb-8">✨</div>
      <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Empty Dashboard</h2>
      <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">You haven't launched any bidding schemes yet. Ready to start your first one?</p>
      <button onClick={onCreate} className="cursor-pointer bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition-all shadow-2xl">Launch New Scheme</button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-[2rem] p-8 h-80 animate-pulse border border-slate-100">
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
  if (!bid) return <div className="text-center py-20 font-bold text-slate-400">Loading details...</div>;

  // Logic for calculations
  const winners = bid.biddingwinners || [];
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
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Current Pool</p>
            <p className="text-4xl font-black text-indigo-600 tracking-tighter">
              ₹{parseInt(bid.amount || 0).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/${adminId}/bidding-dashboard/${bid.documentId}/participants`)} 
            className="cursor-pointer px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
          >
            Manage Members
          </button>
          <button 
            onClick={() => navigate(`/${adminId}/admin-bidding-dashboard/${bid.documentId}`)} 
            className="cursor-pointer px-8 py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all"
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
            <h3 className="font-black text-slate-800 tracking-tight text-lg">Bidding Progress</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Total Rounds</span>
              <span className="font-black text-slate-900 text-lg">{totalRounds}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Completed</span>
              <span className="font-black text-indigo-600 text-lg">{completedRounds}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Latest Winner */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-100/50 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl mb-4 shadow-inner">
            🏆
          </div>
          <h3 className="font-black text-slate-800 tracking-tight text-lg mb-4">Latest Winner</h3>
          {winners.length > 0 ? (
            <div>
              <p className="text-2xl font-black text-slate-900 leading-tight">
                {winners[winners.length - 1]?.name || "N/A"}
              </p>
              <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase">
                Round {winners.length}
              </span>
            </div>
          ) : (
            <p className="text-slate-400 font-bold italic">No winner yet</p>
          )}
        </div>

        {/* Card 3: Participants */}
        <div 
          onClick={() => navigate(`/${adminId}/bidding-dashboard/${bid.documentId}/participants`)}
          className="group bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-xl shadow-slate-100/50 flex flex-col justify-between cursor-pointer hover:border-indigo-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              👥
            </div>
            <h3 className="font-black text-slate-800 tracking-tight text-lg">Participants</h3>
          </div>
          <div className="mt-8">
            <p className="text-5xl font-black text-slate-900 tracking-tighter">
              {participantCount}
            </p>
            <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 group-hover:translate-x-1 transition-transform">
              Click to manage →
            </p>
          </div>
        </div>

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
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}