import React, { createContext, useState, useContext } from "react";
import { studentService } from "../api/studentService";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.getAllStudents();
      setStudents(response || []);
      return response;
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error.message || "Failed to fetch students");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.createStudent(studentData);
      
      const newStudent = response.data || response.student || response;
      
      // Add new student to local state 
      setStudents((prev) => [...prev, newStudent]);

      return response;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudentByStudentId = async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      await studentService.deleteStudentByStudentId(studentId);

      // Remove student from local state 
      setStudents((prev) => 
        prev.filter((student) => 
          student.studentId !== studentId && 
          student.student_id !== studentId
        )
      );

      return { status: 200, message: "Student deleted successfully" };
    } catch (error) {
      console.error("Error deleting student:", error);
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
    createStudent,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudents must be used within StudentProvider");
  }
  return context;
};

export default StudentContext;