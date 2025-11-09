import React from "react";
import CircularProgress from "./CircularProgress";

const StatCard = ({ icon: Icon, title, value, total, percentage, color, iconBg, showTotal = true }) => (
  <div className="group bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
    <div className={`${iconBg} p-4 rounded-2xl inline-flex mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">{title}</p>
    <div className="flex items-end justify-between">
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {showTotal && total !== undefined && <p className="text-sm text-gray-400 mt-1">of {total} sessions</p>}
      </div>
      {percentage !== undefined && <CircularProgress percentage={percentage} color={color} size={65} />}
    </div>
  </div>
);

export default StatCard;
