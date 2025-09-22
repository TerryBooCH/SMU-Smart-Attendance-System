import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  School,
  Video,
  FileText
} from "lucide-react";

const QuickNav = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <h3 className="mb-2 font-semibold text-gray-500 text-sm">Quick Start</h3>
          <div 
            className="bg-white rounded-xl p-8 flex-1 cursor-pointer border-3 border-primary flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/sessions')}
          >
            <div className="mb-4">
              <School size={48} strokeWidth={2} className="text-gray-700" />
            </div>
            <h4 className="font-semibold text-lg mb-3">Manage Sessions</h4>
            <p className="text-sm text-gray-600 leading-relaxed">Set up and monitor attendance sessions with course details, rosters, and status updates.</p>
          </div>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-2 font-semibold text-gray-500 text-sm">Other Actions</h3>
          <div className="flex-1 flex flex-col gap-4">
            <div 
              className="bg-white rounded-xl p-4 flex-1 cursor-pointer border border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors min-h-[120px] flex items-start gap-4"
              onClick={() => navigate('/students')}
            >
              <div className="flex-shrink-0 mt-1">
                <Users size={30} strokeWidth={2} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2 text-gray-800">Manage Students</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Enroll and manage student profiles with personal details and facial data for recognition.</p>
              </div>
            </div>
            <div 
              className="bg-white rounded-xl p-4 flex-1 cursor-pointer border border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors min-h-[120px] flex items-start gap-4"
              onClick={() => navigate('/recognition')}
            >
              <div className="flex-shrink-0 mt-1">
                <Video size={30} strokeWidth={2} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2 text-gray-800">Live Recognition</h4>
                <p className="text-sm text-gray-600 leading-relaxed">Use the webcam to detect and recognize faces, marking attendance automatically in real time.</p>
              </div>
            </div>
            <div 
              className="bg-white rounded-xl p-4 flex-1 cursor-pointer border border-gray-300 hover:border-gray-400 hover:bg-gray-100 transition-colors min-h-[120px] flex items-start gap-4"
              onClick={() => navigate('/reports')}
            >
              <div className="flex-shrink-0 mt-1">
                <FileText size={30} strokeWidth={2} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2 text-gray-800">Generate Reports</h4>
                <p className="text-sm text-gray-600 leading-relaxed">View attendance summaries and export detailed reports in multiple formats (CSV, PDF, Excel).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickNav;