import apiClient from "./axios";

export const studentService = {
  getAllStudents: async () => {
    try {
      const response = await apiClient.get("/api/students");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting students:", error);
      throw error;
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await apiClient.post("/api/students", studentData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    }
  },

  deleteStudentByStudentId: async (studentId) => {
    try {
      const response = await apiClient.delete(`/api/students/${studentId}`);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },

  updateStudentByStudentId: async (studentId, studentData) => {
    try {
      const response = await apiClient.put(`/api/students/${studentId}`, studentData);
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },
};
