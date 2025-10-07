import { useEffect, useRef } from "react";
import { useModal } from "../hooks/useModal";
import { X } from "lucide-react";

const Modal = () => {
  const { isOpen, modalContent, modalTitle, closeModal, modalSize } =
    useModal();
  const modalRef = useRef();

  // Handle clicking outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    // Handle ESC key to close modal
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
      // Prevent scrolling of background content
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  // Size options handling
  const sizeClasses = () => {
    // Default size if not specified
    if (!modalSize) {
      return "w-full max-w-md sm:max-w-lg";
    }

    const { width, height } = modalSize;

    let widthClass = "w-full max-w-md sm:max-w-lg"; // Default width
    let heightClass = ""; // No specific height by default

    // Width options
    if (width === "sm") widthClass = "w-full max-w-sm";
    else if (width === "md") widthClass = "w-full max-w-md";
    else if (width === "lg") widthClass = "w-full max-w-lg";
    else if (width === "xl") widthClass = "w-full max-w-xl";
    else if (width === "2xl") widthClass = "w-full max-w-2xl";
    else if (width === "3xl") widthClass = "w-full max-w-3xl";
    else if (width === "4xl") widthClass = "w-full max-w-4xl";
    else if (width === "5xl") widthClass = "w-full max-w-5xl";
    else if (width === "full") widthClass = "w-full max-w-full mx-4 sm:mx-8";

    // Height options
    if (height === "auto")
      heightClass = "max-h-[90vh]"; // Limit auto height to 90% of viewport
    else if (height === "sm") heightClass = "h-64 max-h-[90vh]";
    else if (height === "md") heightClass = "h-96 max-h-[90vh]";
    else if (height === "lg") heightClass = "h-[32rem] max-h-[90vh]";
    else if (height === "xl") heightClass = "h-[40rem] max-h-[90vh]";
    else if (height === "2xl") heightClass = "h-[45rem] max-h-[90vh]";
    else if (height === "full")
      heightClass = "h-[90vh] max-h-[90vh] my-4 sm:my-8";

    return `${widthClass} ${heightClass}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 transition-opacity p-4 sm:p-6">
      <div
        ref={modalRef}
        className={`relative transform rounded-3xl  bg-[#FFFFFF] shadow-xl transition-all animate-modalPopIn flex flex-col min-h-0 ${sizeClasses()}`}
      >
        {/* Modal header */}
        <div className="flex-shrink-0 flex items-center justify-between pb-3 px-6 pt-6 text-[#000000] ">
          {modalTitle && (
            <h3 className="text-lg font-medium truncate pr-2 min-w-0">
              {modalTitle}
            </h3>
          )}
          <button
            onClick={closeModal}
            className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full  hover:bg-black/5 cursor-pointer"
          >
            <X
              className="text-[#000000] "
              height="20px"
              width="20px"
              strokeWidth={1.4}
            />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto transparent-scrollbar px-6 pb-6 pt-2 min-h-0">
          {modalContent}
        </div>
      </div>
    </div>
  );
};

export default Modal;
