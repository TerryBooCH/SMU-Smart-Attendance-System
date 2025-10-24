import React, { useState, useEffect, useRef } from "react";
import { validateCreateSessionForm } from "../../utils/validateForm";
import useSession from "../../hooks/useSession";
import useRoster from "../../hooks/useRoster";
import { useModal } from "../../context/ModalContext";
import { useToast } from "../../hooks/useToast";
import { CircleAlert } from "lucide-react";

const CreateSessionForm = () => {
  const { createSession } = useSession();
  const { rosters, fetchAllRosters } = useRoster();
  const hasFetched = useRef(false);
  const { closeModal } = useModal();
  const { success, error } = useToast();

  const [formValues, setFormValues] = useState({
    courseName: "",
    rosterId: "",
    startAt: "",
    endAt: "",
    lateAfterMinutes: 10,
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      fetchAllRosters();
      hasFetched.current = true;
    }
  }, [fetchAllRosters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // Clear errors for this field when editing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateCreateSessionForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);

        const payload = {
          courseName: formValues.courseName.trim(),
          startAt: formValues.startAt,
          endAt: formValues.endAt,
          lateAfterMinutes: Number(formValues.lateAfterMinutes),
          isOpen: false,
          roster: { id: Number(formValues.rosterId) },
        };

        await createSession(payload);
        success("Session created successfully");
        closeModal();
      } catch (err) {
        console.error("Error creating session:", err);
        error("Failed to create session");
        setFormErrors({
          submit: err.message || "Failed to create session",
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

        {/* Course Name */}
        <div className="mb-5">
          <label
            htmlFor="courseName"
            className="block mb-2 text-sm text-gray-900 font-lexend"
          >
            Course Name
          </label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formValues.courseName}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="e.g., CS104"
            className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              formErrors.courseName ? "border-red-500" : "border-[#cecece]"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {formErrors.courseName && (
            <p className="mt-2 text-sm text-red-600 font-lexend">
              {formErrors.courseName}
            </p>
          )}
        </div>

        {/* Roster Selection */}
        <div className="mb-5">
          <label
            htmlFor="rosterId"
            className="block mb-2 text-sm text-gray-900 font-lexend"
          >
            Roster
          </label>
          <select
            id="rosterId"
            name="rosterId"
            value={formValues.rosterId}
            onChange={handleChange}
            disabled={isSubmitting || !rosters.length}
            className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              formErrors.rosterId ? "border-red-500" : "border-[#cecece]"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <option value="">Select a roster...</option>
            {rosters.map((roster) => (
              <option key={roster.id} value={roster.id}>
                {roster.name || `Roster ${roster.id}`}
              </option>
            ))}
          </select>
          {formErrors.rosterId && (
            <p className="mt-2 text-sm text-red-600 font-lexend">
              {formErrors.rosterId}
            </p>
          )}
        </div>

        {/* Start Time */}
        <div className="mb-5">
          <label
            htmlFor="startAt"
            className="block mb-2 text-sm text-gray-900 font-lexend"
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startAt"
            name="startAt"
            value={formValues.startAt}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              formErrors.startAt ? "border-red-500" : "border-[#cecece]"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {formErrors.startAt && (
            <p className="mt-2 text-sm text-red-600 font-lexend">
              {formErrors.startAt}
            </p>
          )}
        </div>

        {/* End Time */}
        <div className="mb-5">
          <label
            htmlFor="endAt"
            className="block mb-2 text-sm text-gray-900 font-lexend"
          >
            End Time
          </label>
          <input
            type="datetime-local"
            id="endAt"
            name="endAt"
            value={formValues.endAt}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              formErrors.endAt ? "border-red-500" : "border-[#cecece]"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {formErrors.endAt && (
            <p className="mt-2 text-sm text-red-600 font-lexend">
              {formErrors.endAt}
            </p>
          )}
        </div>

        {/* Late After Minutes */}
        <div className="mb-5">
          <label
            htmlFor="lateAfterMinutes"
            className="block mb-2 text-sm text-gray-900 font-lexend"
          >
            Late After (minutes)
          </label>
          <input
            type="number"
            id="lateAfterMinutes"
            name="lateAfterMinutes"
            min="0"
            value={formValues.lateAfterMinutes}
            onChange={handleChange}
            disabled={isSubmitting}
            className={`font-lexend bg-white border text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
              formErrors.lateAfterMinutes
                ? "border-red-500"
                : "border-[#cecece]"
            } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {formErrors.lateAfterMinutes && (
            <p className="mt-2 text-sm text-red-600 font-lexend">
              {formErrors.lateAfterMinutes}
            </p>
          )}
        </div>

        {/* Buttons */}
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
                !formValues.courseName.trim() ||
                !formValues.rosterId ||
                !formValues.startAt ||
                !formValues.endAt
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

export default CreateSessionForm;
