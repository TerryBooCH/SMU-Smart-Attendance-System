import React, { useEffect, useRef, useState } from "react";
import { Video, VideoOff, User } from "lucide-react";

const MainRecognitionScreen = ({ isCameraOn }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      if (!isCameraOn) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Unable to access camera. Please check permissions.");
        setIsLoading(false);
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
      setIsLoading(false);
    }

    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden rounded-3xl">
      {/* Video Feed - Full Screen */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-contain"
        style={{ display: isCameraOn && !error ? "block" : "none" }}
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        {isCameraOn && !error && !isLoading && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white font-medium text-lg">
                  Face Recognition Active
                </span>
              </div>
              <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                <Video className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Live</span>
              </div>
            </div>
          </div>
        )}

        {/* Camera Off State */}
        {!isCameraOn && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <VideoOff className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">
                Camera is Off
              </h2>
              <p className="text-white/70 text-lg">
                Turn on the camera to start face recognition
              </p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl font-medium">
                Initializing camera...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center max-w-md px-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <VideoOff className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">
                Camera Access Denied
              </h2>
              <p className="text-white/70 text-lg mb-6">{error}</p>
              <p className="text-white/50 text-sm">
                Please enable camera permissions in your browser settings
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainRecognitionScreen;
