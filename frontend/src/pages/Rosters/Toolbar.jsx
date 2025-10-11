import React from "react";
import CreateRosterButton from "./CreateRosterButton";


const Toolbar = () => {
  return (
    <div className="px-6 pt-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Rosters</h1>
        </div>
        <div>
          <CreateRosterButton />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
