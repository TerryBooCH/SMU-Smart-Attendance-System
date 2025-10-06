import React from "react";
import Sidebar from "../../components/Sidebar";
import PageHeader from "../../components/PageHeader";

const Students = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="h-screen w-full bg-[#fafafa] ">
        <PageHeader title="Students" subtitle={"Manage student records."} />
      </main>
    </div>
  );
};

export default Students;
