import React, { useState, useCallback, useRef } from "react";
import { UploadCloud, X, Loader2, CheckCircle2, CircleAlert } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useRoster from "../../hooks/useRoster";
import useToast from "../../hooks/useToast";

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
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [loading]);

  const handleDrop = useCallback((e) => {
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
  }, [loading]);

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
      success(`${response.importedCount || 0} student(s) processed successfully!`);
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
      <div className="flex flex-col items-center gap-6 py-4 font-lexend">
        <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-medium text-gray-800">
              Import Summary
            </span>
          </div>

          {result.rosters?.[0]?.name && (
            <p className="text-gray-700 mb-2">
              📘 Roster: <strong>{result.rosters[0].name}</strong>
            </p>
          )}

          <p className="text-gray-700 mb-2">
            ✅ Imported: <strong>{result.importedCount}</strong> student(s)
          </p>
          <p className="text-gray-700 mb-3">
            ⚠️ Errors: <strong>{result.errorCount}</strong>
          </p>

          {result.errors?.length > 0 && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-2 max-h-40 overflow-y-auto">
              <table className="w-full text-xs text-red-800">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="text-left py-1 px-2 w-12">Line</th>
                    <th className="text-left py-1 px-2">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err, i) => (
                    <tr key={i} className="border-b border-red-100">
                      <td className="py-1 px-2">{err.line}</td>
                      <td className="py-1 px-2">{err.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button
          onClick={handleDone}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200"
        >
          Done
        </button>
      </div>
    );
  }

  // === Default Upload View ===
  return (
    <div className="flex flex-col items-center gap-6 py-4 font-lexend">
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
