import { createContext, useState, useCallback, useEffect } from "react";

// Create the context
const ToastContext = createContext(undefined);

// Toast types
export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
  WARNING: "warning",
};

// Default timeout duration for toasts
const DEFAULT_TIMEOUT = 3000;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Function to add a new toast
  const showToast = useCallback((message, type = TOAST_TYPES.INFO, timeout = DEFAULT_TIMEOUT) => {
    const id = Date.now().toString();
    
    // Add the new toast to the list
    setToasts((prevToasts) => [{ id, message, type, createdAt: Date.now() }, ...prevToasts]);
    
    // Remove the toast after the specified timeout
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, timeout);
    
    return id;
  }, []);

  // Helper functions for different toast types
  const success = useCallback((message, timeout) => 
    showToast(message, TOAST_TYPES.SUCCESS, timeout), [showToast]);
  
  const error = useCallback((message, timeout) => 
    showToast(message, TOAST_TYPES.ERROR, timeout), [showToast]);
  
  const info = useCallback((message, timeout) => 
    showToast(message, TOAST_TYPES.INFO, timeout), [showToast]);
  
  const warning = useCallback((message, timeout) => 
    showToast(message, TOAST_TYPES.WARNING, timeout), [showToast]);

  // Function to dismiss a toast
  const dismissToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Function to dismiss all toasts
  const dismissAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const contextValue = {
    toasts,
    showToast,
    success,
    error,
    info,
    warning,
    dismissToast,
    dismissAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;