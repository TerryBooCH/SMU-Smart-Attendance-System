import React from "react";

const DropdownMenu = ({ options, value, onSelect, menuPosition, portalRef }) => {
  return (
    <div
      ref={portalRef}
      style={{
        position: "fixed",
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        width: `${menuPosition.width}px`,
        zIndex: 9999,
      }}
      className="dropdown-portal bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
    >
      {options.length === 0 ? (
        <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
      ) : (
        options.map((option) => (
          <div
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm
              ${value === option.value ? "bg-blue-100 font-medium" : ""}`}
          >
            {option.label}
          </div>
        ))
      )}
    </div>
  );
};

export default DropdownMenu;
