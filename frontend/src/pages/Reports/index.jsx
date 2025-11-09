import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import SessionContainer from "./SessionContainer";
import StudentsContainer from "./StudentContainer";
import ReportsTabs from "./ReportsTabs";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sessions");

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        {/* Breadcrumb */}
        <div className="sticky top-0 z-20 bg-[#fafafa]">
          <Breadcrumb
            items={[{ label: "Home", href: "/home" }, { label: "Reports" }]}
          />
        </div>

        {/* Tabs (Extracted Component) */}
        <ReportsTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "sessions" && <SessionContainer />}
          {activeTab === "students" && <StudentsContainer />}
        </div>
      </main>
    </div>
  );
};

export default Reports;
