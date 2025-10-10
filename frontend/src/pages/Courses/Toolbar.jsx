import React from "react";
import CreateCourseButton from "./CreateCourseButton";


const Toolbar = () => {
  return (
    <div className="px-6 pt-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Courses</h1>
        </div>
        <div>
          <CreateCourseButton />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
