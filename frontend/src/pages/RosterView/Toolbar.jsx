import React from 'react';
import AddStudentToRosterButton from './AddStudentToRosterButton';
import { Users } from 'lucide-react';

const Toolbar = ({ roster }) => {
  return (
    <div className="px-6 pt-6">
      <div className="flex items-center justify-between bg-white/60 backdrop-blur-md border border-slate-200/60 shadow-sm rounded-2xl px-6 py-6 transition-all hover:shadow-md">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
            <Users className="w-6 h-6" strokeWidth={2.3} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Students</h1>
          </div>
        </div>

        {/* Right Section */}
        <div>
          <AddStudentToRosterButton roster={roster} />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
