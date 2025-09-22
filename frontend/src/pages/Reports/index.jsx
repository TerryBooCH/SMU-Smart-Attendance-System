import React from "react";
import Sidebar from "../../components/Sidebar";
import PageHeader from "../../components/PageHeader";

const Reports = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="h-screen py-2 pr-2 flex flex-col flex-1 bg-[#f9f9f9]">
        <main className="h-full w-full bg-[#fafafa] border-1 border-[#cecece] rounded-2xl">
          <PageHeader title="Reports" subtitle={"Generate reports."} />
        </main>
      </div>
    </div>
  );
};

export default Reports;
