import React, { useState, useEffect } from "react";

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.getHours() % 12;
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  const formatTime = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex items-center gap-4">
      {/* Analog Clock */}
      <div className="relative w-16 h-16 bg-white rounded-full shadow-lg border-2 border-gray-800">
        {/* Clock face markings */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-1.5 bg-gray-800"
            style={{
              top: "4px",
              left: "50%",
              transformOrigin: "center 28px",
              transform: `translateX(-50%) rotate(${i * 30}deg)`,
            }}
          />
        ))}

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>

        {/* Hour hand */}
        <div
          className="absolute w-0.5 h-4 bg-gray-800 rounded-full origin-bottom"
          style={{
            bottom: "50%",
            left: "50%",
            transform: `translateX(-50%) rotate(${hourAngle}deg)`,
            transformOrigin: "bottom center",
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute w-0.5 h-6 bg-gray-700 rounded-full origin-bottom"
          style={{
            bottom: "50%",
            left: "50%",
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
            transformOrigin: "bottom center",
          }}
        />

        {/* Second hand */}
        <div
          className="absolute w-0.5 h-7 bg-red-500 rounded-full origin-bottom"
          style={{
            bottom: "50%",
            left: "50%",
            transform: `translateX(-50%) rotate(${secondAngle}deg)`,
            transformOrigin: "bottom center",
          }}
        />
      </div>

      {/* Digital Time Display */}
      <div className="text-3xl font-semibold text-gray-700">
        {formatTime()}
      </div>
    </div>
  );
};

export default TimeDisplay;