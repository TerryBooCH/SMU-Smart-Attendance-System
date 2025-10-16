import React from "react";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";

const RosterView = () => {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20 ">
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Rosters", href: "/rosters" },
              { label:  "View Roster" },
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto"></div>
      </main>
    </div>
  );
};

export default RosterView;
