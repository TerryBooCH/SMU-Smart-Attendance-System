import React, { createContext, useState, useCallback } from "react";
import { attendanceService } from "../api/attendanceService";
import SockJS from "sockjs-client";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendances, setAttendances] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [wsError, setWsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // ✅ Connect WebSocket — wrapped in useCallback to keep stable reference
  const connectWebSocket = useCallback(
    (onMessage) => {
      if (socket) {
        console.warn("WebSocket already connected");
        return;
      }

      const ws = new SockJS("http://localhost:8080/ws/biometric");

      ws.onopen = () => console.log("SockJS connected");

      ws.onmessage = (event) => {
        try {
          let parsed = event.data;
          parsed = JSON.parse(parsed);
          if (typeof parsed === "string") parsed = JSON.parse(parsed);

          console.log("📩 WebSocket message:", parsed);

          if (parsed.status === "error") {
            console.error("❌ WebSocket error:", parsed.message);
            setWsError(parsed.message || "Unknown WebSocket error");
            setWarnings([]);
            return;
          } else {
            setWsError(null);
          }

          if (parsed.status === "success") {
            const results = parsed.result?.results;
            const warningsObj = parsed.result?.warnings;

            if (warningsObj && Object.keys(warningsObj).length > 0) {
              const allWarnings = Object.entries(warningsObj)
                .map(([key, arr]) => arr.map((msg) => `${key}: ${msg}`))
                .flat();
              console.warn("⚠️ Warnings received:", allWarnings);
              setWarnings(allWarnings);
            } else {
              setWarnings([]);
            }

            if (Array.isArray(results) && results.length > 0) {
              const boxes = results.map((r) => ({
                ...r.detected,
                student: r.top_student,
                recognition_score: r.recognition_score,
              }));
              console.log("🟩 Updating bounding boxes:", boxes);
              setBoundingBoxes(boxes);
            } else {
              console.log("🕒 No detections — keeping previous bounding boxes.");
            }
          }

          if (onMessage) onMessage(parsed);
        } catch (err) {
          console.error("Invalid JSON from WebSocket:", event.data);
        }
      };

      ws.onclose = (event) => {
        console.log("SockJS disconnected:", event.code, event.reason);
      };

      ws.onerror = (err) => {
        console.error("SockJS error:", err);
      };

      setSocket(ws);
    },
    [socket] // 👈 stable dependency so it won't recreate on re-renders
  );

  // ✅ Disconnect WebSocket — also memoized
  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      console.log("🔌 Closing WebSocket...");
      socket.close();
      setSocket(null);
    }
  }, [socket]);

  // ✅ Send recognition — memoized for stability
  const sendRecognition = useCallback(
    (base64Image, sessionId) => {
      if (!socket) {
        console.warn("WebSocket not connected");
        return;
      }

      const payload = {
        event: "recognize",
        image: base64Image,
        session_id: sessionId,
        detector_type: null,
        type: null,
        metric_name: null,
        manualThreshold: null,
        autoThreshold: null,
      };

      socket.send(JSON.stringify(payload));
      console.log("📤 Sent recognition:", payload);
    },
    [socket]
  );

  // --- Attendance API logic (unchanged) ---
  const fetchAttendanceBySessionId = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getAttendanceBySessionId(sessionId);
      const records = response.records || [];
      setAttendances(records);
      return records;
    } catch (err) {
      console.error("Error fetching attendance records:", err);
      setError(err.message || "Failed to fetch attendance records");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAttendanceStatus = useCallback(
    async (sessionId, studentId, status, method = "MANUAL") => {
      try {
        setLoading(true);
        setError(null);
        const updatedRecord = await attendanceService.updateAttendanceStatus(
          sessionId,
          studentId,
          status,
          method
        );
        setAttendances((prev) =>
          prev.map((a) => (a.id === updatedRecord.id ? updatedRecord : a))
        );
        return updatedRecord;
      } catch (err) {
        console.error("Error updating attendance record:", err);
        setError(err.message || "Failed to update attendance record");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearAttendances = useCallback(() => setAttendances([]), []);

  const value = {
    attendances,
    boundingBoxes,
    warnings,
    wsError,
    loading,
    error,
    fetchAttendanceBySessionId,
    updateAttendanceStatus,
    clearAttendances,
    connectWebSocket,
    disconnectWebSocket,
    sendRecognition,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
