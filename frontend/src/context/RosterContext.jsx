import React, { createContext, useState } from "react";
import { rosterService } from "../api/rosterService";

const RosterContext = createContext();

export const RosterProvider = ({ children }) => {
  const [rosters, setRosters] = useState([]);
  const [selectedRoster, setSelectedRoster] = useState(null);
  const [studentsInRoster, setStudentsInRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllRosters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.getAllRosters();
      setRosters(response || []);
      return response;
    } catch (error) {
      console.error("Error fetching rosters:", error);
      setError(error.message || "Failed to fetch rosters");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchRosterById = async (rosterId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.getRosterById(rosterId);
      setSelectedRoster(response);
      return response;
    } catch (error) {
      console.error("Error fetching roster:", error);
      setError(error.message || "Failed to fetch roster");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsInRoster = async (rosterId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.getStudentsInRoster(rosterId);
      const students = response.data || response.students || response || [];
      setStudentsInRoster(students);
      return students;
    } catch (error) {
      console.error("Error fetching students in roster:", error);
      setError(error.message || "Failed to fetch students");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createRoster = async (rosterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.createRoster(rosterData);
      const newRoster = response.data || response.roster || response;
      setRosters((prev) => [...prev, newRoster]);

      return response;
    } catch (error) {
      console.error("Error creating roster:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRosterById = async (rosterId, rosterData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.updateRosterById(
        rosterId,
        rosterData
      );

      const updatedRoster = response.data || response.roster || response;

      setRosters((prev) =>
        prev.map((roster) => (roster.id === rosterId ? updatedRoster : roster))
      );

      if (selectedRoster && selectedRoster.id === rosterId) {
        setSelectedRoster(updatedRoster);
      }

      return response;
    } catch (error) {
      console.error("Error updating roster:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /*
  const deleteRosterById = async (rosterId) => {
    try {
      setLoading(true);
      setError(null);

      await rosterService.deleteRosterById(rosterId);

      setRosters((prev) => prev.filter((roster) => roster.id !== rosterId));

      if (selectedRoster && selectedRoster.id === rosterId) {
        setSelectedRoster(null);
      }

      if (selectedRoster && selectedRoster.id === rosterId) {
        setStudentsInRoster([]);
      }

      return { status: 200, message: "Roster deleted successfully" };
    } catch (error) {
      console.error("Error deleting roster:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  */

  const addStudentToRoster = async (rosterId, studentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.addStudentToRoster(
        rosterId,
        studentId
      );
      const addedStudent = response.data || response.student || response;

      setStudentsInRoster((prev) => [...prev, addedStudent]);

      return response;
    } catch (error) {
      console.error("Error adding student to roster:", error);
      setError(error.message || "Failed to add student to roster");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeStudentFromRoster = async (rosterId, studentId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.removeStudentFromRoster(
        rosterId,
        studentId
      );

      setStudentsInRoster((prev) =>
        prev.filter((student) => student.studentId !== studentId)
      );

      return response;
    } catch (error) {
      console.error("Error removing student from roster:", error);
      setError(error.message || "Failed to remove student from roster");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const importStudentsToRosterFromCsv = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const response = await rosterService.importStudentsToRosterFromCsv(file);
      const { rosters: importedRosters = [] } = response;

      if (importedRosters.length > 0) {
        setRosters((prev) => {
          const updated = [...prev];
          importedRosters.forEach((r) => {
            const index = updated.findIndex((x) => x.id === r.id);
            if (index !== -1) {
              updated[index] = { ...updated[index], ...r };
            } else {
              updated.push(r);
            }
          });
          return updated;
        });
      }

      return response;
    } catch (error) {
      console.error("Error importing students to roster:", error);
      setError(error.message || "Failed to import students to roster");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearStudentsInRoster = () => {
    setStudentsInRoster([]);
  };

  const value = {
    rosters,
    selectedRoster,
    studentsInRoster,
    loading,
    error,
    setRosters,
    setSelectedRoster,
    setStudentsInRoster,
    fetchAllRosters,
    fetchRosterById,
    fetchStudentsInRoster,
    createRoster,
    updateRosterById,
    // deleteRosterById, // commented out
    addStudentToRoster,
    removeStudentFromRoster,
    clearStudentsInRoster,
    importStudentsToRosterFromCsv,
  };

  return (
    <RosterContext.Provider value={value}>{children}</RosterContext.Provider>
  );
};

export default RosterContext;
