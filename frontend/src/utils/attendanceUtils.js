import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Hourglass,
} from "lucide-react";

export const getStatusConfig = (status) => {
  switch (status) {
    case "PRESENT":
      return {
        icon: CheckCircle,
        bgColor: "bg-emerald-50",
        borderColor: "border-l-emerald-500",
        iconColor: "text-emerald-600",
        textColor: "text-emerald-700",
        badgeBg: "bg-emerald-100",
        label: "Present",
      };
    case "LATE":
      return {
        icon: Clock,
        bgColor: "bg-amber-50",
        borderColor: "border-l-amber-500",
        iconColor: "text-amber-600",
        textColor: "text-amber-700",
        badgeBg: "bg-amber-100",
        label: "Late",
      };
    case "ABSENT":
      return {
        icon: XCircle,
        bgColor: "bg-red-50",
        borderColor: "border-l-red-500",
        iconColor: "text-red-600",
        textColor: "text-red-700",
        badgeBg: "bg-red-100",
        label: "Absent",
      };
    case "PENDING":
      return {
        icon: Hourglass,
        bgColor: "bg-blue-50",
        borderColor: "border-l-blue-500",
        iconColor: "text-blue-600",
        textColor: "text-blue-700",
        badgeBg: "bg-blue-100",
        label: "Pending",
      };
    default:
      return {
        icon: AlertCircle,
        bgColor: "bg-gray-50",
        borderColor: "border-l-gray-500",
        iconColor: "text-gray-600",
        textColor: "text-gray-700",
        badgeBg: "bg-gray-100",
        label: status,
      };
  }
};

export const getMethodBadge = (method) => {
  switch (method) {
    case "AUTO":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "MANUAL":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "NOT MARKED":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};