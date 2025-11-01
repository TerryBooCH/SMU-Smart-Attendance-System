import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import useSession from "../../hooks/useSession";
import DashboardHeader from "./DashboardHeader";
import MainDashboardContainer from "./MainDashboardContainer";

const SessionDashboard = () => {
  const { id } = useParams();
  const { selectedSession, fetchSessionById, loading, error } = useSession();
  useEffect(() => {
    if (id) {
      fetchSessionById(id);
    }
  }, [id]);
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20 ">
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Sessions", href: "/sessions" },
              { label: selectedSession?.courseName || "View Session", href: `/session/${id}` },
              { label: "Session Dashboard" },
            ]}
          />
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
