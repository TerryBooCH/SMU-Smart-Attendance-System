import React, { useState, useEffect } from "react";

const TimeToStartDisplay = ({ session }) => {
  const [timeToStart, setTimeToStart] = useState("");

  useEffect(() => {
    const calculateTimeToStart = () => {
      if (!session?.startAt) {
        setTimeToStart("");
        return;
      }

      const now = new Date();
      const startTime = new Date(session.startAt);
      const endTime = new Date(session.endAt);
      const diffMs = startTime - now;

      // If session has ended
      if (now > endTime) {
        setTimeToStart("Over");
        return;
      }

      // If session is ongoing
      if (now >= startTime && now <= endTime) {
        setTimeToStart("In Progress");
        return;
      }

      // If session hasn't started yet
      if (diffMs > 0) {
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;

        if (hours > 0) {
          setTimeToStart(`Starts in ${hours}h ${mins}m`);
        } else {
          setTimeToStart(`Starts in ${mins}m`);
        }
      }
    };

    calculateTimeToStart();
    const interval = setInterval(calculateTimeToStart, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [session?.startAt, session?.endAt]);

  if (!timeToStart) return null;

  return (
    <div
      className={`text-medium font-medium ${
        timeToStart === "Over"
          ? "text-gray-400"
          : timeToStart === "In Progress"
          ? "text-green-600"
          : "text-blue-600"
      }`}
    >
      {timeToStart}
    </div>
  );
};

export default TimeToStartDisplay;