import React from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

const Sessions = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
 
        <main className="h-screen w-full bg-[#fafafa]">
          <Breadcrumb items={[{label: "Home", href: "/home"}, { label: "Sessions" }]}/>
        </main>
     
    </div>
  );
};

export default Sessions;
