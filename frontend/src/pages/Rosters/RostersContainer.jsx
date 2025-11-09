import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import useRoster from "../../hooks/useRoster";
import { formatDate } from "../../utils/dateUtils";
// import DeleteRosterButton from "../../components/DeleteRosterButton"; // commented out
import UpdateRosterButton from "../../components/UpdateRosterButton";

const RostersContainer = () => {
  const { rosters, loading, error, fetchAllRosters } = useRoster();
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch once on mount
    if (!hasFetched.current) {
      fetchAllRosters();
      hasFetched.current = true;
    }
  }, [fetchAllRosters]);

  if (loading && rosters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading rosters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roster Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rosters && rosters.length > 0 ? (
                rosters.map((roster) => (
                  <tr key={roster.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {roster.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {roster.studentCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(roster.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/roster/${roster.id}`)}
                          className="flex items-center cursor-pointer px-2 py-2 text-black"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <UpdateRosterButton roster={roster} />
                        {/* <DeleteRosterButton roster={roster} /> */} {/* commented out */}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No rosters found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RostersContainer;
