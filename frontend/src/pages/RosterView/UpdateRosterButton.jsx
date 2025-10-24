import React from 'react'
import { useModal } from '../../hooks/useModal'
import UpdateRosterForm from '../../components/UpdateRosterForm'
import { Edit } from 'lucide-react'

const UpdateRosterButton = ({roster}) => {
  const { openModal } = useModal();
  const handleUpdateRoster = () => {
    openModal(<UpdateRosterForm roster={roster} />, "Update Roster");
  };
  return (
 <button
      type="button"
      onClick={handleUpdateRoster}
      className="flex items-center gap-2 px-4 py-2 text-sm  font-medium text-white bg-black rounded-xl 
                 hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <Edit size={16} strokeWidth={1.8} />
      <span>Update Roster</span>
    </button>
  )
}

export default UpdateRosterButton
