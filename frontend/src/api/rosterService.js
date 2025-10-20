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

  deleteRosterById: async (rosterId) => {
    try {
      const response = await apiClient.delete(`/api/rosters/${rosterId}`);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error deleting roster:", error);
      throw error;
    }
  },

  updateRosterById: async (rosterId, rosterData) => {
    try {
      const response = await apiClient.put(
        `/api/rosters/${rosterId}`,
        rosterData
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error updating roster:", error);
      throw error;
    }
  },

  getRosterById: async (rosterId) => {
    try {
      const response = await apiClient.get(`/api/rosters/${rosterId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting roster:", error);
      throw error;
    }
  },

  getStudentsInRoster: async (rosterId) => {
    try {
      const response = await apiClient.get(`/api/rosters/${rosterId}/students`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting students in roster:", error);
      throw error;
    }
  },

  addStudentToRoster: async (rosterId, studentId) => {
    try {
      const response = await apiClient.post(
        `/api/rosters/${rosterId}/students/${studentId}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error adding student to roster";
      const statusCode = error.response?.status || 500;

      console.error(
        `Error adding student to roster (${statusCode}):`,
        errorMessage
      );

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

  removeStudentFromRoster: async (rosterId, studentId) => {
    try {
      const response = await apiClient.delete(
        `/api/rosters/${rosterId}/students/${studentId}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error removing student from roster:", error);
      throw error;
    }
  },
  importStudentsToRosterFromCsv: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/api/import/rosters", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Roster student import result:", response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error importing students to roster";
      const statusCode = error.response?.status || 500;

      console.error(
        `Error importing students to roster (${statusCode}):`,
        errorMessage
      );

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },
};
