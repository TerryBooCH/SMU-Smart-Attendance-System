import React from "react";
import OpenSessionButton from "../../components/OpenSessionButton";

const Toolbar = ({ session }) => {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl px-6 py-6 transition-all hover:shadow-md">
 
        <div className="flex items-center gap-3">
          <OpenSessionButton session={session} />
        </div>

 
        <div>

        </div>
      </div>
    </div>
  );
};

export default Toolbar;
