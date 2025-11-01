import React, { useState, useEffect } from "react";
import OpenSessionButton from "../../components/OpenSessionButton";
import TimeDateDisplay from "../../components/TimeDateDisplay";
import TimeToStartDisplay from "./TimeToStartDisplay";
import NavToDashboardButton from "./NavToDashboardButton";

const Toolbar = ({ session }) => {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl px-6 py-6 transition-all hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="text-gray-600 text-medium">
            <TimeDateDisplay />
          </div>
          <div className="text-gray-600">|</div>

          <TimeToStartDisplay session={session} />
           
        </div>

        <div className="flex gap-2 items-center">
          <NavToDashboardButton session={session} />
         <OpenSessionButton session={session} />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
