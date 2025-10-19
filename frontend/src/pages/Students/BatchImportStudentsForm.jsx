import React, { useState, useCallback, useRef } from "react";
import { UploadCloud, Loader2, X, CircleAlert, CheckCircle2 } from "lucide-react";
import useStudent from "../../hooks/useStudent";
import useToast from "../../hooks/useToast";
import { useModal } from "../../hooks/useModal";

const BatchImportStudentsForm = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const { importStudentsFromCsv, loading, fetchAllStudents } = useStudent();
  const { success } = useToast();
  const { closeModal } = useModal();

  // === Drag and drop logic ===
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

      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.name.endsWith(".csv")
      );

      if (droppedFiles.length > 0) {
        setFile(droppedFiles[0]);
        setInlineError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setInlineError("Please upload a valid .csv file.");
      }
    },
    [loading]
  );

  // === File selection ===
  const handleFileChange = (e) => {
    if (loading) return;
    const selectedFile = e.target.files?.[0];

    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setInlineError("");
    } else {
      setInlineError("Please select a valid .csv file.");
    }
  };

  const handleRemoveFile = () => {
    if (loading) return;
    setFile(null);
    setResult(null);
    setInlineError("");

    // 👇 Reset file input so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // === Upload handler ===
  const handleUpload = async () => {
    if (!file || loading) return;
    setInlineError("");

    try {
      const response = await importStudentsFromCsv(file);
      setResult(response);
      success("Students imported successfully!");

      // Optional: refresh list automatically
      await fetchAllStudents?.();
    } catch (err) {
      console.error("Error importing students:", err);
      setInlineError(err.message || "Failed to import students. Please try again.");
    }
  };

  // === Done handler ===
  const handleDone = () => {
    closeModal();
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 font-lexend">
      {/* === Step 1: Upload Zone (hidden after success) === */}
      {!result && (
        <>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
            } ${loading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 text-center">
              Drag & drop your <strong>.csv</strong> file here <br /> or{" "}
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
            <div className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-700 truncate max-w-[80%]">
                📄 {file.name}
              </p>
              <button
                onClick={handleRemoveFile}
                disabled={loading}
                className="text-gray-500 hover:text-red-500 transition-all duration-150 disabled:opacity-50"
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
              type="button"
              onClick={closeModal}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 font-medium"
            >
              Cancel
            </button>

            <button
              type="button"
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
                "Upload CSV"
              )}
            </button>
          </div>
        </>
      )}

      {/* === Step 2: Show Results === */}
      {result && (
        <div className="w-full border border-gray-200 rounded-2xl p-4 bg-gray-50 animate-fadeIn">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">Import Summary</h3>
          </div>

          <div className="text-sm text-gray-700 mb-2">
            <p>✅ Imported: <strong>{result.importedCount}</strong></p>
            <p>⚠️ Errors: <strong>{result.errorCount}</strong></p>
          </div>

          {/* Imported Students */}
          {result.students?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-800 mb-1">Imported Students:</p>
              <ul className="text-sm bg-white border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-40 overflow-y-auto">
                {result.students.map((s, i) => (
                  <li key={i} className="px-3 py-2 flex justify-between">
                    <span>{s.studentId} — {s.name}</span>
                    <span className="text-gray-500">{s.className}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Errors */}
          {result.errors?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-700 mb-1">Errors:</p>
              <ul className="text-sm bg-red-50 border border-red-300 rounded-lg divide-y divide-red-200 max-h-40 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i} className="px-3 py-2">
                    Line {err.line}: <span className="font-medium">{err.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={handleDone}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchImportStudentsForm;
