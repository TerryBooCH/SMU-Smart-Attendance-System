import React from "react";

const FieldSelector = ({ fields, setFields, title = "Select fields to include" }) => {
  const toggleField = (key) => {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const labelMap = {
    rosterName: "Roster Name",
    startTime: "Start Time",
    endTime: "End Time",
    lateAfter: "Late After",
    method: "Method",
    confidence: "Confidence",
    timestamp: "Timestamp",
    arrivalOffset: "Arrival Offset",
    open: "Open",
  };

  return (
    <div>
      <h3 className="block mb-3 text-sm font-medium text-gray-900">{title}</h3>

      {/* Mandatory fields */}
      <div className="mb-3">
        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">
          Mandatory Fields
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {["Student ID", "Name", "Class", "Session ID", "Status"].map((label) => (
            <label
              key={label}
              className="flex items-center space-x-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                checked
                disabled
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div>
        <h4 className="text-xs font-semibold text-gray-600 uppercase mb-2">
          Optional Fields
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(fields)
            .filter(([key]) => key !== "status") // status always included, hidden from optional section
            .map(([key, value]) => (
              <label
                key={key}
                className="flex items-center space-x-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleField(key)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{labelMap[key]}</span>
              </label>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FieldSelector;
