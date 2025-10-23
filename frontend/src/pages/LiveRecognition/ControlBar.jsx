import React, { useEffect, useState } from "react";
import ManageCameraButton from "./ManageCameraButton";
import TimeDateDisplay from "../../components/TimeDateDisplay";
import EndSessionRecognitionButton from "./EndSessionRecognitionButton";

const ControlBar = ({ isCameraOn, setIsCameraOn }) => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: "short", day: "2-digit", month: "short" };
      const formattedDate = now.toLocaleDateString("en-GB", options);
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setDateTime(`${formattedDate} · ${formattedTime}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200">
      <div className="flex items-center justify-between">
        {/* Left: Date & Time */}
        <div className="text-sm text-gray-600 font-medium">
                    <TimeDateDisplay dateTime={dateTime} />
        </div>


        {/* Center: Camera + End Session */}
        <div className="flex justify-center items-center gap-4 flex-1">
          <ManageCameraButton
            isCameraOn={isCameraOn}
            setIsCameraOn={setIsCameraOn}
          />
          <EndSessionRecognitionButton />
        </div>

        {/* Right: Empty spacer for symmetry */}
        <div className="w-[120px]" />
      </div>
    </div>
  );
};

export default ControlBar;
