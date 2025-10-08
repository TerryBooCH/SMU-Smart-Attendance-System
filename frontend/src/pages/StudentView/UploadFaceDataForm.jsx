import React, { useState, useCallback } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react"; // Added Loader2 icon
import { useModal } from "../../hooks/useModal";
import useStudent from "../../hooks/useStudent";
import useToast from "../../hooks/useToast";

const UploadFaceDataForm = ({ student }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { uploadStudentFaceData, loading } = useStudent(); // <-- from context
  const { success, error } = useToast();
  const { closeModal } = useModal();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return; // prevent drag when uploading
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [loading]);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (loading) return;
      setDragActive(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile && droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
      }
    },
    [loading]
  );

  const handleFileChange = (e) => {
    if (loading) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    if (loading) return;
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file || loading) return;

    try {
      await uploadStudentFaceData(student.studentId, file);
      success("Face data uploaded successfully!");
      closeModal();
    } catch (err) {
      console.error(err);
      error("Failed to upload face data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
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
        {!file ? (
          <>
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 text-center">
              Drag & drop your face image here <br /> or{" "}
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
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
          </>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg shadow-md"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={loading}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 cursor-pointer disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* File Info */}
      {file && (
        <div className="text-sm text-gray-600">
          <p>
            <strong>Selected file:</strong> {file.name}
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 w-full mt-4">
        <button
          type="button"
          onClick={closeModal}
          disabled={loading}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
            file && !loading
              ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
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

export default UploadFaceDataForm;
