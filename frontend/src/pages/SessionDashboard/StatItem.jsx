import React from "react";

const StatItem = ({ label, value, color }) => (
  <div className="text-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-slate-600 mt-2 font-medium">{label}</p>
  </div>
);

export default StatItem;
