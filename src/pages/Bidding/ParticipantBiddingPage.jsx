import React, { useState, useEffect } from 'react';
import { 
  Trophy, Phone, ArrowRight, Gavel, Clock, 
  AlertTriangle, ShieldCheck, Activity, Timer, XCircle, Calendar
} from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ParticipantBiddingPage = () => {
  // ✅ GET ROUTE PARAMS
  const { adminId, documentId } = useParams();
  const navigate = useNavigate();
  const isValidRoute = !!adminId && !!documentId;

  // 🔹 Auth States
  const [mobileNumber, setMobileNumber] = useState('');
  const [authStatus, setAuthStatus] = useState('LOGIN'); // LOGIN, PENDING, VERIFIED, REJECTED
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [userData, setUserData] = useState(null);

  // 🔹 Bidding Data States
  const [biddingData, setBiddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [playAmount, setPlayAmount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [roundName, setRoundName] = useState(''); 
  
  // New state for all rounds organized by month
  const [roundsByMonth, setRoundsByMonth] = useState({});
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
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

  const percentages = [5, 4, 3, 2];

  // Helper function to convert UTC to local date
  const convertUTCToLocal = (utcDateString) => {
    if (!utcDateString) return null;
    const date = new Date(utcDateString);
    return date;
  };

  // Function to extract month from round name
  const extractMonthFromRoundName = (roundName) => {
    if (!roundName) return 'Unknown';
    
    // Look for patterns like "Month 1", "Month 2", "Month 3", etc.
    const monthMatch = roundName.match(/month[_\s]*(\d+)/i);
    if (monthMatch) {
      return `Month ${monthMatch[1]}`;
    }
    
    // Look for patterns like "January", "February", etc.
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    for (const month of monthNames) {
      if (roundName.toLowerCase().includes(month.toLowerCase())) {
        return month;
      }
    }
    
    return 'Other Rounds';
  };

  // Fetch bidding data on mount
  useEffect(() => {
    if (!documentId) return;
    
    const fetchBiddingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.regeve.in/api/biddings/public/${documentId}`,
          { params: { populate: "*" } }
        );

        const data = response.data?.data;
        if (data) {
          setBiddingData(data);
          
          // Set total amount from the bidding data
          const amount = parseInt(data.amount) || 0;
          setTotalAmount(amount);
          setCurrentRemaining(amount);
          
          // Organize rounds by month
          if (data.bidding_rounds && data.bidding_rounds.length > 0) {
            const roundsByMonthMap = {};
            
            data.bidding_rounds.forEach(round => {
              const month = extractMonthFromRoundName(round.Round_Name || '');
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
                loadRoundData(firstMonthRounds[0]);
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
  const loadRoundData = (round) => {
    if (!round) return;
    
    setSelectedRound(round);
    setPlayAmount(parseInt(round.playAmount) || 0);
    setRoundName(round.Round_Name || '');
    
    // Parse dates - convert UTC to local
    const start = round.startTime ? convertUTCToLocal(round.startTime) : null;
    const end = round.endTime ? convertUTCToLocal(round.endTime) : null;
    
    setStartTime(start);
    setEndTime(end);
    
    // Reset bidding states for new round
    setBids([]);
    setIsWinnerDeclared(false);
    setWinner(null);
    
    // Reset remaining amount to total amount for new round
    setCurrentRemaining(totalAmount);
    
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
    
    if (!start || !end) {
      setBiddingActive(false);
      setTimeLeft(0);
      return;
    }

    // Check if bidding hasn't started yet
    if (now < start) {
      const timeUntilStart = Math.floor((start - now) / 1000);
      setBiddingNotStarted(true);
      setBiddingActive(false);
      setTimeLeft(timeUntilStart);
    } 
    // Check if bidding is in progress
    else if (now >= start && now <= end) {
      const timeUntilEnd = Math.floor((end - now) / 1000);
      setBiddingNotStarted(false);
      setBiddingActive(true);
      setTimeLeft(timeUntilEnd);
    } 
    // Check if bidding has ended
    else if (now > end) {
      setBiddingNotStarted(false);
      setBiddingActive(false);
      setTimeLeft(0);
    }
  };

  // ⏱️ Timer Logic - Update every second
  useEffect(() => {
    if (authStatus !== 'VERIFIED' || isWinnerDeclared) return;

    const timer = setInterval(() => {
      if (startTime && endTime) {
        calculateTimeLeft(startTime, endTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [authStatus, isWinnerDeclared, startTime, endTime]);

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
    if (playAmount > 0 && currentRemaining <= playAmount && bids.length > 0 && !isWinnerDeclared && biddingActive) {
      // Play amount reached, declare winner
      declareWinner();
    }
  }, [currentRemaining, playAmount, bids.length, isWinnerDeclared, biddingActive]);

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
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const isTimeUp = timeLeft <= 0 && !biddingNotStarted;

  // Format date for display
  const formatDateTime = (date) => {
    if (!date) return '';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
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
        { params: { populate: "*" } }
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
        (p) => p.phonenumber === mobileNumber
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
        setRejectionMessage("Your account is pending verification. Please contact the administrator.");
        setAuthStatus("REJECTED");
      }

    } catch (error) {
      console.error("Verification error:", error);
      setRejectionMessage("Unable to verify at this moment. Please try again later.");
      setAuthStatus("REJECTED");
    }
  };

  // 🔹 Place Bid
  const placeBid = (percentage) => {
    if (!biddingActive || currentRemaining <= 0 || isTimeUp || isWinnerDeclared) return;

    const bidAmount = (totalAmount * percentage) / 100;
    const newRemaining = currentRemaining - bidAmount;

    if (newRemaining < 0) {
      alert("Remaining amount too low for this bid.");
      return;
    }

    // Check if bid would go below playAmount
    if (newRemaining < playAmount) {
      alert(`Cannot bid below the play amount of ₹${playAmount.toLocaleString()}`);
      return;
    }

    const newBid = {
      id: Date.now(),
      bidderName: userData?.name || `User ${mobileNumber.slice(-4)}`,
      bidAmount,
      remainingAmount: newRemaining,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setBids((prev) => [newBid, ...prev]);
    setCurrentRemaining(newRemaining);
  };

  // 🔹 Declare Winner
  const declareWinner = () => {
    if (bids.length === 0) return;
    
    // Find the highest bidder (first bid since we're adding new bids to the top)
    const winningBid = bids[0];
    setWinner(winningBid);
    setIsWinnerDeclared(true);
    setBiddingActive(false);
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
          <h2 className="text-xl font-black text-slate-800">Loading Bidding Session...</h2>
        </motion.div>
      </div>
    );
  }

  // 🚨 INVALID LINK VIEW
  if (!isValidRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl text-center max-w-md w-full border border-slate-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-500" size={36} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">Invalid Session Link</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            The bidding session link you followed is missing required parameters or has expired.
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

  // ================= LOGIN SCREEN =================
  if (authStatus !== 'VERIFIED') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-64 md:w-96 h-64 md:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center border border-white/50 relative z-10"
        >
          <AnimatePresence mode="wait">
            {authStatus === 'LOGIN' && (
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
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 tracking-tight">Secure Access</h2>
                <p className="text-slate-500 mb-8 text-sm">Verify your identity to enter the bidding room.</p>
                <div className="relative mb-6">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="tel" 
                    required 
                    maxLength={10} 
                    placeholder="10-digit Mobile Number"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none rounded-2xl py-4 pl-12 pr-4 font-bold text-slate-800 placeholder:font-normal"
                    value={mobileNumber} 
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
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

            {authStatus === 'PENDING' && (
              <motion.div 
                key="pending" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="py-12"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  <ShieldCheck className="absolute inset-0 m-auto text-indigo-600" size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Authenticating</h2>
                <p className="text-slate-500 text-sm">Verifying your credentials...</p>
              </motion.div>
            )}

            {authStatus === 'REJECTED' && (
              <motion.div 
                key="rejected" 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="py-8"
              >
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="text-red-500" size={36} />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3">Access Denied</h2>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  {rejectionMessage}
                </p>
                <button
                  onClick={() => setAuthStatus('LOGIN')}
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

  // ================= MAIN BIDDING SCREEN =================
  const progressPercentage = totalAmount > 0 ? (currentRemaining / totalAmount) * 100 : 0;

  // Get status text and color
  const getStatusInfo = () => {
    if (isWinnerDeclared) return { text: 'COMPLETED', color: 'bg-purple-100 text-purple-700' };
    if (biddingNotStarted) return { text: 'NOT STARTED', color: 'bg-yellow-100 text-yellow-700' };
    if (biddingActive) return { text: 'LIVE', color: 'bg-emerald-100 text-emerald-700' };
    if (!biddingActive && timeLeft === 0) return { text: 'ENDED', color: 'bg-slate-100 text-slate-600' };
    return { text: 'INACTIVE', color: 'bg-slate-100 text-slate-600' };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8 font-sans pb-24 lg:pb-10">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gavel className="text-indigo-600" size={22} /> {biddingData?.nameOfBid || 'Live Bidding Room'}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium mt-1 flex items-center gap-2 flex-wrap">
            <span className={`${statusInfo.color} px-2 py-0.5 rounded-md text-[10px] md:text-xs font-bold`}>
              {statusInfo.text}
            </span>
            Session: {documentId?.slice(0, 8)}... • Admin: {adminId?.slice(0, 8)}...
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
              <h3 className="font-bold text-slate-700">Select Month</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(month)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    selectedMonth === month
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
            
            {/* Round selector within selected month */}
            {selectedMonth && roundsByMonth[selectedMonth] && roundsByMonth[selectedMonth].length > 1 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-medium text-slate-500 mb-2">Rounds in {selectedMonth}:</h4>
                <div className="flex flex-wrap gap-2">
                  {roundsByMonth[selectedMonth].map((round, index) => (
                    <button
                      key={round.id || index}
                      onClick={() => loadRoundData(round)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedRound?.id === round.id
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-transparent'
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
        
        {/* TOP ROW: Stats & Timer (Left) + Quick Bid Options (Right) */}
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
                  Current Round: {roundName || 'No round selected'}
                </p>
              </div>
              
              {/* Timer Block */}
              <div className={`flex flex-col items-end ${biddingNotStarted ? 'text-yellow-400' : timeLeft < 60 ? 'text-red-400' : 'text-slate-200'}`}>
                <p className="text-xs md:text-sm font-medium mb-1.5 flex items-center gap-1.5 opacity-80">
                  <Timer size={14} /> 
                  {biddingNotStarted ? 'Starts in' : 'Time Remaining'}
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

            {/* Progress Bar */}
            <div className="mt-auto">
              <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden relative z-10">
                <motion.div 
                  className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full"
                  initial={{ width: '100%' }} 
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
              <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">
                <span>₹0</span>
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
                  const wouldGoBelowTarget = (currentRemaining - calculatedAmount) < playAmount;
                  const isDisabled = !biddingActive || isWinnerDeclared || !canAfford || isTimeUp || wouldGoBelowTarget || biddingNotStarted || !selectedRound;

                  return (
                    <button
                      key={percent} 
                      onClick={() => placeBid(percent)} 
                      disabled={isDisabled}
                      className={`relative p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-200 active:scale-95 group overflow-hidden
                        ${!isDisabled
                          ? 'border-slate-100 hover:border-indigo-600 bg-slate-50 hover:bg-white hover:shadow-md cursor-pointer' 
                          : 'border-slate-50 bg-slate-50 opacity-40 cursor-not-allowed'
                        }`}
                    >
                      <span className="text-lg md:text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors relative z-10">
                        ₹{calculatedAmount.toLocaleString()}
                      </span>
                      <ArrowRight className="text-slate-300 group-hover:text-indigo-600 transition-colors hidden sm:block relative z-10" size={18} />
                    </button>
                  );
                })}
              </div>
              {playAmount > 0 && (
                <p className="text-xs text-slate-500 text-center border-t border-slate-100 pt-4">
                  Target Amount: <span className="font-bold text-indigo-600">₹{playAmount.toLocaleString()}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Live Ledger */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 h-[350px] lg:h-[400px] flex flex-col w-full">
          <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 border-b border-slate-100 shrink-0">
            <h4 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="text-slate-400" size={18} /> Live Ledger
              {roundName && (
                <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {roundName}
                </span>
              )}
            </h4>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {bids.length} Bids
            </span>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {bids.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Activity size={36} className="mb-4 opacity-20" />
                <p className="font-medium text-sm md:text-base">No activity yet</p>
                <p className="text-xs md:text-sm">Bids will appear here in real-time</p>
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
                      className={`p-4 rounded-2xl border w-full ${index === 0 ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-white border-slate-100'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
                          {index === 0 && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>}
                          {bid.bidderName}
                        </span>
                        <span className="text-[10px] md:text-xs font-bold text-slate-400">{bid.time}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-0.5">Bid Amount</p>
                          <p className="font-black text-indigo-600 text-sm md:text-base">₹{bid.bidAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] md:text-xs text-slate-500 font-medium mb-0.5">Remaining</p>
                          <p className="font-bold text-slate-700 text-sm md:text-base">₹{bid.remainingAmount.toLocaleString()}</p>
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

      {/* Winner Modal Overlay */}
      <AnimatePresence>
        {isWinnerDeclared && winner && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white p-8 md:p-10 rounded-[2rem] text-center max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-50 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Trophy size={40} className="text-yellow-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">Round Complete</h2>
                <p className="text-slate-500 font-medium mb-2 text-sm md:text-base">{roundName}</p>
                <p className="text-slate-500 font-medium mb-6 text-sm md:text-base">Winning Bidder</p>
                
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
                  <p className="text-lg md:text-xl font-black text-slate-900 mb-2">{winner.bidderName}</p>
                  <p className="text-xs md:text-sm text-slate-500 mb-1">Final Bid Amount</p>
                  <p className="text-2xl md:text-3xl font-black text-indigo-600">₹{winner.bidAmount.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => {
                    // Reset for next round or navigate
                    if (selectedRound) {
                      setIsWinnerDeclared(false);
                      setWinner(null);
                      setBids([]);
                      setCurrentRemaining(totalAmount);
                    } else {
                      navigate('/');
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-4 rounded-xl font-bold transition-colors"
                >
                  {selectedRound ? 'Continue to Next Round' : 'Return to Dashboard'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styles */}
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