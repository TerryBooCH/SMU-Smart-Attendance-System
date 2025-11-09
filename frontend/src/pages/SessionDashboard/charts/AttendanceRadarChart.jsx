import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AttendanceRadarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
      <PolarGrid stroke="#e2e8f0" />
      <PolarAngleAxis
        dataKey="name"
        tick={{ fill: "#64748b", fontSize: 12 }}
      />
      <PolarRadiusAxis
        angle={90}
        domain={[0, 100]}
        tick={{ fill: "#94a3b8", fontSize: 11 }}
      />
      <Radar
        name="Performance"
        dataKey="value"
        stroke="#8b5cf6"
        fill="#8b5cf6"
        fillOpacity={0.5}
        strokeWidth={2}
      />
      <Tooltip
        formatter={(v) => `${v.toFixed(1)}%`}
        contentStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      />
    </RadarChart>
  </ResponsiveContainer>
);

export default AttendanceRadarChart;
