import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Trophy,
  Phone,
  ArrowRight,
  Gavel,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Timer,
  XCircle,
  Calendar,
  Award,
  Sparkles,
  Users,
  Zap,
  TrendingUp,
  ChevronRight,
  Circle,
  DollarSign,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ParticipantBiddingPage = () => {
  // ✅ GET ROUTE PARAMS
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();
  const isValidRoute = !!adminId && !!documentId;

  // 🔹 Auth States
  const [mobileNumber, setMobileNumber] = useState("");
  const [socket, setSocket] = useState(null);
  const [authStatus, setAuthStatus] = useState("LOGIN"); // LOGIN, PENDING, VERIFIED, REJECTED
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [userData, setUserData] = useState(null);

  // 🔹 Bidding Data States
  const [biddingData, setBiddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [playAmount, setPlayAmount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [roundName, setRoundName] = useState("");

  // New state for all rounds organized by month
  const [roundsByMonth, setRoundsByMonth] = useState({});
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedRound, setSelectedRound] = useState(null);

  // 🔹 Bidding & Timer States
  const [bids, setBids] = useState([]);
  const [currentRemaining, setCurrentRemaining] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [biddingActive, setBiddingActive] = useState(false);
  const [biddingNotStarted, setBiddingNotStarted] = useState(false);

  // 🔹 Winner States
  const [isWinnerDeclared, setIsWinnerDeclared] = useState(false);
  const [winner, setWinner] = useState(null);

  // 🔹 API States
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // 🔹 Error Popup States
  const [errorPopup, setErrorPopup] = useState({
    show: false,
    message: "",
    type: "error", // error, warning, info
  });

  const percentages = [5, 4, 3, 2];

  // Helper function to show error popup
  const showError = (message, type = "error") => {
    setErrorPopup({ show: true, message, type });
    setTimeout(() => {
      setErrorPopup({ show: false, message: "", type: "error" });
    }, 3000);
  };

  // Helper function to convert UTC to local date
  const convertUTCToLocal = (utcDateString) => {
    if (!utcDateString) return null;
    return new Date(utcDateString);
  };
  // Function to extract month from round name
  const extractMonthFromRoundName = (roundName) => {
    if (!roundName) return "Unknown";

    // Look for patterns like "Month 1", "Month 2", "Month 3", etc.
    const monthMatch = roundName.match(/month[_\s]*(\d+)/i);
    if (monthMatch) {
      return `Month ${monthMatch[1]}`;
    }

    // Look for patterns like "January", "February", etc.
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    for (const month of monthNames) {
      if (roundName.toLowerCase().includes(month.toLowerCase())) {
        return month;
      }
    }

    return "Other Rounds";
  };

  useEffect(() => {
  if (authStatus !== "VERIFIED") return;

  const newSocket = io("https://api.regeve.in", {
    transports: ["polling", "websocket"],
  });

  newSocket.on("connect", () => {
    console.log("PARTICIPANT CONNECTED:", newSocket.id);
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };
}, [authStatus]);

useEffect(() => {
  if (!socket || !selectedRound || !userData) return;

  socket.emit("join-round", {
    roundId: selectedRound.documentId,
    participantId: userData.documentId,
  });

  console.log("JOINED ROUND:", selectedRound.documentId);

}, [socket, selectedRound, userData]);

  useEffect(() => {
    if (authStatus === "VERIFIED" && startTime && endTime) {
      calculateTimeLeft(startTime, endTime);
    }
  }, [authStatus, startTime, endTime]);

  // Fetch bidding data on mount
  useEffect(() => {
    if (!documentId) return;

    const fetchBiddingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.regeve.in/api/biddings/public/${documentId}`,
          { params: { populate: "*" } },
        );

        const data = response.data?.data;
        if (data) {
          setBiddingData(data);

          // Set total amount from the bidding data
          const amount = parseInt(data.amount) || 0;
          setTotalAmount(amount);

          // Organize rounds by month
          if (data.bidding_rounds && data.bidding_rounds.length > 0) {
            const roundsByMonthMap = {};

            data.bidding_rounds.forEach((round) => {
              const month = extractMonthFromRoundName(round.Round_Name || "");
              if (!roundsByMonthMap[month]) {
                roundsByMonthMap[month] = [];
              }
              roundsByMonthMap[month].push(round);
            });

            setRoundsByMonth(roundsByMonthMap);

            // Extract unique months and sort them
            const uniqueMonths = Object.keys(roundsByMonthMap).sort((a, b) => {
              // Custom sorting for "Month X" pattern
              const monthNumA = a.match(/\d+/);
              const monthNumB = b.match(/\d+/);

              if (monthNumA && monthNumB) {
                return parseInt(monthNumA[0]) - parseInt(monthNumB[0]);
              }
              return a.localeCompare(b);
            });

            setMonths(uniqueMonths);

            // Set default selected month to first available
            if (uniqueMonths.length > 0) {
              setSelectedMonth(uniqueMonths[0]);

              // Load the first round of the first month
              const firstMonthRounds = roundsByMonthMap[uniqueMonths[0]];
              if (firstMonthRounds && firstMonthRounds.length > 0) {
                loadRoundData(firstMonthRounds[0], amount);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching bidding data:", error);
        setRejectionMessage("Failed to load bidding session");
      } finally {
        setLoading(false);
      }
    };

    fetchBiddingData();
  }, [documentId]);

  // Function to load round data
  const loadRoundData = (round, amountOverride = null) => {
    if (!round) return;

    const baseAmount = amountOverride ?? totalAmount;
    setSelectedRound(round);
    setPlayAmount(parseInt(round.playAmount) || 0);
    setRoundName(round.Round_Name || "");

    // Parse dates - convert UTC to local
    const start = round.startTime ? convertUTCToLocal(round.startTime) : null;
    const end = round.endTime ? convertUTCToLocal(round.endTime) : null;

    setStartTime(start);
    setEndTime(end);

    // Load existing bids from round history
    if (round.Bidding_History && round.Bidding_History.length > 0) {
      // Sort bids by time (newest first)
      const sortedHistory = [...round.Bidding_History].sort(
        (a, b) => new Date(b.bidTime) - new Date(a.bidTime),
      );

      const formattedBids = sortedHistory.map((bid, index) => {
        // Calculate remaining amount at the time of this bid
        const bidsUpToThis = round.Bidding_History
          .filter((b) => new Date(b.bidTime) <= new Date(bid.bidTime))
          .sort((a, b) => new Date(a.bidTime) - new Date(b.bidTime));

        let remainingAtBidTime = baseAmount;
        bidsUpToThis.forEach((b) => {
          remainingAtBidTime -= parseFloat(b.amount);
        });

        return {
          id: bid.id || Date.now() + Math.random(),
          bidderName: bid.name,
          bidAmount: parseFloat(bid.amount),
          remainingAmount: remainingAtBidTime,
          time: new Date(bid.bidTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        };
      });

      setBids(formattedBids);

      // Calculate current remaining amount (after all bids)
      const totalBidAmount = round.Bidding_History.reduce(
        (sum, bid) => sum + parseFloat(bid.amount),
        0,
      );
      setCurrentRemaining(baseAmount - totalBidAmount);
    } else {
      setBids([]);
      setCurrentRemaining(baseAmount);
    }

    // Check if winner is already declared
    const hasWinner = round.Bidding_History?.some((bid) => bid.winner === "yes");
    if (hasWinner) {
      const winningBid = round.Bidding_History.find(
        (bid) => bid.winner === "yes",
      );
      if (winningBid) {
        setWinner({
          bidderName: winningBid.name,
          bidAmount: parseFloat(winningBid.amount),
          time: winningBid.bidTime,
        });
        setIsWinnerDeclared(true);
        setBiddingActive(false);
      }
    } else {
      setIsWinnerDeclared(false);
      setWinner(null);
    }

    // Calculate time left based on current time
    calculateTimeLeft(start, end);
  };

  // Handle month selection
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    const monthRounds = roundsByMonth[month];
    if (monthRounds && monthRounds.length > 0) {
      loadRoundData(monthRounds[0]);
    }
  };

  // Function to calculate time left
  const calculateTimeLeft = (start, end) => {
    const now = new Date();

    if (!(start instanceof Date) || isNaN(start)) return;
    if (!(end instanceof Date) || isNaN(end)) return;

    const startDiff = Math.floor((start.getTime() - now.getTime()) / 1000);
    const endDiff = Math.floor((end.getTime() - now.getTime()) / 1000);

    if (startDiff > 0) {
      setBiddingNotStarted(true);
      setBiddingActive(false);
      setTimeLeft(startDiff);
    } else if (endDiff > 0) {
      setBiddingNotStarted(false);
      setBiddingActive(true);
      setTimeLeft(endDiff);
    } else {
      setBiddingNotStarted(false);
      setBiddingActive(false);
      setTimeLeft(0);
    }
  };
  // ⏱️ Timer Logic - Update every second
  useEffect(() => {
    if (!startTime || !endTime || isWinnerDeclared) return;

    const timer = setInterval(() => {
      calculateTimeLeft(startTime, endTime);
    }, 1000);

    // Call once immediately
    calculateTimeLeft(startTime, endTime);

    return () => clearInterval(timer);
  }, [startTime, endTime, isWinnerDeclared]);

  // Check if bidding should end based on time or play amount
  useEffect(() => {
    if (!biddingActive || isWinnerDeclared) return;

    // Auto-declare winner when time runs out
    if (timeLeft <= 0 && bids.length > 0) {
      setBiddingActive(false);
      declareWinner();
    }
  }, [timeLeft, biddingActive, bids.length, isWinnerDeclared]);

  // Check if playAmount reached
  useEffect(() => {
    if (
      playAmount > 0 &&
      currentRemaining <= playAmount &&
      bids.length > 0 &&
      !isWinnerDeclared &&
      biddingActive
    ) {
      // Play amount reached, declare winner
      declareWinner();
    }
  }, [
    currentRemaining,
    playAmount,
    bids.length,
    isWinnerDeclared,
    biddingActive,
  ]);

  // Format Time (DD:HH:MM:SS or HH:MM:SS or MM:SS)
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";
    if (seconds < 0) return "00:00";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${secs}s`;
    } else if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
  };

  const isTimeUp = timeLeft <= 0;

  // Format date for display
  const formatDateTime = (date) => {
    if (!date) return "";
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // 🔹 Handle Login with API Verification
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10) {
      alert("Mobile number must be 10 digits");
      return;
    }

    setAuthStatus("PENDING");

    try {
      const response = await axios.get(
        `https://api.regeve.in/api/biddings/public/${documentId}`,
        { params: { populate: "*" } },
      );

      const biddingData = response.data?.data;

      if (!biddingData) {
        setRejectionMessage("Invalid bidding session.");
        setAuthStatus("REJECTED");
        return;
      }

      const participants = biddingData.bidding_participants || [];

      // 🔍 Find participant by mobile number
      const matchedUser = participants.find(
        (p) => p.phonenumber === mobileNumber,
      );

      if (!matchedUser) {
        setRejectionMessage("No participant found with this mobile number.");
        setAuthStatus("REJECTED");
        return;
      }

      if (matchedUser.is_verified === true) {
        setUserData(matchedUser);
        setTimeout(() => setAuthStatus("VERIFIED"), 1000);
      } else {
        setRejectionMessage(
          "Your account is pending verification. Please contact the administrator.",
        );
        setAuthStatus("REJECTED");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setRejectionMessage(
        "Unable to verify at this moment. Please try again later.",
      );
      setAuthStatus("REJECTED");
    }
  };

  // 🔹 Place Bid with API
  const placeBid = async (percentage) => {
   if (
    biddingNotStarted ||
    isTimeUp ||
    isWinnerDeclared ||
    !selectedRound ||
    isPlacingBid ||
    currentRemaining <= 0
  ) {
    return;
  }

  // ✅ STEP 2: ADD THIS BLOCK HERE
  if (bids.length > 0) {
    const lastBid = bids[0]; // newest bid (top of ledger)

    if (lastBid.bidderName === userData.name) {
      showError("You cannot place two consecutive bids. Wait for another participant.", "warning");
      return;
    }
  }

    const bidAmount = (totalAmount * percentage) / 100;
    const newRemaining = currentRemaining - bidAmount;

    if (newRemaining < 0) {
      showError("Remaining amount too low for this bid.", "error");
      return;
    }

    // Check if bid would go below playAmount
    if (newRemaining < playAmount) {
      showError(
        `Cannot bid below the target amount of ₹${playAmount.toLocaleString()}`,
        "warning"
      );
      return;
    }

    setIsPlacingBid(true);

    try {
      // Call the API to place bid
     const response = await axios.post(
        `https://api.regeve.in/api/bidding/${selectedRound.documentId}/place-bid`,
        {
          participantDocumentId: userData.documentId,
          amount: bidAmount,
        },
      );

     

       
  if (response.data?.data) {
    await refreshRoundData();   // ✅ always sync from server
  
      

        // Check if this bid makes the round reach target amount
        if (newRemaining <= playAmount) {
          // Winner will be declared by the useEffect
        }
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      showError(
        error.response?.data?.error?.message ||
          "Failed to place bid. Please try again.",
        "error"
      );
    } finally {
      setIsPlacingBid(false);
    }
  };

  const refreshRoundData = async () => {
  if (!selectedRound) return;

  try {
    const response = await axios.get(
      `https://api.regeve.in/api/biddings/public/${documentId}`,
      { params: { populate: "*" } }
    );

    const updatedData = response.data?.data;
    if (!updatedData) return;

    const updatedRound = updatedData.bidding_rounds.find(
      (r) => r.documentId === selectedRound.documentId
    );

    if (updatedRound) {
      loadRoundData(updatedRound);
    }
  } catch (error) {
    console.error("Auto refresh error:", error);
  }
};

useEffect(() => {
  if (!selectedRound || isWinnerDeclared) return;

  const interval = setInterval(() => {
    refreshRoundData();
  }, 2000);

  return () => clearInterval(interval);
}, [selectedRound, isWinnerDeclared]);


  // 🔹 Declare Winner
  const declareWinner = async () => {
    if (bids.length === 0 || !selectedRound) return;

    // Find the highest bidder (first bid since we're adding new bids to the top)
    const winningBid = bids[0];

    try {
      // Update the round to mark winner
      // Note: You might need an API endpoint for this
      // For now, we'll just update local state
      setWinner(winningBid);
      setIsWinnerDeclared(true);
      setBiddingActive(false);
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl text-center border border-white/50"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
            <Gavel className="absolute inset-0 m-auto text-indigo-600" size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-800">
            Loading Bidding Session...
          </h2>
          <p className="text-slate-500 text-sm mt-2">Please wait while we prepare the auction room</p>
        </motion.div>
      </div>
    );
  }

  // 🚨 INVALID LINK VIEW
  if (!isValidRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50/30 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl text-center max-w-md w-full border border-white/50"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-500" size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">
            Invalid Session Link
          </h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            The bidding session link you followed is missing required parameters
            or has expired.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-slate-900 hover:bg-slate-800 transition-colors text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
          >
            Return to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  // ================= LOGIN SCREEN =================
  if (authStatus !== "VERIFIED") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-white/50 relative z-10"
        >
          <AnimatePresence mode="wait">
            {authStatus === "LOGIN" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLoginSubmit}
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-indigo-600" size={32} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">
                  Secure Access
                </h2>
                <p className="text-slate-500 mb-8 text-sm">
                  Verify your identity to enter the bidding room.
                </p>
                <div className="relative mb-6">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Mobile Number"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-800 placeholder:font-normal"
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98] group"
                >
                  Request Entry <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.form>
            )}

            {authStatus === "PENDING" && (
              <motion.div
                key="pending"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <ShieldCheck
                    className="absolute inset-0 m-auto text-indigo-600"
                    size={24}
                  />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
                  Authenticating
                </h2>
                <p className="text-slate-500 text-sm">
                  Verifying your credentials...
                </p>
              </motion.div>
            )}

            {authStatus === "REJECTED" && (
              <motion.div
                key="rejected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="text-red-500" size={36} />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3">
                  Access Denied
                </h2>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  {rejectionMessage}
                </p>
                <button
                  onClick={() => setAuthStatus("LOGIN")}
                  className="w-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
                >
                  Try Again <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // ================= MAIN BIDDING SCREEN =================
  const progressPercentage =
    totalAmount > 0 ? (currentRemaining / totalAmount) * 100 : 0;

  // Get status text and color
  const getStatusInfo = () => {
    if (isWinnerDeclared)
      return { text: "COMPLETED", color: "bg-purple-100 text-purple-700", icon: Award };
    if (biddingNotStarted)
      return { text: "NOT STARTED", color: "bg-yellow-100 text-yellow-700", icon: Clock };
    if (biddingActive)
      return { text: "LIVE", color: "bg-emerald-100 text-emerald-700", icon: Zap };
    if (!biddingActive && timeLeft === 0)
      return { text: "ENDED", color: "bg-slate-100 text-slate-600", icon: XCircle };
    return { text: "INACTIVE", color: "bg-slate-100 text-slate-600", icon: Activity };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/20 p-4 md:p-6 lg:p-8 font-sans pb-24 lg:pb-10">
      {/* Error Popup */}
      <AnimatePresence>
        {errorPopup.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.3 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className={`
              relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-xl
              ${errorPopup.type === 'error' ? 'bg-red-500/90 border-red-400' : 
                errorPopup.type === 'warning' ? 'bg-amber-500/90 border-amber-400' : 
                'bg-blue-500/90 border-blue-400'}
              text-white
            `}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="relative p-4 flex items-start gap-3">
                {errorPopup.type === 'error' ? (
                  <XCircle className="shrink-0 mt-0.5" size={20} />
                ) : errorPopup.type === 'warning' ? (
                  <AlertTriangle className="shrink-0 mt-0.5" size={20} />
                ) : (
                  <ShieldCheck className="shrink-0 mt-0.5" size={20} />
                )}
                <p className="flex-1 text-sm font-medium">{errorPopup.message}</p>
                <button 
                  onClick={() => setErrorPopup({ show: false, message: "", type: "error" })}
                  className="shrink-0 hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <XCircle size={16} />
                </button>
              </div>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-white/30"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gavel className="text-indigo-600" size={22} /> 
            {biddingData?.nameOfBid || "Live Bidding Room"}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 flex items-center gap-2 flex-wrap">
            <span
              className={`${statusInfo.color} px-2 py-0.5 rounded-md text-[10px] md:text-xs font-bold flex items-center gap-1`}
            >
              <StatusIcon size={12} />
              {statusInfo.text}
            </span>
            Session: {documentId?.slice(0, 8)}... • Admin:{" "}
            {adminId?.slice(0, 8)}...
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl shadow-sm border border-slate-200 w-full sm:w-auto"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
            {userData?.name?.charAt(0)?.toUpperCase() || mobileNumber.slice(-2)}
          </div>
          <span className="font-bold text-slate-700 text-sm truncate">
            {userData?.name || `User ${mobileNumber.slice(-4)}`}
          </span>
          {userData?.is_verified && (
            <ShieldCheck size={14} className="text-emerald-500" />
          )}
        </motion.div>
      </header>

      {/* Month Selector */}
      {months.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto mb-6"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Select Month</h3>
            </div>

            {/* Month buttons */}
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <motion.button
                  key={month}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMonthSelect(month)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    selectedMonth === month
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {month}
                  {roundsByMonth[month] && roundsByMonth[month].length > 1 && (
                    <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {roundsByMonth[month].length}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Round selector within selected month */}
            {selectedMonth &&
              roundsByMonth[selectedMonth] &&
              roundsByMonth[selectedMonth].length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-4 border-t border-slate-100"
                >
                  <h4 className="text-xs font-medium text-slate-500 mb-2">
                    Rounds in {selectedMonth}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roundsByMonth[selectedMonth].map((round, index) => (
                      <motion.button
                        key={round.id || index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => loadRoundData(round)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedRound?.id === round.id
                            ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-transparent"
                        }`}
                      >
                        {round.Round_Name || `Round ${index + 1}`}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
          </div>
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP ROW: Stats & Timer (Left) + Quick Bid Options (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Left: Stats & Timer */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 flex flex-col justify-between h-full"
          >
            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-5"></div>

            <div className="flex flex-row items-center justify-between gap-4 relative z-10 mb-8 flex-1">
              <div>
                <p className="text-slate-400 font-medium mb-1.5 flex items-center gap-2 text-xs md:text-sm">
                  <Activity size={16} /> Remaining Pool Balance
                </p>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                  ₹{currentRemaining.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <Circle size={6} className="fill-slate-500" />
                  Current Round: {roundName || "No round selected"}
                </p>
              </div>

              {/* Timer Block */}
              <motion.div
                animate={{ scale: timeLeft < 60 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.5, repeat: timeLeft < 60 ? Infinity : 0 }}
                className={`flex flex-col items-end ${biddingNotStarted ? "text-yellow-400" : timeLeft < 60 ? "text-red-400" : "text-slate-200"}`}
              >
                <p className="text-xs md:text-sm font-medium mb-1.5 flex items-center gap-1.5 opacity-80">
                  <Timer size={14} />
                  {biddingNotStarted ? "Starts in" : "Time Remaining"}
                </p>
                <div className="text-2xl md:text-3xl font-black tracking-widest font-mono bg-slate-800/50 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm inline-block">
                  {formatTime(timeLeft)}
                </div>
                {startTime && endTime && (
                  <p className="text-[10px] text-slate-500 mt-2">
                    {formatDateTime(startTime)} - {formatDateTime(endTime)}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Progress Bar */}
            <div className="mt-auto">
              <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden relative z-10">
                <motion.div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">
                <span>Total: ₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Top Right: Bidding Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between h-full"
          >
            <div>
              <h4 className="text-base md:text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                Quick Bid Options
                {roundName && (
                  <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={12} />
                    {roundName}
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {percentages.map((percent, index) => {
                  const calculatedAmount = (totalAmount * percent) / 100;
                  const canAfford = currentRemaining >= calculatedAmount;
                  const isDisabled =
                    isWinnerDeclared ||
                    !selectedRound ||
                    isPlacingBid ||
                    isTimeUp ||
                    !biddingActive ||
                    biddingNotStarted ||
                    currentRemaining <= 0 ||
                    !canAfford;

                  return (
                    <motion.button
                      key={percent}
                      whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                      onClick={() => placeBid(percent)}
                      disabled={isDisabled}
                      className={`relative p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-200 group overflow-hidden
                        ${
                          !isDisabled
                            ? "border-slate-100 hover:border-indigo-600 bg-slate-50 hover:bg-white hover:shadow-lg cursor-pointer"
                            : "border-slate-50 bg-slate-50 opacity-40 cursor-not-allowed"
                        }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all"></div>
                      <span className="text-lg md:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors relative z-10">
                        ₹{calculatedAmount.toLocaleString()}
                      </span>
                      <ArrowRight
                        className="text-slate-300 group-hover:text-indigo-600 transition-colors hidden sm:block relative z-10 group-hover:translate-x-1"
                        size={18}
                      />
                    </motion.button>
                  );
                })}
              </div>

              {isPlacingBid && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-indigo-600 text-center mt-2 flex items-center justify-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  Placing bid...
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* BOTTOM ROW: Live Ledger - Professional Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 h-[400px] lg:h-[450px] flex flex-col w-full"
        >
          <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-slate-100 shrink-0">
            <h4 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" size={18} /> Live Auction Ledger
              {roundName && (
                <span className="text-xs font-normal bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                  {roundName}
                </span>
              )}
            </h4>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full flex items-center gap-1">
                <Users size={12} />
                {bids.length} Bids
              </span>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-50 rounded-xl mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-4">Bidder</div>
            <div className="col-span-3 text-right">Bid Amount</div>
            <div className="col-span-3 text-right">Remaining</div>
            <div className="col-span-2 text-right">Time</div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {bids.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Gavel size={48} className="mb-4 opacity-20" />
                </motion.div>
                <p className="font-medium text-sm md:text-base">
                  No activity yet
                </p>
                <p className="text-xs md:text-sm">
                  Bids will appear here in real-time
                </p>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <AnimatePresence>
                  {bids.map((bid, index) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`grid grid-cols-12 gap-2 p-3 rounded-xl border transition-all ${
                        index === 0 
                          ? "bg-gradient-to-r from-indigo-50 to-indigo-50/50 border-indigo-200 shadow-sm" 
                          : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="col-span-4 flex items-center gap-2">
                        {index === 0 && (
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-indigo-500"
                          />
                        )}
                        <span className={`font-bold text-sm truncate ${
                          index === 0 ? "text-indigo-700" : "text-slate-900"
                        }`}>
                          {bid.bidderName}
                        </span>
                      </div>
                      <div className="col-span-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign size={12} className="text-emerald-500" />
                          <span className={`font-black ${
                            index === 0 ? "text-indigo-600" : "text-emerald-600"
                          }`}>
                            {bid.bidAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-3 text-right">
                        <span className={`font-medium text-sm ${
                          index === 0 ? "text-indigo-600" : "text-slate-700"
                        }`}>
                          ₹{bid.remainingAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-xs font-mono text-slate-400">
                          {bid.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Winner Modal Overlay - Enhanced Design */}
      <AnimatePresence>
        {isWinnerDeclared && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, rotateX: -15 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 20, rotateX: -15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-white to-indigo-50/30 p-8 md:p-10 rounded-[2rem] text-center max-w-md w-full shadow-2xl relative overflow-hidden border border-white/50"
            >
              {/* Animated Background Elements */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-100/50 to-transparent"></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
              </div>

              {/* Confetti Effect */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                  initial={{
                    top: "50%",
                    left: "50%",
                    opacity: 1,
                  }}
                  animate={{
                    top: `${Math.random() * 200 - 100}%`,
                    left: `${Math.random() * 200 - 100}%`,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}

              <div className="relative z-10">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1.2, 1]
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/30"
                >
                  <Trophy size={48} className="text-white" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-1 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Round Complete!
                  </h2>
                  <p className="text-slate-500 font-medium mb-2 text-sm md:text-base">
                    {roundName}
                  </p>
                  <p className="text-slate-500 font-medium mb-6 text-sm flex items-center justify-center gap-2">
                    <Award size={16} className="text-yellow-500" />
                    Winning Bidder
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100 shadow-lg"
                >
                  <motion.p 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-xl md:text-2xl font-black text-slate-900 mb-2"
                  >
                    {winner.bidderName}
                  </motion.p>
                  <p className="text-xs md:text-sm text-slate-500 mb-1">
                    Final Bid Amount
                  </p>
                  <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    ₹{winner.bidAmount.toLocaleString()}
                  </p>
                  <motion.div 
                    className="mt-3 text-xs text-slate-400 flex items-center justify-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Clock size={12} />
                    {new Date(winner.time).toLocaleTimeString()}
                  </motion.div>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (selectedRound) {
                      setIsWinnerDeclared(false);
                      setWinner(null);
                      setBids([]);
                      setCurrentRemaining(totalAmount);
                    } else {
                      navigate("/");
                    }
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 group"
                >
                  <span className="flex items-center justify-center gap-2">
                    {selectedRound ? "Continue to Next Round" : "Return to Dashboard"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default ParticipantBiddingPage;