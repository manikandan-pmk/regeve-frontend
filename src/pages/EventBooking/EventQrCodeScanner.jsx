import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";

export default function QRScannerPage() {
  const [status, setStatus] = useState("");
  const [scannedId, setScannedId] = useState("");
  const [scanning, setScanning] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Use a ref to prevent double initialization in React Strict Mode
  const scannerRef = useRef(null);

  const API_URL = "https://api.regeve.in/api"; // change if needed

  useEffect(() => {
    // If scanner is already initialized, don't start it again
    if (scannerRef.current) return;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        // Use 'environment' facing mode for better mobile UX (defaults to back camera)
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          async (decodedText) => {
            // 🛑 Stop scanner safely after a successful scan
            if (html5QrCode.isScanning) {
              await html5QrCode.stop();
              html5QrCode.clear();
            }
            setScanning(false);
            setStatus("Verifying participant..."); // Intermediate loading state

            try {
              let participationId = decodedText;

              // ✅ Extract ID if QR contains a full URL
              if (decodedText.includes("/")) {
                const parts = decodedText.split("/");
                participationId = parts[parts.length - 1];
              }

              setScannedId(participationId);

              // ✅ API call
              const res = await axios.get(
                `${API_URL}/verify-participant/${participationId}`
              );

              setStatus(res.data.message || "✅ Verified Successfully");
            } catch (err) {
              setStatus(
                err.response?.data?.message || "❌ Verification failed"
              );
            }
          },
          (errorMessage) => {
            // Ignore background scan frame errors to prevent console spam
          }
        );
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        if (err.name === "NotAllowedError") {
          setError("❌ Camera permission denied. Please allow access.");
        } else {
          setError("❌ Camera not accessible. Please check your device.");
        }
      }
    };

    startScanner();

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            scannerRef.current.clear();
            scannerRef.current = null;
          }).catch(console.error);
        } else {
          scannerRef.current.clear();
          scannerRef.current = null;
        }
      }
    };
  }, []);

  // UI Helper for status styling
  const getStatusColor = () => {
    if (status.includes("Already")) return "text-amber-600 bg-amber-50 border-amber-200";
    if (status.includes("❌") || status.includes("failed")) return "text-red-600 bg-red-50 border-red-200";
    if (status.includes("✅")) return "text-green-600 bg-green-50 border-green-200";
    return "text-blue-600 bg-blue-50 border-blue-200"; // Default/Verifying state
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Event Check-in
          </h1>
          <p className="text-indigo-100 mt-1 text-sm">Point your camera at the QR code</p>
        </div>

        <div className="p-6 flex flex-col items-center">
          {/* 🎥 CAMERA AREA */}
          {scanning && !error && (
            <div className="relative w-full max-w-[300px] aspect-square rounded-xl overflow-hidden bg-slate-100 ring-4 ring-slate-50 shadow-inner">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              )}
              {/* html5-qrcode injects the video here */}
              <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full" />
              
              {/* Decorative Scanning Overlay */}
              {!isLoading && (
                <div className="absolute inset-0 border-2 border-indigo-500/30 pointer-events-none rounded-xl">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-600 rounded-tl-xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-600 rounded-tr-xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-600 rounded-bl-xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-600 rounded-br-xl"></div>
                </div>
              )}
            </div>
          )}

          {/* ❌ ERROR STATE */}
          {error && (
            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100 w-full">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* 🆔 RESULTS AREA */}
          {!scanning && !error && (
            <div className="w-full animate-fade-in-up mt-2">
              <div className="text-center mb-4">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full tracking-wider">
                  SCANNED ID: {scannedId}
                </span>
              </div>

              {status && (
                <div className={`p-4 rounded-xl border text-center transition-all ${getStatusColor()}`}>
                  <p className="font-semibold text-lg">{status}</p>
                </div>
              )}

              {/* 🔄 RESCAN BUTTON */}
              <button
                onClick={() => window.location.reload()}
                className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm active:scale-[0.98]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Scan Next Participant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}