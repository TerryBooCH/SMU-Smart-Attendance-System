import apiClient from "./axios";

export const courseService = {
  getAllCourses: async () => {
    try {
      const response = await apiClient.get("/api/courses");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error getting courses:", error);
      throw error;
    }
  },

  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post("/api/courses", courseData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },
};
