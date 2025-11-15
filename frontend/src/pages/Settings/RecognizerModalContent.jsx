import React from "react";
import {
  Palette,
  Brain,
  Link2,
  Sparkles,
  CheckCircle2,
  XCircle
} from "lucide-react";

const badge = (text) => (
  <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-200 text-gray-700 uppercase tracking-wide">
    {text}
  </span>
);

const RecognizerModalContent = () => {
  return (
    <div className="space-y-6 text-gray-800">

      {/* Recommendation */}
      <div className="p-4 rounded-xl bg-black text-white shadow-sm flex items-center gap-3">
        <Sparkles size={18} className="text-yellow-300" />
        <p className="text-sm leading-relaxed">
          <span className="font-semibold">Recommended:</span> Siamese Network —
          Best accuracy & modern deep-learning approach.
        </p>
      </div>

      {/* Histogram Recognizer */}
      <div className="space-y-1 flex items-start gap-3">
        <Palette size={20} className="text-purple-600 mt-1" />
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            Histogram Recognizer {badge("hist")}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Compares objects using histogram-based feature distributions that 
            capture color or intensity patterns.
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* EigenFace */}
      <div className="space-y-1 flex items-start gap-3">
        <Brain size={20} className="text-blue-600 mt-1" />
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            EigenFace {badge("eigen")}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Recognizes faces by projecting images into a lower-dimensional space
            built using principal component analysis.
          </p>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Siamese Network */}
      <div className="space-y-1 flex items-start gap-3">
        <Link2 size={20} className="text-green-600 mt-1" />
        <div>
          <p className="font-medium text-gray-900 flex items-center">
            Siamese Network {badge("neuralnet")}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Uses CNNs trained with triplet loss to learn an embedding space 
            where similar inputs move closer and dissimilar ones move apart.
          </p>
        </div>
      </div>

      {/* COMPATIBILITY TABLE */}
      <div className="mt-6">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Detector Compatibility
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

export default RecognizerModalContent;
