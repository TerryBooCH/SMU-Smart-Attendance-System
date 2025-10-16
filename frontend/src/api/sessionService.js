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
};
