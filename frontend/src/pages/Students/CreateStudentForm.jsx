import React, { useState } from "react";
import { validateCreateStudentForm } from "../../utils/validateForm";
import { useModal } from "../../context/ModalContext";
import { useToast } from "../../hooks/useToast";
import useStudent from "../../hooks/useStudent";
import { CircleAlert } from "lucide-react";

const CreateStudentForm = () => {
  const { closeModal } = useModal();
  const { success, error } = useToast();
  const { createStudent } = useStudent();
  const [formValues, setFormValues] = useState({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    className: "", 
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
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
      className: formValues.className.trim(), 
    };

    const errors = validateCreateStudentForm(trimmedValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        await createStudent(trimmedValues);
        success("Student created successfully");
        closeModal();
      } catch (err) {
        console.error("Error submitting form:", err);
        const errorMessage = err.message || "Failed to create student";

        if (err.statusCode === 409) {
          if (err.field === "email") {
            setFormErrors({
              email:
                "A student with this email already exists. Please use a different email.",
              submit: "A student with this email already exists.",
            });
          } else if (err.field === "studentId") {
            setFormErrors({
              studentId:
                "A student with this ID already exists. Please use a different Student ID.",
              submit: "A student with this ID already exists.",
            });
          }
        } else {
          setFormErrors({ submit: errorMessage });
        }
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
            <p className=" text-sm text-red-600 font-lexend">
              {formErrors.submit}
            </p>
          </div>
        )}

        <div className="mb-5">
          {/* Student ID */}
          <div className="w-full mb-4">
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
              className={`font-lexend bg-white border border-[#cecece] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.studentId ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="e.g., S12345"
            />
            {formErrors.studentId && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.studentId}
              </p>
            )}
          </div>

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

          {/* Email */}
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
              disabled={isSubmitting}
              className={`font-lexend bg-white border border-[#cecece] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.className ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="e.g., CS102"
            />
            {formErrors.className && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.className}
              </p>
            )}
          </div>

          {/* Phone */}
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
              className={`font-lexend bg-white border border-[#cecece] text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                formErrors.phone ? "border-red-500" : "border-gray-300"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="+65 1234 5678"
            />
            {formErrors.phone && (
              <p className="mt-2 text-sm text-red-600 font-lexend">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer
                      hover:bg-gray-100 active:scale-[0.98] 
                      transition-all duration-200 disabled:opacity-50 
                      disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !formValues.studentId.trim() ||
                !formValues.name.trim()
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

export default CreateStudentForm;
