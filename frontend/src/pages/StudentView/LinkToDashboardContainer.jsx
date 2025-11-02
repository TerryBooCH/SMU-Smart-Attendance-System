import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react"; // icon import

const LinkToDashboardContainer = ({ studentId }) => {
  const dashboardUrl = `/student/${studentId}/dashboard`;

  return (
    <div className="p-6">
      <div className="border border-[#cecece] rounded-2xl bg-white shadow-sm">
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#cecece] flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-900">
            View Student Dashboard
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-start gap-4">
          <p className="text-sm text-gray-600">
            Click below to navigate to the student’s dashboard for detailed
            performance, attendance, and profile information.
          </p>

          <Link
            to={dashboardUrl}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LinkToDashboardContainer;
