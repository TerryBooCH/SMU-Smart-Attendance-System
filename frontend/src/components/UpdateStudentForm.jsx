import React, { useState } from "react";
import { CircleAlert } from "lucide-react";
import { validateUpdateStudentForm } from "../utils/validateForm";
import { useModal } from "../context/ModalContext";
import { useToast } from "../hooks/useToast";
import useStudent from "../hooks/useStudent";

const UpdateStudentForm = ({ student }) => {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const { updateStudentByStudentId } = useStudent();

  const [formValues, setFormValues] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    className: student?.className || "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form has been modified
  const isFormChanged = () => {
    return (
      formValues.name !== (student?.name || "") ||
      formValues.email !== (student?.email || "") ||
      formValues.phone !== (student?.phone || "") ||
      formValues.className !== (student?.className || "")
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Always include all fields, even empty
    const trimmedValues = {
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim() || "",
      className: formValues.className.trim(),
    };

    const errors = validateUpdateStudentForm(trimmedValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        await updateStudentByStudentId(student.studentId, trimmedValues);
        success("Student updated successfully");
        closeModal();
      } catch (err) {
        if (err.statusCode === 409 || err.response?.statusCode === 409) {
          console.error("Error submitting form:", err);
          setFormErrors({
            email: err.message || "A student with this email already exists.",
            submit: err.message || "Failed to update student",
          });
        } else {
          console.error("Error submitting form:", err);
          setFormErrors({
            submit: err.message || "Failed to update student",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <form className="w-full" onSubmit={handleSubmit}>
        {/* Error banner */}
        {formErrors.submit && (
          <div className="mb-5 border-red-400 bg-red-50 border rounded-md p-4 flex items-center justify-center py-6 gap-3">
            <CircleAlert size={20} color="red" strokeWidth={1.4} />
            <p className="text-sm text-red-600 font-lexend">
              {formErrors.submit}
            </p>
          </div>
        )}

        <div className="mb-5">
          {/* Name */}
          <div className="w-full mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm text-gray-900 font-lexend"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`font-lexend bg-white border border-[#cecece] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter student name"
            />
            {formErrors.name && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.name}
              </p>
            )}
          </div>

          {/* Email (✅ now required) */}
          <div className="w-full mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm text-gray-900 font-lexend"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className={`font-lexend bg-white border border-[#cecece] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="student@example.com"
            />
            {formErrors.email && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.email}
              </p>
            )}
          </div>

          {/* Class */}
          <div className="w-full mb-4">
            <label
              htmlFor="className"
              className="block mb-2 text-sm text-gray-900 font-lexend"
            >
              Class
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={formValues.className}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              placeholder="e.g., AB123"
              className={`font-lexend bg-white border border-[#cecece] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.className ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {formErrors.className && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.className}
              </p>
            )}
          </div>

          {/* Phone (optional, but always included in payload) */}
          <div className="w-full">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm text-gray-900 font-lexend"
            >
              Phone <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formValues.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="12345678"
              className={`font-lexend bg-white border border-[#cecece] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.phone ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {formErrors.phone && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Footer buttons */}
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
                isSubmitting || !formValues.name.trim() || !isFormChanged()
              }
              className="px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 
                      font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudentForm;
