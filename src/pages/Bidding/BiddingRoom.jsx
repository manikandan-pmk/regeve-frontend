import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { Gavel, Clock, Trophy, History, ArrowUpCircle } from "lucide-react";

const API_BASE = "http://localhost:1337/api/bidding-rounds";

export default function BiddingRoom() {
  const { roundId } = useParams(); // The Document ID of the specific Bidding Round
  const [round, setRound] = useState(null);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ m: 0, s: 0, over: false });
  const [bidInput, setBidInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const pollRef = useRef(null);
  const lastPrice = useRef(0);
  const participant = JSON.parse(localStorage.getItem("participant"));

  // 🚨 Force verify if:
  // 1. No participant
  // 2. Participant belongs to another bidding
  if (!participant || participant.roundId !== roundId) {
    return <Navigate to={`/bidding/round/${roundId}/verify`} />;
  }
  // 🔹 1. Fetch Round Status (Strapi 5 Document Service)
  const syncAuction = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/${roundId}`);
      const data = res.data.data;

      if (data.currentBidAmount > lastPrice.current) {
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 1000);
      }
      lastPrice.current = data.currentBidAmount;
      setRound(data);
      setLoading(false);
    } catch (err) {
      console.error("Auction Sync Error:", err);
    }
  }, [roundId]);

  useEffect(() => {
    syncAuction();
    pollRef.current = setInterval(syncAuction, 3000); // Poll every 3 seconds
    return () => clearInterval(pollRef.current);
  }, [syncAuction]);

  // 🔹 2. Countdown Logic
  useEffect(() => {
    if (!round?.endTime || round.roundStatus === "COMPLETED") return;

    const timer = setInterval(() => {
      const diff = new Date(round.endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ m: 0, s: 0, over: true });
        clearInterval(timer);
        syncAuction(); // Final sync to confirm winner
      } else {
        setTimeLeft({
          m: Math.floor(diff / 60000),
          s: Math.floor((diff % 60000) / 1000),
          over: false,
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [round?.endTime, round?.roundStatus, syncAuction]);

  // 🔹 3. Submit Bid Logic
  const handlePlaceBid = async (e) => {
    e.preventDefault();
    const bidValue = Number(bidInput);

    if (bidValue <= round.currentBidAmount) {
      alert(
        `Minimum bid required: ₹${(Number(round.currentBidAmount) + 1).toLocaleString()}`,
      );
      return;
    }

    try {
      await axios.post(`${API_BASE}/${roundId}/bid`, {
        data: {
          bidderId: participant.documentId,
          bidderName: participant.name,
          bidAmount: bidValue,
        },
      });
      setBidInput("");
      syncAuction();
    } catch (err) {
      alert(
        err.response?.data?.error?.message ||
          "Bid was rejected. Try a higher amount.",
      );
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse">
        Connecting to Bidding Room...
      </div>
    );

  const isClosed = timeLeft.over || round.roundStatus === "COMPLETED";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Top Status */}
        <div
          className={`p-4 text-center text-xs font-black uppercase tracking-widest ${isClosed ? "bg-slate-200 text-slate-500" : "bg-indigo-600 text-white"}`}
        >
          {isClosed ? "Bidding Closed" : "Live Bidding Active"}
        </div>

        <div className="p-8">
          {/* Timer Display */}
          <div className="flex justify-between items-center mb-8">
            <div className="bg-slate-100 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Clock
                size={16}
                className={
                  timeLeft.m === 0 && !isClosed
                    ? "text-red-500 animate-spin"
                    : "text-slate-400"
                }
              />
              <span className="font-mono font-bold text-lg">
                {isClosed
                  ? "00:00"
                  : `${timeLeft.m}:${timeLeft.s < 10 ? "0" : ""}${timeLeft.s}`}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Round ID
              </p>
              <p className="text-xs font-bold text-slate-800">
                {round.documentId.slice(-6)}
              </p>
            </div>
          </div>

          {/* Current Price */}
          <div className="text-center py-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Highest Bid
            </p>
            <div
              className={`text-6xl font-black transition-all duration-500 ${isUpdating ? "scale-110 text-emerald-500" : "text-slate-900"}`}
            >
              ₹{round.currentBidAmount.toLocaleString()}
            </div>
          </div>

          {/* Action Area */}
          <div className="mt-8">
            {!isClosed ? (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    value={bidInput}
                    onChange={(e) => setBidInput(e.target.value)}
                    placeholder={`Min ₹${Number(round.currentBidAmount) + 1}`}
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-8 rounded-2xl text-xl font-bold outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <button className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                  <ArrowUpCircle size={20} /> Place Your Bid
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center">
                <Trophy className="mx-auto text-emerald-500 mb-2" size={32} />
                <p className="text-emerald-900 font-bold text-lg">
                  Winner Decided
                </p>
                <p className="text-emerald-600 font-medium">
                  Winner: {round.winner?.name || "No Bids Placed"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <History size={14} /> Recent Bids
          </h3>
          <div className="space-y-3">
            {round.bidHistory?.slice(0, 3).map((bid, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-slate-600 font-medium">
                  {bid.bidderName}
                </span>
                <span className="font-bold text-slate-900">
                  ₹{bid.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
