import { create } from "zustand";
import { configService } from "../api/configService";

export const useConfigStore = create((set, get) => ({
  detector: "",
  recognizer: "",
  threshold: 0,
  loading: true,

  // Load all config values from backend
  loadConfigs: async () => {
    try {
      const [det, rec, thr] = await Promise.all([
        configService.getDefaultDetector(),
        configService.getDefaultRecognizer(),
        configService.getRecognitionThreshold(),
      ]);

      set({
        detector: det,
        recognizer: rec,
        threshold: thr,
        loading: false,
      });
    } catch (err) {
      console.error("Failed loading config", err);
      set({ loading: false });
    }
  },

  // Update Detector
  updateDetector: async (newDetector) => {
    const updated = await configService.updateDefaultDetector(newDetector);

    // Detector update may auto-adjust recognizer
    set({
      detector: updated.defaultDetector,
      recognizer: updated.defaultRecognizer,
    });

    return updated;
  },

  // Update Recognizer
  updateRecognizer: async (newRecognizer) => {
    const updated = await configService.updateDefaultRecognizer(newRecognizer);

    // Recognizer update may also adjust detector (rare)
    set({
      recognizer: updated.defaultRecognizer,
      detector: updated.defaultDetector,
    });

    return updated;
  },

  // Update Threshold
  updateThreshold: async (newThreshold) => {
    const updated = await configService.updateRecognitionThreshold(newThreshold);

    set({
      threshold: updated,
    });

    return updated;
  },
}));
