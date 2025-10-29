import React, { createContext, useState } from "react";
import { sessionService } from "../api/sessionService";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all sessions
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

  // Fetch a specific session by ID
  const fetchSessionById = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await sessionService.getSessionById(sessionId);
      setSelectedSession(response);
      return response;
    } catch (error) {
      console.error("Error fetching session:", error);
      setError(error.message || "Failed to fetch session");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new session
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

  // Delete a session by ID
  const deleteSessionById = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      await sessionService.deleteSessionById(sessionId);

      // Remove deleted session from local state
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));

      // Clear selectedSession if it was deleted
      if (selectedSession && selectedSession.id === sessionId) {
        setSelectedSession(null);
      }

      return { status: 200, message: "Session deleted successfully" };
    } catch (error) {
      console.error("Error deleting session:", error);
      setError(error.message || "Failed to delete session");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Open a session
  const openSession = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      const updatedSession = await sessionService.openSession(sessionId);

      // Update local state
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? updatedSession : s))
      );

      if (selectedSession?.id === sessionId) {
        setSelectedSession(updatedSession);
      }

      return updatedSession;
    } catch (error) {
      console.error("Error opening session:", error);
      setError(error.message || "Failed to open session");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Close a session
  const closeSession = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);

      const updatedSession = await sessionService.closeSession(sessionId);

      // Update local state
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? updatedSession : s))
      );

      if (selectedSession?.id === sessionId) {
        setSelectedSession(updatedSession);
      }

      return updatedSession;
    } catch (error) {
      console.error("Error closing session:", error);
      setError(error.message || "Failed to close session");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    sessions,
    selectedSession,
    loading,
    error,
    setSessions,
    setSelectedSession,
    fetchAllSessions,
    fetchSessionById,
    createSession,
    deleteSessionById,
    openSession, // ✅ newly added
    closeSession, // ✅ newly added
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export default SessionContext;
