import React, { createContext, useState } from "react";
import { courseService } from "../api/courseService";

const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await courseService.getAllCourses();
      setCourses(response || []);
      return response;
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError(error.message || "Failed to fetch courses");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    courses,
    loading,
    error,
    setCourses,
    fetchAllCourses,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export default CourseContext;