import React, { useEffect, useState } from "react";
import { sessionService } from "../../api/sessionService";
import {
  Activity,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import MetricCard from "./MetricCard";
import ChartCard from "./ChartCard";
import StatItem from "./StatItem";
import AttendanceDistributionChart from "./charts/AttendanceDistributionChart";
import PerformanceMetricsChart from "./charts/PerformanceMetricsChart";
import AttendanceRadarChart from "./charts/AttendanceRadarChart";
import CompletionProgressChart from "./charts/CompletionProgressChart";

const COLORS = {
  present: "#10b981",
  late: "#f59e0b",
  absent: "#ef4444",
  pending: "#6b7280",
  unmarked: "#e5e7eb",
};

const MainDashboardContainer = ({ sessionId }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await sessionService.getSessionSummary(sessionId);
        setSummary(data);
      } catch (err) {
        setError(err.message || "Failed to load session summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [sessionId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );

  if (!summary) return null;

  const attendanceData = [
    { name: "Present", value: summary.presentCount, color: COLORS.present },
    { name: "Late", value: summary.lateCount, color: COLORS.late },
    { name: "Absent", value: summary.absentCount, color: COLORS.absent },
    { name: "Pending", value: summary.pendingCount, color: COLORS.pending },
  ];

  const performanceData = [
    { name: "Attendance", value: summary.attendanceRate * 100 },
    { name: "Punctuality", value: summary.punctualRate * 100 },
    { name: "Late Rate", value: summary.lateRate * 100 },
    { name: "Absent Rate", value: summary.absentRate * 100 },
  ];

  const completionData = [
    { name: "Marked", value: summary.markedCount, color: COLORS.present },
    { name: "Unmarked", value: summary.unmarkedCount, color: COLORS.unmarked },
  ];

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={summary.rosterSize}
          icon={<Users className="w-6 h-6" />}
          gradient="from-blue-500 to-blue-600"
          trend={`${summary.markedCount}/${summary.rosterSize} marked`}
          percentage={(summary.markedCount / summary.rosterSize) * 100}
        />
        <MetricCard
          title="Present"
          value={summary.presentCount}
          icon={<CheckCircle className="w-6 h-6" />}
          gradient="from-emerald-500 to-green-600"
          trend={`${(summary.punctualRate * 100).toFixed(1)}% on time`}
          percentage={(summary.presentCount / summary.rosterSize) * 100}
        />
        <MetricCard
          title="Late Arrivals"
          value={summary.lateCount}
          icon={<Clock className="w-6 h-6" />}
          gradient="from-amber-500 to-orange-600"
          trend={`>${summary.lateAfterMinutes} min late`}
          percentage={(summary.lateCount / summary.rosterSize) * 100}
        />
        <MetricCard
          title="Absent"
          value={summary.absentCount}
          icon={<XCircle className="w-6 h-6" />}
          gradient="from-rose-500 to-red-600"
          trend={`${(summary.absentRate * 100).toFixed(1)}% rate`}
          percentage={(summary.absentCount / summary.rosterSize) * 100}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Attendance Distribution"
          icon={<Activity className="w-5 h-5 text-blue-600" />}
        >
          <AttendanceDistributionChart data={attendanceData} />
        </ChartCard>

        <ChartCard
          title="Performance Metrics"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
        >
          <PerformanceMetricsChart data={performanceData} />
        </ChartCard>

        <ChartCard
          title="Attendance Analysis"
          icon={<Activity className="w-5 h-5 text-purple-600" />}
        >
          <AttendanceRadarChart data={performanceData} />
        </ChartCard>

        <ChartCard
          title="Marking Progress"
          icon={<CheckCircle className="w-5 h-5 text-green-600" />}
        >
          <CompletionProgressChart
            data={completionData}
            summary={summary}
          />
        </ChartCard>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Session Summary</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem label="Attendance Rate" value={`${(summary.attendanceRate * 100).toFixed(1)}%`} color="text-emerald-600" />
          <StatItem label="Punctual Rate" value={`${(summary.punctualRate * 100).toFixed(1)}%`} color="text-blue-600" />
          <StatItem label="Late Rate" value={`${(summary.lateRate * 100).toFixed(1)}%`} color="text-amber-600" />
          <StatItem label="Absent Rate" value={`${(summary.absentRate * 100).toFixed(1)}%`} color="text-rose-600" />
        </div>
      </div>
    </div>
  );
};

export default MainDashboardContainer;
