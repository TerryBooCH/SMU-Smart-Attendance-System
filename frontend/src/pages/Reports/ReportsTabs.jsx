import React from "react";

const ReportsTabs = ({ activeTab, onChange }) => {
  const tabs = [
    { id: "sessions", label: "Sessions" },
    { id: "students", label: "Students" },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="mx-6 pt-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative px-6 py-3 text-sm font-semibold transition-all duration-200 rounded-t-lg cursor-pointer ${
                activeTab === tab.id
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsTabs;
