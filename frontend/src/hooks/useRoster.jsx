import { useContext } from "react";
import RosterContext from "../context/RosterContext";

export const useRoster = () => {
  const context = useContext(RosterContext);
  if (!context) {
    throw new Error("useRoster must be used within a RosterProvider");
  }
  return context;
};

export default useRoster;