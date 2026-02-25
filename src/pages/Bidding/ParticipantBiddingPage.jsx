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
  AlertCircle,
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

  // 🔹 Custom Toast State for Animated Alerts
  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

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

  const percentages = [5, 4, 3, 2];

  // Helper function to show custom animated toast instead of alert
  const showToast = (message, type = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // Helper function to convert UTC to local date
  const convertUTCToLocal = (utcDateString) => {
    if (!utcDateString) return null;
    return new Date(utcDateString);
  };

  // Function to extract month from round name
 const extractMonthFromRoundName = (roundName) => {
  if (!roundName) return "Other Rounds";

  // Match Month 1, Month_1, etc.
  const monthMatch = roundName.match(/month[_\s]*(\d+)/i);
  if (monthMatch) {
    return `Month ${monthMatch[1]}`;
  }

  // Match Week 1, Week_1, etc.
  const weekMatch = roundName.match(/week[_\s]*(\d+)/i);
  if (weekMatch) {
    return `Week ${weekMatch[1]}`;
  }

  // Match actual month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
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
          const amount = parseInt(data.amount) || 0;
          setTotalAmount(amount);

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

            const uniqueMonths = Object.keys(roundsByMonthMap).sort((a, b) => {
              const monthNumA = a.match(/\d+/);
              const monthNumB = b.match(/\d+/);

              if (monthNumA && monthNumB) {
                return parseInt(monthNumA[0]) - parseInt(monthNumB[0]);
              }
              return a.localeCompare(b);
            });

            setMonths(uniqueMonths);

            if (uniqueMonths.length > 0) {
              setSelectedMonth(uniqueMonths[0]);
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

    const start = round.startTime ? convertUTCToLocal(round.startTime) : null;
    const end = round.endTime ? convertUTCToLocal(round.endTime) : null;

    setStartTime(start);
    setEndTime(end);

    if (round.Bidding_History && round.Bidding_History.length > 0) {
      const sortedHistory = [...round.Bidding_History].sort(
        (a, b) => new Date(b.bidTime) - new Date(a.bidTime),
      );

      const formattedBids = sortedHistory.map((bid, index) => {
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

      const totalBidAmount = round.Bidding_History.reduce(
        (sum, bid) => sum + parseFloat(bid.amount),
        0,
      );
      setCurrentRemaining(baseAmount - totalBidAmount);
    } else {
      setBids([]);
      setCurrentRemaining(baseAmount);
    }

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

    calculateTimeLeft(start, end);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    const monthRounds = roundsByMonth[month];
    if (monthRounds && monthRounds.length > 0) {
      loadRoundData(monthRounds[0]);
    }
  };

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

  useEffect(() => {
    if (!startTime || !endTime || isWinnerDeclared) return;

    const timer = setInterval(() => {
      calculateTimeLeft(startTime, endTime);
    }, 1000);

    calculateTimeLeft(startTime, endTime);

    return () => clearInterval(timer);
  }, [startTime, endTime, isWinnerDeclared]);

  useEffect(() => {
    if (!biddingActive || isWinnerDeclared) return;

    if (timeLeft <= 0 && bids.length > 0) {
      setBiddingActive(false);
      declareWinner();
    }
  }, [timeLeft, biddingActive, bids.length, isWinnerDeclared]);

  useEffect(() => {
    if (
      playAmount > 0 &&
      currentRemaining <= playAmount &&
      bids.length > 0 &&
      !isWinnerDeclared &&
      biddingActive
    ) {
      declareWinner();
    }
  }, [currentRemaining, playAmount, bids.length, isWinnerDeclared, biddingActive]);

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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (mobileNumber.length !== 10) {
      showToast("Mobile number must be exactly 10 digits");
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
      setRejectionMessage("Unable to verify at this moment. Please try again later.");
      setAuthStatus("REJECTED");
    }
  };

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

    if (bids.length > 0) {
      const lastBid = bids[0];

      if (lastBid.bidderName === userData.name) {
        showToast("You cannot place two consecutive bids. Wait for another participant.");
        return;
      }
    }

    const bidAmount = (totalAmount * percentage) / 100;
    const newRemaining = currentRemaining - bidAmount;

    if (newRemaining < 0) {
      showToast("Remaining amount too low for this bid.");
      return;
    }

    if (newRemaining < playAmount) {
      showToast(`Cannot bid below the target amount of ₹${playAmount.toLocaleString()}`);
      return;
    }

    setIsPlacingBid(true);

    try {
      const response = await axios.post(
        `https://api.regeve.in/api/bidding/${selectedRound.documentId}/place-bid`,
        {
          participantDocumentId: userData.documentId,
          amount: bidAmount,
        },
      );

      if (response.data?.data) {
        await refreshRoundData();
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      showToast(error.response?.data?.error?.message || "Failed to place bid. Please try again.");
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

  const declareWinner = async () => {
    if (bids.length === 0 || !selectedRound) return;

    const winningBid = bids[0];

    try {
      setWinner(winningBid);
      setIsWinnerDeclared(true);
      setBiddingActive(false);
    } catch (error) {
      console.error("Error declaring winner:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[2rem] shadow-2xl text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            Loading Bidding Session...
          </h2>
        </motion.div>
      </div>
    );
  }

  if (!isValidRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl text-center max-w-md w-full border border-slate-100"
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
            className="w-full bg-slate-900 hover:bg-slate-800 transition-colors text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            Return to Dashboard <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  if (authStatus !== "VERIFIED") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        {/* Toast Notification Container */}
        <AnimatePresence>
          {toast.show && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[320px] max-w-md"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-50 text-red-500">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 text-sm">Action Blocked</h4>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button onClick={() => setToast({ show: false, message: '', type: '' })} className="text-slate-400 hover:text-slate-600">
                <XCircle size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-[-10%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-white/50 relative z-10"
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
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  Request Entry <ArrowRight size={18} />
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
                  className="w-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  Try Again <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  const progressPercentage =
    totalAmount > 0 ? (currentRemaining / totalAmount) * 100 : 0;

  const getStatusInfo = () => {
    if (isWinnerDeclared)
      return { text: "COMPLETED", color: "bg-purple-100 text-purple-700" };
    if (biddingNotStarted)
      return { text: "NOT STARTED", color: "bg-yellow-100 text-yellow-700" };
    if (biddingActive)
      return { text: "LIVE", color: "bg-emerald-100 text-emerald-700" };
    if (!biddingActive && timeLeft === 0)
      return { text: "ENDED", color: "bg-slate-100 text-slate-600" };
    return { text: "INACTIVE", color: "bg-slate-100 text-slate-600" };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8 font-sans pb-24 lg:pb-10 relative">
      {/* 🟢 TOAST NOTIFICATION FOR ERRORS 🟢 */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[320px] max-w-md"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-red-50 text-red-500">
              <AlertCircle size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-sm">Wait a moment</h4>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => setToast({ show: false, message: '', type: '' })} className="text-slate-400 hover:text-slate-600">
              <XCircle size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gavel className="text-indigo-600" size={22} />{" "}
            {biddingData?.nameOfBid || "Live Bidding Room"}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 flex items-center gap-2 flex-wrap">
            <span
              className={`${statusInfo.color} px-2 py-0.5 rounded-md text-[10px] md:text-xs font-bold`}
            >
              {statusInfo.text}
            </span>
           
            
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200 w-full sm:w-auto">
          <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
            {userData?.name?.charAt(0)?.toUpperCase() || mobileNumber.slice(-2)}
          </div>
          <span className="font-bold text-slate-700 text-sm truncate">
            {userData?.name || `User ${mobileNumber.slice(-4)}`}
          </span>
          {userData?.is_verified && (
            <ShieldCheck size={14} className="text-emerald-500" />
          )}
        </div>
      </header>

      {/* Month Selector */}
      {months.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">Select {biddingData?.durationUnit === "Weekly" ? "Week" : "Month"}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <button
                  key={month}
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
                </button>
              ))}
            </div>

            {selectedMonth &&
              roundsByMonth[selectedMonth] &&
              roundsByMonth[selectedMonth].length > 1 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-medium text-slate-500 mb-2">
                    Rounds in {selectedMonth}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roundsByMonth[selectedMonth].map((round, index) => (
                      <button
                        key={round.id || index}
                        onClick={() => loadRoundData(round)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedRound?.id === round.id
                            ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-transparent"
                        }`}
                      >
                        {round.Round_Name || `Round ${index + 1}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Left: Stats & Timer */}
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10 flex flex-col justify-between h-full">
            <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-row items-center justify-between gap-4 relative z-10 mb-8 flex-1">
              <div>
                <p className="text-slate-400 font-medium mb-1.5 flex items-center gap-2 text-xs md:text-sm">
                  <Activity size={16} /> Remaining Pool Balance
                </p>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                  ₹{currentRemaining.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Current Round: {roundName || "No round selected"}
                </p>
              </div>

              <div
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
              </div>
            </div>

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
          </div>

          {/* Top Right: Bidding Controls */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between h-full">
            <div>
              <h4 className="text-base md:text-lg font-black text-slate-900 mb-5 flex items-center gap-2">
                Quick Bid Options
                {roundName && (
                  <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {roundName}
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {percentages.map((percent) => {
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
                    <button
                      key={percent}
                      onClick={() => placeBid(percent)}
                      disabled={isDisabled}
                      className={`relative p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-200 active:scale-95 group overflow-hidden
                        ${
                          !isDisabled
                            ? "border-slate-100 hover:border-indigo-600 bg-slate-50 hover:bg-white hover:shadow-md cursor-pointer"
                            : "border-slate-50 bg-slate-50 opacity-40 cursor-not-allowed"
                        }`}
                    >
                      <span className="text-lg md:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors relative z-10">
                        ₹{calculatedAmount.toLocaleString()}
                      </span>
                      <ArrowRight
                        className="text-slate-300 group-hover:text-indigo-600 transition-colors hidden sm:block relative z-10"
                        size={18}
                      />
                    </button>
                  );
                })}
              </div>

              {isPlacingBid && (
                <p className="text-xs text-indigo-600 text-center mt-2 font-semibold animate-pulse">
                  Placing bid securely...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Upgraded Live Ledger */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 h-[450px] lg:h-[500px] flex flex-col w-full">
          <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-slate-100 shrink-0">
            <h4 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="text-indigo-500" size={20} /> Live Ledger
              {roundName && (
                <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {roundName}
                </span>
              )}
            </h4>
            <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100">
              {bids.length} Total Bids
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {bids.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Activity size={36} className="mb-4 opacity-20" />
                <p className="font-medium text-sm md:text-base">
                  No activity yet
                </p>
                <p className="text-xs md:text-sm">
                  Bids will appear here in real-time
                </p>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <AnimatePresence>
                  {bids.map((bid, index) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                        index === 0 ? "border-indigo-100 ring-1 ring-indigo-50" : ""
                      }`}
                    >
                      {index === 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                      )}
                      
                      <div className="flex items-center gap-4 mb-3 sm:mb-0 ml-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-inner ${
                          index === 0 ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {bid.bidderName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                            {bid.bidderName}
                            {index === 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider animate-pulse border border-indigo-100">
                                Latest
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <Clock size={12} /> {bid.time}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                            Bid Amount
                          </p>
                          <p className="font-black text-indigo-600 text-base md:text-lg">
                            ₹{bid.bidAmount.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                        
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                            Remaining
                          </p>
                          <p className="font-bold text-slate-700 text-sm md:text-base">
                            ₹{bid.remainingAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🌟 PREMIUM WINNER MODAL UPGRADE 🌟 */}
      <AnimatePresence>
        {isWinnerDeclared && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-slate-900 p-8 md:p-10 rounded-[2rem] text-center max-w-md w-full shadow-2xl relative overflow-hidden border border-slate-700"
            >
              {/* Glow effects in the background */}
              <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)] border-4 border-slate-800"
                >
                  <Trophy size={40} className="text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
                  Round Winner!
                </h2>
                <p className="text-slate-400 font-medium mb-8 text-sm md:text-base bg-slate-800/50 inline-block px-4 py-1.5 rounded-full border border-slate-700">
                  {roundName}
                </p>

                <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-slate-700 shadow-inner">
                  <p className="text-xs md:text-sm text-slate-400 mb-1 uppercase tracking-widest font-bold">
                    Winning Bidder
                  </p>
                  <p className="text-xl md:text-2xl font-black text-white mb-4">
                    {winner.bidderName}
                  </p>
                  
                  <div className="w-full h-px bg-slate-700 mb-4"></div>
                  
                  <p className="text-xs md:text-sm text-slate-400 mb-1 uppercase tracking-widest font-bold">
                    Final Bid Amount
                  </p>
                  <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                    ₹{winner.bidAmount.toLocaleString()}
                  </p>
                </div>

                <button
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
                  className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-95"
                >
                  {selectedRound ? "Continue to Next Round" : "Return to Dashboard"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; md:width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default ParticipantBiddingPage;