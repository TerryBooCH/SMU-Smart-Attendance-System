import apiClient from "./axios";

export const rosterService = {
  getAllRosters: async () => {
    try {
      const response = await apiClient.get("/api/rosters");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting rosters:", error);
      throw error;
    }
  },

  createRoster: async (rosterData) => {
    try {
      const response = await apiClient.post("/api/rosters", rosterData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating roster:", error);
      throw error;
    }
  },
};