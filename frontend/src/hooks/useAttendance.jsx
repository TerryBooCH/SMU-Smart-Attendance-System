import { useContext } from "react";
import AttendanceContext from "../context/AttendanceContext";

export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error("useAttendance must be used within a AttendanceProvider");
    }
    return context;
};

export default useAttendance;