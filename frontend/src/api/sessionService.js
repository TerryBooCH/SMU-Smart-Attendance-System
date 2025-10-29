import apiClient from "./axios";

export const sessionService = {
  getAllSessions: async () => {
    try {
      const response = await apiClient.get("/api/sessions");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting sessions:", error);
      throw error;
    }
  },

  getSessionById: async (sessionId) => {
    try {
      const response = await apiClient.get(`/api/sessions/${sessionId}`);
      console.log("Fetched session:", response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error fetching session";
      const statusCode = error.response?.status || 500;

      console.error(`Error fetching session (${statusCode}):`, errorMessage);

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

  createSession: async (sessionData) => {
    try {
      const response = await apiClient.post("/api/sessions", sessionData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error creating session";
      const statusCode = error.response?.status || 500;

      console.error(`Error creating session (${statusCode}):`, errorMessage);

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

  deleteSessionById: async (sessionId) => {
    try {
      const response = await apiClient.delete(`/api/sessions/${sessionId}`);
      console.log("Deleted session:", response);
      return response;
    } catch (error) {
      console.error("Error deleting session:", error);
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error deleting session";
      const statusCode = error.response?.status || 500;

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

    openSession: async (sessionId) => {
    try {
      const response = await apiClient.put(`/api/sessions/${sessionId}/open`);
      console.log("Opened session:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error opening session:", error);
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error opening session";
      const statusCode = error.response?.status || 500;

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

  closeSession: async (sessionId) => {
    try {
      const response = await apiClient.put(`/api/sessions/${sessionId}/close`);
      console.log("Closed session:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error closing session:", error);
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error closing session";
      const statusCode = error.response?.status || 500;

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },
};
