import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, Clock, DollarSign, TrendingDown, Users, Edit, Trash2, X, 
  Save, Loader, PlusCircle, AlertCircle, RefreshCw, LayoutDashboard,
  Layers, ChevronRight, CheckCircle2, History, Lock
} from 'lucide-react';

const API_URL = 'https://api.regeve.in/api';

// --- Sub-Component: Dynamic Countdown Timer ---
const CountdownTimer = ({ startTime, endTime, roundNumber, roundStatus }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0,
    isActive: false, isEnded: false, notStarted: false
  });

  useEffect(() => {
    if (!startTime) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const roundStart = new Date(startTime).getTime();
      const roundEnd = endTime ? new Date(endTime).getTime() : null;

      if (roundStatus === 'Ended' || (roundEnd && now > roundEnd)) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, isActive: false, isEnded: true, notStarted: false });
        return;
      }

      if (now < roundStart) {
        const timeUntilStart = roundStart - now;
        setTimeRemaining({
          days: Math.floor(timeUntilStart / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timeUntilStart % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeUntilStart % (1000 * 60)) / 1000),
          isActive: false, isEnded: false, notStarted: true
        });
        return;
      }

      // Round is Active
      const endTimeToUse = roundEnd || (roundStart + (7 * 24 * 60 * 60 * 1000)); // Default to 7 days if no endTime
      const distance = endTimeToUse - now;
      
      setTimeRemaining({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        isActive: true, isEnded: false, notStarted: false
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime, roundStatus]);

  const formatNumber = (num) => num < 10 ? `0${num}` : num;

  if (timeRemaining.notStarted) {
    return (
      <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 flex flex-col items-center">
        <div className="flex items-center gap-2 text-amber-600 mb-3 text-xs font-black uppercase tracking-widest">
          <Lock size={16} /> Starts In
        </div>
        <div className="flex gap-4">
          {timeRemaining.days > 0 && (
            <div className="text-center"><div className="text-2xl font-black text-amber-600">{timeRemaining.days}</div><div className="text-[10px] text-amber-500 font-bold uppercase">Days</div></div>
          )}
          <div className="text-center"><div className="text-2xl font-black text-amber-600">{formatNumber(timeRemaining.hours)}</div><div className="text-[10px] text-amber-500 font-bold uppercase">Hrs</div></div>
          <div className="text-center"><div className="text-2xl font-black text-amber-600">{formatNumber(timeRemaining.minutes)}</div><div className="text-[10px] text-amber-500 font-bold uppercase">Min</div></div>
          <div className="text-center"><div className="text-2xl font-black text-amber-600">{formatNumber(timeRemaining.seconds)}</div><div className="text-[10px] text-amber-500 font-bold uppercase">Sec</div></div>
        </div>
      </div>
    );
  }

  if (timeRemaining.isEnded) {
    return (
      <div className="bg-slate-100 rounded-2xl p-4 text-center flex flex-col items-center justify-center h-full border border-slate-200">
        <span className="text-slate-400 font-black uppercase tracking-widest text-sm">Round Ended</span>
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
          <div className="text-center"><div className="text-2xl font-black text-emerald-600">{timeRemaining.days}</div><div className="text-[10px] font-bold uppercase text-emerald-500">Days</div></div>
        )}
        <div className="text-center"><div className="text-2xl font-black text-emerald-600">{formatNumber(timeRemaining.hours)}</div><div className="text-[10px] font-bold uppercase text-emerald-500">Hrs</div></div>
        <div className="text-center"><div className="text-2xl font-black text-emerald-600">{formatNumber(timeRemaining.minutes)}</div><div className="text-[10px] font-bold uppercase text-emerald-500">Min</div></div>
        <div className="text-center"><div className="text-2xl font-black text-emerald-600">{formatNumber(timeRemaining.seconds)}</div><div className="text-[10px] font-bold uppercase text-emerald-500">Sec</div></div>
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
  
  // Edit State
  const [isEditingRound, setIsEditingRound] = useState(false);
  const [editedRound, setEditedRound] = useState(null);
  const [showCreateRoundModal, setShowCreateRoundModal] = useState(false);
  const [newRound, setNewRound] = useState({
    durationType: 'Weekly',
    roundNumber: 1,
    startTime: '',
    endTime: '',
    totalAmount: '',
    Final_Ratio: 40
  });
  
  const [loading, setLoading] = useState(true);
  const [apiActionLoading, setApiActionLoading] = useState(false);

  // Fetch Rounds Data
  const fetchRounds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`${API_URL}/bidding-rounds`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let dataList = response.data?.data || [];
      
      setRounds(dataList);

      // Determine LIVE round
      if (dataList.length > 0) {
        const now = new Date().getTime();
        
        // Find active round
        const activeRound = dataList.find(round => {
          const start = new Date(round.startTime).getTime();
          const end = round.endTime ? new Date(round.endTime).getTime() : start + (7 * 24 * 60 * 60 * 1000);
          return now >= start && now <= end && round.roundStatus !== 'Ended';
        });

        if (activeRound) {
          setActiveRoundLive(activeRound);
          // If no round selected or documentId provided, select active round
          if (!selectedRound && !documentId) {
            setSelectedRound(activeRound);
          }
        }

        // If documentId provided, find that specific round
        if (documentId) {
          const foundRound = dataList.find(r => r.documentId === documentId);
          if (foundRound) {
            setSelectedRound(foundRound);
          } else if (dataList.length > 0) {
            // Sort by startTime descending and take latest
            const sorted = [...dataList].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            setSelectedRound(sorted[0]);
          }
        } else if (dataList.length > 0 && !selectedRound) {
          // Sort by startTime descending and take latest
          const sorted = [...dataList].sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
          setSelectedRound(sorted[0]);
        }
      }

    } catch (err) {
      console.error('Error fetching rounds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchRounds(); 
  }, [documentId]);

  // Handle Edit Mode Toggle
  const handleEditRound = () => { 
    setEditedRound({
      ...selectedRound,
      durationType: selectedRound.Round_Name?.includes('Week') ? 'Weekly' : 'Monthly',
      roundNumber: parseInt(selectedRound.Round_Name?.replace(/\D/g, '')) || 1,
      totalAmount: calculateTotalAmount(selectedRound.playAmount, selectedRound.Final_Ratio)
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
    return totalAmount - (totalAmount * (percent || 0) / 100);
  };

  // Handle Create Round
  const handleCreateRound = async () => {
    if (!newRound.startTime || !newRound.endTime || !newRound.totalAmount || !newRound.Final_Ratio) {
      alert('Please fill all fields');
      return;
    }

    setApiActionLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      
      const roundData = {
        data: {
          durationType: newRound.durationType,
          roundNumber: newRound.roundNumber,
          startTime: new Date(newRound.startTime).toISOString(),
          endTime: new Date(newRound.endTime).toISOString(),
          totalAmount: parseFloat(newRound.totalAmount),
          Final_Ratio: parseFloat(newRound.Final_Ratio)
        }
      };
      
      await axios.post(`${API_URL}/bidding-rounds/create`, roundData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowCreateRoundModal(false);
      setNewRound({
        durationType: 'Weekly',
        roundNumber: rounds.length + 1,
        startTime: '',
        endTime: '',
        totalAmount: '',
        Final_Ratio: 40
      });
      
      fetchRounds(); // Refresh the list
      
    } catch (err) { 
      alert(`Error creating round: ${err.response?.data?.error?.message || err.message}`); 
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
      
      const updatedData = {
        data: {
          durationType: editedRound.durationType,
          roundNumber: editedRound.roundNumber,
          startTime: new Date(editedRound.startTime).toISOString(),
          endTime: new Date(editedRound.endTime).toISOString(),
          totalAmount: parseFloat(editedRound.totalAmount),
          Final_Ratio: parseFloat(editedRound.Final_Ratio),
          roundStatus: editedRound.roundStatus
        }
      };
      
      await axios.put(`${API_URL}/bidding-rounds/${selectedRound.documentId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      const updatedRound = {
        ...selectedRound,
        Round_Name: editedRound.durationType === 'Weekly' 
          ? `Week ${editedRound.roundNumber}`
          : `Month ${editedRound.roundNumber}`,
        playAmount: calculateReducedAmount(editedRound.totalAmount, editedRound.Final_Ratio),
        Final_Ratio: editedRound.Final_Ratio,
        startTime: editedRound.startTime,
        endTime: editedRound.endTime
      };
      
      setSelectedRound(updatedRound);
      setRounds(prev => prev.map(r => r.documentId === updatedRound.documentId ? updatedRound : r));
      
      setIsEditingRound(false);
      
    } catch (err) { 
      alert(`Error updating round: ${err.response?.data?.error?.message || err.message}`); 
    } finally { 
      setApiActionLoading(false); 
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
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
    if (!roundName) return 'Weekly';
    return roundName.includes('Week') ? 'Weekly' : 'Monthly';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
      <Loader className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <p className="text-slate-500 font-bold tracking-tight">Loading Bidding Rounds...</p>
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
            <button 
              onClick={() => setShowCreateRoundModal(true)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
              title="Create New Round"
            >
              <PlusCircle size={18} />
            </button>
          </div>
          
          <nav className="space-y-3">
            {rounds.map(round => {
              const roundNum = getRoundNumber(round.Round_Name);
              const isLive = activeRoundLive?.documentId === round.documentId;
              const isPast = round.roundStatus === 'Ended';
              const isSelected = selectedRound?.documentId === round.documentId;

              return (
                <button
                  key={round.documentId}
                  onClick={() => setSelectedRound(round)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 transform translate-x-2' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 hover:translate-x-1 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isPast ? <CheckCircle2 size={18} className={isSelected ? "text-indigo-200" : "text-emerald-500"} /> 
                            : <History size={18} className={isSelected ? "text-indigo-200" : "text-slate-400"} />}
                    <span>{round.Round_Name || `Round ${roundNum}`}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isLive && (
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600 animate-pulse'}`}>
                        Live
                      </span>
                    )}
                    {isPast && (
                      <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
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
               {selectedRound?.Round_Name || 'Round'} Overview
             </h1>
             <p className="text-sm font-bold text-slate-500 mt-1">
               {selectedRound ? `Viewing details for ${selectedRound.Round_Name}` : 'No round selected'}
             </p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm">
                <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                  <DollarSign size={18}/>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pool Amount</p>
                  <p className="text-lg font-black leading-none">
                    ₹{selectedRound?.playAmount?.toLocaleString() || '0'}
                  </p>
                </div>
             </div>
             <button 
               onClick={fetchRounds} 
               className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-indigo-600 hover:shadow-lg transition-all"
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
                   <LayoutDashboard size={18} className="text-indigo-500" /> Round Configuration
                 </h3>
                 {!isEditingRound && (
                   <button 
                     onClick={handleEditRound} 
                     className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 bg-indigo-50 px-4 py-2 rounded-xl transition-all hover:bg-indigo-100"
                   >
                     <Edit size={14}/> Edit Round
                   </button>
                 )}
              </div>

              <div className="p-8">
                {!isEditingRound ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-fade-in">
                    
                    {/* Col 1: Identity & Amount */}
                    <div className="space-y-6">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Round Name</p>
                        <p className="text-3xl font-black text-slate-800 tracking-tight">{selectedRound.Round_Name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Status</p>
                        <p className={`text-lg font-black leading-none ${
                          selectedRound.roundStatus === 'Ended' ? 'text-slate-500' : 'text-emerald-600'
                        }`}>
                          {selectedRound.roundStatus || 'Started'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Pool Amount</p>
                        <p className="text-4xl font-black text-indigo-600 leading-none">
                          ₹{parseInt(selectedRound.playAmount)?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {/* Col 2: Info Details */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="p-3 bg-white shadow-sm rounded-xl text-slate-500">
                            <Calendar size={20}/>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Start Time</p>
                            <p className="text-sm font-bold text-slate-700">{formatDate(selectedRound.startTime)}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="p-3 bg-white shadow-sm rounded-xl text-slate-500">
                            <Calendar size={20}/>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">End Time</p>
                            <p className="text-sm font-bold text-slate-700">{formatDate(selectedRound.endTime)}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="p-3 bg-white shadow-sm rounded-xl text-slate-500">
                            <TrendingDown size={20}/>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                              Final Ratio ({selectedRound.Final_Ratio}%)
                            </p>
                            <p className="text-lg font-black text-emerald-600 leading-none">
                              ₹{calculateReducedAmount(
                                calculateTotalAmount(selectedRound.playAmount, selectedRound.Final_Ratio), 
                                selectedRound.Final_Ratio
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
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration Type</label>
                          <select 
                            value={editedRound?.durationType || 'Weekly'} 
                            onChange={(e) => setEditedRound({...editedRound, durationType: e.target.value})}
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
                          >
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Round Number</label>
                          <input 
                            type="number" 
                            value={editedRound?.roundNumber || 1} 
                            onChange={(e) => setEditedRound({...editedRound, roundNumber: parseInt(e.target.value)})} 
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Amount (₹)</label>
                          <input 
                            type="number" 
                            value={editedRound?.totalAmount || 0} 
                            onChange={(e) => setEditedRound({...editedRound, totalAmount: parseInt(e.target.value)})} 
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Start Time</label>
                          <input 
                            type="datetime-local" 
                            value={editedRound?.startTime?.slice(0, 16) || ''} 
                            onChange={(e) => setEditedRound({...editedRound, startTime: e.target.value})} 
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">End Time</label>
                          <input 
                            type="datetime-local" 
                            value={editedRound?.endTime?.slice(0, 16) || ''} 
                            onChange={(e) => setEditedRound({...editedRound, endTime: e.target.value})} 
                            className="w-full mt-1 px-4 py-3 border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</label>
                          <select 
                            value={editedRound?.roundStatus || 'Started'} 
                            onChange={(e) => setEditedRound({...editedRound, roundStatus: e.target.value})}
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
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Final Ratio (%)</label>
                        <div className="flex items-center gap-3 mt-1">
                          <input 
                            type="number" 
                            value={editedRound?.Final_Ratio || 0} 
                            onChange={(e) => setEditedRound({...editedRound, Final_Ratio: parseInt(e.target.value)})} 
                            className="w-32 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700" 
                            min="0" 
                            max="100" 
                          />
                          <TrendingDown className="text-slate-400" size={20}/>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Payout</span>
                        <p className="text-3xl font-black text-emerald-600">
                          ₹{calculateReducedAmount(
                            editedRound?.totalAmount || 0, 
                            editedRound?.Final_Ratio || 0
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                      <button 
                        onClick={handleCancelEdit} 
                        className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveRound} 
                        disabled={apiActionLoading} 
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        {apiActionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Save size={18} />}
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
              <h2 className="text-xl font-black text-slate-700">No Rounds Found</h2>
              <p className="text-slate-500 mt-2 font-bold">Create your first bidding round</p>
              <button
                onClick={() => setShowCreateRoundModal(true)}
                className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Create Round
              </button>
            </div>
          )}

          {/* Bidding History (placeholder) */}
          {selectedRound && (
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <History className="text-indigo-500" size={20}/>
                  <h3 className="text-lg font-black text-slate-800">Bidding History</h3>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Bidder</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Amount</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Time</th>
                      <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedRound.Bidding_History && selectedRound.Bidding_History.length > 0 ? (
                      selectedRound.Bidding_History.map((bid, index) => (
                        <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-8 py-5 text-sm font-black text-slate-800">{bid.bidder}</td>
                          <td className="px-8 py-5 text-sm font-bold text-indigo-600">₹{parseInt(bid.amount)?.toLocaleString()}</td>
                          <td className="px-8 py-5 text-sm font-bold text-slate-600">{new Date(bid.time).toLocaleString()}</td>
                          <td className="px-8 py-5">
                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                              bid.status === 'won' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {bid.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-16 text-center text-slate-400 font-bold">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3 text-slate-300">
                              <History size={20}/>
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
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-black text-slate-800">Create New Round</h2>
              <button 
                onClick={() => setShowCreateRoundModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Duration Type
                  </label>
                  <select 
                    value={newRound.durationType} 
                    onChange={(e) => setNewRound({...newRound, durationType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Round Number
                  </label>
                  <input 
                    type="number" 
                    value={newRound.roundNumber} 
                    onChange={(e) => setNewRound({...newRound, roundNumber: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700"
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Start Time
                  </label>
                  <input 
                    type="datetime-local" 
                    value={newRound.startTime} 
                    onChange={(e) => setNewRound({...newRound, startTime: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    End Time
                  </label>
                  <input 
                    type="datetime-local" 
                    value={newRound.endTime} 
                    onChange={(e) => setNewRound({...newRound, endTime: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Total Amount (₹)
                  </label>
                  <input 
                    type="number" 
                    value={newRound.totalAmount} 
                    onChange={(e) => setNewRound({...newRound, totalAmount: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Final Ratio (%)
                  </label>
                  <input 
                    type="number" 
                    value={newRound.Final_Ratio} 
                    onChange={(e) => setNewRound({...newRound, Final_Ratio: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-700"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="p-6 bg-indigo-50 rounded-2xl">
                <p className="text-sm font-bold text-indigo-700 mb-2">Preview</p>
                <p className="text-2xl font-black text-indigo-600">
                  {newRound.durationType === 'Weekly' ? 'Week' : 'Month'} {newRound.roundNumber}
                </p>
                <p className="text-sm font-bold text-indigo-500 mt-2">
                  Final Payout: ₹{calculateReducedAmount(
                    parseFloat(newRound.totalAmount) || 0, 
                    parseFloat(newRound.Final_Ratio) || 0
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button 
                onClick={() => setShowCreateRoundModal(false)}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateRound} 
                disabled={apiActionLoading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {apiActionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <PlusCircle size={18} />}
                Create Round
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Processing State */}
      {apiActionLoading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[200]">
           <div className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex items-center gap-5 border border-slate-100">
             <div className="relative">
                <div className="w-10 h-10 border-4 border-indigo-50 rounded-full"></div>
                <div className="w-10 h-10 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
             </div>
             <span className="font-black text-slate-800 text-lg uppercase tracking-tight">Processing...</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminBiddingDashboard;