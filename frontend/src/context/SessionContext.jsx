import React, { createContext, useState, useContext } from "react";
import { sessionService } from "../api/sessionService";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const value = {};
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};


export default SessionContext;
