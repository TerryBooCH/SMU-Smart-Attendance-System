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
};
