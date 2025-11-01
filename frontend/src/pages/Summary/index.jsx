import React from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

const Summary = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20 ">
          <Breadcrumb items={[{ label: "Summary" }]} />
        </div>
        <div className="flex-1 overflow-y-auto">
        </div>
      </main>
    </div>
  );
};

export default Summary;
