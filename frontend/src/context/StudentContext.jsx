import React, { createContext, useState, useContext } from "react";
import { studentService } from "../api/studentService";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null); // Add this
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

  // Add this new function
  const fetchStudentById = async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.getStudentByStudentId(studentId);
      setSelectedStudent(response);
      return response;
    } catch (error) {
      console.error("Error fetching student:", error);
      setError(error.message || "Failed to fetch student");
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
      setStudents((prev) => [...prev, newStudent]);

      return response;
    } catch (error) {
      console.error("Error creating student:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudentByStudentId = async (studentId, studentData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.updateStudentByStudentId(
        studentId,
        studentData
      );

      const updatedStudent = response.data || response.student || response;

      setStudents((prev) =>
        prev.map((student) => {
          const currentStudentId = student.studentId || student.student_id;
          return currentStudentId === studentId ? updatedStudent : student;
        })
      );

      // Update selectedStudent if it's the one being updated
      if (selectedStudent && 
          (selectedStudent.studentId === studentId || 
           selectedStudent.student_id === studentId)) {
        setSelectedStudent(updatedStudent);
      }

      return response;
    } catch (error) {
      console.error("Error updating student:", error);
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

      setStudents((prev) =>
        prev.filter(
          (student) =>
            student.studentId !== studentId && student.student_id !== studentId
        )
      );

      // Clear selectedStudent if it was deleted
      if (selectedStudent && 
          (selectedStudent.studentId === studentId || 
           selectedStudent.student_id === studentId)) {
        setSelectedStudent(null);
      }

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
    selectedStudent,
    loading,
    error,
    setStudents,
    setSelectedStudent,
    fetchAllStudents,
    fetchStudentById, // Add this
    deleteStudentByStudentId,
    updateStudentByStudentId,
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