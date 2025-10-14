import React, { useEffect } from "react";
import { TOAST_TYPES } from "../context/ToastContext";
import useToast from "../hooks/useToast";

const ToastContainer = () => {
  const { toasts, dismissToast } = useToast();

  useEffect(() => {
    const timers = toasts.map((toast) => {
      const dismissTimer = setTimeout(() => {
        dismissToast(toast.id);
      }, 8000);
      return dismissTimer;
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, dismissToast]);

  const getToastIcon = (type) => {
    const iconClasses = "w-5 h-5";

    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
            <svg
              className={iconClasses}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      case TOAST_TYPES.ERROR:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600">
            <svg
              className={iconClasses}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        );
      case TOAST_TYPES.WARNING:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-600">
            <svg
              className={iconClasses}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
            <svg
              className={iconClasses}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  if (toasts.length === 0) return null;

  return (
    <>
      <div className="fixed top-6 right-6 flex flex-col items-end gap-3 z-50 pointer-events-none px-5">
        {toasts.map((toast) => {
          const toastStyles = {
            [TOAST_TYPES.SUCCESS]:
              "border border-green-200 bg-white/70 text-gray-900",
            [TOAST_TYPES.ERROR]:
              "border border-red-200 bg-white/70 text-gray-900",
            [TOAST_TYPES.WARNING]:
              "border border-yellow-200 bg-white/70 text-gray-900",
            [TOAST_TYPES.INFO]:
              "border border-blue-200 bg-white/70 text-gray-900",
          };

          return (
            <div
              key={toast.id}
              className={`toast-modern relative w-full max-w-sm flex items-center gap-4 p-4 rounded-2xl shadow-lg ${
                toastStyles[toast.type]
              } pointer-events-auto`}
              role="alert"
            >
              {getToastIcon(toast.type)}

              <div className="flex-1">
                <p className="font-medium text-sm leading-snug">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="p-2 rounded-full hover:bg-gray-200/60 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ToastContainer;
