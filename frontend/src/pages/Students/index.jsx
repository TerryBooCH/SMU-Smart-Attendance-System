import React from "react";
import Sidebar from "../../components/Sidebar";
import PageHeader from "../../components/PageHeader";
import StudentsContainer from "./StudentsContainer";
import Toolbar from "./Toolbar";

const Students = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="h-screen w-full bg-[#fafafa] ">
        <PageHeader title="Students" subtitle={"Manage student records."} />
        <Toolbar />
        <StudentsContainer />
      </main>
    </div>
  );
};

export default Students;
