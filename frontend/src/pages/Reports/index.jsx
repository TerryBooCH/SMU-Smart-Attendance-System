import React from "react";
import Sidebar from "../../components/Sidebar";

const Reports = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="h-screen p-2 flex flex-col flex-1 bg-[#f9f9f9]">
        <main className="h-full w-full bg-white border-1 border-[#cecece] rounded-2xl  shadow-md"></main>
      </div>
    </div>
  );
};

export default Reports;
