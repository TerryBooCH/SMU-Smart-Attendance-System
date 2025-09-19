import React from "react";
import {
  Rocket,
  ArrowRight,
  ScanFace,
  ChartNoAxesGantt,
  Brain,
} from "lucide-react";

const Hero = () => {
  return (
    <div className="relaive pt-17">
      <div className="lg:w-7xl px-4 lg:px-6 mx-auto min-h-[80vh] grid grid-cols-1 md:grid-cols-2 gap-7 items-center">
        <div className="text-left">
          <div className="rounded-full border-1 border-[#cecece] text-gray-muted inline-flex px-4 py-2 text-sm font-medium items-center gap-2 mb-6">
            <Rocket size={18} color="#2563eb" />
            CS102 - Programming Fundamentals 2 Project
          </div>
          <div className="mb-6">
            <div className="sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6">
              Smart <span className="text-primary">Attendance</span> System
            </div>
            <div>
              <p className="text-base lg:text-lg  text-gray-muted">
                A vision-based smart attendance system automates this process by
                detecting and recognizing faces from a webcam feed or uploaded
                media, marking attendance in real time, and storing records
                securely.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/signin"
              className="group sm:py-2.5 sm:px-8 bg-primary text-white rounded-full font-medium sm:text-base lg:text-lg hover:scale-105 hover:shadow-md transition-all duration-200 flex items-center gap-3"
            >
              Get Started
              <div className="group-hover:rotate-[-45deg] transition-all duration-200">
                <ArrowRight size={20} />
              </div>
            </a>
            <a
              href="/signup"
              className="sm:py-2.5 sm:px-8 rounded-full font-medium sm:text-base lg:text-lg text-black border-1 border-[#cecece] hover:scale-105 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
            >
              New Account
            </a>
          </div>
        </div>
        <div>
          <div className="relative">
            <div className="min-h-100 bg-white rounded-xl overflow-hidden  shadow-xl flex flex-col">
              <div className="w-full h-12 flex justify-center items-center top-0 bg-slate-100 z-50 ring-1 ring-[#cecece] relative">
                <p className="bg-white  text-gray-muted text-sm px-30 rounded-sm z-100 h-6 flex items-center">
                  http://Smartend
                </p>
                <div className="w-3 h-3 bg-red-500 rounded-full absolute left-3"></div>
                <div className="w-3 h-3 bg-yellow-300 rounded-full absolute left-7"></div>
                <div className="w-3 h-3 bg-green-600 rounded-full absolute left-11"></div>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <h2 className="font-bold text-lg mb-10">
                  Attendance Taking in Progress
                </h2>
                <div>
                  <span className="relative flex size-18">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex size-18 rounded-full bg-red-500"></span>
                  </span>
                </div>
                <div className="mt-10 flex items-center gap-3 border-1 border-[#cecece] rounded-xl px-4 py-2">
                  <div className="bg-green-200 w-22 px-3 py-2 rounded-xl border-1 text-center border-green-500 font-medium text-green-600 text-sm">
                    Present
                  </div>
                  <div className="bg-red-200 w-22 px-3 py-2 rounded-xl border-1 text-center border-red-500 font-medium text-red-600 text-sm">
                    Absent
                  </div>
                  <div className="bg-amber-200 w-22 px-3 py-2 rounded-xl border-1 text-center border-amber-500 font-medium text-amber-600 text-sm">
                    Late
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute z-50 -top-6 -right-8 bg-white shadow-lg rounded-xl p-4  flex  items-center justify-center gap-3 float-1">
              <ScanFace size={20} className="text-primary" />
              <h3 className="text-sm font-semibold text-primary">Face Detection</h3>
            </div>

            <div className="absolute bottom-10 -right-14 bg-white shadow-lg rounded-xl p-4 flex  items-center justify-center gap-3 float-2">
              <ChartNoAxesGantt size={20} className="text-primary" />
              <h3 className="text-sm font-semibold text-primary ">
                Manage Sessions
              </h3>
            </div>

            <div className="absolute -bottom-5 right-80 bg-white shadow-lg rounded-xl p-4  flex  items-center justify-center gap-3 float-3">
              <Brain size={20} className="text-primary" />
              <h3 className="text-sm font-semibold text-primary">
                Smart Attendance Taking
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
