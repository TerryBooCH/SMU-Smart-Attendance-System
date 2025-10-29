import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import DropdownMenu from "./DropdownMenu";

const Dropdown = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  error = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const portalRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.value.toString().includes(searchTerm)
  );

  // Update position when opening or on scroll/resize
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const updatePosition = () => {
        const rect = dropdownRef.current.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom,
          left: rect.left,
          width: rect.width,
        });
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        portalRef.current &&
        !portalRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);

    // If user types a valid number, update the value
    const numericValue = parseInt(inputValue);
    if (!isNaN(numericValue) && inputValue.trim() !== "") {
      onChange({ target: { name, value: numericValue } });
    }
  };

  const handleSelect = (optionValue) => {
    if (!disabled) {
      onChange({ target: { name, value: optionValue } });
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const displayValue = selectedOption 
    ? selectedOption.label 
    : (searchTerm || (value ? value.toString() : ""));

  return (
    <div>
      <div className="relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          id={name}
          value={isOpen ? searchTerm : displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          placeholder={placeholder}
          className={`font-lexend bg-white border text-sm rounded-md 
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            w-full p-2.5
            ${error ? "border-red-500" : "border-gray-300"}
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
            ${!selectedOption && !searchTerm && !value ? "text-gray-500" : "text-gray-900"}`}
        />
        <div 
          className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 text-gray-400 ${
              isOpen ? "transform rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen &&
        !disabled &&
        createPortal(
          <DropdownMenu
            options={filteredOptions}
            value={value}
            onSelect={handleSelect}
            menuPosition={menuPosition}
            portalRef={portalRef}
          />,
          document.body
        )}

      {error && <p className="mt-2 text-sm text-red-600 font-lexend">{error}</p>}
    </div>
  );
};

export default Dropdown;