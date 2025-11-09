import React, { useEffect, useState } from "react";
import { Loader2, XCircle, Users, CheckCircle2, Clock, CircleX, AlertTriangle, HelpCircle, BarChart3 } from "lucide-react";
import { studentService } from "../../api/studentService";
import StatCard from "./StatCard";
import AttendancePieChart from "./AttendancePieChart";
import AttendanceBarChart from "./AttendanceBarChart";
import SessionTable from "./SessionTable";
import EmptyState from "./EmptyState";

const MainDashboardContainer = ({ studentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await studentService.getStudentAttendanceSummary(studentId);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [studentId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-lg text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-800 font-semibold">Error loading data</p>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );

  if (data.totalSessions === 0) {
    return <EmptyState data={data} />;
  }

  const attendancePercentage = Math.round(data.attendanceRate * 100);
  const pieData = [
    { name: "Present", value: data.presentCount },
    { name: "Late", value: data.lateCount },
    { name: "Absent", value: data.absentCount },
    { name: "Pending", value: data.pendingCount },
    { name: "Unmarked", value: data.unmarkedCount },
  ];

  const COLORS = ["#22c55e", "#f97316", "#ef4444", "#a855f7", "#94a3b8"];

  return (
    <div className="p-6 space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard icon={Users} title="Attendance Rate" value={`${attendancePercentage}%`} percentage={attendancePercentage} color="#3b82f6" iconBg="bg-blue-50" showTotal={false} />
        <StatCard icon={CheckCircle2} title="Present" value={data.presentCount} total={data.totalSessions} color="#22c55e" iconBg="bg-green-50" />
        <StatCard icon={Clock} title="Late" value={data.lateCount} total={data.totalSessions} color="#f97316" iconBg="bg-orange-50" />
        <StatCard icon={CircleX} title="Absent" value={data.absentCount} total={data.totalSessions} color="#ef4444" iconBg="bg-red-50" />
        <StatCard icon={AlertTriangle} title="Pending" value={data.pendingCount} total={data.totalSessions} color="#a855f7" iconBg="bg-purple-50" />
        <StatCard icon={HelpCircle} title="Unmarked" value={data.unmarkedCount} total={data.totalSessions} color="#94a3b8" iconBg="bg-gray-50" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendancePieChart data={pieData} colors={COLORS} />
        <AttendanceBarChart data={pieData} colors={COLORS} />
      </div>

      {/* Table */}
      <SessionTable sessions={data.sessions} />
    </div>
  );
};

export default MainDashboardContainer;
