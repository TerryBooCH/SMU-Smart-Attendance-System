import React from "react";
import { useModal } from "../../hooks/useModal";
import { useToast } from "../../hooks/useToast";
import useStudent from "../../hooks/useStudent";

const DeleteFaceDataForm = ({ faceData, student }) => {
  const { deleteStudentFaceDataByFaceId } = useStudent();
  const { closeModal } = useModal();
  const { success, error } = useToast();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteStudentFaceDataByFaceId(
        student.studentId,
        faceData.id
      );

      if (response.status === 200) {
        success("Face data successfully deleted");
        closeModal();
      } else {
        error(
          `Failed to delete face data: ${
            response.data?.error || "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error("Error deleting face data:", err);
      error(`Failed to delete face data: ${err.message || "Unknown error"}`);
      closeModal();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Full-size Image */}
      <div className="w-full max-w-md aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-md">
        <img
          src={faceData.imageBase64}
          alt={`Face of ${student.name}`}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Warning & Details */}
      <form className="w-full max-w-md" onSubmit={handleDelete}>
        <div className="mb-5">
          <p className="text-sm font-lexend text-[#6E6E76]">
            You are about to <strong>permanently delete</strong> this face data
            of <span className="font-semibold">{student.name}</span>.
          </p>
          <p className="text-sm font-lexend text-red-600 mt-2">
            Warning: This action <strong>cannot be undone</strong>.
          </p>
        </div>

        {/* Buttons */}
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
            Delete Face
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteFaceDataForm;
