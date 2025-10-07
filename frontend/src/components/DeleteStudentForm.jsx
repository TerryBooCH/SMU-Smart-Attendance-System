import React from "react";
import useStudent from "../hooks/useStudent";
import { useModal } from "../hooks/useModal";
import { useToast } from "../hooks/useToast";

const DeleteStudentForm = ({ student, onDelete }) => {
  const { deleteStudentByStudentId } = useStudent();
  const { closeModal } = useModal();
  const { success, error } = useToast();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteStudentByStudentId(student.studentId);

      if (response.status === 200) {
        success(`"${student.name}" successfully deleted`);
      } else {
        // Add error toast notification
        error(
          `Failed to delete student: ${response.data?.error || "Unknown error"}`
        );
      }

      closeModal();
    } catch (err) {
      console.error("Error deleting student:", err);
      // Add error toast notification
      error(`Failed to delete student: ${err.message || "Unknown error"}`);
      closeModal();
    }
  };

  return (
    <div>
      <form className="w-full" onSubmit={handleDelete}>
        <div className="mb-5">
          <p className="text-sm font-lexend text-[#6E6E76]">
            You are about to <strong>permanently delete</strong>{" "}
            <span className="font-semibold">{student.name}</span> (
            {student.studentId}).
          </p>
          <p className="text-sm font-lexend text-red-600 mt-2">
            Warning: This will remove all records associated with this student.
            This action <strong>cannot be undone</strong>.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="border border-black text-black text-medium px-3 py-2 rounded-lg font-lexend cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="text-white bg-red-600 hover:bg-red-700 text-medium px-3 py-2 rounded-lg font-lexend cursor-pointer"
          >
            Delete Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteStudentForm;
