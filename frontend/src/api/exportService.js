import apiClient from "./axios";

export const exportService = {

  downloadStudentReport: async (studentId, format = "csv", fields = {}) => {
    try {
      const response = await apiClient.post(
        `/api/exports/student/${studentId}`,
        fields, // Request body
        {
          params: { format }, // Query param
          responseType: "blob", // Expect binary data
        }
      );

      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers["content-disposition"];
      let filename = `student_${studentId}.${format}`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^"]+)"?/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // Create a download link
      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`✅ Student report downloaded successfully: ${filename}`);
    } catch (error) {
      console.error("❌ Error downloading student report:", error);
      throw error;
    }
  },


  downloadSessionReport: async (sessionId, format = "csv", fields = {}) => {
    try {
      const response = await apiClient.post(
        `/api/exports/session/${sessionId}`,
        fields, // Request body
        {
          params: { format }, // Query param
          responseType: "blob",
        }
      );

      // Extract filename
      const contentDisposition = response.headers["content-disposition"];
      let filename = `session_${sessionId}.${format}`;

      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^"]+)"?/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // Trigger download
      const blob = new Blob([response.data], { type: response.data.type });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log(`✅ Session report downloaded successfully: ${filename}`);
    } catch (error) {
      console.error("❌ Error downloading session report:", error);
      throw error;
    }
  },
};
