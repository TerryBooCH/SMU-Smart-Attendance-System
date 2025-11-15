import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Tooltip from "../../components/ToolTip";
import { useToast } from "../../hooks/useToast";
import { useConfigStore } from "../../store/configStore";

const TreshHoldConfigContainer = () => {
  const { threshold, updateThreshold, loading } = useConfigStore();

  const [localThreshold, setLocalThreshold] = useState(threshold);
  const [saving, setSaving] = useState(false);

  const { success, error } = useToast();

  // Sync UI when global store updates
  useEffect(() => {
    setLocalThreshold(threshold);
  }, [threshold]);

  const handleReset = () => setLocalThreshold(threshold);

  const handleSave = async (e) => {
    e.preventDefault();

    if (localThreshold < -1 || localThreshold > 1) {
      error("Threshold must be between -1 and 1");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateThreshold(localThreshold);

      success(`Threshold updated to ${updated}`);
    } catch (err) {
      error("Failed to update threshold");
    } finally {
      setSaving(false);
    }
  };

  const isChanged = localThreshold !== threshold;

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
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">

            {/* Description */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-medium text-gray-600">
                  Recognition Sensitivity
                </label>
                <Tooltip
                  content="Adjust the confidence threshold used for facial recognition. Range: -1 (very lenient) to 1 (very strict)."
                  position="right"
                >
                  <Info size={16} />
                </Tooltip>
              </div>

              <p className="text-sm text-gray-600">
                Valid range: <strong>-1 to 1</strong>.
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Recommended value: <strong>0.85</strong>
              </p>
            </div>

            {/* Slider + Input */}
            <div className="flex flex-col w-full md:w-60 gap-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
              ) : (
                <>
                  <input
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={localThreshold}
                    onChange={(e) =>
                      setLocalThreshold(parseFloat(e.target.value))
                    }
                    className="w-full accent-black"
                  />

                  <input
                    type="number"
                    min="-1"
                    max="1"
                    step="0.01"
                    value={localThreshold}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setLocalThreshold(isNaN(value) ? 0 : value);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full"
                  />
                </>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving || !isChanged}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-xl disabled:opacity-50"
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={saving || !isChanged}
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

export default TreshHoldConfigContainer;
