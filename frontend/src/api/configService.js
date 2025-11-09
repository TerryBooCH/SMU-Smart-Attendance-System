// src/services/configService.js
import apiClient from "./axios";

export const configService = {
  getRecognitionThreshold: async () => {
    try {
      const response = await apiClient.get("/api/config/recognition-threshold");
      console.log("Current threshold:", response.data);
      return response.data.threshold;
    } catch (error) {
      console.error("Error fetching recognition threshold:", error);
      throw error;
    }
  },

  updateRecognitionThreshold: async (newThreshold) => {
    try {
      const response = await apiClient.put("/api/config/recognition-threshold", {
        threshold: newThreshold.toString(),
      });
      console.log("Threshold updated:", response.data);
      return response.data.threshold;
    } catch (error) {
      console.error("Error updating recognition threshold:", error);
      throw error;
    }
  },
};
