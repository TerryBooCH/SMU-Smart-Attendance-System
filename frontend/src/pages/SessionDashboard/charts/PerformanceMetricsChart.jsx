import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const PerformanceMetricsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <defs>
        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.6} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
      <XAxis
        dataKey="name"
        tick={{ fill: "#64748b", fontSize: 12 }}
        axisLine={{ stroke: "#cbd5e1" }}
      />
      <YAxis
        domain={[0, 100]}
        tick={{ fill: "#64748b", fontSize: 12 }}
        axisLine={{ stroke: "#cbd5e1" }}
        label={{ value: "%", position: "insideLeft", fill: "#64748b" }}
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
      <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default PerformanceMetricsChart;
