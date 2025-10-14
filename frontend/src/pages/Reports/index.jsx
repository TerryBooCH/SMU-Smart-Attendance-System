import React from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

const Reports = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
        <main className="h-screen w-full bg-[#fafafa] ">
          <Breadcrumb items={[{label: "Home", href: "/home"}, { label: "Reports" }]} />
        </main>
    
    </div>
  );
};

export default Reports;
