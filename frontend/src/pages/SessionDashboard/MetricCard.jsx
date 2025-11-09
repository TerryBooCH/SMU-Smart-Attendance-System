import React from "react";
import { TrendingUp } from "lucide-react";

const MetricCard = ({ title, value, icon, gradient, trend, percentage }) => (
  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
      <div
        className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`bg-gradient-to-br ${gradient} text-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-slate-800">{value}</div>
          <div className="text-xs text-slate-500 mt-1">{percentage.toFixed(0)}%</div>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        {trend}
      </p>
    </div>
  </div>
);

export default MetricCard;
