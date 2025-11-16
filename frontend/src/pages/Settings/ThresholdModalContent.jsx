import React from "react";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";

const ThresholdModalContent = () => {
  return (
    <div className="space-y-6">
      {/* Recommendation */}
      <div className="p-4 rounded-xl bg-black text-white shadow-sm flex items-center gap-3">
        <Sparkles size={18} className="text-yellow-300" />
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">Recommended:</span> 0.80 — 
          Optimal balance between accuracy & real-world variance.
        </p>
      </div>

      {/* Main Description */}
      <div className="space-y-1 flex items-start gap-3">
        <TrendingUp size={20} className="text-indigo-600 mt-1" />
        <div>
          <p className="font-medium text-gray-900">
            Face Recognition Threshold
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Controls how strict the system is when comparing face embeddings using{" "}
            <span className="font-medium text-gray-900">cosine similarity</span> — 
            a measure of how similar two face vectors are.
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Similarity Scale */}
      <div className="space-y-3">
        <p className="font-medium text-gray-900">
          Cosine Similarity Scale
        </p>
        
        <p className="text-sm text-gray-600 leading-relaxed">
          Your threshold must fall within the <span className="font-medium text-gray-900">-1 to +1 range</span> since 
          that's the natural output of cosine similarity. The scale below shows how similarity values map to face matching quality.
        </p>
        
        <div className="relative">
          {/* Gradient Bar */}
          <div className="h-3 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 shadow-sm"></div>
          
          {/* Scale Markers */}
          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-start max-w-[30%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-red-600">-1.0</span>
              </div>
              <p className="text-xs text-gray-600">
                Opposite directions • Total dissimilarity (rare)
              </p>
            </div>
            
            <div className="flex flex-col items-center max-w-[30%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-yellow-600">0</span>
              </div>
              <p className="text-xs text-gray-600 text-center">
                Orthogonal • Unrelated faces
              </p>
            </div>
            
            <div className="flex flex-col items-end max-w-[30%]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-green-600">+1.0</span>
              </div>
              <p className="text-xs text-gray-600 text-right">
                Same direction • Extremely similar or identical
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Key Insight */}
      <div className="space-y-1 flex items-start gap-3">
        <AlertCircle size={20} className="text-amber-600 mt-1" />
        <div>
          <p className="font-medium text-gray-900">
            How Thresholds Work
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            <span className="font-medium text-gray-900">Higher threshold</span> = stricter matching (fewer false positives) •{" "}
            <span className="font-medium text-gray-900">Lower threshold</span> = looser matching (more permissive)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThresholdModalContent;