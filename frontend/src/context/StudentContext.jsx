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

  const deleteStudentByStudentId = async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.deleteStudentByStudentId(studentId);

      if (response.status == 200) {
        // Remove student locally after successful deletion
        setStudents((prevStudents) => {
          if (Array.isArray(prevStudents)) {
            return prevStudents.filter(
              (student) => student.studentId !== studentId
            );
          }
          // If students is an object, remove the key
          const { [studentId]: deleted, ...rest } = prevStudents;
          return rest;
        });
      }

      return response;
    } catch (error) {
      console.error("Error deleting student:", error);
      setError(error.message || "Failed to delete student");
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
    deleteStudentByStudentId,
  };
  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};

export default StudentContext;
