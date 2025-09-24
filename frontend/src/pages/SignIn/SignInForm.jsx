import React from "react";
import { Link } from "react-router-dom";

const SignInForm = () => {
  return (
    <div className="relaive">
      <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-medium text-3xl sm:text-4xl text-center">
              Welcome Back
            </h1>
          </div>
          {/* From */}
          <form action="">
            <div class="mb-6">
              <label for="username" class="block mb-2 text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                class="bg-gray-50 border border-[#cecece] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-3  "
                placeholder="Username"
                required
              />
            </div>
            <div class="mb-6">
              <label for="password" class="block mb-2 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                class="bg-gray-50 border border-[#cecece] text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-2.5 py-3  "
                placeholder="Password"
                required
              />
            </div>
            {/* Submit Button */}
            <div>
              <button className="text-white bg-primary font-medium w-full px-2.5 py-2 rounded-xl cursor-pointer">
                <span>Sign In</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
