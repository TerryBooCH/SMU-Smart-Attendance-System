import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const AttendancePieChart = ({ data, colors }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md">
    <h3 className="text-gray-800 font-semibold mb-4">Attendance Breakdown</h3>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
          {data.map((entry, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex justify-around text-sm mt-3 text-gray-600">
      {data.map((d, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i] }}></div>
          <span>{d.name}: {d.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AttendancePieChart;
