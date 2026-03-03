import React, { useState, useEffect, useRef } from "react";
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
  Award,
  Medal,
  Users,
  CreditCard,
  UploadCloud,
  CheckCircle,
  Download,
  Copy,
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
  const [winnerLocked, setWinnerLocked] = useState(false);

  // 🔹 Track shown winners across sessions using localStorage
  const [shownWinners, setShownWinners] = useState(() => {
    const saved = localStorage.getItem(`shownWinners_${documentId}`);
    return saved ? JSON.parse(saved) : {};
  });

  // 🔹 Custom Toast State for Animated Alerts
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "error",
  });

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

  // 🔹 Winners State - Store all winners from biddingwinners array
  const [allWinners, setAllWinners] = useState([]);
  const [currentRoundWinner, setCurrentRoundWinner] = useState(null);

  // 🔹 Bidding & Timer States
  const [bids, setBids] = useState([]);
  const [currentRemaining, setCurrentRemaining] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [biddingActive, setBiddingActive] = useState(false);
  const [biddingNotStarted, setBiddingNotStarted] = useState(false);
  const winnerRoundRef = useRef(null);

  // 🔹 Winner Modal State
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winner, setWinner] = useState(null);

  // 🔹 Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentFile, setPaymentFile] = useState(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // 🔹 API States
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const percentages = [5, 4, 3, 2];

  // ✅ UNIFIED MATH CALCULATIONS
  const basePlayAmount = parseInt(playAmount) || 0;
  const taxAmount = basePlayAmount * 0.04;
  const totalPoolAmount = basePlayAmount + taxAmount;
  const maxPeopleCount = biddingData?.maxPeople || 1; // Fallback to 1 to prevent division by zero
  const amountPerParticipant = (totalPoolAmount / maxPeopleCount).toFixed(2);

  // 🔹 UPI Copy State
  const [upiCopied, setUpiCopied] = useState(false);
  const activeUpiId =
    biddingData?.Upi_Id || biddingData?.Admin_Upi_Id || "Not Provided";

  // Function to Copy UPI ID
  const handleCopyUpi = () => {
    if (activeUpiId === "Not Provided") return;
    navigator.clipboard.writeText(activeUpiId);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000); // Reset after 2 seconds
  };

  // Function to Download QR Code (Mobile Safe)
  const handleDownloadQr = async () => {
    if (!qrCodeUrl) return;
    try {
      const imageUrl = `https://api.regeve.in${qrCodeUrl}`;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `Admin_QR_Code_${documentId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading QR:", error);
      showToast("Failed to download QR code.");
    }
  };

  // Save shown winners to localStorage whenever it changes
  useEffect(() => {
    if (documentId) {
      localStorage.setItem(
        `shownWinners_${documentId}`,
        JSON.stringify(shownWinners),
      );
    }
  }, [shownWinners, documentId]);

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

  // ✅ Detect winner dynamically when declared
  useEffect(() => {
    if (!selectedRound) return;

    const roundWinner = findWinnerForRound(selectedRound.Round_Name);

    if (roundWinner && winnerRoundRef.current !== selectedRound.Round_Name) {
      winnerRoundRef.current = selectedRound.Round_Name;

      setWinner({
        bidderName: roundWinner.winnerName,
        bidAmount: parseFloat(roundWinner.amount),
        time: roundWinner.date,
        roundName: roundWinner.round,
        phoneNumber: roundWinner.phoneNumber,
      });

      setShowWinnerModal(true);
      setCurrentRoundWinner(roundWinner);
      setBiddingActive(false);
    }
  }, [allWinners, selectedRound]);

  // ✅ AUTO-TRANSITION: Winner Modal -> Payment Modal after 2 seconds
  // useEffect(() => {
  //   let timer;
  //   if (showWinnerModal && winner) {
  //     timer = setTimeout(() => {
  //       setShowWinnerModal(false);
  //       setShowPaymentModal(true);
  //     }, 2000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [showWinnerModal, winner]);

  // 🔹 Build Participant Photo Map (by phone number)
  const participantPhotoMap = React.useMemo(() => {
    if (!biddingData?.bidding_participants) return {};

    const baseURL = "https://api.regeve.in"; // your production API
    const map = {};

    biddingData.bidding_participants.forEach((p) => {
      if (p?.Photo?.url) {
        map[p.phonenumber] = `${baseURL}${p.Photo.url}`;
      }
    });

    return map;
  }, [biddingData]);

  // Function to extract month from round name
  const extractMonthFromRoundName = (roundName) => {
    if (!roundName) return "Other Rounds";

    const monthMatch = roundName.match(/month[_\s]*(\d+)/i);
    if (monthMatch) {
      return `Month ${monthMatch[1]}`;
    }

    const weekMatch = roundName.match(/week[_\s]*(\d+)/i);
    if (weekMatch) {
      return `Week ${weekMatch[1]}`;
    }

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
          const amount = parseInt(data.amount) || 0;
          setTotalAmount(amount);

          // Store all winners from biddingwinners array
          if (data.biddingwinners && data.biddingwinners.length > 0) {
            setAllWinners(data.biddingwinners);
          }

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

  // Function to find winner for a specific round
  const findWinnerForRound = (roundName) => {
    if (!allWinners || allWinners.length === 0) return null;
    return allWinners.find((winner) => winner.round === roundName) || null;
  };

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

    // Check if this round has a winner from biddingwinners
    const roundWinner = findWinnerForRound(round.Round_Name);
    setCurrentRoundWinner(roundWinner);

    if (round.Bidding_History && round.Bidding_History.length > 0) {
      const sortedHistory = [...round.Bidding_History].sort(
        (a, b) => new Date(b.bidTime) - new Date(a.bidTime),
      );

      const formattedBids = sortedHistory.map((bid, index) => {
        const bidsUpToThis = round.Bidding_History.filter(
          (b) => new Date(b.bidTime) <= new Date(bid.bidTime),
        ).sort((a, b) => new Date(a.bidTime) - new Date(b.bidTime));

        let remainingAtBidTime = baseAmount;
        bidsUpToThis.forEach((b) => {
          remainingAtBidTime -= parseFloat(b.amount);
        });

        return {
          id: bid.id || Date.now() + Math.random(),
          bidderName: bid.name,
          phoneNumber: bid.phoneNumber,
          bidAmount: parseFloat(bid.amount),
          remainingAmount: remainingAtBidTime,
          time: new Date(bid.bidTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          isWinner: roundWinner && bid.name === roundWinner.winnerName,
        };
      });

      setBids(formattedBids);

      const totalBidAmount = round.Bidding_History.reduce(
        (sum, bid) => sum + parseFloat(bid.amount),
        0,
      );
      setCurrentRemaining(baseAmount - totalBidAmount);
      setWinnerLocked(false);
    } else {
      setBids([]);
      setCurrentRemaining(baseAmount);
    }
  };

  const handleMonthSelect = (month) => {
    winnerRoundRef.current = null;
    setWinnerLocked(false);
    setShowWinnerModal(false);
    setWinner(null);
    setCurrentRoundWinner(null);

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
    if (!startTime || !endTime || showWinnerModal) return;

    const timer = setInterval(() => {
      calculateTimeLeft(startTime, endTime);
    }, 1000);

    calculateTimeLeft(startTime, endTime);

    return () => clearInterval(timer);
  }, [startTime, endTime, showWinnerModal]);

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
    return new Date(date).toLocaleString("en-US", {
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
      setRejectionMessage(
        "Unable to verify at this moment. Please try again later.",
      );
      setAuthStatus("REJECTED");
    }
  };

  const placeBid = async (percentage) => {
    if (
      biddingNotStarted ||
      isTimeUp ||
      showWinnerModal ||
      currentRoundWinner ||
      !selectedRound ||
      isPlacingBid ||
      currentRemaining <= 0
    ) {
      return;
    }

    if (bids.length > 0) {
      const lastBid = bids[0];

      if (lastBid.bidderName === userData.name) {
        showToast(
          "You cannot place two consecutive bids. Wait for another participant.",
        );
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
      showToast(
        `Cannot bid below the target amount of ₹${playAmount.toLocaleString()}`,
      );
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
      showToast(
        error.response?.data?.error?.message ||
          "Failed to place bid. Please try again.",
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
        { params: { populate: "*" } },
      );

      const updatedData = response.data?.data;
      if (!updatedData) return;

      // Update winners list
      if (updatedData.biddingwinners) {
        setAllWinners(updatedData.biddingwinners);
      }

      const updatedRound = updatedData.bidding_rounds.find(
        (r) => r.documentId === selectedRound.documentId,
      );

      if (updatedRound) {
        loadRoundData(updatedRound);
      }
    } catch (error) {
      console.error("Auto refresh error:", error);
    }
  };

  // 🔹 Handle Payment Submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentFile) {
      showToast("Please upload a payment proof image.");
      return;
    }

    setIsSubmittingPayment(true);

    try {
      const jwt = localStorage.getItem("jwt");

      // ==============================
      // 1️⃣ Upload Image
      // ==============================
      const formData = new FormData();
      formData.append("files", paymentFile);

      const uploadResponse = await axios.post(
        "https://api.regeve.in/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      const mediaId = uploadResponse.data[0].id;

      // ==============================
      // 2️⃣ Dynamic Amount Calculation (Unified)
      // ==============================
      const currentRound = biddingData.bidding_rounds.find(
        (round) => round.Round_Name === roundName,
      );

      if (!currentRound) {
        throw new Error("Round not found");
      }

      // Use the pre-calculated amount based on maxPeople
      const exactAmount = Number(amountPerParticipant);

      // ==============================
      // 3️⃣ Correct Payload (Use ID not documentId)
      // ==============================
      const payload = {
        data: {
          Round_Name: roundName,
          Amount: exactAmount.toFixed(2),
          Payment_Proof: mediaId,
          biddings: [biddingData.id],
          bidding_participants: [userData.id],
        },
      };

      // ==============================
      // 4️⃣ Execute Request
      // ==============================
      await axios.post(
        "https://api.regeve.in/api/bidding-participant-payments/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        },
      );

      setPaymentSuccess(true);

      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        setPaymentFile(null);
      }, 3000);
    } catch (error) {
      console.error("FULL PAYMENT ERROR:", error.response || error);
      showToast(
        error.response?.data?.error?.message ||
          "Failed to submit payment. Please try again.",
      );
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  useEffect(() => {
    if (!selectedRound || showWinnerModal || currentRoundWinner) return;

    const interval = setInterval(() => {
      refreshRoundData();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedRound, showWinnerModal, currentRoundWinner]);

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
                <h4 className="font-bold text-slate-900 text-sm">
                  Action Blocked
                </h4>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast({ show: false, message: "", type: "" })}
                className="text-slate-400 hover:text-slate-600"
              >
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
                  className="w-full cursor-pointer bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
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
                  className="w-full cursor-pointer bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
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
    if (currentRoundWinner)
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

  // Helper inside render to safely extract QR image URL
  const getQRCodeUrl = () => {
    if (biddingData?.QR_Code && biddingData.QR_Code.length > 0) {
      return biddingData.QR_Code[0].url;
    }
    if (biddingData?.Admin_QR_Code && biddingData.Admin_QR_Code.length > 0) {
      return biddingData.Admin_QR_Code[0].url;
    }
    if (biddingData?.QR_Code?.url) {
      return biddingData.QR_Code.url;
    }
    if (biddingData?.Admin_QR_Code?.url) {
      return biddingData.Admin_QR_Code.url;
    }
    return null;
  };

  const qrCodeUrl = getQRCodeUrl();

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
              <h4 className="font-bold text-slate-900 text-sm">
                Wait a moment
              </h4>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast({ show: false, message: "", type: "" })}
              className="text-slate-400 hover:text-slate-600"
            >
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

        {/* Right Header Section with Pay Button and Profile */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-gradient-to-r cursor-pointer  from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <CreditCard size={18} /> Pay Round
          </button>

          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200">
            <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0 overflow-hidden">
              {participantPhotoMap[mobileNumber] ? (
                <img
                  src={participantPhotoMap[mobileNumber]}
                  alt={userData?.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                userData?.name?.charAt(0)?.toUpperCase() ||
                mobileNumber.slice(-2)
              )}
            </div>
            <span className="font-bold text-slate-700 text-sm truncate">
              {userData?.name || `User ${mobileNumber.slice(-4)}`}
            </span>
            {userData?.is_verified && (
              <ShieldCheck size={14} className="text-emerald-500" />
            )}
          </div>
        </div>
      </header>

      {/* Month Selector */}
      {months.length > 0 && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-700">
                Select{" "}
                {biddingData?.durationUnit === "Weekly" ? "Week" : "Month"}
              </h3>
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
                    {roundsByMonth[selectedMonth].map((round, index) => {
                      const hasWinner = allWinners.some(
                        (w) => w.round === round.Round_Name,
                      );
                      return (
                        <button
                          key={round.id || index}
                          onClick={() => loadRoundData(round)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5
                            ${
                              selectedRound?.id === round.id
                                ? hasWinner
                                  ? "bg-purple-100 text-purple-700 border-2 border-purple-200"
                                  : "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                                : hasWinner
                                  ? "bg-purple-50 text-purple-600 hover:bg-purple-100 border-2 border-transparent"
                                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-transparent"
                            }`}
                        >
                          {round.Round_Name || `Round ${index + 1}`}
                          {hasWinner && (
                            <Trophy size={12} className="text-purple-500" />
                          )}
                        </button>
                      );
                    })}
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
                <p className="text-xs text-green-500 mt-2">
                  Target Amount: {playAmount || "No round selected"}
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
                    currentRoundWinner ||
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
                      className={`relative  p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-200 active:scale-95 group overflow-hidden
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

        {/* BOTTOM ROW: Live Ledger with Winner Indicator */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 h-[450px] lg:h-[500px] flex flex-col w-full">
          <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <h4 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock className="text-indigo-500" size={20} /> Live Ledger
                {roundName && (
                  <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {roundName}
                  </span>
                )}
              </h4>
              {currentRoundWinner && (
                <div className="flex items-center gap-1.5 bg-purple-50 text-green-700 px-3 py-1.5 rounded-full border border-purple-200">
                  <Medal size={14} />
                  <span className="text-xs font-bold">
                    Winner: {currentRoundWinner.winnerName}
                  </span>
                </div>
              )}
            </div>
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
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${
                        bid.isWinner
                          ? "border-purple-300 bg-purple-50/50 ring-2 ring-purple-200"
                          : index === 0
                            ? "border-indigo-100 ring-1 ring-indigo-50"
                            : "border-slate-100"
                      }`}
                    >
                      {index === 0 && !bid.isWinner && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
                      )}
                      {bid.isWinner && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
                      )}

                      <div className="flex items-center gap-4 mb-3 sm:mb-0 ml-1">
                        <div className="w-10 h-10 rounded-full overflow-hidden shadow-inner border border-slate-200">
                          {participantPhotoMap[bid.phoneNumber] ? (
                            <img
                              src={participantPhotoMap[bid.phoneNumber]}
                              alt={bid.bidderName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`w-full h-full flex items-center justify-center font-bold ${
                                bid.isWinner
                                  ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white"
                                  : index === 0
                                    ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                                    : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {bid.bidderName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                            {bid.bidderName}
                            {bid.isWinner && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-black uppercase tracking-wider border border-purple-200 flex items-center gap-1">
                                <Trophy size={10} /> Winner
                              </span>
                            )}
                            {index === 0 && !bid.isWinner && (
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
                          <p
                            className={`font-black text-base md:text-lg ${
                              bid.isWinner
                                ? "text-purple-600"
                                : "text-indigo-600"
                            }`}
                          >
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

      {/* 💳 PAYMENT MODAL 💳 */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl relative my-auto border border-slate-100"
            >
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentSuccess(false);
                  setPaymentFile(null);
                }}
                className="absolute cursor-pointer top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
              >
                <XCircle size={20} />
              </button>

              {paymentSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="text-emerald-500" size={40} />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    Payment Submitted!
                  </h2>
                  <p className="text-slate-500">
                    Your payment proof has been successfully uploaded and sent
                    for verification.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-slate-900 mb-1">
                      Pay for Round
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      {biddingData?.nameOfBid} -{" "}
                      <span className="text-indigo-600 font-bold">
                        {roundName || selectedMonth}
                      </span>
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-200">
                    {/* 1. Show the Math First */}
                    <div className="space-y-3 mb-5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        Calculation Breakdown
                      </p>

                      <div className="flex justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Trophy size={14} className="text-yellow-500" /> Play
                          Amount
                        </span>
                        <span className="font-semibold text-slate-800">
                          ₹{basePlayAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Activity size={14} className="text-red-400" />{" "}
                          Platform Fee (4%)
                        </span>
                        <span className="font-semibold text-red-500">
                          + ₹{taxAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm font-bold text-slate-800 pt-3 border-t border-slate-200 border-dashed">
                        <span>Total Pool Amount</span>
                        <span>₹{totalPoolAmount.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between text-sm text-slate-600 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Users size={14} className="text-blue-500" /> Max
                          Participants
                        </span>
                        <span className="font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded-md">
                          ÷ {maxPeopleCount}
                        </span>
                      </div>
                    </div>

                    {/* 2. Highlight Final Amount to Pay clearly */}
                    <div className="bg-indigo-600 rounded-xl p-4 text-white flex items-center justify-between shadow-lg shadow-indigo-600/20">
                      <div>
                        <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          Exact Amount to Pay
                        </p>
                        <p className="text-3xl md:text-4xl font-black tracking-tight">
                          ₹{amountPerParticipant}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                        <CreditCard size={24} className="text-white" />
                      </div>
                    </div>
                    {/* --- NEW: Due Date Section --- */}
                    <div className="mt-4 flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Calendar size={18} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider">
                          Payment Deadline
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          Due within{" "}
                          <span className="text-amber-700">5 to 7 days</span>{" "}
                          from today
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details (UPI & QR) */}
                  <div className="bg-white rounded-2xl p-5 mb-6 border border-slate-200 shadow-sm text-center">
                    <p className="text-sm text-slate-500 font-bold mb-3 uppercase tracking-wider">
                      Admin UPI Details
                    </p>

                    {/* Touchable UPI Copy Area (Mobile Friendly) */}
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="w-full relative cursor-pointer flex items-center justify-center gap-3 text-lg font-black text-indigo-700 mb-6 bg-indigo-50 py-3 px-4 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors active:scale-[0.98]"
                    >
                      <span className="truncate">{activeUpiId}</span>
                      {upiCopied ? (
                        <CheckCircle
                          size={20}
                          className="text-emerald-500 shrink-0"
                        />
                      ) : (
                        <Copy size={20} className="text-indigo-400 shrink-0" />
                      )}

                      {/* Floating 'Copied' badge */}
                      <AnimatePresence>
                        {upiCopied && (
                          <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: -20 }}
                            exit={{ opacity: 0 }}
                            className="absolute right-2 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-md"
                          >
                            Copied!
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>

                    {/* QR Code Section */}
                    {qrCodeUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="w-48 h-48 mx-auto border-2 border-slate-100 rounded-xl overflow-hidden p-2 mb-4 bg-white shadow-sm">
                          <img
                            src={`https://api.regeve.in${qrCodeUrl}`}
                            alt="Admin QR Code"
                            className="w-full h-full object-contain pointer-events-none"
                          />
                        </div>

                        {/* Mobile Friendly Download Button */}
                        <button
                          type="button"
                          onClick={handleDownloadQr}
                          className="flex items-center cursor-pointer justify-center gap-2 w-full max-w-[200px] text-sm font-bold text-slate-700 bg-slate-100 border border-slate-200 hover:bg-slate-200 py-3 rounded-full transition-colors active:scale-95 mx-auto"
                        >
                          <Download size={18} className="text-indigo-600" />{" "}
                          Save QR Code
                        </button>
                      </div>
                    ) : (
                      <div className="w-48 h-48 mx-auto border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50">
                        No QR Code
                      </div>
                    )}
                  </div>

                  <form onSubmit={handlePaymentSubmit}>
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Upload Payment Proof
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500 font-medium">
                            {paymentFile ? (
                              <span className="text-indigo-600">
                                {paymentFile.name}
                              </span>
                            ) : (
                              "Click to upload screenshot"
                            )}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => setPaymentFile(e.target.files[0])}
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingPayment}
                      className="w-full bg-slate-900 cursor-pointer hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                      {isSubmittingPayment ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Payment <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 WINNER MODAL 🌟 */}
      <AnimatePresence>
        {showWinnerModal && winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-[#0f1523] p-6 rounded-[2rem] text-center max-w-[340px] w-full shadow-2xl relative"
            >
              <div className="relative z-10 flex flex-col items-center">
                {/* Winner Profile Image Section */}
                <div className="relative w-28 h-28 mb-6 mt-2">
                  <div className="w-full h-full rounded-full border-[3px] border-[#7a6430] overflow-hidden bg-[#0f1523] flex items-center justify-center">
                    {participantPhotoMap[winner.phoneNumber] ? (
                      <img
                        src={participantPhotoMap[winner.phoneNumber]}
                        alt={winner.bidderName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-slate-600 text-sm font-medium">
                        No Image
                      </span>
                    )}
                  </div>

                  {/* Small yellow trophy badge */}
                  <div className="absolute -bottom-1 -right-1 bg-[#f5b301] p-2.5 rounded-full border-[3px] border-[#0f1523]">
                    <Trophy size={16} className="text-white" />
                  </div>
                </div>

                <h2 className="text-[26px] font-black text-white mb-1 tracking-tight">
                  Round Winner!
                </h2>
                <p className="text-indigo-400 font-bold mb-6 text-[11px] uppercase tracking-widest">
                  {winner.roundName}
                </p>

                {/* Inner Dark Card */}
                <div className="bg-[#161c2d] rounded-[1.5rem] p-6 w-full mb-6 border border-white/5">
                  <div className="mb-5">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                      Winning Bidder
                    </p>
                    <p className="text-xl font-black text-white leading-tight">
                      {winner.bidderName}
                    </p>
                    <p className="text-slate-400 text-[13px] mt-1 font-medium">
                      {winner.phoneNumber}
                    </p>
                  </div>

                  {/* Faint divider line */}
                  <div className="w-full h-px bg-slate-700/50 mb-5" />

                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">
                      Winning Amount
                    </p>
                    <p className="text-[32px] font-black text-[#f5b301] leading-none">
                      ₹{playAmount}
                    </p>
                  </div>
                </div>

                {/* Solid White Button - Added immediate skip to payment */}
                {/* Solid White Button - Click to close, then wait 3s for payment */}
                <button
                  onClick={() => {
                    setShowWinnerModal(false); // 1. Close Winner Popup immediately

                    setTimeout(() => {
                      setShowPaymentModal(true); // 2. Open Payment Popup after 3 seconds
                    }, 3000);
                  }}
                  className="w-full cursor-pointer bg-white text-black hover:bg-slate-100 px-6 py-3.5 rounded-[1rem] font-black transition-all active:scale-95"
                >
                  CLOSE
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
