import React from "react";
import {
  Sparkles,
  SquareDashed,
  ScanFace,
  Cpu,
  CheckCircle2,
  XCircle
} from "lucide-react";

const badge = (text) => (
  <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-200 text-gray-700 uppercase tracking-wide">
    {text}
  </span>
);

const DetectorModalContent = () => {
  return (
    <div className="space-y-6 text-gray-800">

      {/* Recommendation */}
      <div className="p-4 rounded-xl bg-black text-white shadow-sm flex items-center gap-3">
        <Sparkles size={18} className="text-yellow-300" />
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">Recommended:</span> YOLOv8 — 
          Best overall accuracy & performance.
        </p>
      </div>

      {/* HaarCascade */}
      <div className="space-y-1 flex items-start gap-3">
        <SquareDashed size={20} className="text-gray-700 mt-1" />
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            HaarCascade {badge("haar")}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Uses Haar features and cascade classifiers for rapid,
            rule-based object detection.
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* LBPCascade */}
      <div className="space-y-1 flex items-start gap-3">
        <ScanFace size={20} className="text-gray-700 mt-1" />
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            LBPCascade {badge("lbp")}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Uses Local Binary Patterns for fast detection, more robust to
            lighting changes than Haar cascades.
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* YOLOv8 */}
      <div className="space-y-1 flex items-start gap-3">
        <Cpu size={20} className="text-green-600 mt-1" />
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            YOLOv8 {badge("yolo")}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            A deep-learning, real-time detector that predicts bounding boxes
            and classes in a single pass with high accuracy.
          </p>
        </div>
      </div>

      {/* COMPATIBILITY TABLE */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Recognizer Compatibility
        </p>

        <div className="border border-gray-300 rounded-xl overflow-hidden text-sm">

          {/* Header */}
          <div className="grid grid-cols-4 bg-gray-100 font-medium text-gray-700 py-2">
            <div className="px-3">Detector</div>
            <div className="px-3 text-center">Hist</div>
            <div className="px-3 text-center">EigenFace</div>
            <div className="px-3 text-center">Siamese</div>
          </div>

          {/* Haar */}
          <div className="grid grid-cols-4 border-t py-2 items-center">
            <div className="px-3 font-medium">HAAR</div>
            <div className="text-center">
              <CheckCircle2 size={18} className="text-green-600 inline" />
            </div>
            <div className="text-center">
              <XCircle size={18} className="text-red-500 inline" />
            </div>
            <div className="text-center">
              <XCircle size={18} className="text-red-500 inline" />
            </div>
          </div>

          {/* LBP */}
          <div className="grid grid-cols-4 border-t py-2 items-center">
            <div className="px-3 font-medium">LBP</div>
            <div className="text-center">
              <CheckCircle2 size={18} className="text-green-600 inline" />
            </div>
            <div className="text-center">
              <XCircle size={18} className="text-red-500 inline" />
            </div>
            <div className="text-center">
              <XCircle size={18} className="text-red-500 inline" />
            </div>
          </div>

          {/* YOLO */}
          <div className="grid grid-cols-4 border-t py-2 items-center">
            <div className="px-3 font-medium">YOLO</div>
            <div className="text-center">
              <CheckCircle2 size={18} className="text-green-600 inline" />
            </div>
            <div className="text-center">
              <CheckCircle2 size={18} className="text-green-600 inline" />
            </div>
            <div className="text-center">
              <CheckCircle2 size={18} className="text-green-600 inline" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default DetectorModalContent;
