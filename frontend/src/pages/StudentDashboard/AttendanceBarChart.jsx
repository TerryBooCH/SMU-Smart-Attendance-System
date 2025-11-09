import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

const AttendanceBarChart = ({ data, colors }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md">
    <div className="flex items-center mb-4">
      <BarChart3 className="text-blue-500 w-5 h-5 mr-2" />
      <h3 className="text-gray-800 font-semibold">Attendance Comparison</h3>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default AttendanceBarChart;
