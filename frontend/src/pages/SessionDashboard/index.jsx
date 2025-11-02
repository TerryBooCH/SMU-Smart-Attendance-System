import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import useSession from "../../hooks/useSession";
import DashboardHeader from "./DashboardHeader";
import MainDashboardContainer from "./MainDashboardContainer";

const SessionDashboard = () => {
  const { id } = useParams();
  const location = useLocation();
  const { selectedSession, fetchSessionById } = useSession();

  useEffect(() => {
    if (id) {
      fetchSessionById(id);
    }
  }, [id]);

  const from = location.state?.from;

  const breadcrumbItems =
    from === "report"
      ? [
          { label: "Home", href: "/home" },
          { label: "Reports", href: "/reports" },
          { label: "Sessions", href: "/sessions" },
          {
            label: selectedSession?.courseName || "View Session",
            href: `/session/${id}`,
          },
          { label: "Session Dashboard" },
        ]
      : [
          { label: "Home", href: "/home" },
          { label: "Sessions", href: "/sessions" },
          {
            label: selectedSession?.courseName || "View Session",
            href: `/session/${id}`,
          },
          { label: "Session Dashboard" },
        ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <DashboardHeader session={selectedSession} />
          <MainDashboardContainer sessionId={id} />
        </div>
      </main>
    </div>
  );
};

export default SessionDashboard;
