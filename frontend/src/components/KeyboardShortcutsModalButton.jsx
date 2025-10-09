import React, { useEffect } from "react";
import { useModal } from "../context/ModalContext";
import { Keyboard } from "lucide-react";
import KeyboardShortcutsModalContent from "./KeyboardShortcutsModalContent";

const KeyboardShortcutsModalButton = ({ isCollapsed }) => {
  const { openModal } = useModal();
  
  const handleOpenModal = () => {
    openModal(<KeyboardShortcutsModalContent />, "Keyboard Shortcuts", {
      width: "lg",
      height: "auto",
    });
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + / to open shortcuts modal
      if ((e.ctrlKey || e.metaKey) && e.key === '/' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        handleOpenModal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="group flex items-center rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 p-3 w-full cursor-pointer"
      >
        <div className="flex-shrink-0 w-6 flex justify-center">
          <Keyboard
            size={20}
            strokeWidth={2}
            className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200"
          />
        </div>
        <div
          className={`flex-1 flex items-center justify-between ml-3 overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? "max-w-0 opacity-0" : "max-w-xs opacity-100"
          }`}
        >
          <span className="font-medium text-sm whitespace-nowrap">
            Shortcuts
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 border border-gray-300 rounded text-gray-600">
            CTRL + /
          </kbd>
        </div>
      </button>
    </>
  );
};

export default KeyboardShortcutsModalButton;