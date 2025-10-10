import React, { useState, useRef, useEffect, useContext } from "react";
import { validateUpdateStudentForm } from "../../utils/validateForm";
import useStudent from "../../hooks/useStudent";
import { useToast } from "../../hooks/useToast";
import { CircleAlert } from "lucide-react";

const UpdateStudentDetailsForm = ({ student }) => {
  const { success, errror } = useToast();
  const { updateStudentByStudentId } = useStudent();
  const [formValues, setFormValues] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    setFormValues({
      name: student?.name || "",
      email: student?.email || "",
      phone: student?.phone || "",
    });
    setFormErrors({});
  };

  const isFormChanged = () => {
    return (
      formValues.name !== (student?.name || "") ||
      formValues.email !== (student?.email || "") ||
      formValues.phone !== (student?.phone || "")
    );
  };

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
      name: formValues.name.trim(),
      email: formValues.email.trim(),
      phone: formValues.phone.trim(),
    };

    const errors = validateUpdateStudentForm(trimmedValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        await updateStudentByStudentId(student.studentId, trimmedValues);
        success("Student updated successfully");
      } catch (error) {
        console.error("Error submitting form:", error);
        setFormErrors({
          submit: error.message || "Failed to update student",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece]">
          <h2 className="font-semibold text-lg text-gray-800">Profile</h2>
        </div>

        {/* Form */}
        <form className="w-full p-6 space-y-6" onSubmit={handleSubmit}>
          {/* Error banner */}
          {formErrors.submit && (
            <div className="border border-red-300 bg-red-50 rounded-xl p-4 flex items-center justify-center gap-3">
              <CircleAlert size={20} color="red" strokeWidth={1.4} />
              <p className="text-sm text-red-600 font-lexend">
                {formErrors.submit}
              </p>
            </div>
          )}

          {/* Input fields */}
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-700 font-lexend"
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
                  placeholder="Enter student name"
                  className={`font-lexend w-full px-4 py-2.5 border text-sm rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    formErrors.name ? "border-red-500" : "border-[#d4d4d4]"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-600 font-lexend">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 font-lexend"
                >
                  Email <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="student@example.com"
                  className={`font-lexend w-full px-4 py-2.5 border text-sm rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    formErrors.email ? "border-red-500" : "border-[#d4d4d4]"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600 font-lexend">
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-700 font-lexend"
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
                  placeholder="+65 1234 5678"
                  className={`font-lexend w-full px-4 py-2.5 border text-sm rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                    formErrors.phone ? "border-red-500" : "border-[#d4d4d4]"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                />
                {formErrors.phone && (
                  <p className="mt-2 text-sm text-red-600 font-lexend">
                    {formErrors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting || !isFormChanged()}
                className="text-gray-700 bg-white border border-gray-300 text-sm font-lexend px-4 py-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting || !formValues.name.trim() || !isFormChanged()
                }
                className="text-white bg-black text-sm font-lexend px-4 py-2 rounded-xl hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentDetailsForm;
