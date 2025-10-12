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
      const response = await apiClient.put(
        `/api/students/${studentId}`,
        studentData
      );
      console.log(response);
      return response;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
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
};
