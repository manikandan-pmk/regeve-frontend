import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

// 🔹 CONFIGURATION
const API_URL = "http://localhost:1337/api/biddings";

export default function BiddingDashboard() {
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [biddings, setBiddings] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const fetchBiddings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const result = await response.json();
      // Your controller returns { data: entries } format
      const data = result.data || [];
      setBiddings(data);
    } catch (error) {
      console.error("Error fetching biddings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSingleBid = async (idToFetch) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/${idToFetch}`);
      const result = await response.json();
      // Your controller returns { data: entry } format
      setSelectedBid(result.data || null);
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

  // Filter and sort biddings
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
    // Use documentId for navigation (as per your controller's findOne)
    const targetId = bid.documentId;
    if (!targetId) return;
    navigate(`/${adminId}/bidding-dashboard/${targetId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleParticipantsClick = (bid, e) => {
    e.stopPropagation();
    const targetId = bid.documentId;
    if (!targetId) return;
    navigate(`/${adminId}/bidding-dashboard/${targetId}/participants`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    navigate(`/${adminId}/bidding-dashboard`);
  };

  const currentView = documentId ? "detail" : "list";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full blur-3xl animate-rotate-slow"></div>
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

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-28 pb-16 transition-all duration-700 ease-out">
        {isLoading ? (
          <LoadingSkeleton />
        ) : currentView === "list" && biddings.length === 0 ? (
          <EmptyState onCreate={() => setShowCreateModal(true)} />
        ) : currentView === "list" ? (
          <DashboardOverview
            biddings={filteredAndSortedBiddings}
            onCardClick={handleCardClick}
            onParticipantsClick={handleParticipantsClick}
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
            if (!documentId) fetchBiddings();
          }}
        />
      )}

      {/* Floating Action Button for Mobile */}
      {currentView === "list" && biddings.length > 0 && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-6 right-6 md:hidden z-50 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl"
        >
          +
        </button>
      )}
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in-up">
      <div className="relative group cursor-pointer" onClick={onCreate}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition duration-700 animate-pulse-slow"></div>
        <div className="relative w-28 h-28 bg-white rounded-full flex items-center justify-center text-4xl shadow-2xl border-2 border-slate-100 transform group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
          <span className="bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            ✦
          </span>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-slate-800 mt-8 mb-3 tracking-tight">
        Create Your First Scheme
      </h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
        Start a new chit fund or auction group to begin managing your members
        and bidding rounds.
      </p>
      <button
        onClick={onCreate}
        className="group cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-2"
      >
        <span className="text-lg">Create New Scheme</span>
        <span className="group-hover:translate-x-1 transition-transform">
          →
        </span>
      </button>
    </div>
  );
}

function DashboardOverview({
  biddings,
  onCardClick,
  onParticipantsClick,
  searchTerm,
}) {
  // Calculate stats from actual data
  const stats = {
    total: biddings.length,
    active: biddings.filter((b) => b.roundStatus === "OPEN").length,
    totalAmount: biddings.reduce(
      (sum, b) => sum + (parseInt(b.amount) || 0),
      0,
    ),
    participants: biddings.reduce(
      (sum, b) => sum + (parseInt(b.maxPeople) || 0),
      0,
    ),
  };

  return (
    <div className="space-y-8">
      {/* Schemes Grid */}
      {biddings.length === 0 ? (
        <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 text-lg">
            No schemes match "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biddings.map((bid, index) => (
            <BiddingCard
              key={bid.documentId || bid.id || index}
              data={bid}
              index={index}
              onClick={() => onCardClick(bid)}
              onParticipantsClick={(e) => onParticipantsClick(bid, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SingleBiddingAdminPage({ bid, onBack, adminId, navigate }) {
  if (!bid) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading bidding details...</p>
        </div>
      </div>
    );
  }

  const targetId = bid.documentId;

  const handleViewParticipants = () => {
    navigate(`/${adminId}/bidding-dashboard/${targetId}/participants`);
  };

  // Parse JSON fields if they exist
  const winners = bid.biddingwinners || [];
  const percentages = bid.BiddingPercentage || {};

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Hero Section */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-100/50 border border-white/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 animate-gradient"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-4 justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                {bid.biddingid || "SCHEME"}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleViewParticipants}
                className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transform hover:-translate-y-1 active:scale-95 transition-all duration-300"
              >
                <span>Manage Participants</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
              <button
                onClick={() =>
                  navigate(`/${adminId}/admin-bidding-dashboard/${targetId}`)
                }
                className="group flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
              >
                <span>Admin Bidding Dashboard</span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                {bid.nameOfBid}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="font-medium">
                    {bid.durationValue} {bid.durationUnit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span className="font-medium">
                    {bid.maxPeople} Participants Max
                  </span>
                </div>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-sm font-semibold text-indigo-600 mb-1">
                Total Pool Value
              </p>
              <p className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ₹{parseInt(bid.amount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              📈
            </div>
            <h3 className="font-semibold text-slate-800">Bidding Progress</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Total Rounds</span>
              <span className="font-bold text-slate-900">
                {bid.durationValue || 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Completed</span>
              <span className="font-bold text-slate-900">
                {winners.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
              🏆
            </div>
            <h3 className="font-semibold text-slate-800">Latest Winner</h3>
          </div>
          {winners.length > 0 ? (
            <div>
              <p className="text-2xl font-bold text-slate-900 mb-2">
                {winners[winners.length - 1]?.name || "N/A"}
              </p>
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                Round {winners.length}
              </span>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-slate-400">No winner yet</p>
            </div>
          )}
        </div>

        <div
          onClick={handleViewParticipants}
          className="bg-white/70 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              👥
            </div>
            <h3 className="font-semibold text-slate-800">Participants</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900 mb-2">
            {bid.maxPeople || 0}
          </p>
          <p className="text-sm text-slate-500 mt-2 group-hover:text-indigo-600 transition-colors">
            Click to manage →
          </p>
        </div>
      </div>

      {/* Winners History if available */}
      {winners.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              📋
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Winners History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                    Round
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                    Winner Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 hover:bg-indigo-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {winner.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-indigo-600">
                      ₹{winner.amount?.toLocaleString() || "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onRefresh,
}) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {currentView === "detail" ? (
            <button
              onClick={onBack}
              className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-all px-3 py-2 rounded-lg hover:bg-indigo-50"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => navigate(`/${adminId}/LuckyDrawHome`)}
              className="group flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-all px-3 py-2 rounded-lg hover:bg-indigo-50"
            >
              <span className="group-hover:-translate-x-1 transition-transform">
                ←
              </span>
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentView === "list" && hasItems && (
            <>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="hidden md:block px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 cursor-pointer hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="amount-high">Highest Amount</option>
                <option value="amount-low">Lowest Amount</option>
              </select>

              <button
                onClick={onRefresh}
                className="hidden md:block p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                title="Refresh"
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
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              <button
                onClick={onCreate}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
              >
                <span>+</span>
                <span>New Scheme</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function BiddingCard({ data, index, onClick, onParticipantsClick }) {
  const { biddingid, nameOfBid, amount, maxPeople, durationUnit } = data;

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-lg hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 ease-out flex flex-col h-full overflow-hidden"
      style={{
        animation: `cardFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s both`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-200/20 to-purple-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          💰
        </div>
      </div>

      <div className="relative z-10 flex-1">
        <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {nameOfBid}
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          {biddingid || "New Scheme"}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Pool Amount</span>
            <span className="text-2xl font-black text-slate-900">
              ₹{parseInt(amount || 0).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Duration</span>
            <span className="font-semibold text-slate-700">
              {durationUnit || "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Capacity</span>
            <span className="font-semibold text-slate-700">
              {maxPeople || 0} members
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 pt-4 border-t border-slate-100">
        <button
          onClick={onParticipantsClick}
          className="w-full py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          <span>View Participants</span>
          <span className="group-hover/btn:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent w-full h-full animate-shimmer"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>

            <div className="space-y-3 mb-6">
              <div className="h-8 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>

            <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
          </div>
        </div>
      ))}
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
    setIsSubmitting(true);
    try {
      const payload = {
        data: {
          nameOfBid: formData.nameOfBid,
          amount: formData.amount,
          maxPeople: parseInt(formData.maxPeople),
          durationValue: parseInt(formData.durationValue),
          durationUnit: formData.durationUnit,
        },
      };

      const response = await fetch("http://localhost:1337/api/biddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        const error = await response.json();
        alert(error.error?.message || "Failed to save");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the scheme");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h3 className="text-2xl font-bold">Create New Scheme</h3>
          <p className="text-indigo-100 text-sm mt-1">
            Fill in the details to get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">
              Scheme Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              name="nameOfBid"
              value={formData.nameOfBid}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="e.g., Gold Investment Scheme"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Amount <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ₹
                </span>
                <input
                  required
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  placeholder="50000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Max People <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="number"
                name="maxPeople"
                value={formData.maxPeople}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Duration <span className="text-red-400">*</span>
              </label>
              <input
                required
                type="number"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                placeholder="12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Unit
              </label>
              <select
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer"
              >
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-200 hover:shadow-xl transform hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Creating...
              </span>
            ) : (
              "Create Scheme"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes cardFadeIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .animate-fade-in {
    animation: fadeInUp 0.6s ease-out;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out;
  }

  .animate-fade-in-down {
    animation: slideIn 0.8s ease-out;
  }

  .animate-slide-in {
    animation: slideIn 0.6s ease-out;
  }

  .animate-scale-up {
    animation: scaleUp 0.4s ease-out;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  .animate-pulse-slow {
    animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-pulse-slower {
    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .animate-rotate-slow {
    animation: rotate 20s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes gradient {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  .animate-gradient {
    animation: gradient 3s ease-in-out infinite;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
