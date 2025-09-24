import React from "react";
import Logo from "../assets/logo.svg";

const PreAuthNavbar = () => {
  return (
    <header className="lg:flex lg:items-center justify-center fixed top-0 left-0 w-full z-50 backdrop-blur-sm lg:backdrop-blur-sm">
      <div
        className={`lg:w-7xl h-17 flex items-center justify-between px-4 lg:px-6`}
      >
        <div className="flex items-center justify-start">
          <a href="/" className={`flex items-center gap-1.5 me-[3rem]`}>
            <img src={Logo} alt="AgentSoC" className="size-[32px]" />

            <span className={`font-bold text-2xl text-primary `}>Smartend</span>
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/signin"
            className="text-sm py-2 px-3 bg-primary text-white rounded-full font-medium hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            Sign In
          </a>
        </div>
      </div>
    </header>
  );
};

export default PreAuthNavbar;
