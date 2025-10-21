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
};
