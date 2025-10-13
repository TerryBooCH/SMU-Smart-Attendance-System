import React, { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../api/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const value = {};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;