import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyParticipant() {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [schemeName, setSchemeName] = useState(""); // 🔹 State for dynamic heading

  // 🔹 Fetch Round/Scheme info for the heading
  useEffect(() => {
    const fetchHeadingInfo = async () => {
      try {
        const res = await fetch(`http://localhost:1337/api/bidding-rounds/${roundId}?populate=*`);
        const result = await res.json();
        if (result.data?.bidding?.nameOfBid) {
          setSchemeName(result.data.bidding.nameOfBid);
        }
      } catch (err) {
        console.error("Error fetching heading info", err);
      }
    };
    if (roundId) fetchHeadingInfo();
  }, [roundId]);

  const verify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:1337/api/bidding-rounds/${roundId}?populate=*`
      );
      const round = (await res.json()).data;

      if (!round) throw new Error("Bidding round not found");

      const verifyRes = await fetch(
        `http://localhost:1337/api/biddingparticipantforms/by-phone?phone=${phone}&biddingId=${round.bidding.documentId}`
      );

      if (!verifyRes.ok) {
        setError("You are not registered for this bidding.");
        return;
      }

      const participant = (await verifyRes.json()).data;

      localStorage.setItem(
        "participant",
        JSON.stringify({
          documentId: participant.documentId,
          name: participant.name,
          roundId: round.documentId,
        })
      );

      navigate(`/bidding/round/${roundId}`);
    } catch (err) {
      setError("An error occurred during verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
          
          {/* 🔹 ENHANCED DYNAMIC HEADER */}
          <div className="bg-slate-900 px-8 py-12 text-center relative">
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl mb-4 border border-white/10 backdrop-blur-sm">
                <span className="text-2xl">🔐</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                {schemeName || "Participant Entry"}
              </h2>
              
              <div className="flex items-center justify-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 <p className="text-indigo-200 text-[10px] font-extrabold uppercase tracking-widest">
                   {schemeName ? "Secure Verification" : "Identity Verification"}
                 </p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Registered Phone Number
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-bold">
                  +91
                </span>
                <input
                  type="tel"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-r-xl text-lg font-bold text-slate-900 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="00000 00000"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length <= 10) setPhone(value);
                  }}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-shake">
                <span className="text-lg">⚠️</span>
                <p className="text-red-600 text-sm font-bold">{error}</p>
              </div>
            )}

            <button
              onClick={verify}
              disabled={phone.length !== 10 || loading}
              className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                phone.length !== 10 || loading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-slate-900 hover:bg-indigo-600 shadow-indigo-100"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                "Verify & Enter Room"
              )}
            </button>

            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-tight">
              Only registered participants can enter the bidding room.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}