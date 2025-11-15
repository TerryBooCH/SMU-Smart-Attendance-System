// src/services/configService.js
import apiClient from "./axios";

export const configService = {
  /* ============================================================
   * RECOGNITION THRESHOLD
   * ============================================================ */

  getRecognitionThreshold: async () => {
    try {
      const response = await apiClient.get("/api/config/recognition-threshold");
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
      return response.data.threshold;
    } catch (error) {
      console.error("Error updating recognition threshold:", error);
      throw error;
    }
  },

  /* ============================================================
   * DEFAULT DETECTOR
   * ============================================================ */

  getDefaultDetector: async () => {
    try {
      const response = await apiClient.get("/api/config/default-detector");
      return response.data.defaultDetector;
    } catch (error) {
      console.error("Error fetching default detector:", error);
      throw error;
    }
  },

  updateDefaultDetector: async (newDetector) => {
    try {
      const response = await apiClient.put("/api/config/default-detector", {
        defaultDetector: newDetector,
      });
      return {
        defaultDetector: response.data.defaultDetector,
        defaultRecognizer: response.data.defaultRecognizer, // auto-adjusted if needed
      };
    } catch (error) {
      console.error("Error updating default detector:", error);
      throw error;
    }
  },

  /* ============================================================
   * DEFAULT RECOGNIZER
   * ============================================================ */

  getDefaultRecognizer: async () => {
    try {
      const response = await apiClient.get("/api/config/default-recognizer");
      return response.data.defaultRecognizer;
    } catch (error) {
      console.error("Error fetching default recognizer:", error);
      throw error;
    }
  },

  updateDefaultRecognizer: async (newRecognizer) => {
    try {
      const response = await apiClient.put("/api/config/default-recognizer", {
        defaultRecognizer: newRecognizer,
      });
      return {
        defaultDetector: response.data.defaultDetector,
        defaultRecognizer: response.data.defaultRecognizer,
      };
    } catch (error) {
      console.error("Error updating default recognizer:", error);
      throw error;
    }
  },
};
