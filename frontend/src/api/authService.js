import apiClient from "./axios";

export const authService = {
  login: async (userData) => {
    try {
      const response = await apiClient.post("/api/users/login", userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error(
              "Invalid credentials. Please check your email and password."
            );
          default:
            throw new Error(
              error.response.data.message || "Login failed. Please try again."
            );
        }
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your internet connection."
        );
      } else {
        throw error;
      }
    }
  },
};
