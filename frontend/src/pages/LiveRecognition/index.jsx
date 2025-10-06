import React from "react";
import Sidebar from "../../components/Sidebar";
import PageHeader from "../../components/PageHeader";

const LiveRecognition = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
   
        <main className="h-screen w-full bg-[#fafafa] ">
          <PageHeader
            title="Live Recognition"
            subtitle={"Real-time face recognition."}
          />
        </main>
  
    </div>
  );
};

export default LiveRecognition;
