import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.svg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <img 
        src={Logo} 
        alt="Logo" 
        className="w-32 h-32 mb-8 opacity-80"
      />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate(-1)} 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;