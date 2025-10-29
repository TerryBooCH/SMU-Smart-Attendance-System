import React, { useState, useCallback, useRef } from "react";
import {
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useRoster from "../../hooks/useRoster";
import useToast from "../../hooks/useToast";
import CsvHint from "./CsvHint";

const BatchAddStudentsToRostersForm = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const { importStudentsToRosterFromCsv, loading } = useRoster();
  const { success } = useToast();
  const { closeModal } = useModal();

  // --- Drag & Drop handlers ---
  const handleDrag = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;

      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    },
    [loading]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      setDragActive(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile && droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        setInlineError("");
      } else {
        setInlineError("Please upload a valid CSV file.");
      }
    },
    [loading]
  );

  // --- File input handlers ---
  const handleFileChange = (e) => {
    if (loading) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setInlineError("");
    } else {
      setInlineError("Please select a valid CSV file.");
    }
  };

  const handleRemoveFile = () => {
    if (loading) return;
    setFile(null);
    setInlineError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Upload CSV ---
  const handleUpload = async () => {
    if (!file || loading) return;
    try {
      const response = await importStudentsToRosterFromCsv(file);
      setResult(response);
      success(
        `${response.importedCount || 0} student(s) processed successfully!`
      );
    } catch (err) {
      console.error("Error importing roster students:", err);
      setInlineError(err.message || "Failed to import students to roster.");
    }
  };

  // --- Done ---
  const handleDone = () => closeModal();

  // === After Upload: Show only summary ===
  if (result) {
    return (
      <div className="w-full space-y-4 py-4 font-lexend animate-fadeIn">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                Import Complete!
              </h3>
              <p className="text-sm text-gray-600">
                {result.rosters?.[0]?.name
                  ? `Roster: ${result.rosters[0].name}`
                  : "Your CSV has been processed successfully."}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-100">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Imported
              </p>
              <p className="text-2xl font-bold text-green-600">
                {result.importedCount || 0}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                Errors
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {result.errorCount || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Errors */}
        {result.errors?.length > 0 && (
          <div className="bg-white border border-red-200 rounded-2xl p-5">
            <h4 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Failed to Import ({result.errors.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.errors.map((err, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
                >
                  <CircleAlert className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-red-900">
                      Line {err.line}
                    </p>
                    <p className="text-sm text-red-700 mt-0.5">{err.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleDone}
            className="cursor-pointer px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // === Default Upload View ===
  return (
    <div className="flex flex-col items-center gap-6 py-4 font-lexend">
      <CsvHint />
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        } ${loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 text-center">
          Drag & drop your CSV file here <br /> or{" "}
          <label
            htmlFor="csvInput"
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            browse
          </label>
        </p>
        <input
          id="csvInput"
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
      </div>

      {/* File Preview */}
      {file && (
        <div className="w-full flex items-center justify-between border border-gray-200 bg-gray-50 rounded-xl p-3">
          <p className="text-sm text-gray-700 truncate">{file.name}</p>
          <button
            onClick={handleRemoveFile}
            disabled={loading}
            className="text-gray-500 hover:text-red-500 transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Inline Error */}
      {inlineError && (
        <div className="w-full bg-red-50 border border-red-400 text-red-800 px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
          <CircleAlert className="w-5 h-5" />
          <span>{inlineError}</span>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 w-full mt-4">
        <button
          onClick={closeModal}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Cancel
        </button>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className={`px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
            file && !loading
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </div>
  );
};

export default BatchAddStudentsToRostersForm;
