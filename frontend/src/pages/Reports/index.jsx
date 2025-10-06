import React from "react";
import Sidebar from "../../components/Sidebar";
import PageHeader from "../../components/PageHeader";

const Reports = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
        <main className="h-screen w-full bg-[#fafafa] ">
          <PageHeader title="Reports" subtitle={"Generate reports."} />
        </main>
    
    </div>
  );
};

export default Reports;
