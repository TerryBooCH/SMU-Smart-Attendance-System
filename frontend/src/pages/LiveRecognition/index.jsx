import React, { useState } from "react";
import LiveRecognitionSidebar from "./LiveRecognitionSidebar";
import Breadcrumb from "../../components/Breadcrumb";
import MainRecognitionScreen from "./MainRecognitionScreen";
import ControlBar from "./ControlBar";

const LiveRecognition = () => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  return (
    <div className="min-h-screen flex">
      <main className="h-screen w-full bg-[#fafafa] flex flex-col">
        <div className="px-4 py-3 flex flex-col overflow-hidden">
          <MainRecognitionScreen isCameraOn={isCameraOn} />
        </div>
        <ControlBar isCameraOn={isCameraOn} setIsCameraOn={setIsCameraOn} />
      </main>
      <LiveRecognitionSidebar />
    </div>
  );
};

export default LiveRecognition;
