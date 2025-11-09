import React, { useEffect, useState } from "react";
import { configService } from "../../api/configService";
import { Info } from "lucide-react";
import Tooltip from "../../components/ToolTip";
import { useToast } from "../../hooks/useToast";

const TreshHoldConfigContainer = () => {
  const [threshold, setThreshold] = useState(0.5);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialThreshold, setInitialThreshold] = useState(0.5);

  const { success, error } = useToast();

  // Load current threshold
  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const current = await configService.getRecognitionThreshold();
        setThreshold(current);
        setInitialThreshold(current);
      } catch (err) {
        error("Failed to load recognition threshold");
      } finally {
        setLoading(false);
      }
    };
    fetchThreshold();
  }, [error]);

  const handleReset = () => {
    setThreshold(initialThreshold);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (threshold < 0 || threshold > 1) {
      error("Threshold must be between 0 and 1");
      return;
    }

    setSaving(true);
    try {
      const updated = await configService.updateRecognitionThreshold(threshold);
      success(`Threshold updated to ${updated}`);
      setInitialThreshold(updated);
    } catch (err) {
      error("Failed to update threshold");
    } finally {
      setSaving(false);
    }
  };

  const isChanged = threshold !== initialThreshold;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece]">
          <h2 className="font-semibold text-lg text-gray-800">
            Face Recognition Threshold
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="w-full p-6 space-y-6">
          {/* Description and Input */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            {/* Left side: description */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-600">
                  Recognition Sensitivity
                </label>
                <div className="cursor-pointer">
                  <Tooltip
                    content="Adjust the confidence threshold used for facial recognition. Lower values make recognition more lenient; higher values make it stricter."
                    position="right"
                  >
                    <Info size={16} />
                  </Tooltip>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Set the minimum confidence required for a face match. Recommended range:{" "}
                <strong>0.5 – 0.8</strong>.
              </p>
            </div>

            {/* Right side: input */}
            <div className="flex flex-col items-end w-full md:w-48">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={threshold}
                  onChange={(e) =>
                    setThreshold(parseFloat(e.target.value) || 0)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end pt-4 border-t border-gray-100">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={saving || !isChanged}
                className="text-gray-700 bg-white border border-gray-300 text-sm px-4 py-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving || !isChanged}
                className="text-white bg-black text-sm px-4 py-2 rounded-xl hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TreshHoldConfigContainer;
