import React, { createContext, useState } from "react";
import { attendanceService } from "../api/attendanceService";
import SockJS from "sockjs-client";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendances, setAttendances] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [warnings, setWarnings] = useState([]); // ✅ new state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // ✅ Connect manually when a component needs it
  const connectWebSocket = (onMessage) => {
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

        if (parsed.status === "success") {
          // ✅ Extract results
          const results = parsed.result?.results;
          const warningsObj = parsed.result?.warnings;

          // ✅ Handle warnings
          if (warningsObj && Object.keys(warningsObj).length > 0) {
            // Flatten all warning arrays into a single list of messages
            const allWarnings = Object.entries(warningsObj)
              .map(([key, arr]) => arr.map((msg) => `${key}: ${msg}`))
              .flat();
            console.warn("⚠️ Warnings received:", allWarnings);
            setWarnings(allWarnings);
          } else {
            setWarnings([]); // clear when no warnings
          }

          // ✅ Handle detections
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

    ws.onclose = () => console.log("SockJS disconnected");
    ws.onerror = (err) => console.error("SockJS error:", err);

    setSocket(ws);
  };

  // ✅ Disconnect manually when done
  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  // ✅ Send recognition frame
  const sendRecognition = (base64Image, sessionId) => {
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
  };

  // --- Attendance API logic ---
  const fetchAttendanceBySessionId = async (sessionId) => {
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
  };

  const updateAttendanceStatus = async (
    sessionId,
    studentId,
    status,
    method = "MANUAL"
  ) => {
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
  };

  const clearAttendances = () => setAttendances([]);

  const value = {
    attendances,
    boundingBoxes,
    warnings, // ✅ expose warnings
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
