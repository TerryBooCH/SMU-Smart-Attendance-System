import React, { createContext, useState } from "react";
import { rosterService } from "../api/rosterService";

const RosterContext = createContext();

export const RosterProvider = ({ children }) => {
  const [rosters, setRosters] = useState([]);
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

  const value = {
    rosters,
    loading,
    error,
    setRosters,
    fetchAllRosters,
    createRoster,
  };

  return (
    <RosterContext.Provider value={value}>
      {children}
    </RosterContext.Provider>
  );
};

export default RosterContext;