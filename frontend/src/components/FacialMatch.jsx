/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";

export default function FacialMatch({ onSuccess }) {
  const [status, setStatus] = useState(null); // null | "verifying" | "success" | "failed"
  const [image, setImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Start camera safely
  const startCamera = async () => {
    if (cameraActive) return; // prevent multiple starts
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Camera access is required to take a selfie.");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);
    stopCamera();
  };

  // Verify the captured face
  const handleVerify = () => {
    if (!image) return;
    setStatus("verifying");

    // Simulate scanning delay
    setTimeout(() => {
      const result = Math.random() > 0.1 ? "success" : "failed"; // 90% chance success
      setStatus(result);
      if (result === "success" && onSuccess) onSuccess();
    }, 2000);
  };

  const reset = () => {
    setStatus(null);
    setImage(null);
    startCamera();
  };

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => stopCamera(); // cleanup
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md text-center space-y-3 max-w-xs mx-auto">
      <h3 className="font-semibold text-lg">BVN Facial Verification</h3>

      {/* Camera preview */}
      {cameraActive && !image && (
        <div className="relative w-64 h-64 mx-auto border rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          <button
            onClick={capturePhoto}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Capture
          </button>
        </div>
      )}

      {/* Captured image with scan overlay */}
      {image && (
        <div className="relative w-64 h-64 mx-auto">
          <img src={image} alt="Selfie" className="w-full h-full object-cover rounded-lg border" />
          
          {/* Scan animation */}
          {status === "verifying" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black bg-opacity-20 rounded-lg">
              <div className="relative">
                <svg className="animate-spin h-16 w-16 text-blue-600" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75"/>
                </svg>
                <span className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-50 animate-ping"></span>
              </div>
            </div>
          )}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Controls */}
      {!image && !cameraActive && (
        <button
          onClick={startCamera}
          className="px-4 py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Take Selfie
        </button>
      )}

      {image && status !== "verifying" && (
        <div className="flex flex-col items-center mt-2 space-y-2">
          <button
            onClick={handleVerify}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
          >
            Verify Face
          </button>
          {status === "failed" && (
            <button
              onClick={reset}
              className="text-blue-600 underline text-sm mt-1"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {status === "success" && (
        <p className="text-green-600 font-medium mt-2">✅ BVN Face Match Successful!</p>
      )}

      {status === "failed" && (
        <p className="text-red-600 font-medium mt-2">❌ Face does not match BVN records</p>
      )}
    </div>
  );
}
