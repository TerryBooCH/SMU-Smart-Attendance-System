import React from "react";
import ManageCameraButton from "./ManageCameraButton";
import TimeDateDisplay from "../../components/TimeDateDisplay";
import EndSessionRecognitionButton from "./EndSessionRecognitionButton";
import ToggleInfoButton from "./ToggleInfoButton";
import ToggleNotificationButton from "./ToggleNotificationButton";
import ToggleAttendanceFieldButton from "./ToggleAttendanceFieldButton";

const ControlBar = ({ isCameraOn, setIsCameraOn, activeSidebar, setActiveSidebar }) => {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Date & Time */}
        <div className="text-medium text-gray-600 font-medium">
          <TimeDateDisplay />
        </div>

        {/* Center: Camera + End Session */}
        <div className="flex justify-center items-center gap-4 flex-1">
          <ManageCameraButton
            isCameraOn={isCameraOn}
            setIsCameraOn={setIsCameraOn}
          />
          <EndSessionRecognitionButton />
        </div>

        {/* Right: Info + Notification + Attendance buttons */}
        <div className="flex items-center gap-3">
          <ToggleInfoButton
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
          />
          <ToggleNotificationButton
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
          />
          <ToggleAttendanceFieldButton
            activeSidebar={activeSidebar}
            setActiveSidebar={setActiveSidebar}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
