import React, { useState } from 'react';
import { validateAddStudentToRosterForm } from '../../utils/validateForm';
import useRoster from '../../hooks/useRoster';
import { useModal } from "../../context/ModalContext";
import { useToast } from "../../hooks/useToast";
import { CircleAlert } from "lucide-react";

const AddStudentToRosterForm = ({ roster }) => {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const [formValues, setFormValues] = useState({
    studentId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addStudentToRoster } = useRoster();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValues = {
      ...formValues,
      [name]: value,
    };

    setFormValues(updatedValues);

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedValues = {
      studentId: formValues.studentId.trim(),
    };

    const errors = validateAddStudentToRosterForm(trimmedValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        await addStudentToRoster(roster.id, trimmedValues.studentId);
        
        
        success(`Student added to ${roster.name} successfully`);
        closeModal();
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormErrors({
          studentId: error.message || "Failed to add student to roster",
          submit: error.message || "Failed to add student to roster",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <form className="w-full" onSubmit={handleSubmit}>
        {formErrors.submit && (
          <div className="mb-5 border-red-400 bg-red-50 border rounded-md p-4 flex items-center justify-center py-6 gap-3">
            <CircleAlert size={20} color="red" strokeWidth={1.4} />
            <p className="text-sm text-red-600 font-lexend">
              {formErrors.submit}
            </p>
          </div>
        )}

        <div className="mb-5">
          <div className="w-full">
            <label
              htmlFor="studentId"
              className="block mb-2 text-sm text-gray-900 font-lexend"
            >
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formValues.studentId}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.studentId ? "border-red-500" : "border-[#cecece]"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="e.g., S1234567"
            />
            {formErrors.studentId && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.studentId}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer
                      hover:bg-gray-100 active:scale-[0.98] 
                      transition-all duration-200 disabled:opacity-50 
                      disabled:cursor-not-allowed font-medium"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formValues.studentId.trim()}
              className="px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 
                      font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add Student"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudentToRosterForm;