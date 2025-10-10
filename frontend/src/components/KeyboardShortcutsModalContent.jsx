import React from "react";
import { Command, KeyRound, PanelLeft, Settings } from "lucide-react";

const KeyboardShortcutsModalContent = () => {
  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["Ctrl", "1"], label: "Go to Home" },
        { keys: ["Ctrl", "2"], label: "Go to Sessions" },
        { keys: ["Ctrl", "3"], label: "Go to Courses" },
        { keys: ["Ctrl", "4"], label: "Go to Live Recognition" },
        { keys: ["Ctrl", "5"], label: "Go to Students" },
        { keys: ["Ctrl", "6"], label: "Go to Reports" },
      ],
    },
    {
      category: "System",
      items: [
        { keys: ["Ctrl", "B"], label: "Toggle Sidebar" },
        { keys: ["Ctrl", ","], label: "Open Settings" },
      ],
    },
    {
      category: "General",
      items: [
        { keys: ["Esc"], label: "Close Modal / Cancel Action" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {shortcuts.map((section, idx) => (
        <div key={idx}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {section.category}
          </h3>
          <div className="space-y-2">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors duration-150"
              >
                <span className="text-sm text-gray-800">{item.label}</span>
                <div className="flex items-center gap-1">
                  {item.keys.map((key, k) => (
                    <kbd
                      key={k}
                      className="px-2 py-1 text-xs font-semibold bg-white border border-gray-300 rounded shadow-sm text-gray-700"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 border-t border-gray-200 pt-4 flex items-center gap-2 text-gray-500 text-xs">
        <Command size={14} />
        <span>Use Ctrl or ⌘ on macOS</span>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModalContent;
