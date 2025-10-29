import apiClient from "./axios";

export const attendanceService = {
  getAttendanceBySessionId: async (sessionId) => {
    try {
      const response = await apiClient.get(
        `/api/attendances/session/${sessionId}`
      );
      console.log("Attendance records:", response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error fetching attendance records";
      const statusCode = error.response?.status || 500;

      console.error(
        `Error fetching attendance for session ${sessionId} (${statusCode}):`,
        errorMessage
      );

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

  updateAttendanceStatus: async (
    sessionId,
    studentId,
    status,
    method = "MANUAL"
  ) => {
    try {
      const response = await apiClient.put(
        `/api/attendances/session/${sessionId}/student/${studentId}`,
        { status, method }
      );
      console.log(
        `Updated attendance for student ${studentId} in session ${sessionId}:`,
        response.data
      );
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error updating attendance record";
      const statusCode = error.response?.status || 500;

      console.error(
        `Error updating attendance for session ${sessionId}, student ${studentId} (${statusCode}):`,
        errorMessage
      );

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },
};
