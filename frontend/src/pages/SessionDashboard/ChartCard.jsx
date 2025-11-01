import React from "react";

const ChartCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
      {icon}
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    </div>
    {children}
  </div>
);

export default ChartCard;
