import React from 'react';
import { getInitials } from '../../utils/stringUtils';
import { IdCardLanyard, Mail, Phone, GraduationCap } from 'lucide-react'; 

const UserBanner = ({ student }) => {
  const studentName = student?.name || 'John Doe';
  const initials = getInitials(studentName);
  const faceImage = student?.face?.imageBase64;

  return (
    <div className="p-6">
      <div className="relative">
        {/* Banner with gradient and pattern */}
        <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500">
          {/* Decorative circles pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute top-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
          </div>

          {/* Geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center">
              {faceImage ? (
                <img
                  src={faceImage}
                  alt={studentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-4xl font-semibold text-white">{initials}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to accommodate profile picture */}
      <div className="pt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{studentName}</h2>
        <p className="text-gray-500 mt-1">Student Profile</p>

        {/* Contact Information */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-sm text-gray-600">
          {/* Student ID */}
          <div className="flex items-center gap-1.5">
            <IdCardLanyard className="w-4 h-4 text-amber-500" />
            <span>{student?.studentId?.trim() || "N/A"}</span>
          </div>

          {/* Class */}
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-purple-500" />
            <span>{student?.className?.trim() || "N/A"}</span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>{student?.email?.trim() || "N/A"}</span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-green-500" />
            <span>{student?.phone?.trim() || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBanner;
