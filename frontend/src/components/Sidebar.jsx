import React from "react";
import { Link } from "react-router-dom";
import {
  PanelLeft,
  ArrowLeft,
  Users,
  School,
  Video,
  FileText,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div
      className={`md:sticky z-30 fixed transition-all duration-300 ease-in-out w-[15rem]`}
    >
      <nav
        className={`flex-col gap-4 items-center fixed top-0 left-0 h-screen  transition-all duration-300 ease-in-out bg-[#f9f9f9] w-[15rem]`}
      >
        {/* Header section */}
        <div className="px-2.5 flex min-h-[4rem] items-center  relative w-full gap-2">
          <button className="group px-2 py-2 cursor-pointer hover:bg-black/5 rounded-lg">
            <div className="relative">
              <PanelLeft
                height={"20px"}
                width={"20px"}
                strokeWidth={1.4}
                className="group-hover:opacity-0 transition duration-300 "
              />
              <ArrowLeft
                height={"20px"}
                width={"20px"}
                strokeWidth={1.4}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300 
                  `}
              />
            </div>
          </button>
          <Link to="/students">
            <h1 className="text-2xl font-bold text-primary">Smartend</h1>
          </Link>
        </div>

        {/* Navigation section */}
        <div className="px-2.5 flex flex-col gap-2.5 w-full">
          <Link
            to="/students"
            className="inline-flex items-center px-2 py-2 rounded-lg h-10  hover:bg-black/5"
          >
            <Users
              height={"20px"}
              width={"20px"}
              strokeWidth={1.4}
              className="group-hover:opacity-0 transition duration-300 "
            />
            <span className="ml-3 text-sm ">Students</span>
          </Link>
          <Link
            to="/sessions"
            className="inline-flex items-center px-2 py-2 rounded-lg h-10  hover:bg-black/5"
          >
            <School
              height={"20px"}
              width={"20px"}
              strokeWidth={1.4}
              className="group-hover:opacity-0 transition duration-300 "
            />
            <span className="ml-3 text-sm ">Sessions</span>
          </Link>
          <Link
            to="/live-recognition"
            className="inline-flex items-center px-2 py-2 rounded-lg h-10  hover:bg-black/5"
          >
            <Video
              height={"20px"}
              width={"20px"}
              strokeWidth={1.4}
              className="group-hover:opacity-0 transition duration-300 "
            />
            <span className="ml-3 text-sm ">Live Recognition</span>
          </Link>
          <Link
            to="/reports"
            className="inline-flex items-center px-2 py-2 rounded-lg h-10  hover:bg-black/5"
          >
            <FileText
              height={"20px"}
              width={"20px"}
              strokeWidth={1.4}
              className="group-hover:opacity-0 transition duration-300 "
            />
            <span className="ml-3 text-sm ">Reports</span>
          </Link>
          <Link
            to="/settings"
            className="inline-flex items-center px-2 py-2 rounded-lg h-10  hover:bg-black/5"
          >
            <Settings
              height={"20px"}
              width={"20px"}
              strokeWidth={1.4}
              className="group-hover:opacity-0 transition duration-300 "
            />
            <span className="ml-3 text-sm ">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
