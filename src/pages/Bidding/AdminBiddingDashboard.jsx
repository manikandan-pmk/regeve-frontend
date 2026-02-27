import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast"; // Run: npm install react-hot-toast
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingDown,
  Check,
  Edit,
  LinkIcon,
  X,
  Save,
  Loader,
  PlusCircle,
  AlertCircle,
  RefreshCw,
  LayoutDashboard,
  Layers,
  ChevronRight,
  CheckCircle2,
  History,
  Lock,
  Trash2,
} from "lucide-react";

const API_URL = "https://api.regeve.in/api";

// --- Sub-Component: Dynamic Countdown Timer ---
const CountdownTimer = ({ startTime, endTime, roundNumber, roundStatus }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isActive: false,
    isEnded: false,
    notStarted: false,
  });

  useEffect(() => {
    if (!startTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const roundStart = new Date(startTime).getTime();
      const roundEnd = endTime ? new Date(endTime).getTime() : null;

      if (roundStatus === "Ended" || (roundEnd && now > roundEnd)) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isActive: false,
          isEnded: true,
          notStarted: false,
        });
        return;
      }

      if (now < roundStart) {
        const timeUntilStart = roundStart - now;
        setTimeRemaining({
          days: Math.floor(timeUntilStart / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor(
            (timeUntilStart % (1000 * 60 * 60)) / (1000 * 60),
          ),
          seconds: Math.floor((timeUntilStart % (1000 * 60)) / 1000),
          isActive: false,
          isEnded: false,
          notStarted: true,
        });
        return;
      }

      // Round is Active
      const endTimeToUse = roundEnd || roundStart + 7 * 24 * 60 * 60 * 1000; // Default to 7 days if no endTime
      const distance = endTimeToUse - now;

      setTimeRemaining({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isActive: true,
        isEnded: false,
        notStarted: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime, roundStatus]);

  const formatNumber = (num) => (num < 10 ? `0${num}` : num);

  if (timeRemaining.notStarted) {
    return (
      <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 flex flex-col items-center">
        <div className="flex items-center gap-2 text-amber-600 mb-3 text-xs font-black uppercase tracking-widest">
          <Lock size={16} /> Starts In
        </div>
        <div className="flex gap-4">
          {timeRemaining.days > 0 && (
            <div className="text-center">
              <div className="text-2xl font-black text-amber-600">
                {timeRemaining.days}
              </div>
              <div className="text-[10px] text-amber-500 font-bold uppercase">
                Days
              </div>
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-black text-amber-600">
              {formatNumber(timeRemaining.hours)}
            </div>
            <div className="text-[10px] text-amber-500 font-bold uppercase">
              Hrs
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-600">
              {formatNumber(timeRemaining.minutes)}
            </div>
            <div className="text-[10px] text-amber-500 font-bold uppercase">
              Min
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-600">
              {formatNumber(timeRemaining.seconds)}
            </div>
            <div className="text-[10px] text-amber-500 font-bold uppercase">
              Sec
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (timeRemaining.isEnded) {
    return (
      <div className="bg-slate-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center h-full border border-slate-200">
        <span className="text-slate-400 font-black uppercase tracking-widest text-sm">
          Round Ended
        </span>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center border border-emerald-100">
      <div className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-emerald-600">
        <Clock size={16} /> Live Time Remaining
      </div>
      <div className="flex gap-4">
        {timeRemaining.days > 0 && (
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-600">
              {timeRemaining.days}
            </div>
            <div className="text-[10px] font-bold uppercase text-emerald-500">
              Days
            </div>
          </div>
        )}
        <div className="text-center">
          <div className="text-2xl font-black text-emerald-600">
            {formatNumber(timeRemaining.hours)}
          </div>
          <div className="text-[10px] font-bold uppercase text-emerald-500">
            Hrs
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-emerald-600">
            {formatNumber(timeRemaining.minutes)}
          </div>
          <div className="text-[10px] font-bold uppercase text-emerald-500">
            Min
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-black text-emerald-600">
            {formatNumber(timeRemaining.seconds)}
          </div>
          <div className="text-[10px] font-bold uppercase text-emerald-500">
            Sec
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const AdminBiddingDashboard = () => {
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [activeRoundLive, setActiveRoundLive] = useState(null);
  const [copied, setCopied] = useState(false);
  const [biddingConfig, setBiddingConfig] = useState(null);
  const [onlineParticipants, setOnlineParticipants] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Add state for delete modal

  const handleCopyLink = () => {
    const participantUrl = `${window.location.origin}/#/${adminId || "admin"}/participant-bidding/${documentId}`;
    navigator.clipboard.writeText(participantUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Edit State
  const [isEditingRound, setIsEditingRound] = useState(false);
  const [editedRound, setEditedRound] = useState(null);
  const [showCreateRoundModal, setShowCreateRoundModal] = useState(false);
  const [newRound, setNewRound] = useState({
    durationType: "Weekly",
    roundNumber: 1,
    startTime: "",
    endTime: "",
    totalAmount: "",
    Final_Ratio: 40,
  });

  const [loading, setLoading] = useState(true);
  const [apiActionLoading, setApiActionLoading] = useState(false);

  const maxRounds = biddingConfig?.durationValue || 0;
  const isMaxRoundsReached = maxRounds > 0 && rounds.length >= maxRounds;

  useEffect(() => {
    const newSocket = io("https://api.regeve.in", {
      transports: ["polling", "websocket"],
    });

    newSocket.on("connect", () => {
      console.log("ADMIN CONNECTED:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.log("SOCKET ERROR:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !selectedRound) return;

    socket.emit("join-round", {
      roundId: selectedRound.documentId,
    });

    socket.on("online-participants", (participants) => {
      setOnlineParticipants(participants);
    });

    return () => {
      socket.off("online-participants");
    };
  }, [socket, selectedRound]);

  // Fetch Bidding Configuration
  const fetchBiddingConfig = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/biddings/public/${documentId}`,
      );
      if (response.data?.data) {
        setBiddingConfig(response.data.data);
        // Set default values based on config
        setNewRound((prev) => ({
          ...prev,
          durationType: response.data.data.durationUnit || "Weekly",
          totalAmount: response.data.data.amount || "",
          roundNumber: (rounds.length || 0) + 1,
        }));
      }
    } catch (err) {
      console.error("Error fetching bidding config:", err);
    }
  };

  // Fetch Rounds Data
  const fetchRounds = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `${API_URL}/biddings/${documentId}?populate=bidding_rounds`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      let dataList = response.data?.data?.bidding_rounds || [];

      setRounds(dataList);

      // Determine LIVE round
      if (dataList.length > 0) {
        const now = new Date().getTime();

        // Find active round
        const activeRound = dataList.find((round) => {
          const start = new Date(round.startTime).getTime();
          const end = round.endTime
            ? new Date(round.endTime).getTime()
            : start + 7 * 24 * 60 * 60 * 1000;
          return now >= start && now <= end && round.roundStatus !== "Ended";
        });

        if (activeRound) {
          setActiveRoundLive(activeRound);
          if (!selectedRound && !documentId) {
            setSelectedRound(activeRound);
          }
        }

        // If documentId provided, find that specific round
        if (documentId) {
          const foundRound = dataList.find((r) => r.documentId === documentId);
          if (foundRound) {
            setSelectedRound(foundRound);
          } else if (dataList.length > 0) {
            const sorted = [...dataList].sort(
              (a, b) => new Date(b.startTime) - new Date(a.startTime),
            );
            setSelectedRound(sorted[0]);
          }
        } else if (dataList.length > 0 && !selectedRound) {
          const sorted = [...dataList].sort(
            (a, b) => new Date(b.startTime) - new Date(a.startTime),
          );
          setSelectedRound(sorted[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching rounds:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Updated handleDeleteRound with toast notifications
  const handleDeleteRound = async () => {
    if (!selectedRound) return;

    // Show custom delete confirmation modal (you can create a styled modal instead)
    setShowDeleteModal(true);
  };

  const confirmDeleteRound = async () => {
    try {
      setApiActionLoading(true);
      const token = localStorage.getItem("jwt");

      await axios.delete(
        `${API_URL}/bidding-rounds/${selectedRound.documentId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Animated Success Message
      toast.success(`${selectedRound.Round_Name} has been deleted.`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "16px",
          fontWeight: "bold",
        },
      });

      // Local State Update
      const updatedRounds = rounds.filter(
        (r) => r.documentId !== selectedRound.documentId,
      );
      setRounds(updatedRounds);

      // Auto-select next available round
      if (updatedRounds.length > 0) {
        setSelectedRound(updatedRounds[0]);
      } else {
        setSelectedRound(null);
      }
    } catch (err) {
      toast.error("Failed to delete round. Please try again.", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setApiActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchRounds();
    if (documentId) {
      fetchBiddingConfig();
    }
  }, [documentId]);

  useEffect(() => {
    if (!documentId) return;

    const interval = setInterval(() => {
      fetchRounds(true); // silent refresh
    }, 4000); // every 4 seconds

    return () => clearInterval(interval);
  }, [documentId]);

  // Update newRound when rounds change
  useEffect(() => {
    if (biddingConfig) {
      setNewRound((prev) => ({
        ...prev,
        durationType: biddingConfig.durationUnit || "Weekly",
        totalAmount: biddingConfig.amount || "",
        roundNumber: rounds.length + 1,
      }));
    }
  }, [rounds, biddingConfig]);

  // Handle Edit Mode Toggle
  const handleEditRound = () => {
    setEditedRound({
      ...selectedRound,
      durationType: selectedRound.Round_Name?.includes("Week")
        ? "Weekly"
        : "Monthly",
      roundNumber: parseInt(selectedRound.Round_Name?.replace(/\D/g, "")) || 1,
      totalAmount: calculateTotalAmount(
        selectedRound.playAmount,
        selectedRound.Final_Ratio,
      ),
    });
    setIsEditingRound(true);
  };

  const handleCancelEdit = () => {
    setEditedRound(null);
    setIsEditingRound(false);
  };

  const calculateTotalAmount = (playAmount, finalRatio) => {
    return Math.round(playAmount / (1 - finalRatio / 100));
  };

  const calculateReducedAmount = (totalAmount, percent) => {
    return totalAmount - (totalAmount * (percent || 0)) / 100;
  };

  // Handle Create Round
  const handleCreateRound = async () => {
    if (
      !newRound.startTime ||
      !newRound.endTime ||
      !newRound.totalAmount ||
      !newRound.Final_Ratio
    ) {
      toast.error("Please fill all fields", {
        duration: 3000,
        position: "top-center",
      });
      return;
    }

    setApiActionLoading(true);
    try {
      const token = localStorage.getItem("jwt");

      // Calculate playAmount based on totalAmount and Final_Ratio
      const playAmount = calculateReducedAmount(
        newRound.totalAmount,
        newRound.Final_Ratio,
      );

      const roundData = {
        data: {
          durationType: newRound.durationType,
          roundNumber: newRound.roundNumber,
          startTime: new Date(newRound.startTime).toISOString(),
          endTime: new Date(newRound.endTime).toISOString(),
          totalAmount: parseFloat(newRound.totalAmount),
          playAmount: playAmount,
          Final_Ratio: parseFloat(newRound.Final_Ratio),
          Round_Name:
            newRound.durationType === "Weekly"
              ? `Week ${newRound.roundNumber}`
              : `Month ${newRound.roundNumber}`,
          roundStatus: "Created",
        },
      };

      await axios.post(
        `${API_URL}/bidding-rounds/create/${documentId}`,
        roundData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(`${roundData.data.Round_Name} has been created.`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "16px",
          fontWeight: "bold",
        },
      });

      setShowCreateRoundModal(false);
      setNewRound({
        durationType: biddingConfig?.durationUnit || "Weekly",
        roundNumber: rounds.length + 2,
        startTime: "",
        endTime: "",
        totalAmount: biddingConfig?.amount || "",
        Final_Ratio: 40,
      });

      fetchRounds();
    } catch (err) {
      toast.error(
        `Error creating round: ${err.response?.data?.error?.message || err.message}`,
        {
          duration: 4000,
          position: "top-center",
        },
      );
    } finally {
      setApiActionLoading(false);
    }
  };

  // Handle Saving Round Configuration
  const handleSaveRound = async () => {
    if (!editedRound) return;

    setApiActionLoading(true);
    try {
      const token = localStorage.getItem("jwt");

      const playAmount = calculateReducedAmount(
        editedRound.totalAmount,
        editedRound.Final_Ratio,
      );

      const updatedData = {
        data: {
          durationType: editedRound.durationType,
          roundNumber: editedRound.roundNumber,
          startTime: new Date(editedRound.startTime).toISOString(),
          endTime: new Date(editedRound.endTime).toISOString(),
          totalAmount: parseFloat(editedRound.totalAmount),
          playAmount: playAmount,
          Final_Ratio: parseFloat(editedRound.Final_Ratio),
          Round_Name:
            editedRound.durationType === "Weekly"
              ? `Week ${editedRound.roundNumber}`
              : `Month ${editedRound.roundNumber}`,
          roundStatus: editedRound.roundStatus,
        },
      };

      await axios.put(
        `${API_URL}/bidding-rounds/${selectedRound.documentId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update local state
      const updatedRound = {
        ...selectedRound,
        Round_Name:
          editedRound.durationType === "Weekly"
            ? `Week ${editedRound.roundNumber}`
            : `Month ${editedRound.roundNumber}`,
        playAmount: playAmount.toString(),
        Final_Ratio: editedRound.Final_Ratio,
        startTime: editedRound.startTime,
        endTime: editedRound.endTime,
      };

      setSelectedRound(updatedRound);
      setRounds((prev) =>
        prev.map((r) =>
          r.documentId === updatedRound.documentId ? updatedRound : r,
        ),
      );

      toast.success(`${updatedRound.Round_Name} has been updated.`, {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1e293b",
          color: "#fff",
          borderRadius: "16px",
          fontWeight: "bold",
        },
      });

      setIsEditingRound(false);
    } catch (err) {
      toast.error(
        `Error updating round: ${err.response?.data?.error?.message || err.message}`,
        {
          duration: 4000,
          position: "top-center",
        },
      );
    } finally {
      setApiActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get round number from Round_Name
  const getRoundNumber = (roundName) => {
    if (!roundName) return 1;
    const match = roundName.match(/\d+/);
    return match ? parseInt(match[0]) : 1;
  };

  // Get duration type from Round_Name
  const getDurationType = (roundName) => {
    if (!roundName) return "Weekly";
    return roundName.includes("Week") ? "Weekly" : "Monthly";
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold tracking-tight">
          Loading Bidding Rounds...
        </p>
      </div>
    );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-200/50 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px]"></div>
      </div>

      {/* --- SIDEBAR --- */}
      <aside className="w-80 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col z-20 shadow-2xl relative">
        <div className="p-8 border-b border-slate-100 flex items-center gap-4">
          <div className="bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200">
            <Layers size={24} />
          </div>
          <div>
            <span className="font-black text-slate-800 text-2xl tracking-tight leading-none block">
              Admin<span className="text-indigo-600">Bid</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ROUNDS
            </span>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Rounds ({rounds.length})
            </p>
            {isMaxRoundsReached && (
              <p className="text-xs text-red-500 font-bold mt-1">
                Maximum {maxRounds} rounds reached
              </p>
            )}
            <button
              disabled={isMaxRoundsReached}
              onClick={() => {
                if (isMaxRoundsReached) return;
                setNewRound({
                  durationType: biddingConfig?.durationUnit || "Weekly",
                  roundNumber: rounds.length + 1,
                  startTime: "",
                  endTime: "",
                  totalAmount: biddingConfig?.amount || "",
                  Final_Ratio: 0,
                });
                setShowCreateRoundModal(true);
              }}
              className="p-2 cursor-pointer bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
              title="Create New Round"
            >
              <PlusCircle size={18} />
            </button>
          </div>

          <nav className="space-y-3">
            {rounds.map((round) => {
              const roundNum = getRoundNumber(round.Round_Name);
              const isLive = activeRoundLive?.documentId === round.documentId;
              const isPast = round.roundStatus === "Ended";
              const isSelected = selectedRound?.documentId === round.documentId;

              return (
                <button
                  key={round.documentId}
                  onClick={() => setSelectedRound(round)}
                  className={`w-full cursor-pointer flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 transform translate-x-2"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 hover:translate-x-1 border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPast ? (
                      <CheckCircle2
                        size={18}
                        className={
                          isSelected ? "text-indigo-200" : "text-emerald-500"
                        }
                      />
                    ) : (
                      <History
                        size={18}
                        className={
                          isSelected ? "text-indigo-200" : "text-slate-400"
                        }
                      />
                    )}
                    <span>{round.Round_Name || `Round ${roundNum}`}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span
                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${isSelected ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-600 animate-pulse"}`}
                      >
                        Live
                      </span>
                    )}
                    {isPast && (
                      <span
                        className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}
                      >
                        Ended
                      </span>
                    )}
                    {isSelected && <ChevronRight size={18} />}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Header */}
        <header className="h-24 px-10 flex items-center justify-between bg-white/40 backdrop-blur-sm border-b border-slate-200/50 shrink-0">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {selectedRound?.Round_Name || "Bidding"} Overview
            </h1>
            <p className="text-sm font-bold text-slate-500 mt-1">
              {selectedRound
                ? `Viewing details for ${selectedRound.Round_Name}`
                : "Live Bidding Session"}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {/* Total Pool Amount */}
            <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Pool Amount
                </p>
                <p className="text-lg font-black leading-none">
                  ₹{selectedRound?.playAmount?.toLocaleString() || "0"}
                </p>
              </div>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="flex items-center cursor-pointer gap-2 px-4 py-4 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-indigo-600 hover:shadow-lg transition-all"
              title="Copy Bidding Page Link"
            >
              {copied ? (
                <Check size={20} className="text-green-500" />
              ) : (
                <LinkIcon size={20} />
              )}
              <span className="text-sm font-bold">
                {copied ? "Copied!" : "Bidding Page"}
              </span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => {
                window.location.reload();
                fetchRounds();
              }}
              
              
              className="p-4 bg-white cursor-pointer border border-slate-100 rounded-2xl text-slate-500 hover:text-indigo-600 hover:shadow-lg transition-all"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-10">
          {selectedRound ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-10 transition-all duration-300">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-slate-700 flex items-center gap-2 text-sm uppercase tracking-widest">
                  <LayoutDashboard size={18} className="text-indigo-500" />{" "}
                  Round Configuration
                </h3>
                {!isEditingRound && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleEditRound}
                      className="text-xs font-bold cursor-pointer text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-indigo-50 px-4 py-2 rounded-xl transition-all hover:bg-indigo-100"
                    >
                      <Edit size={14} /> Edit Round
                    </button>

                    <button
                      onClick={handleDeleteRound}
                      className="text-xs font-bold cursor-pointer text-red-600 hover:text-red-800 flex items-center gap-1.5 bg-red-50 px-4 py-2 rounded-xl transition-all hover:bg-red-100"
                    >
                      <X size={14} /> Delete Round
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8">
                {!isEditingRound ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in">
                    {/* Col 1: Identity & Amount */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
                          Round Name
                        </p>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">
                          {selectedRound.Round_Name}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
                          Status
                        </p>
                        <p
                          className={`text-lg font-black leading-none ${
                            selectedRound.roundStatus === "Ended"
                              ? "text-slate-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {selectedRound.roundStatus || "Started"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
                          Pool Amount
                        </p>
                        <p className="text-4xl font-black text-indigo-600 leading-none">
                          ₹
                          {parseInt(selectedRound.playAmount)?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Col 2: Info Details */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="p-3 bg-white shadow-sm rounded-xl text-slate-500">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            Start Time
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {formatDate(selectedRound.startTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="p-3 bg-white shadow-sm rounded-xl text-slate-500">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            End Time
                          </p>
                          <p className="text-sm font-bold text-slate-700">
                            {formatDate(selectedRound.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="p-3 bg-white shadow-sm rounded-xl text-slate-500">
                          <TrendingDown size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                            Final Ratio ({selectedRound.Final_Ratio}%)
                          </p>
                          <p className="text-lg font-black text-emerald-600 leading-none">
                            ₹
                            {calculateReducedAmount(
                              calculateTotalAmount(
                                selectedRound.playAmount,
                                selectedRound.Final_Ratio,
                              ),
                              selectedRound.Final_Ratio,
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Col 3: Dynamic Timer */}
                    <div className="flex flex-col h-full">
                      <CountdownTimer
                        startTime={selectedRound.startTime}
                        endTime={selectedRound.endTime}
                        roundNumber={getRoundNumber(selectedRound.Round_Name)}
                        roundStatus={selectedRound.roundStatus}
                      />
                    </div>
                  </div>
                ) : (
                  // --- EDIT MODE VIEW ---
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {/* Duration Type */}
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Duration Type
                          </label>

                          <div className="w-full mt-1 px-4 py-3 border-2 border-slate-100 bg-white rounded-xl font-bold text-slate-700">
                            {editedRound?.durationType || "—"}
                          </div>
                        </div>

                        {/* Round Number */}
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Round Number
                          </label>

                          <div className="w-full mt-1 px-4 py-3 border-2 border-slate-100 bg-white rounded-xl font-bold text-slate-700">
                            {editedRound?.roundNumber || "—"}
                          </div>
                        </div>

                        {/* Total Amount */}
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Total Amount (₹)
                          </label>

                          <div className="w-full mt-1 px-4 py-3 border-2 border-slate-100 bg-white rounded-xl font-bold text-slate-700">
                            ₹{" "}
                            {editedRound?.totalAmount
                              ? parseInt(
                                  editedRound.totalAmount,
                                ).toLocaleString()
                              : "—"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Start Time
                          </label>
                          <input
                            type="datetime-local"
                            value={editedRound?.startTime?.slice(0, 16) || ""}
                            onChange={(e) =>
                              setEditedRound({
                                ...editedRound,
                                startTime: e.target.value,
                              })
                            }
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            End Time
                          </label>
                          <input
                            type="datetime-local"
                            value={editedRound?.endTime?.slice(0, 16) || ""}
                            onChange={(e) =>
                              setEditedRound({
                                ...editedRound,
                                endTime: e.target.value,
                              })
                            }
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Status
                          </label>
                          <select
                            value={editedRound?.roundStatus || "Started"}
                            onChange={(e) =>
                              setEditedRound({
                                ...editedRound,
                                roundStatus: e.target.value,
                              })
                            }
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                          >
                            <option value="Started">Started</option>
                            <option value="Ended">Ended</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Final Ratio (%)
                        </label>
                        <div className="flex items-center gap-3 mt-1">
                          <input
                            type="number"
                            value={editedRound?.Final_Ratio || 0}
                            onChange={(e) =>
                              setEditedRound({
                                ...editedRound,
                                Final_Ratio: parseInt(e.target.value),
                              })
                            }
                            className="w-32 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700"
                            min="0"
                            max="100"
                          />
                          <TrendingDown className="text-slate-400" size={20} />
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Final Payout
                        </span>
                        <p className="text-3xl font-black text-emerald-600">
                          ₹
                          {calculateReducedAmount(
                            editedRound?.totalAmount || 0,
                            editedRound?.Final_Ratio || 0,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                      <button
                        onClick={handleCancelEdit}
                        className="px-6 py-3 bg-white cursor-pointer border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveRound}
                        disabled={apiActionLoading}
                        className="px-6 py-3 bg-indigo-600 cursor-pointer text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {apiActionLoading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-64 border-2 border-dashed border-slate-300 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/50 mb-10">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                <AlertCircle size={24} />
              </div>
              <h2 className="text-xl font-black text-slate-700">
                No Rounds Found
              </h2>
              <p className="text-slate-500 mt-2 font-bold">
                Create your first bidding round
              </p>
              <button
                onClick={() => {
                  setNewRound({
                    durationType: biddingConfig?.durationUnit || "Weekly",
                    roundNumber: 1,
                    startTime: "",
                    endTime: "",
                    totalAmount: biddingConfig?.amount || "",
                    Final_Ratio: 40,
                  });
                  setShowCreateRoundModal(true);
                }}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create Round
              </button>
            </div>
          )}

          {selectedRound && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">
                  🟢 Online Participants ({onlineParticipants.length})
                </h3>
              </div>

              <div className="p-6">
                {onlineParticipants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {onlineParticipants.map((user, index) => (
                      <div
                        key={index}
                        className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl"
                      >
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500 font-bold">
                          ID: {user.candidateid}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 font-bold">
                    No participants online
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bidding History */}
          {selectedRound && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <History className="text-indigo-500" size={20} />
                  <h3 className="text-lg font-black text-slate-800">
                    Bidding History
                  </h3>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Bidder
                      </th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Bid Amount
                      </th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Remaining Amount
                      </th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        Time
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {selectedRound?.Bidding_History &&
                    selectedRound.Bidding_History.length > 0 ? (
                      (() => {
                        const history = selectedRound.Bidding_History || [];

                        // 1️⃣ Sort oldest first (for correct calculation)
                        const sortedOldestFirst = [...history].sort(
                          (a, b) => new Date(a.bidTime) - new Date(b.bidTime),
                        );

                        const totalAmount =
                          calculateTotalAmount(
                            selectedRound.playAmount,
                            selectedRound.Final_Ratio,
                          ) || 0;

                        let runningAmount = totalAmount;

                        // 2️⃣ Calculate remaining for each bid
                        const processed = sortedOldestFirst.map((bid) => {
                          const bidAmount = parseInt(bid.amount) || 0;
                          runningAmount -= bidAmount;

                          return {
                            ...bid,
                            bidAmount,
                            remainingAmount: runningAmount,
                          };
                        });

                        // 3️⃣ Reverse so latest shows first
                        const latestFirst = processed.reverse();

                        return latestFirst.map((bid, index) => {
                          const isWinner = biddingConfig?.biddingwinners?.some(
                            (w) =>
                              w.round === selectedRound.Round_Name &&
                              w.winnerName === bid.name &&
                              parseInt(w.amount) === bid.bidAmount,
                          );

                          return (
                            <tr
                              key={index}
                              className={`transition-colors ${
                                isWinner
                                  ? "bg-amber-50/50 hover:bg-amber-50"
                                  : "hover:bg-slate-50/80"
                              }`}
                            >
                              <td className="px-8 py-5 text-sm font-black text-slate-800">
                                <div className="flex items-center gap-2">
                                  {bid.name}
                                  {isWinner && (
                                    <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                      🏆 Winner
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="px-8 py-5 text-sm font-bold text-indigo-600">
                                ₹{bid.bidAmount.toLocaleString()}
                              </td>

                              <td className="px-8 py-5 text-sm font-bold text-emerald-600">
                                ₹{bid.remainingAmount.toLocaleString()}
                              </td>

                              <td className="px-8 py-5 text-sm font-bold text-slate-600">
                                {new Date(bid.bidTime).toLocaleString()}
                              </td>
                            </tr>
                          );
                        });
                      })()
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-8 py-16 text-center text-slate-400 font-bold"
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3 text-slate-300">
                              <History size={20} />
                            </div>
                            No bidding history for this round yet.
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Round Modal */}
      {showCreateRoundModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Widened to max-w-4xl, removed max-h and overflow-y-auto to prevent scrolling */}
          <div className="bg-white rounded-[2rem] max-w-4xl w-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between rounded-t-[2rem]">
              <h2 className="text-xl font-black text-slate-800">
                Create New Round
              </h2>
              <button
                onClick={() => setShowCreateRoundModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            {/* Body - Left/Right Split Layout */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Side: Form Inputs (7 Columns) */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Duration Type
                    </label>
                    <div className="w-full px-4 py-2.5 border-2 border-slate-200 bg-white rounded-xl font-bold text-slate-700 text-sm">
                      {newRound.durationType || "—"}
                    </div>
                    {biddingConfig?.durationValue && (
                      <p className="text-[12px] text-slate-500 mt-1 font-bold">
                        Duration: {biddingConfig.durationValue}{" "}
                        {biddingConfig.durationUnit}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Round Number
                    </label>
                    <div className="w-full px-4 py-2.5 border-2 border-slate-200 bg-white rounded-xl font-bold text-slate-700 text-sm">
                      {newRound.roundNumber || "—"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newRound.startTime}
                      onChange={(e) =>
                        setNewRound({ ...newRound, startTime: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newRound.endTime}
                      onChange={(e) =>
                        setNewRound({ ...newRound, endTime: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Total Amount (₹)
                    </label>
                    <div className="w-full px-4 py-2.5 border-2 border-slate-200 bg-white rounded-xl font-bold text-slate-700 text-sm">
                      ₹{" "}
                      {newRound.totalAmount
                        ? parseInt(newRound.totalAmount).toLocaleString()
                        : "—"}
                    </div>
                    {biddingConfig?.amount && (
                      <p className="text-[12px] text-slate-500 mt-1 font-bold">
                        Base: ₹{parseInt(biddingConfig.amount).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                      Final Ratio (%)
                    </label>
                    <input
                      type="number"
                      value={newRound.Final_Ratio}
                      onChange={(e) =>
                        setNewRound({
                          ...newRound,
                          Final_Ratio: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Right Side: Preview Panel (5 Columns) */}
              <div className="md:col-span-5 flex h-full">
                <div className="p-6 bg-indigo-50 rounded-2xl w-full flex flex-col justify-center items-center text-center">
                  <p className="text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wider">
                    Preview
                  </p>
                  <p className="text-3xl font-black text-indigo-600 mb-4">
                    {newRound.durationType === "Weekly" ? "Week" : "Month"}{" "}
                    {newRound.roundNumber}
                  </p>

                  <div className="space-y-2 w-full max-w-xs">
                    <div className="flex justify-between items-center bg-white/60 px-4 py-2 rounded-lg">
                      <span className="text-md font-bold text-indigo-500">
                        Final Payout
                      </span>
                      <span className="text-md font-black text-indigo-700">
                        ₹
                        {calculateReducedAmount(
                          parseFloat(newRound.totalAmount) || 0,
                          parseFloat(newRound.Final_Ratio) || 0,
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 px-4 py-2 rounded-lg">
                      <span className="text-md font-bold text-indigo-500">
                        Pool Amount
                      </span>
                      <span className="text-md font-black text-indigo-700">
                        ₹
                        {calculateReducedAmount(
                          parseFloat(newRound.totalAmount) || 0,
                          parseFloat(newRound.Final_Ratio) || 0,
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 rounded-b-[2rem] bg-white">
              <button
                onClick={() => setShowCreateRoundModal(false)}
                className="px-6 py-2.5 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRound}
                disabled={apiActionLoading}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                {apiActionLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <PlusCircle size={16} />
                )}
                Create Round
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden transform transition-all">
            {/* Visual Indicator Section */}
            <div className="pt-10 pb-4 flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                  <Trash2 size={28} strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Confirm Deletion
              </h2>
            </div>

            {/* Content */}
            <div className="px-10 pb-8 text-center">
              <p className="text-slate-500 leading-relaxed text-lg">
                Are you sure you want to remove <br />
                <span className="font-extrabold text-slate-900 decoration-red-200 decoration-4 underline-offset-2">
                  {selectedRound?.Round_Name}
                </span>
                ?
              </p>
              <p className="text-sm text-slate-400 mt-3 font-medium">
                This process is permanent and cannot be reversed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 order-2 sm:order-1 px-6 cursor-pointer py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-slate-200"
              >
                Nevermind
              </button>
              <button
                onClick={confirmDeleteRound}
                disabled={apiActionLoading}
                className="flex-1 order-1 sm:order-2 cursor-pointer px-6 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 active:scale-95 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {apiActionLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <X size={20} strokeWidth={3} />
                    <span>Delete Round</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Processing State */}
      {apiActionLoading && !showDeleteModal && !showCreateRoundModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex items-center gap-5 border border-slate-100">
            <div className="relative">
              <div className="w-10 h-10 border-4 border-indigo-50 rounded-full"></div>
              <div className="w-10 h-10 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
            </div>
            <span className="font-black text-slate-800 text-lg uppercase tracking-tight">
              Processing...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBiddingDashboard;
