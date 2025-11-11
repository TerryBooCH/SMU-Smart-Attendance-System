import React, { createContext, useState, useCallback } from "react";
import { attendanceService } from "../api/attendanceService";
import SockJS from "sockjs-client";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendances, setAttendances] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [wsError, setWsError] = useState(null);
  const [successAutoAttendanceMarked, setSuccessAutoAttendanceMarked] =
    useState([]);
  const [manualPendingList, setManualPendingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // ✅ Connect WebSocket
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

          // ❌ Error response
          if (parsed.status === "error") {
            console.error("❌ WebSocket error:", parsed.message);
            setWsError(parsed.message || "Unknown WebSocket error");
            setWarnings([]);
            return;
          } else {
            setWsError(null);
          }

          // ✅ Success response
          if (parsed.status === "success") {
            const results = parsed.result?.results;
            const warningsObj = parsed.result?.warnings;

            // ⚠️ Handle warnings
            if (warningsObj && Object.keys(warningsObj).length > 0) {
              const allWarnings = Object.entries(warningsObj)
                .map(([key, arr]) => arr.map((msg) => `${key}: ${msg}`))
                .flat();
              console.warn("⚠️ Warnings received:", allWarnings);
              setWarnings(allWarnings);
            } else {
              setWarnings([]);
            }

            // 🟩 Handle detections and attendance updates
            if (Array.isArray(results) && results.length > 0) {
              const boxes = results.map((r) => {
                const attendanceExists = !!r.attendance;

                return {
                  ...r.detected,
                  student: r.top_student,
                  recognition_score: r.recognition_score ?? 0,
                  threshold_status: attendanceExists
                    ? "above_threshold"
                    : "below_threshold",
                  has_attendance: attendanceExists,
                };
              });

              setBoundingBoxes(boxes);
              console.log("🟩 Updating bounding boxes:", boxes);

              results.forEach((r) => {
                const attendance = r.attendance;
                const student = r.top_student;

                // 🟡 Case 1: attendance is null → manual marking required
                if (!attendance) {
                  if (!student?.studentId) return;

                  setManualPendingList((prev) => {
                    const exists = prev.some(
                      (s) => s.studentId === student.studentId
                    );
                    if (exists) return prev;

                    const entry = {
                      studentId: student.studentId,
                      name: student.name || "Unknown Student",
                      timestamp: new Date().toISOString(),
                      message: `🟡 Detected ${
                        student.name || "Unknown Student"
                      } (ID: ${
                        student.studentId
                      }) — recognition confidence below threshold, manual attendance marking required.`,
                    };

                    console.log("🟡 Manual marking pending:", entry);
                    return [...prev, entry];
                  });

                  return;
                }

                // 🟢 Case 2: attendance exists → handle normally
                if (attendance && attendance.id) {
                  // Update local attendance list
                  setAttendances((prev) => {
                    const exists = prev.some((a) => a.id === attendance.id);
                    return exists
                      ? prev.map((a) =>
                          a.id === attendance.id ? attendance : a
                        )
                      : prev;
                  });

                  // ✅ Auto attendance success
                  if (attendance.method === "AUTO") {
                    // 🧹 Remove from manual pending if previously listed
                    setManualPendingList((prev) =>
                      prev.filter((s) => s.studentId !== attendance.studentId)
                    );

                    // ✅ Add success message if not duplicate
                    setSuccessAutoAttendanceMarked((prev) => {
                      const exists = prev.some(
                        (m) => m.studentId === attendance.studentId
                      );
                      if (exists) return prev;

                      const messageObj = {
                        studentId: attendance.studentId,
                        message: `✅ Attendance marked as "${
                          attendance.status
                        }" for ${student?.name || "Unknown Student"} in ${
                          attendance.sessionCourseName || "Unknown Course"
                        } (${
                          attendance.studentClassName || "N/A"
                        }). Confidence: ${(attendance.confidence * 100).toFixed(
                          1
                        )}%. Method: ${attendance.method}.`,
                        details: {
                          studentName: student?.name,
                          studentEmail: student?.email,
                          course: attendance.sessionCourseName,
                          className: attendance.studentClassName,
                          status: attendance.status,
                          confidence: attendance.confidence,
                          method: attendance.method,
                          timestamp: attendance.timestamp,
                        },
                        timestamp: new Date().toISOString(),
                      };

                      console.log("✅ Auto attendance success:", messageObj);
                      return [...prev, messageObj];
                    });
                  }
                }
              });
            } else {
              console.log(
                "🕒 No detections — keeping previous bounding boxes."
              );
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
    [socket]
  );

  // ✅ Disconnect WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (socket) {
      console.log("🔌 Closing WebSocket...");
      socket.close();
      setSocket(null);
    }
  }, [socket]);

  // ✅ Send recognition frame
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
      };

      socket.send(JSON.stringify(payload));
      console.log("📤 Sent recognition:", payload);
    },
    [socket]
  );

  // --- Attendance API logic ---
  const fetchAttendanceBySessionId = useCallback(async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.getAttendanceBySessionId(
        sessionId
      );
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

        // ✅ Remove from manual pending if exists
        setManualPendingList((prev) =>
          prev.filter((s) => s.studentId !== studentId)
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

  // ✅ Utility: Remove specific manual pending item by studentId
  const removeManualPendingByStudentId = useCallback((studentId) => {
    setManualPendingList((prev) =>
      prev.filter((s) => s.studentId !== studentId)
    );
  }, []);

  // ✅ Clear helpers
  const clearAttendances = useCallback(() => setAttendances([]), []);
  const clearSuccessAutoAttendance = useCallback(
    () => setSuccessAutoAttendanceMarked([]),
    []
  );
  const clearManualPending = useCallback(() => setManualPendingList([]), []);

  const value = {
    attendances,
    boundingBoxes,
    warnings,
    wsError,
    successAutoAttendanceMarked,
    manualPendingList,
    loading,
    error,
    fetchAttendanceBySessionId,
    updateAttendanceStatus,
    clearAttendances,
    clearSuccessAutoAttendance,
    clearManualPending,
    removeManualPendingByStudentId, // 🆕 Expose the helper
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
