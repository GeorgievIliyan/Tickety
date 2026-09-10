"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

type AutoQRScannerProps = {
  onScanSuccess: (decodedText: string) => void;
};

export default function AutoQRScanner({ onScanSuccess }: AutoQRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let isMounted = true;

    // Automatically request camera and start decoding continuous video frames
    codeReader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err) => {
        if (result && isMounted) {
          onScanSuccess(result.getText());
        }
      }
    ).catch((err) => {
      if (isMounted) {
        console.error("Camera access error:", err);
        setError("Unable to access camera. Please check permissions.");
      }
    });

    return () => {
      isMounted = false;
      // Stop camera stream and release resources on unmount
      codeReader.reset();
    };
  }, [onScanSuccess]);

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {error ? (
        <div className="p-4 text-center text-sm text-red-500 bg-red-50 dark:bg-red-950/50 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black shadow-lg border">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
          />
          {/* Target Overlay Frame */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-white/70 rounded-xl border-dashed animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}