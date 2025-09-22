import React from "react";
import Sidebar from "../../components/Sidebar";

const Students = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="h-screen py-2 pr-2 flex flex-col flex-1 bg-[#f9f9f9]">
        <main className="h-full w-full bg-white border-1 border-[#cecece] rounded-2xl"></main>
      </div>
    </div>
  );
};

export default Students;
