import React from "react";
import useRoster from "../../hooks/useRoster";
import { useModal } from "../../hooks/useModal";
import { useToast } from "../../hooks/useToast";

const RemoveStudentFromRosterForm = ({ student, roster }) => {
  const { removeStudentFromRoster } = useRoster();
  const { closeModal } = useModal();
  const { success, error } = useToast();

  const handleRemove = async (e) => {
    e.preventDefault();

    try {
      const response = await removeStudentFromRoster(roster.id, student.studentId);

      success(
        `"${student.name}" has been removed from roster "${roster.name}".`
      );
      closeModal();
      return response;
    } catch (err) {
      console.error("Error removing student from roster:", err);
      error(`Failed to remove student: ${err.message || "Unknown error"}`);
      closeModal();
    }
  };

  return (
    <div>
      <form className="w-full" onSubmit={handleRemove}>
        <div className="mb-5">
          <p className="text-sm font-lexend text-[#6E6E76]">
            You are about to <strong>remove</strong>{" "}
            <span className="font-semibold">{student.name}</span> (
            {student.studentId}) from the roster{" "}
            <span className="font-semibold">"{roster.name}"</span>.
          </p>
          <p className="text-sm font-lexend text-red-600 mt-2">
            This will <strong>only remove</strong> the student from this roster —
            the student record will <strong>not be deleted</strong> from the
            system.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer
                      hover:bg-gray-100 active:scale-[0.98] 
                      transition-all duration-200 disabled:opacity-50 
                      disabled:cursor-not-allowed font-medium"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 
                      font-medium transition-all duration-200  bg-red-500 hover:bg-red-700 active:scale-[0.98] cursor-pointer"
          >
            Remove from Roster
          </button>
        </div>
      </form>
    </div>
  );
};

export default RemoveStudentFromRosterForm;
