import React, { useState, useCallback } from "react";
import { UploadCloud, X, Loader2, CircleAlert } from "lucide-react";
import { useModal } from "../../hooks/useModal";
import useStudent from "../../hooks/useStudent";
import useToast from "../../hooks/useToast";

const UploadFaceDataForm = ({ student }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [inlineError, setInlineError] = useState(""); // inline error state
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
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile && droppedFile.type.startsWith("image/")) {
        setFile(droppedFile);
        setInlineError("");
      }
    },
    [loading]
  );

  const handleFileChange = (e) => {
    if (loading) return;
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setInlineError("");
    }
  };

  const handleRemoveFile = () => {
    if (!loading) {
      setFile(null);
      setInlineError("");
    }
  };

  const handleUpload = async () => {
    if (!file || loading) return;

    try {
      const response = await uploadStudentFaceData(student.studentId, file);

      if (response.status === 201 || response.status === "success") {
        success("Face data uploaded successfully!");
        closeModal();
      }
    } catch (err) {
      console.error("Error uploading face data:", err);

      // Default error message
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
              className="w-32 h-32 object-cover rounded-xl shadow-md"
            />
            <button
              type="button"
              onClick={handleRemoveFile}
              disabled={loading}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Inline Error Box */}
      {inlineError && (
        <div className="w-full  bg-red-50 border border-red-400 text-red-800 px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
          <CircleAlert className="w-5 h-5" />
          <span>{inlineError}</span>
        </div>
      )}

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
          className="px-4 py-2 text-sm rounded-xl border border-gray-300 text-gray-700 cursor-pointer
                      hover:bg-gray-100 active:scale-[0.98] 
                      transition-all duration-200 disabled:opacity-50 
                      disabled:cursor-not-allowed font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className={`px-4 py-2 rounded-xl text-sm text-white flex items-center justify-center gap-2 
                      font-medium transition-all duration-200 
                      ${
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

export default UploadFaceDataForm;
