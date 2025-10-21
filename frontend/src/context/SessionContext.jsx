import React, { createContext, useState } from "react";
import { sessionService } from "../api/sessionService";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await sessionService.getAllSessions();
      setSessions(response || []);
      return response;
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError(error.message || "Failed to fetch sessions");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await sessionService.createSession(sessionData);
      const newSession = response.data || response.session || response;
      setSessions((prev) => [...prev, newSession]);

      return newSession;
    } catch (error) {
      console.error("Error creating session:", error);
      setError(error.message || "Failed to create session");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    sessions,
    loading,
    error,
    setSessions,
    fetchAllSessions,
    createSession,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default SessionContext;
