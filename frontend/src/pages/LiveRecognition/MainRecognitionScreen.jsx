import React, { useEffect, useRef, useState } from "react";
import { Video, VideoOff } from "lucide-react";
import useAttendance from "../../hooks/useAttendance"; // ✅ Hook from AttendanceContext
import { useParams } from "react-router-dom";

const MainRecognitionScreen = ({ isCameraOn }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const streamRef = useRef(null);
  const captureIntervalRef = useRef(null);

  const { sendRecognition, boundingBoxes } = useAttendance(); // ✅ Access bounding boxes
  const { id } = useParams(); // session ID

  // --- Camera Setup ---
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
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
    };

    if (isCameraOn) startCamera();
    else {
      stopCamera();
      setIsLoading(false);
    }

    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

  // --- Frame Capture + Send (10 FPS) ---
  useEffect(() => {
    if (!isCameraOn) {
      clearInterval(captureIntervalRef.current);
      return;
    }

    let isSending = false;

    const sendFrame = () => {
      if (!videoRef.current || videoRef.current.readyState !== 4 || isSending) return;

      isSending = true;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL("image/jpeg", 0.6); // lower quality for faster transfer

      sendRecognition(base64Image, Number(id));

      // throttle — mark ready after 50ms
      setTimeout(() => {
        isSending = false;
      }, 50);
    };

    // 10 fps (every 100ms)
    captureIntervalRef.current = setInterval(sendFrame, 100);

    return () => clearInterval(captureIntervalRef.current);
  }, [isCameraOn, sendRecognition, id]);

  // --- Scale boxes to fit video display ---
  const getBoxStyles = (box) => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return {};

    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = video.clientWidth / video.clientHeight;

    let scaleX, scaleY, offsetX = 0, offsetY = 0;

    if (videoRatio > containerRatio) {
      // Horizontal letterboxing
      scaleY = video.clientHeight / video.videoHeight;
      scaleX = scaleY;
      offsetX = (video.clientWidth - video.videoWidth * scaleX) / 2;
    } else {
      // Vertical letterboxing
      scaleX = video.clientWidth / video.videoWidth;
      scaleY = scaleX;
      offsetY = (video.clientHeight - video.videoHeight * scaleY) / 2;
    }

    return {
      left: `${box.x * scaleX + offsetX}px`,
      top: `${box.y * scaleY + offsetY}px`,
      width: `${box.width * scaleX}px`,
      height: `${box.height * scaleY}px`,
    };
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden rounded-3xl">
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-contain"
        style={{ display: isCameraOn && !error ? "block" : "none" }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* ✅ Bounding Boxes */}
        {boundingBoxes.map((box, idx) => (
          <div
            key={idx}
            className="absolute border-4 border-green-500 bg-green-500/10 rounded-lg transition-all duration-300"
            style={getBoxStyles(box)}
          >
            <div className="absolute -top-6 left-0 bg-green-600 text-white text-sm px-2 py-1 rounded shadow-md">
              {box.student?.name || "Unknown"}
            </div>
          </div>
        ))}

        {/* Recognition Active Banner */}
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

        {/* Camera Off / Error / Loading */}
        {!isCameraOn && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <VideoOff className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">Camera is Off</h2>
              <p className="text-white/70 text-lg">
                Turn on the camera to start face recognition
              </p>
            </div>
          </div>
        )}

        {isLoading && isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white text-xl font-medium">Initializing camera...</p>
            </div>
          </div>
        )}

        {error && isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center max-w-md px-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <VideoOff className="w-10 h-10 text-red-400" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">Camera Access Denied</h2>
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
