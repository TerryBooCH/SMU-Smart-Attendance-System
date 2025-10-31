import React, { createContext, useState } from "react";
import { attendanceService } from "../api/attendanceService";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch attendance records by session ID
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

  // Update attendance status using separate arguments
  const updateAttendanceStatus = async (sessionId, studentId, status, method = "MANUAL") => {
    try {
      setLoading(true);
      setError(null);

      const updatedRecord = await attendanceService.updateAttendanceStatus(
        sessionId,
        studentId,
        status,
        method
      );

      setAttendances((prevAttendances) =>
        prevAttendances.map((attendance) =>
          attendance.id === updatedRecord.id ? updatedRecord : attendance
        )
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

  const clearAttendances = () => {
    setAttendances([]);
  };

  const value = {
    attendances,
    loading,
    error,
    fetchAttendanceBySessionId,
    updateAttendanceStatus,
    clearAttendances,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
