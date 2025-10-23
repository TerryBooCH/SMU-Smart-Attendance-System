import React from 'react'
import { Video, VideoOff } from 'lucide-react'

const ManageCameraButton = ({ isCameraOn, setIsCameraOn }) => {
  return (
    <button
      onClick={() => setIsCameraOn(!isCameraOn)}
      className={`p-4 rounded-full transition-all shadow-md cursor-pointer
        ${isCameraOn 
          ? "bg-red-500 hover:bg-red-600 text-white" 
          : "bg-gray-100 hover:bg-gray-200 text-gray-700"} 
        active:scale-95`}
      aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
    >
      {isCameraOn ? (
        <VideoOff className="w-6 h-6" />
      ) : (
        <Video className="w-6 h-6" />
      )}
    </button>
  )
}

export default ManageCameraButton
