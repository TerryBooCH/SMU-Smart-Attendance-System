import React from "react";
import CreateSessionButton from "./CreateSessionButton";

const Toolbar = () => {
  return (
    <div className="px-6 pt-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sessions</h1>
        </div>
        <div>
          <CreateSessionButton />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
