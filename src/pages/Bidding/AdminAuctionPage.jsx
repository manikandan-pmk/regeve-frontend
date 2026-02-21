import React, { useState, useEffect } from 'react';
import { 
  History, Users, DollarSign, TrendingUp, User, Award, Clock, 
  Calendar, ChevronRight, BarChart3, Target, IndianRupee,
  Layers, FileText, Download, RefreshCw, Filter
} from 'lucide-react';

const AdminAuctionPage = () => {
  // ---------- mock data / state ----------
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Elena Rossi', bids: [850, 920, 1100], currentTotal: 2870 },
    { id: 2, name: 'Marco Villa', bids: [1300, 1450], currentTotal: 2750 },
    { id: 3, name: 'Sofia Chen', bids: [2100, 500], currentTotal: 2600 },
    { id: 4, name: 'James Kim', bids: [950, 800, 1200], currentTotal: 2950 },
    { id: 5, name: 'Lea Müller', bids: [3000], currentTotal: 3000 },
  ]);

  // Time period state for history sidebar
  const [selectedPeriod, setSelectedPeriod] = useState('week1'); // 'week1', 'week2', 'month1', 'month2'
  
  // History data organized by periods
  const [historyByPeriod, setHistoryByPeriod] = useState({
    week1: [
      { id: 'w1-1', text: 'Elena raised to ₹1,100', time: '14:23:12', date: '2024-03-20' },
      { id: 'w1-2', text: 'Marco bid ₹1,450', time: '14:22:45', date: '2024-03-20' },
      { id: 'w1-3', text: 'James placed ₹1,200', time: '14:21:30', date: '2024-03-19' },
      { id: 'w1-4', text: 'Sofia entered ₹2,100', time: '14:20:05', date: '2024-03-19' },
      { id: 'w1-5', text: 'Lea starts with ₹3,000', time: '14:19:20', date: '2024-03-18' },
    ],
    week2: [
      { id: 'w2-1', text: 'James increased to ₹2,500', time: '15:30:22', date: '2024-03-27' },
      { id: 'w2-2', text: 'Sofia bid ₹2,800', time: '15:15:10', date: '2024-03-26' },
      { id: 'w2-3', text: 'Marco raised to ₹3,200', time: '14:45:33', date: '2024-03-26' },
    ],
    month1: [
      { id: 'm1-1', text: 'Elena final bid ₹4,500', time: '11:20:15', date: '2024-04-05' },
      { id: 'm1-2', text: 'Marco won lot #42 at ₹5,200', time: '10:45:30', date: '2024-04-04' },
      { id: 'm1-3', text: 'Sofia placed winning bid ₹3,800', time: '16:20:45', date: '2024-04-03' },
      { id: 'm1-4', text: 'James outbid at ₹6,000', time: '15:10:20', date: '2024-04-02' },
    ],
    month2: [
      { id: 'm2-1', text: 'New participant: Alex Kumar', time: '09:30:00', date: '2024-05-01' },
      { id: 'm2-2', text: 'Record bid: ₹10,000 by Lea', time: '14:25:10', date: '2024-04-30' },
    ]
  });

  // Final ratio percentages (entered manually in real scenario)
  const [finalRatios, setFinalRatios] = useState({
    1: 40, // Elena - 40%
    2: 35, // Marco - 35%
    3: 30, // Sofia - 30%
    4: 45, // James - 45%
    5: 50, // Lea - 50%
  });

  // Calculate final amounts based on ratios
  const calculateFinalAmount = (total, ratio) => {
    return (total * ratio) / 100;
  };

  // Enhanced participants data with final calculations
  const enhancedParticipants = participants.map(p => ({
    ...p,
    ratio: finalRatios[p.id] || 0,
    finalAmount: calculateFinalAmount(p.currentTotal, finalRatios[p.id] || 0)
  }));

  // Total auction value
  const totalAuctionValue = enhancedParticipants.reduce((sum, p) => sum + p.finalAmount, 0);

  // Helper to add a new random bid (simulate live)
  const addRandomBid = () => {
    const randomIndex = Math.floor(Math.random() * participants.length);
    const p = participants[randomIndex];
    const increment = Math.floor(Math.random() * 400) + 100; // 100–500
    const newBid = p.currentTotal + increment;

    // Update participant
    const updatedParticipants = participants.map((item, idx) =>
      idx === randomIndex
        ? { ...item, bids: [...item.bids, newBid], currentTotal: newBid }
        : item
    );
    setParticipants(updatedParticipants);

    // Add history entry to current period
    const newEntry = {
      id: `${selectedPeriod}-${Date.now()}`,
      text: `${p.name} raised to ₹${newBid.toLocaleString()}`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
    };
    
    setHistoryByPeriod(prev => ({
      ...prev,
      [selectedPeriod]: [newEntry, ...prev[selectedPeriod].slice(0, 9)]
    }));
  };

  // Update ratio for a participant
  const updateRatio = (participantId, newRatio) => {
    setFinalRatios(prev => ({
      ...prev,
      [participantId]: Math.min(100, Math.max(0, parseInt(newRatio) || 0))
    }));
  };

  // Auto-sim every 7 seconds
  useEffect(() => {
    const timer = setInterval(addRandomBid, 7000);
    return () => clearInterval(timer);
  }, [participants, selectedPeriod]);

  // Period options for sidebar
  const periodOptions = [
    { id: 'week1', label: 'Week 1', icon: Calendar, date: 'Mar 18-24' },
    { id: 'week2', label: 'Week 2', icon: Calendar, date: 'Mar 25-31' },
    { id: 'month1', label: 'Month 1', icon: Layers, date: 'April 2024' },
    { id: 'month2', label: 'Month 2', icon: Layers, date: 'May 2024' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 p-6">
      {/* Header with stats */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Auction Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Manage participants and track final allocations</p>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Participants</p>
                <p className="text-lg font-bold text-slate-800">{participants.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Auction Value</p>
                <p className="text-lg font-bold text-indigo-600 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {totalAuctionValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========== LEFT SIDEBAR – ENHANCED HISTORY WITH PERIODS ========== */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col h-fit lg:sticky lg:top-6">
          {/* Period tabs */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-5 h-5 text-indigo-500" />
              <h2 className="font-semibold text-slate-800">Auction History</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {periodOptions.map((period) => {
                const Icon = period.icon;
                return (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`flex flex-col items-start p-2 rounded-xl transition-all ${
                      selectedPeriod === period.id
                        ? 'bg-indigo-50 border-2 border-indigo-200'
                        : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 w-full">
                      <Icon className={`w-3.5 h-3.5 ${
                        selectedPeriod === period.id ? 'text-indigo-600' : 'text-slate-500'
                      }`} />
                      <span className={`text-xs font-medium ${
                        selectedPeriod === period.id ? 'text-indigo-700' : 'text-slate-600'
                      }`}>{period.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5">{period.date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* History entries for selected period */}
          <div className="flex-1 p-4 pt-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">
                {historyByPeriod[selectedPeriod]?.length || 0} entries
              </span>
              <button className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Download className="w-3 h-3" /> Export
              </button>
            </div>

            <ul className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
              {historyByPeriod[selectedPeriod]?.map((entry) => (
                <li key={entry.id} className="group relative flex items-start gap-2 text-sm p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-200 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 truncate">{entry.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400">{entry.date}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">{entry.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>

            <button 
              onClick={addRandomBid}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow"
            >
              <RefreshCw className="w-4 h-4" /> Simulate New Bid
            </button>
          </div>
        </div>

        {/* ========== RIGHT SIDE (9 cols) ========== */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Live totals card */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h2 className="font-semibold text-slate-800">Live Bidding Totals</h2>
                <span className="ml-auto flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>
            </div>

            {/* Participants grid */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {enhancedParticipants.map((p) => {
                  const maxTotal = Math.max(...participants.map(x => x.currentTotal));
                  const progressPercent = (p.currentTotal / maxTotal) * 100;
                  
                  return (
                    <div key={p.id} className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow border border-slate-100">
                      {/* Participant header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-700" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">ID: {p.id}</p>
                        </div>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          {p.bids.length} bids
                        </span>
                      </div>

                      {/* Bid amount and progress */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-500">Current Bid</span>
                          <span className="font-mono font-bold text-slate-800 flex items-center">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {p.currentTotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Ratio and final amount */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200">
                        <div>
                          <label className="text-xs text-slate-500 block mb-1">Final Ratio (%)</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={p.ratio}
                              onChange={(e) => updateRatio(p.id, e.target.value)}
                              className="w-16 px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              min="0"
                              max="100"
                            />
                            <span className="text-xs text-slate-400">%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-1">Final Amount</p>
                          <p className="font-mono font-bold text-indigo-600 flex items-center justify-end">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {p.finalAmount.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            of ₹{p.currentTotal.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary card with final allocations */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-lg text-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold">Final Allocation Summary</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Total bids */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-indigo-200 text-xs mb-1">Total Bids Placed</p>
                <p className="text-2xl font-bold">
                  {participants.reduce((sum, p) => sum + p.bids.length, 0)}
                </p>
              </div>

              {/* Average ratio */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-indigo-200 text-xs mb-1">Average Ratio</p>
                <p className="text-2xl font-bold">
                  {Math.round(Object.values(finalRatios).reduce((a, b) => a + b, 0) / participants.length)}%
                </p>
              </div>

              {/* Highest final amount */}
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-indigo-200 text-xs mb-1">Highest Final Amount</p>
                <p className="text-2xl font-bold flex items-center">
                  <IndianRupee className="w-5 h-5" />
                  {Math.max(...enhancedParticipants.map(p => p.finalAmount)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Detailed allocation list */}
            <div className="mt-4 bg-white/5 rounded-xl p-4">
              <p className="text-xs text-indigo-200 mb-2">Final Payouts</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {enhancedParticipants.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="font-mono flex items-center">
                      <IndianRupee className="w-3 h-3" />
                      {p.finalAmount.toLocaleString()}
                      <span className="text-indigo-300 text-xs ml-1">
                        ({p.ratio}%)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 px-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Final ratio determines payout
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" />
              Auto-refresh every 7s
            </span>
            <span className="flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              Click ratio to adjust percentage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuctionPage;