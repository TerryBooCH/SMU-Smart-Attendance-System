import React, { useState } from "react";
import { useParams } from "react-router-dom";
import LiveRecognitionSidebar from "./LiveRecognitionSidebar";
import Breadcrumb from "../../components/Breadcrumb";
import MainRecognitionScreen from "./MainRecognitionScreen";
import ControlBar from "./ControlBar";

const LiveRecognition = () => {
  const { id } = useParams();
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState(null); // can be: 'info', 'notifications', 'attendance', or null

  return (
    <div className="min-h-screen flex">
      <main className="h-screen w-full bg-[#fafafa] flex flex-col">
        <div className="px-4 pt-3 flex flex-col overflow-hidden">
          <MainRecognitionScreen isCameraOn={isCameraOn} />
        </div>
        <ControlBar
          isCameraOn={isCameraOn}
          setIsCameraOn={setIsCameraOn}
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
        />
      </main>

      <LiveRecognitionSidebar
        id={id}
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
      />
    </div>
  );
};

export default LiveRecognition;
