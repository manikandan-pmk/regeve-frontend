import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  CheckCircle2,
  Loader2,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "https://api.regeve.in/api";

const PaymentPopup = ({
  isOpen,
  onClose,
  round,
  biddingConfig,
  biddingDocumentId,
  onPaymentSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const fileInputRef = useRef(null);

  const [adminUpiId, setAdminUpiId] = useState(null);
  const [adminQrUrl, setAdminQrUrl] = useState(null);

  // ─── STATIC CONFIG ────────────────────────────────────────────────────────
  const totalAmount = parseFloat(biddingConfig?.amount) || 0;
  const administrativeFee = (totalAmount * 0.04).toFixed(2);
  const totalRounds = biddingConfig?.durationValue || 1;
  const durationUnit = biddingConfig?.durationUnit || "Monthly";
  const cycleLabel =
    durationUnit === "Weekly" ? "Week"
    : durationUnit === "Daily" ? "Day"
    : "Month";

  // ─── NORMALIZE PAYMENT RECORDS ────────────────────────────────────────────
  // API returns: bidding_admin_payments (plural array) — always normalize to array
  const allPaymentRecords = (() => {
    const p = biddingConfig?.bidding_admin_payments
      ?? biddingConfig?.bidding_admin_payment; // fallback for old key
    if (!p) return [];
    return Array.isArray(p) ? p : [p];
  })();

  // ─── SOURCE OF TRUTH: verified unique round numbers ───────────────────────
  //
  // From the API response, multiple records can exist for the same Round_Name.
  // We treat a round as "paid & verified" only if AT LEAST ONE record for that
  // round has Is_Payment_Verified === true.
  //
  // verifiedRoundNums = Set of round numbers that are fully verified
  // e.g. Week 1 has one verified record → verifiedRoundNums = {1}
  //
  // verifiedCount = how many unique rounds are verified
  // currentRoundNumber = verifiedCount + 1  (next round to pay)
  //
  // Also check for the current round: if any record (verified or not) exists
  // for currentRoundNumber, the admin already submitted for that round.

  const verifiedRoundNums = new Set(
    allPaymentRecords
      .filter((r) => r.Is_Payment_Verified === true)
      .map((r) => {
        const match = r.Round_Name?.match(/\d+/);
        return match ? parseInt(match[0]) : null;
      })
      .filter(Boolean)
  );

  const verifiedCount = verifiedRoundNums.size;
  const currentRoundNumber = verifiedCount + 1;
  const isAllPaymentsDone = currentRoundNumber > totalRounds;
  const roundName = `${cycleLabel} ${currentRoundNumber}`;

  // ─── ALREADY SUBMITTED FOR CURRENT ROUND? ────────────────────────────────
  // Check if ANY payment record exists for currentRoundNumber (verified or not).
  // If yes → already submitted → show status, hide form.
  const currentRoundRecord = allPaymentRecords.find((r) => {
    const match = r.Round_Name?.match(/\d+/);
    return match && parseInt(match[0]) === currentRoundNumber;
  });

  const alreadyPaid = currentRoundRecord
    ? {
        roundName: currentRoundRecord.Round_Name,
        isVerified: currentRoundRecord.Is_Payment_Verified === true,
        amount: currentRoundRecord.Amount,
      }
    : null;

  // ─── CAN PAY? ─────────────────────────────────────────────────────────────
  const allRounds = biddingConfig?.bidding_rounds || [];
  const nowMs = Date.now();

  const checkCanPay = () => {
    if (alreadyPaid) return { canPay: false, blockReason: null };

    if (isAllPaymentsDone) {
      return {
        canPay: false,
        blockReason: `All ${totalRounds} payments have been completed.`,
      };
    }

    // Round 1 — no previous round needed
    if (currentRoundNumber <= 1) return { canPay: true, blockReason: "" };

    // For Round 2+ → the previous round must have ended
    const previousRoundNumber = currentRoundNumber - 1;
    const previousRound = allRounds.find((r) => {
      const match = r.Round_Name?.match(/\d+/);
      return match && parseInt(match[0]) === previousRoundNumber;
    });

    if (!previousRound) {
      return {
        canPay: false,
        blockReason: `${cycleLabel} ${previousRoundNumber} round has not been created yet. Please create and complete it first before paying for ${cycleLabel} ${currentRoundNumber}.`,
      };
    }

    const prevEndMs = previousRound.endTime
      ? new Date(previousRound.endTime).getTime()
      : null;
    const prevEnded =
      previousRound.roundStatus === "Ended" || (prevEndMs && nowMs > prevEndMs);

    if (!prevEnded) {
      return {
        canPay: false,
        blockReason: `${cycleLabel} ${previousRoundNumber} has not ended yet. You can only pay for ${cycleLabel} ${currentRoundNumber} after it ends.`,
      };
    }

    return { canPay: true, blockReason: "" };
  };

  const { canPay, blockReason } = checkCanPay();

  // ─── FETCH ADMIN QR ───────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPaymentAdmin = async () => {
      try {
        const res = await axios.get(`${API_URL}/payment-admins?populate=*`);
        const adminData = res.data?.data?.[0];
        if (adminData) {
          setAdminUpiId(adminData.Upi_Id);
          const qrImage = adminData.QRcode?.[0];
          if (qrImage?.url) setAdminQrUrl(`https://api.regeve.in${qrImage.url}`);
        }
      } catch (error) {
        console.error("QR Fetch Error:", error);
        toast.error("Failed to load payment QR");
      }
    };
    fetchPaymentAdmin();
  }, []);

  if (!isOpen) return null;

  // ─── HANDLERS ─────────────────────────────────────────────────────────────
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Invalid image file");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const { canPay: stillCanPay, blockReason: stillBlockReason } = checkCanPay();
    if (!stillCanPay) {
      if (stillBlockReason) toast.error(stillBlockReason, { duration: 4000, position: "top-center" });
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a screenshot first");
      return;
    }

    setUploading(true);
    setPaymentStatus(null);

    try {
      const jwt = localStorage.getItem("jwt");

      const formData = new FormData();
      formData.append("files", selectedFile);
      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const uploadedFileId = uploadRes.data[0]?.id;
      if (!uploadedFileId) throw new Error("File upload failed");

      const paymentRes = await axios.post(
        `${API_URL}/bidding-admin-payment/create`,
        {
          Round_Name: roundName,
          biddingId: biddingDocumentId,
          amount: administrativeFee,
          paymentProofIds: [uploadedFileId],
        },
        { headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" } }
      );

      setPaymentStatus("success");
      toast.success("Payment proof submitted successfully!");
      if (onPaymentSuccess) onPaymentSuccess(paymentRes.data);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      console.error("Upload Error:", err);
      setPaymentStatus("error");
      toast.error(err.response?.data?.error?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ─── LEFT PANEL STEP STATE ────────────────────────────────────────────────
  // done    = verified payment exists for this round number
  // pending = submitted but NOT verified for this round
  // current = this is currentRoundNumber and nothing submitted yet
  // future  = beyond currentRoundNumber
  const getStepState = (stepNum) => {
    if (verifiedRoundNums.has(stepNum)) return "done";
    const hasAnyRecord = allPaymentRecords.some((r) => {
      const match = r.Round_Name?.match(/\d+/);
      return match && parseInt(match[0]) === stepNum;
    });
    if (hasAnyRecord) return "pending";
    if (stepNum === currentRoundNumber) return "current";
    return "future";
  };

  // ─── RIGHT PANEL CONTENT ──────────────────────────────────────────────────
  const renderRightPanelContent = () => {
    // CASE 1: Already submitted for current round
    if (alreadyPaid) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-5 ${alreadyPaid.isVerified ? "bg-emerald-50" : "bg-amber-50"}`}>
            {alreadyPaid.isVerified
              ? <CheckCircle2 size={36} className="text-emerald-500" />
              : <Clock size={36} className="text-amber-500" />}
          </div>
          <h4 className="text-xl font-black text-slate-800 mb-2">
            {alreadyPaid.isVerified ? "Payment Verified ✓" : "Payment Submitted"}
          </h4>
          <p className="text-sm text-slate-500 font-medium mb-1">
            You have already submitted payment for
          </p>
          <p className="text-lg font-black text-indigo-600 mb-4">{alreadyPaid.roundName}</p>
          {alreadyPaid.amount && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3 mb-5">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Amount Paid</p>
              <p className="text-2xl font-black text-slate-800">
                ₹{parseFloat(alreadyPaid.amount).toLocaleString()}
              </p>
            </div>
          )}
          <div className={`w-full px-5 py-3 rounded-2xl text-sm font-bold mb-6 ${alreadyPaid.isVerified ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-amber-50 border border-amber-100 text-amber-700"}`}>
            {alreadyPaid.isVerified
              ? "✓ Payment has been verified. You can now create the round."
              : "⏳ Your payment proof is under review. You can create the round once verified."}
          </div>
          <button onClick={onClose} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all text-sm">
            Close
          </button>
        </div>
      );
    }

    // CASE 2: Blocked
    if (!canPay && blockReason) {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-red-50 rounded-2xl border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-600" />
          </div>
          <h4 className="text-base font-black text-slate-800 mb-2">Payment Blocked</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{blockReason}</p>
          <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all text-sm">
            Close
          </button>
        </div>
      );
    }

    // CASE 3: All done
    if (isAllPaymentsDone) {
      return (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
            <CheckCircle2 size={36} className="text-emerald-500" />
          </div>
          <h4 className="text-xl font-black text-slate-800 mb-2">All Payments Complete</h4>
          <p className="text-sm text-slate-500 font-medium">
            All {totalRounds} {cycleLabel} payments have been completed.
          </p>
          <button onClick={onClose} className="mt-6 px-8 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all text-sm">
            Close
          </button>
        </div>
      );
    }

    // CASE 4: Normal payment form
    return (
      <>
        <div className="mx-auto mb-6 p-3 bg-slate-50 rounded-[1.5rem] border border-slate-100 w-fit">
          {adminQrUrl
            ? <img src={adminQrUrl} alt="Admin QR" className="w-32 h-32 mix-blend-multiply" />
            : <p className="text-xs text-slate-400">Loading QR...</p>}
        </div>
        <div className="text-center mb-6">
          <p className="text-indigo-600 font-mono text-sm font-bold bg-indigo-50 px-4 py-1.5 rounded-full inline-block border border-indigo-100">
            {adminUpiId ? `UPI ID: ${adminUpiId}` : "Loading UPI ID..."}
          </p>
        </div>
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${previewUrl ? "border-indigo-500 bg-indigo-50/30" : "border-slate-200 hover:bg-slate-50"}`}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
          {previewUrl
            ? <img src={previewUrl} alt="Preview" className="max-h-24 mx-auto rounded-lg shadow-sm" />
            : (
              <div className="py-2">
                <Upload size={20} className="mx-auto text-slate-400 mb-2" />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-tight">Upload Screenshot</p>
              </div>
            )}
        </motion.div>
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full mt-6 py-3.5 rounded-xl font-bold text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {uploading ? <Loader2 className="animate-spin" size={18} /> : "Submit Payment Proof"}
        </button>
        {paymentStatus === "success" && (
          <p className="mt-4 text-center text-green-600 font-bold text-xs flex items-center justify-center gap-1">
            <CheckCircle2 size={14} /> Submission Successful
          </p>
        )}
      </>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-slate-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-[2rem] max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto max-h-[95vh]"
        >
          {/* LEFT PANEL */}
          <div className="md:w-[38%] bg-slate-900 p-6 sm:p-8 text-white flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 mb-6">
                <ShieldCheck size={20} />
                <span className="font-bold tracking-widest uppercase text-[10px]">Step-by-Step Payment</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{biddingConfig?.nameOfBid}</h2>
              <p className="text-slate-400 text-xs mb-6">Ref ID: {biddingConfig?.biddingid}</p>

              {/* Payment Schedule Tracker */}
              <div className="mb-8 space-y-3">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Payment Schedule</p>
                <div className="space-y-2">
                  {[...Array(totalRounds)].map((_, i) => {
                    const stepNum = i + 1;
                    const state = getStepState(stepNum);

                    const containerClass =
                      state === "done"    ? "bg-emerald-500/10 border-emerald-500/30" :
                      state === "pending" ? "bg-amber-500/10 border-amber-500/30" :
                      state === "current" ? "bg-indigo-600/20 border-indigo-500" :
                                            "bg-white/5 border-white/10 opacity-40";

                    const dotClass =
                      state === "done"    ? "bg-emerald-500" :
                      state === "pending" ? "bg-amber-500" :
                      state === "current" ? "bg-indigo-500" :
                                            "bg-slate-700";

                    return (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-xl border ${containerClass}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${dotClass}`}>
                          {state === "done" ? <CheckCircle2 size={12} /> : stepNum}
                        </div>
                        <span className="text-xs font-medium">{cycleLabel} {stepNum} Payment</span>
                        <span className="ml-auto">
                          {state === "done"    && <CheckCircle2 size={14} className="text-emerald-400" />}
                          {state === "pending" && <Clock size={14} className="text-amber-400" />}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Admin Fee (4%)</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Calculated</span>
                </div>
                <p className="text-3xl font-black text-white">₹{administrativeFee}</p>
                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between text-[10px]">
                  <span className="text-slate-500">Total Project Value</span>
                  <span className="text-slate-300 font-mono">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-500">
              <Calendar size={12} /> Cycle: {biddingConfig?.durationUnit}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 p-6 sm:p-10 bg-white overflow-y-auto">
            <button onClick={onClose} className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-all">
              <X size={20} className="text-slate-400" />
            </button>
            <div className="max-w-sm mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  {alreadyPaid
                    ? alreadyPaid.roundName
                    : isAllPaymentsDone
                    ? "All Complete"
                    : `Complete ${cycleLabel} ${currentRoundNumber}`}
                </h3>
                <p className="text-slate-500 text-xs">
                  {alreadyPaid
                    ? alreadyPaid.isVerified ? "Payment verified by platform" : "Awaiting verification"
                    : isAllPaymentsDone
                    ? `All ${totalRounds} payments done`
                    : "Scan the QR and upload the receipt"}
                </p>
              </div>
              {renderRightPanelContent()}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentPopup;
