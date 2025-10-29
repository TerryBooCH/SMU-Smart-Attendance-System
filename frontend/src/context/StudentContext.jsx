import React, { createContext, useState, useContext } from "react";
import { studentService } from "../api/studentService";
import { fileToBase64 } from "../utils/fileUtils";

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentFaceData, setStudentFaceData] = useState([]);
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

  const searchStudentsByName = async (name) => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.searchStudentsByName(name);
      setStudents(response || []);
      return response;
    } catch (error) {
      console.error("Error searching students:", error);
      setError(error.message || "Failed to search students");
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
      if (
        selectedStudent &&
        (selectedStudent.studentId === studentId ||
          selectedStudent.student_id === studentId)
      ) {
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
      if (
        selectedStudent &&
        (selectedStudent.studentId === studentId ||
          selectedStudent.student_id === studentId)
      ) {
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

  const uploadStudentFaceData = async (studentId, files) => {
    try {
      setLoading(true);
      setError(null);

      // Upload the files
      const response = await studentService.uploadStudentFaceData(
        studentId,
        files
      );

      // Check for successful response
      if (response.status === "success" || response.status === 201) {
        console.log("Face data uploaded successfully:", response);

        const uploadedDataArray = Array.isArray(response.data)
          ? response.data
          : [response.data];

        // Create face data entries matching the GET response structure
        const newFaceDataArray = uploadedDataArray.map((uploadedData) => ({
          id: uploadedData.id,
          studentId: uploadedData.studentId,
          studentName: uploadedData.studentName,
          imageBase64: uploadedData.imageBase64,
          createdAt: uploadedData.createdAt,
        }));

        setStudentFaceData((prev) => [...prev, ...newFaceDataArray]);
      }

      return response;
    } catch (error) {
      console.error("Error uploading face data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getFaceDataByStudentId = async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.getFaceDataByStudentId(studentId);
      setStudentFaceData(response || []);
      console.log("Face data fetched successfully:", response);
      return response;
    } catch (error) {
      console.error("Error fetching face data:", error);
      setError(error.message || "Failed to fetch face data");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudentFaceDataByFaceId = async (studentId, faceId) => {
    try {
      setLoading(true);
      setError(null);

      await studentService.deleteStudentFaceDataByFaceId(studentId, faceId);

      // Remove the face data from local state
      setStudentFaceData((prev) =>
        prev.filter((faceData) => faceData.id !== faceId)
      );

      console.log("Face data deleted successfully");
      return { status: 200, message: "Face data deleted successfully" };
    } catch (error) {
      console.error("Error deleting face data:", error);
      setError(error.message || "Failed to delete face data");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const importStudentsFromCsv = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentService.importStudentsFromCsv(file);

      // Destructure response
      const { students: importedStudents = [] } = response;

      // Merge imported students into current list
      if (importedStudents.length > 0) {
        setStudents((prev) => [...prev, ...importedStudents]);
      }

      // Return full import result (so UI can show errors, counts, etc.)
      return response;
    } catch (error) {
      console.error("Error importing students:", error);
      setError(error.message || "Failed to import students");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    students,
    selectedStudent,
    studentFaceData,
    loading,
    error,
    setStudents,
    setSelectedStudent,
    setStudentFaceData,
    fetchAllStudents,
    searchStudentsByName,
    fetchStudentById,
    deleteStudentByStudentId,
    updateStudentByStudentId,
    createStudent,
    uploadStudentFaceData,
    getFaceDataByStudentId,
    deleteStudentFaceDataByFaceId,
    importStudentsFromCsv,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};

export default StudentContext;
