import React from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import StudentsContainer from "./StudentsContainer";
import Toolbar from "./Toolbar";

const Students = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="h-screen w-full bg-[#fafafa] ">
        <Breadcrumb items={[{label: "Home", href: "/home"}, { label: "Students"}]} />
        <Toolbar />
        <StudentsContainer />
      </main>
    </div>
  );
};

export default Students;
