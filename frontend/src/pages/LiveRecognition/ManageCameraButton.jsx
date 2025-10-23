import React from 'react'
import { Video, VideoOff } from 'lucide-react'

const ManageCameraButton = ({ isCameraOn, setIsCameraOn }) => {
  return (
    <button
      onClick={() => setIsCameraOn(!isCameraOn)}
      className={`p-3 rounded-full transition-all shadow-md cursor-pointer
        ${isCameraOn 
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700" 
          : "bg-primary hover:brightness-90 text-white"} 
        active:scale-95`}
      aria-label={isCameraOn ? "Turn off camera" : "Turn on camera"}
    >
      {isCameraOn ? (
        <VideoOff className="size-7" />
      ) : (
        <Video className="size-7" />
      )}
    </button>
  )
}

export default ManageCameraButton
