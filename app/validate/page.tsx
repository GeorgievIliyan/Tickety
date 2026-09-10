"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FullPageScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [scanMessage, setScanMessage] = useState<string>("");

  const handleScanResult = async (scannedData: string) => {
    // avoid re-triggering while a result is already showing
    if (isValid !== null) return;

    try {
      const res = await fetch("/api/validate-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scannedData }),
      });

      const data = await res.json();
      setIsValid(data.valid);
      setScanMessage(data.message);
    } catch {
      setIsValid(false);
      setScanMessage("Could not reach server.");
    }
  };

  const resetScan = () => {
    setIsValid(null);
    setScanMessage("");
  };

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let isMounted = true;
    
    const originalWarn = console.warn;
    const originalError = console.error;
    console.warn = () => { };
    console.error = () => { };

    const constraints = {
      video: { facingMode: "environment" },
    };

    const videoElement = videoRef.current;
    if (!videoElement) {
      console.warn = originalWarn;
      console.error = originalError;
      return;
    }

    codeReader
      .decodeFromConstraints(constraints, videoElement, (result) => {
        if (result && isMounted) {
          handleScanResult(result.getText());
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn = originalWarn;
          console.error = originalError;
          console.error("Camera access error:", err);
          setError("Unable to access camera. Please check permissions.");
        }
      });

    return () => {
      isMounted = false;
      console.warn = originalWarn;
      console.error = originalError;
      codeReader.reset();
    };
  }, []);
  
  if (isValid !== null) {
    return (
      <div
        className={`h-screen w-screen flex items-center justify-center p-6 ${isValid ? "bg-emerald-500" : "bg-red-500"
          }`}
      >
        <Card className="max-w-sm w-full border-none shadow-2xl">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            {isValid ? (
              <CheckCircle2 className="h-20 w-20 text-emerald-500" />
            ) : (
              <XCircle className="h-20 w-20 text-red-500" />
            )}
            <p className="text-xl font-semibold">{scanMessage}</p>
            <Button onClick={resetScan} className="w-full mt-2">
              Scan another
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <style>{`
        @keyframes scan-anim {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-anim 2s ease-in-out infinite;
        }
      `}</style>

      <video ref={videoRef} className="h-full w-full object-cover" playsInline />

      <div className="absolute inset-0 flex flex-col items-center justify-between p-6 pointer-events-none">
        <div className="mt-8 text-center bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <p className="text-sm font-medium">Position QR code inside the frame</p>
        </div>

        <div className="relative h-80 w-80 max-w-[80vw] max-h-[80vw] md:h-[500px] md:w-[500px] md:max-w-[60vw] md:max-h-[60vw] rounded-3xl border-2 border-white/60 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-white/5" />
          <div className="absolute w-full h-1 bg-emerald-400 shadow-[0_0_15px_#34d399] animate-scan-line" />
        </div>

        <div className="mb-8">
          {error && (
            <div className="bg-red-500/80 backdrop-blur-md text-white text-xs px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}