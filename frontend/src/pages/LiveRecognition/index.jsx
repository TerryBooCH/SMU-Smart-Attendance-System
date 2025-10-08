import React from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

const LiveRecognition = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="h-screen w-full bg-[#fafafa] ">
        <Breadcrumb
          items={[
            { label: "Home", href: "/home" },
            { label: "Live Recognition" },
          ]}
        />
      </main>
    </div>
  );
};

export default LiveRecognition;
