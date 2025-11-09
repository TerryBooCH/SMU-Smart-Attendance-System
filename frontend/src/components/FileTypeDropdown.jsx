import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FileSpreadsheet, FileText, FileDown, ChevronDown } from "lucide-react";

const FileTypeDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const dropdownRef = useRef(null);

  const options = [
    {
      value: "csv",
      label: "CSV (.csv)",
      icon: (
        <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
          <FileSpreadsheet size={14} className="text-green-600" />
        </div>
      ),
    },
    {
      value: "xlsx",
      label: "Excel (.xlsx)",
      icon: (
        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
          <FileSpreadsheet size={14} className="text-blue-600" />
        </div>
      ),
    },
    {
      value: "pdf",
      label: "PDF (.pdf)",
      icon: (
        <div className="w-6 h-6 rounded-md bg-red-100 flex items-center justify-center">
          <FileText size={14} className="text-red-600" />
        </div>
      ),
    },
  ];

  // Position the dropdown
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest(".dropdown-portal")
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white border border-gray-300 text-gray-900 text-sm rounded-md p-2.5 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center gap-2">
          {selected ? (
            selected.icon
          ) : (
            <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
              <FileDown size={14} className="text-gray-500" />
            </div>
          )}
          <span>{selected ? selected.label : "Choose format"}</span>
        </div>
        <ChevronDown size={16} />
      </button>

      {/* Dropdown menu */}
      {isOpen &&
        createPortal(
          <div
            className="dropdown-portal absolute z-[9999] bg-white border border-gray-200 rounded-md shadow-lg"
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer font-medium"
              >
                {option.icon}
                {option.label}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};

export default FileTypeDropdown;
