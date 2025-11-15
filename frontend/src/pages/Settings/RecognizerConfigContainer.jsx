import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Tooltip from "../../components/ToolTip";
import { useToast } from "../../hooks/useToast";
import { useConfigStore } from "../../store/configStore";
import RecognizerModalButton from "./RecognizerModalButton";

const RecognizerConfigContainer = () => {
  const { detector, recognizer, updateRecognizer, loading } = useConfigStore();
  const { success, error } = useToast();

  const [localRecognizer, setLocalRecognizer] = useState(recognizer);
  const [initialRecognizer, setInitialRecognizer] = useState(recognizer);
  const [saving, setSaving] = useState(false);

  const recognizerOptions = ["eigen", "hist", "neuralnet"];
  const histOnly = detector === "haar" || detector === "lbp";

  useEffect(() => {
    if (histOnly) {
      setLocalRecognizer("hist");
      setInitialRecognizer("hist");
    } else {
      setLocalRecognizer(recognizer);
      setInitialRecognizer(recognizer);
    }
  }, [recognizer, detector]);

  const handleReset = () => setLocalRecognizer(initialRecognizer);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    try {
      setSaving(true);
      const updated = await updateRecognizer(localRecognizer);

      success(
        `Recognizer updated to '${updated.defaultRecognizer}' (Detector: ${updated.defaultDetector})`
      );

      setInitialRecognizer(updated.defaultRecognizer);
      setLocalRecognizer(updated.defaultRecognizer);
    } catch (err) {
      error(err?.response?.data?.error || "Failed to update recognizer");
    } finally {
      setSaving(false);
    }
  };

  const isChanged = localRecognizer !== initialRecognizer;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">

        {/* Header with Left Button */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center gap-3">

          <RecognizerModalButton />
          

          <h2 className="font-semibold text-lg text-gray-800">
            Face Recognition Model
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">

            {/* Description */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-600">
                  Default Recognizer
                </label>

                <Tooltip
                  content="Haar & LBP detectors force HIST recognizer."
                  position="right"
                >
                  <Info size={16} />
                </Tooltip>
              </div>

              <p className="text-sm text-gray-600">
                Available: <strong>eigen</strong>, <strong>hist</strong>, <strong>neuralnet</strong>.
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Recommended: <strong>NeuralNet</strong>
              </p>

              {histOnly && (
                <p className="text-xs mt-1 text-red-500 font-medium">
                  Detector {detector.toUpperCase()} requires HIST recognizer.
                </p>
              )}
            </div>

            {/* Dropdown */}
            <div className="w-full md:w-60">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <select
                  value={localRecognizer}
                  disabled={histOnly}
                  onChange={(e) => setLocalRecognizer(e.target.value)}
                  className={`border border-gray-300 rounded-md px-3 py-2 w-full text-sm 
                    ${histOnly ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {recognizerOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.toUpperCase()}
                    </option>
                  ))}
                </select>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isChanged || saving}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-xl disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={!isChanged || saving}
              className="px-4 py-2 text-sm bg-black text-white rounded-xl disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RecognizerConfigContainer;
