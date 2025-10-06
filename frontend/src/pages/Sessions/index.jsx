import React from "react";
import Sidebar from "../../components/Sidebar";
import PageHeader from "../../components/PageHeader";

const Sessions = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
 
        <main className="h-screen w-full bg-[#fafafa]">
          <PageHeader title="Sessions" subtitle={"Manage attendance sessions."} />
        </main>
     
    </div>
  );
};

export default Sessions;
