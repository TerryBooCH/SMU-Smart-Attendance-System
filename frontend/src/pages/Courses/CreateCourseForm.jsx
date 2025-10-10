import React, { useState } from "react";
import { validateCreateCourseForm } from "../../utils/validateForm";
import { useModal } from "../../context/ModalContext";
import { useToast } from "../../hooks/useToast";
import useCourse from "../../hooks/useCourse";
import { CircleAlert } from "lucide-react";

const CreateCourseForm = () => {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const { createCourse } = useCourse();
  const [formValues, setFormValues] = useState({
    code: "",
    title: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Trim all form values
    const trimmedValues = {
      code: formValues.code.trim(),
      title: formValues.title.trim(),
    };

    const errors = validateCreateCourseForm(trimmedValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        await createCourse(trimmedValues);
        success("Course created successfully");
        closeModal();
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormErrors({
          submit: error.message || "Failed to create course",
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
          <div className="w-full mb-4">
            <label
              htmlFor="code"
              className="block mb-2 text-sm text-gray-900 font-lexend"
            >
              Course Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formValues.code}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.code ? "border-red-500" : "border-[#cecece]"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="e.g., CS104"
            />
            {formErrors.code && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.code}
              </p>
            )}
          </div>

          <div className="w-full">
            <label
              htmlFor="title"
              className="block mb-2 text-sm text-gray-900 font-lexend"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.title ? "border-red-500" : "border-[#cecece]"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter course title"
            />
            {formErrors.title && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.title}
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
              disabled={
                isSubmitting ||
                !formValues.code.trim() ||
                !formValues.title.trim()
              }
              className="px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 
                      font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;
