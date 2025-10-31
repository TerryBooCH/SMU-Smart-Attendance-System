import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import useToast from "../hooks/useToast";
import useAttendance from "../hooks/useAttendance";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronDown,
  Hourglass,
} from "lucide-react";

const UpdateStatusButton = ({ record }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const { success, error } = useToast();
  const { updateAttendanceStatus } = useAttendance();

  // Status options (excluding PENDING)
  const statusOptions = [
    {
      value: "PRESENT",
      icon: CheckCircle,
      badgeBg: "bg-emerald-100",
      textColor: "text-emerald-700",
      hoverBg: "hover:bg-emerald-50",
      label: "Present",
    },
    {
      value: "LATE",
      icon: Clock,
      badgeBg: "bg-amber-100",
      textColor: "text-amber-700",
      hoverBg: "hover:bg-amber-50",
      label: "Late",
    },
    {
      value: "ABSENT",
      icon: XCircle,
      badgeBg: "bg-red-100",
      textColor: "text-red-700",
      hoverBg: "hover:bg-red-50",
      label: "Absent",
    },
  ];

  const getStatusConfig = (status) => {
    const config = statusOptions.find((opt) => opt.value === status);
    if (config) return config;

    if (status === "PENDING") {
      return {
        value: "PENDING",
        icon: Hourglass,
        badgeBg: "bg-blue-100",
        textColor: "text-blue-700",
        hoverBg: "hover:bg-blue-50",
        label: "Pending",
      };
    }

    return {
      value: status,
      icon: AlertCircle,
      badgeBg: "bg-gray-100",
      textColor: "text-gray-700",
      hoverBg: "hover:bg-gray-50",
      label: status || "Unknown",
    };
  };

  const statusConfig = getStatusConfig(record?.status);
  const StatusIcon = statusConfig.icon;

  // Position dropdown correctly
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 160; // w-40 = 10rem = 160px
      const dropdownHeight = 120; // Approx height

      let top = rect.bottom + window.scrollY + 4;
      let left = rect.left + window.scrollX;

      if (left + dropdownWidth > window.innerWidth) {
        left = rect.right + window.scrollX - dropdownWidth;
      }
      if (rect.bottom + dropdownHeight > window.innerHeight) {
        top = rect.top + window.scrollY - dropdownHeight - 4;
      }

      setDropdownPosition({ top, left });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle selecting a new status
  const handleStatusSelect = async (newStatus) => {
    setIsOpen(false);
    if (!record?.sessionId || !record?.studentStudentId) {
      error("Invalid attendance record — missing IDs");
      return;
    }

    try {
      await updateAttendanceStatus(
        record.sessionId,
        record.studentStudentId,
        newStatus,
        "MANUAL"
      );
      success(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating status:", err);
      error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change status"
        className={`cursor-pointer inline-flex items-center gap-2 ${statusConfig.badgeBg} ${statusConfig.textColor} border border-gray-200 px-3 py-1 rounded-md text-sm font-medium transition-colors hover:opacity-90`}
      >
        <StatusIcon className="w-4 h-4" />
        {statusConfig.label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="py-1">
              {statusOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStatusSelect(option.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${option.textColor} ${option.hoverBg} transition-colors text-left cursor-pointer`}
                  >
                    <OptionIcon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default UpdateStatusButton;
