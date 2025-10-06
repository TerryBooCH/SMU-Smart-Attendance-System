import React, { createContext, useState, useContext } from "react";
import { studentService } from "../api/studentService";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.getAllStudents();

      setStudents(response || []);
    console.log(response);
      return response;
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error.message || "Failed to fetch students");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    students,
    loading,
    error,
    setStudents,
    fetchAllStudents,
  };
  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};

export default StudentContext;
