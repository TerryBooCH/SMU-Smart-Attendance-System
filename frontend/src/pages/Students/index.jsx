import React from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import StudentsContainer from "./StudentsContainer";
import Toolbar from "./Toolbar";

const Students = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20 ">
          <Breadcrumb
            items={[{ label: "Home", href: "/home" }, { label: "Students" }]}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Toolbar />
          <StudentsContainer />
        </div>
      </main>
    </div>
  );
};

export default Students;
