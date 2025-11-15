import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import Tooltip from "../../components/ToolTip";
import { useToast } from "../../hooks/useToast";
import { useConfigStore } from "../../store/configStore";
import DetectorModalButton from "./DetectorModalButton";

const DetectorConfigContainer = () => {
  const { detector, recognizer, updateDetector, loading } = useConfigStore();

  const [localDetector, setLocalDetector] = useState(detector);
  const [initialDetector, setInitialDetector] = useState(detector);
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();
  const detectorOptions = ["haar", "lbp", "yolo"];

  useEffect(() => {
    setLocalDetector(detector);
    setInitialDetector(detector);
  }, [detector]);

  const handleReset = () => setLocalDetector(initialDetector);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isChanged) return;

    try {
      setSaving(true);
      const updated = await updateDetector(localDetector);

      success(
        `Detector updated to '${updated.defaultDetector}' (Recognizer: ${updated.defaultRecognizer})`
      );

      setInitialDetector(updated.defaultDetector);
      setLocalDetector(updated.defaultDetector);
    } catch (err) {
      error(err?.response?.data?.error || "Failed to update detector");
    } finally {
      setSaving(false);
    }
  };

  const isChanged = localDetector !== initialDetector;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">

        {/* Header with Left Button */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center gap-3">
          
          {/* Placeholder button for modal */}
          <DetectorModalButton />

          <h2 className="font-semibold text-lg text-gray-800">
            Face Detection Model
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="w-full p-6 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">

            {/* Description */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-600">
                  Default Detector
                </label>

                <Tooltip
                  content="Haar & LBP only support HIST recognizer. YOLO supports all recognizers."
                  position="right"
                >
                  <Info size={16} />
                </Tooltip>
              </div>

              <p className="text-sm text-gray-600">
                Choose between <strong>haar</strong>, <strong>lbp</strong>, or <strong>yolo</strong>.
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Recommended: <strong>YOLO</strong>
              </p>
            </div>

            {/* Dropdown */}
            <div className="w-full md:w-60">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <select
                  value={localDetector}
                  onChange={(e) => setLocalDetector(e.target.value)}
                  className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm w-full"
                >
                  {detectorOptions.map((opt) => (
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

export default DetectorConfigContainer;
