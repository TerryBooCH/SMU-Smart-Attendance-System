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

  searchStudentsByName: async (name) => {
    try {
      const response = await apiClient.get("/api/students", {
        params: { name },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error searching students:", error);
      throw error;
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await apiClient.post("/api/students", studentData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error creating student";
      const statusCode = error.response?.status || 500;
      const field = errorData.field;

      console.error(`Error creating student (${statusCode}):`, errorMessage);

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      customError.field = field;
      throw customError;
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
      const response = await apiClient.put(
        `/api/students/${studentId}`,
        studentData
      );
      console.log(response);
      return response;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error updating student";
      const statusCode = error.response?.status || 500;

      console.error(`Error updating student (${statusCode}):`, errorMessage);

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

  getStudentByStudentId: async (studentId) => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting student:", error);
      throw error;
    }
  },

  uploadStudentFaceData: async (studentId, files) => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("file", file);
      });

      const response = await apiClient.post(
        `/api/students/${studentId}/faces`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Face data upload response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error uploading face data:", error);
      throw error;
    }
  },

  getFaceDataByStudentId: async (studentId) => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/faces`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting face data:", error);
      throw error;
    }
  },

  deleteStudentFaceDataByFaceId: async (studentId, faceId) => {
    try {
      const response = await apiClient.delete(
        `/api/students/${studentId}/faces/${faceId}`
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error deleting face data:", error);
      throw error;
    }
  },

  importStudentsFromCsv: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/api/import/students", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Import result:", response.data);
      return response.data;
    } catch (error) {
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error importing students";

      const statusCode = error.response?.status || 500;

      console.error(`Error importing students (${statusCode}):`, errorMessage);

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },

  // Inside studentService
  getStudentAttendanceSummary: async (studentId) => {
    try {
      const response = await apiClient.get(
        `/api/reports/student/${studentId}/summary`
      );
      console.log("Fetched student attendance summary:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching student attendance summary:", error);
      const errorData = error.response?.data || {};
      const errorMessage =
        errorData.message ||
        errorData.error ||
        error.message ||
        "Error fetching student attendance summary";
      const statusCode = error.response?.status || 500;

      const customError = new Error(errorMessage);
      customError.statusCode = statusCode;
      throw customError;
    }
  },
};
