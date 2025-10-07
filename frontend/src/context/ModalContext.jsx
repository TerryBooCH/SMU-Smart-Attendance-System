import { createContext, useContext, useState, useCallback } from "react";

// Create modal context with modalSize added
const ModalContext = createContext({
  isOpen: false,
  modalContent: null,
  modalTitle: "",
  modalSize: null,
  openModal: () => {},
  closeModal: () => {},
});

// Modal provider component
export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [modalSize, setModalSize] = useState(null);

  // Open modal with content, optional title, and optional size
  const openModal = useCallback((content, title = "", size = null) => {
    setModalContent(content);
    setModalTitle(title);
    setModalSize(size);
    setIsOpen(true);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset content after animation completes
    setTimeout(() => {
      setModalContent(null);
      setModalTitle("");
      setModalSize(null);
    }, 300);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        modalContent,
        modalTitle,
        modalSize,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export default ModalContext;