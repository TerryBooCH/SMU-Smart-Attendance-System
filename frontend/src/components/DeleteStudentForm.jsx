import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useStudent from "../hooks/useStudent";
import { useModal } from "../hooks/useModal";
import { useToast } from "../hooks/useToast";

const DeleteStudentForm = ({ student }) => {
  const { deleteStudentByStudentId } = useStudent();
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteStudentByStudentId(student.studentId);

      if (response.status === 200) {
        success(`"${student.name}" successfully deleted`);
        closeModal();

        // Only redirect if user is on /student/:id page
        if (location.pathname === `/student/${student.studentId}`) {
          navigate("/students");
        }
      } else {
        error(
          `Failed to delete student: ${response.data?.error || "Unknown error"}`
        );
      }
    } catch (err) {
      console.error("Error deleting student:", err);
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
            Delete Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteStudentForm;
