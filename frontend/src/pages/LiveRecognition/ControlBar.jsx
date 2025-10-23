import React, { useEffect, useState } from "react";
import ManageCameraButton from "./ManageCameraButton";
import TimeDateDisplay from "./TimeDateDisplay";

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
    <div className="bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <TimeDateDisplay />

        <div className="flex-1 flex justify-center">
          <ManageCameraButton
            isCameraOn={isCameraOn}
            setIsCameraOn={setIsCameraOn}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
