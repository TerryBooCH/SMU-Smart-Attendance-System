import React, { useState, useRef, useCallback, useEffect } from "react";
import { Camera, X, Loader2, RefreshCw, CircleAlert } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useStudent from "../../hooks/useStudent";
import useToast from "../../hooks/useToast";

const CaptureFaceDataForm = ({ student }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [inlineError, setInlineError] = useState(""); // inline error state
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { uploadStudentFaceData, loading } = useStudent();
  const { success } = useToast();
  const { closeModal } = useModal();

  // Check if webcam is available
  const checkWebcamAvailability = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return {
          available: false,
          message: "Camera API not supported in this browser.",
        };
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasVideoInput = devices.some(
        (device) => device.kind === "videoinput"
      );

      if (!hasVideoInput) {
        return {
          available: false,
          message: "No webcam detected on this device.",
        };
      }

      return { available: true };
    } catch (err) {
      return { available: false, message: "Unable to detect camera devices." };
    }
  };

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);

      // Check webcam availability first
      const webcamCheck = await checkWebcamAvailability();
      if (!webcamCheck.available) {
        setCameraError(webcamCheck.message);
        return;
      }

      setIsCameraActive(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (playErr) {
          setCameraError("Unable to play video stream.");
        }
      }
    } catch (err) {
      setIsCameraActive(false);

      let errorMessage = "Unable to access camera. Please check permissions.";

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        errorMessage = "Camera access denied. Please allow camera permissions.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "No camera found on this device.";
      } else if (err.name === "NotReadableError") {
        errorMessage = "Camera is already in use by another application.";
      }

      setCameraError(errorMessage);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || loading) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `face-capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setCapturedImage(file);
          setInlineError("");
          stopCamera();
        }
      },
      "image/jpeg",
      0.95
    );
  }, [loading, stopCamera]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setInlineError("");
    startCamera();
  }, [startCamera]);

  // Handle upload
  const handleUpload = async () => {
    if (!capturedImage || loading) return;

    try {
      const response = await uploadStudentFaceData(
        student.studentId,
        capturedImage
      );

      if (response.status === 201 || response.status === "success") {
        success("Face data uploaded successfully!");
        stopCamera();
        closeModal();
      }
    } catch (err) {
      console.error("Error uploading face data:", err);

      // Default error message
      let message = "Failed to upload face data. Please try again.";

      if (err?.response?.status === 400) {
        message =
          "Cannot upload more images: maximum of 20 face images allowed.";
      } else if (err?.data?.error) {
        message = err.data.error;
      }

      setInlineError(message);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="flex flex-col items-center gap-6 py-4 font-lexend">
      {/* Camera/Preview Zone */}
      <div className="relative w-full h-80 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
        {!isCameraActive && !capturedImage && (
          <div className="flex flex-col items-center gap-4">
            <Camera className="w-16 h-16 text-gray-400" />
            <p className="text-sm text-gray-300 text-center">
              Click the button below to start your camera
            </p>
            {cameraError && (
              <p className="text-xs text-red-400 text-center max-w-xs">
                {cameraError}
              </p>
            )}
          </div>
        )}

        {isCameraActive && !capturedImage && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
              style={{ transform: "scaleX(-1)" }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <button
                type="button"
                onClick={capturePhoto}
                disabled={loading}
                className="bg-white hover:bg-gray-100 active:scale-95 rounded-full p-4 shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                <Camera className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </>
        )}

        {capturedImage && (
          <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
            <img
              src={URL.createObjectURL(capturedImage)}
              alt="Captured"
              className="max-w-full max-h-full object-contain"
            />
            <button
              type="button"
              onClick={() => {
                setCapturedImage(null);
                setInlineError("");
              }}
              disabled={loading}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Inline Error Box */}
      {inlineError && (
        <div className="w-full  bg-red-50 border border-red-400 text-red-800 px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
          <CircleAlert className="w-5 h-5" />
          <span>{inlineError}</span>
        </div>
      )}

      {/* Camera Controls */}
      {!isCameraActive && !capturedImage && (
        <button
          type="button"
          onClick={startCamera}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          <Camera className="w-5 h-5" />
          Start Camera
        </button>
      )}

      {/* File Info */}
      {capturedImage && (
        <div className="text-sm text-gray-600">
          <p>
            <strong>Captured:</strong> {capturedImage.name}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 w-full mt-4">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => {
            stopCamera();
            closeModal();
          }}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Cancel
        </button>

        {/* Retake Button */}
        {capturedImage && (
          <button
            type="button"
            onClick={retakePhoto}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-xl border border-blue-600 text-blue-600 cursor-pointer hover:bg-blue-50 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retake
          </button>
        )}

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={!capturedImage || loading}
          className={`px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
            capturedImage && !loading
              ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </div>
  );
};

export default CaptureFaceDataForm;
