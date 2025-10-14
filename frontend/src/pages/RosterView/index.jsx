import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Breadcrumb from "../../components/Breadcrumb";
import useRoster from "../../hooks/useRoster";
import RosterHeader from "./RosterHeader";
import Toolbar from "./Toolbar";
import RosterStudentsContainer from "./RosterStudentsContainer";

const RosterView = () => {
  const { id } = useParams();
  const { selectedRoster,studentsInRoster, loading, error, fetchRosterById, fetchStudentsInRoster } = useRoster();

  useEffect(() => {
    if (id) {
      fetchRosterById(id);
      fetchStudentsInRoster(id);
    }
  }, [id]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex flex-col h-screen w-full bg-[#fafafa] overflow-hidden">
        <div className="sticky top-0 z-20 ">
          <Breadcrumb
            items={[
              { label: "Home", href: "/home" },
              { label: "Rosters", href: "/rosters" },
              { label: selectedRoster?.name || "View Roster" },
            ]}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <RosterHeader roster={selectedRoster} />
          <Toolbar roster={selectedRoster} />
          <RosterStudentsContainer roster={selectedRoster} students={studentsInRoster} />
        </div>
      </main>
    </div>
  );
};

export default RosterView;
