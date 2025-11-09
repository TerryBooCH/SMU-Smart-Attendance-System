import React from 'react';
import { Calendar, Clock, Users, AlertCircle, DoorOpen, DoorClosed, Info } from 'lucide-react';
import { formatDateTime, calculateDuration } from '../../utils/dateUtils';

const InfoContent = ({ sessionData }) => {
  if (!sessionData) {
    return <p className="text-gray-500">No session data available.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Session Status */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
        {sessionData.open ? (
          <DoorOpen className="text-green-600" size={20} />
        ) : (
          <DoorClosed className="text-gray-500" size={20} />
        )}
        <span
          className={`font-semibold ${
            sessionData.open ? 'text-green-600' : 'text-gray-500'
          }`}
        >
          {sessionData.open ? 'Session Open' : 'Session Closed'}
        </span>
      </div>

      {/* Course Information */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Course Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-xs text-gray-500">Course Name</p>
              <p className="text-sm font-medium text-gray-800">{sessionData.courseName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-xs text-gray-500">Roster</p>
              <p className="text-sm font-medium text-gray-800">{sessionData.rosterName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Information */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Schedule
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-xs text-gray-500">Start Time</p>
              <p className="text-sm font-medium text-gray-800">
                {formatDateTime(sessionData.startAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-xs text-gray-500">End Time</p>
              <p className="text-sm font-medium text-gray-800">
                {formatDateTime(sessionData.endAt)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="text-gray-400 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium text-gray-800">
                {calculateDuration(sessionData.startAt, sessionData.endAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Policy */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Attendance Policy
        </h3>
        <div className="flex items-start gap-3">
          <AlertCircle className="text-orange-500 mt-0.5 flex-shrink-0" size={18} />
          <div>
            <p className="text-xs text-gray-500">Late Threshold</p>
            <p className="text-sm font-medium text-gray-800">
              {sessionData.lateAfterMinutes} minutes after start time
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      {(sessionData.createdAt || sessionData.updatedAt) && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Metadata
          </h3>
          <div className="space-y-2 text-xs text-gray-500">
            {sessionData.createdAt && (
              <p>Created: {formatDateTime(sessionData.createdAt)}</p>
            )}
            {sessionData.updatedAt && (
              <p>Last Updated: {formatDateTime(sessionData.updatedAt)}</p>
            )}
          </div>
        </div>
      )}

      {/* Closing Session Note */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2 text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <Info className="text-yellow-500 mt-0.5 flex-shrink-0" size={18} />
          <p>
            <span className="font-medium">Note:</span> Closing a session will
            automatically mark all students with a pending status as{' '}
            <span className="font-semibold text-gray-800">absent</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoContent;
