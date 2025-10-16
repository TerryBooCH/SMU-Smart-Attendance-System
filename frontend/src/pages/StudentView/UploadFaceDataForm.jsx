import React, { useState, useCallback } from "react";
import { UploadCloud, X, Loader2, CircleAlert } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useStudent from "../../hooks/useStudent";
import useToast from "../../hooks/useToast";

const UploadFaceDataForm = ({ student }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const { uploadStudentFaceData, loading } = useStudent();
  const { success } = useToast();
  const { closeModal } = useModal();

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

      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );

      if (droppedFiles.length > 0) {
        setFiles((prev) => [...prev, ...droppedFiles]);
        setInlineError("");
      }
    },
    [loading]
  );

  const handleFileChange = (e) => {
    if (loading) return;
    const selectedFiles = Array.from(e.target.files || []).filter((file) =>
      file.type.startsWith("image/")
    );

    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      setInlineError("");
    }
  };

  const handleRemoveFile = (index) => {
    if (!loading) {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      if (files.length === 1) {
        setInlineError("");
      }
    }
  };

  const handleUpload = async () => {
    if (files.length === 0 || loading) return;

    try {
      const response = await uploadStudentFaceData(student.studentId, files);

      if (response.status === 201 || response.status === "success") {
        success(`${files.length} face image(s) uploaded successfully!`);
        closeModal();
      }
    } catch (err) {
      console.error("Error uploading face data:", err);

      let message = "Failed to upload face data. Please try again.";

      if (err?.response?.status === 400) {
        message =
          "Cannot upload more images: maximum of 20 face images allowed.";
      } else if (err?.data?.error) {
        message = err.data.error;
      }

      setInlineError(message);
    }
  };

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
          Drag & drop your face images here <br /> or {" "}
          <label
            htmlFor="fileInput"
            className="text-blue-600 cursor-pointer hover:underline font-medium"
          >
            browse
          </label>
        </p>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          disabled={loading}
        />
      </div>

      {/* Preview Section */}
      {files.length > 0 && (
        <div className="w-full max-h-56 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
          <div className="grid grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  disabled={loading}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inline Error Box */}
      {inlineError && (
        <div className="w-full bg-red-50 border border-red-400 text-red-800 px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
          <CircleAlert className="w-5 h-5" />
          <span>{inlineError}</span>
        </div>
      )}

      {/* File Info */}
      {files.length > 0 && (
        <div className="text-sm text-gray-600">
          <p>
            <strong>Selected files:</strong> {files.length} image(s)
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 w-full mt-4">
        <button
          type="button"
          onClick={closeModal}
          disabled={loading}
          className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-100 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={files.length === 0 || loading}
          className={`px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
            files.length > 0 && !loading
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
            `Upload ${files.length > 0 ? `(${files.length})` : ""}`
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadFaceDataForm;