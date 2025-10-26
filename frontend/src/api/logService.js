import apiClient from "./axios";

export const logService = {
  downloadLogs: async () => {
    try {
      const response = await apiClient.get("/api/logs/download", {
        responseType: "blob", // Important for file downloads
      });

      // Extract filename from Content-Disposition
      const contentDisposition = response.headers["content-disposition"];
      console.log("content-disposition:", contentDisposition);
      let filename = "attendance_log.txt";

      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^"]+)"?/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      // Create blob and download
      const blob = new Blob([response.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      console.log("✅ Log file downloaded successfully:", filename);
    } catch (error) {
      console.error("❌ Error downloading log file:", error);
      throw error;
    }
  },
};
