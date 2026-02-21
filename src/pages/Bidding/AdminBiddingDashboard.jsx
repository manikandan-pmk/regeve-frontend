import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:1337/api";

export default function AdminBiddingDashboard() {
  const { adminId, biddingId } = useParams();
  const navigate = useNavigate();

  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingRatio, setSavingRatio] = useState(null);

  // 🔹 Fetch all rounds (week-wise)
  const fetchRounds = async () => {
    setLoading(true);
    const res = await fetch(
      `${API}/bidding-rounds/by-bidding/${biddingId}`
    );
    const json = await res.json();
    setRounds(json.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRounds();
  }, [biddingId]);

  // 🔹 Start round
  const startRound = async (roundId) => {
    await fetch(`${API}/bidding-rounds/${roundId}/start`, {
      method: "POST",
    });
    fetchRounds();
  };

  // 🔹 End round
  const endRound = async (roundId) => {
    await fetch(`${API}/bidding-rounds/${roundId}/end`, {
      method: "POST",
    });
    fetchRounds();
  };

  // 🔹 Update admin ratio
  const updateRatio = async (roundId, value) => {
    setSavingRatio(roundId);
    await fetch(`${API}/bidding-rounds/${roundId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: { Final_Ratio: Number(value) },
      }),
    });
    setSavingRatio(null);
    fetchRounds();
  };

  if (loading) {
    return <div className="p-10">Loading rounds…</div>;
  }

  return (
    <div className="p-10 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 font-semibold"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold">
        Admin Bidding Dashboard
      </h1>

      {rounds.length === 0 && (
        <p className="text-gray-500">No rounds found</p>
      )}

      <div className="space-y-6">
        {rounds.map((round) => {
          const total = Number(round.currentBidAmount || 0);
          const ratio = Number(round.Final_Ratio || 40);
          const adminAmount = Math.floor((total * ratio) / 100);
          const userAmount = total - adminAmount;

          return (
            <div
              key={round.documentId}
              className={`border rounded-2xl p-6 bg-white shadow
                ${round.isLocked ? "opacity-50" : ""}`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Week {round.Round_Number}
                </h2>

                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100">
                  {round.roundStatus}
                </span>
              </div>

              {/* TIMES */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <b>Start:</b>{" "}
                  {round.startTime
                    ? new Date(round.startTime).toLocaleString()
                    : "—"}
                </div>
                <div>
                  <b>End:</b>{" "}
                  {round.endTime
                    ? new Date(round.endTime).toLocaleString()
                    : "—"}
                </div>
              </div>

              {/* AMOUNTS */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded bg-slate-50">
                  <div className="text-sm">Total Amount</div>
                  <div className="text-xl font-bold">
                    ₹{total}
                  </div>
                </div>

                <div className="p-4 rounded bg-slate-50">
                  <div className="text-sm mb-1">
                    Admin Ratio (%)
                  </div>
                  <input
                    type="number"
                    disabled={round.roundStatus === "COMPLETED"}
                    defaultValue={ratio}
                    onBlur={(e) =>
                      updateRatio(
                        round.documentId,
                        e.target.value
                      )
                    }
                    className="border rounded px-3 py-1 w-full"
                  />
                  <div className="text-xs mt-1">
                    Admin: ₹{adminAmount}
                  </div>
                </div>

                <div className="p-4 rounded bg-slate-50">
                  <div className="text-sm">User Pool</div>
                  <div className="text-xl font-bold">
                    ₹{userAmount}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  disabled={
                    round.roundStatus !== "PENDING" ||
                    round.isLocked
                  }
                  onClick={() =>
                    startRound(round.documentId)
                  }
                  className="px-6 py-2 rounded-xl bg-green-600 text-white disabled:opacity-40"
                >
                  Start Bidding
                </button>

                <button
                  disabled={round.roundStatus !== "OPEN"}
                  onClick={() =>
                    endRound(round.documentId)
                  }
                  className="px-6 py-2 rounded-xl bg-red-600 text-white disabled:opacity-40"
                >
                  End Bidding
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/${adminId}/admin-bidding-dashboard/${biddingId}/round/${round.documentId}`
                    )
                  }
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white"
                >
                  View Details
                </button>
              </div>

              {/* WINNER */}
              {round.roundStatus === "COMPLETED" && (
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <div>
                    <b>Winner:</b>{" "}
                    {round.winner
                      ? round.winner.documentId
                      : "—"}
                  </div>
                  <div>
                    <b>Payout:</b> ₹{round.winnerPayout}
                  </div>
                </div>
              )}

              {savingRatio === round.documentId && (
                <p className="text-sm mt-2 text-indigo-600">
                  Saving ratio…
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}