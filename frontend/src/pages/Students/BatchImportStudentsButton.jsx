import React from 'react'
import { CopyPlus } from 'lucide-react'
import { useModal } from "../../hooks/useModal";
import BatchImportStudentsForm from './BatchImportStudentsForm';

const BatchImportStudentsButton = () => {
  const { openModal } = useModal();

  const handleBatchImportStudents = () => {
    openModal(<BatchImportStudentsForm />, "Bacth Import Student", { width: "2xl", height: "auto" });
  };

  return (
    <button
      onClick={handleBatchImportStudents}
      className="flex items-center gap-2 px-4 py-2 text-sm font-lexend font-medium text-white 
                 bg-primary rounded-xl transition-all duration-200 
                 hover:bg-primary/90 active:scale-[0.98] 
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <CopyPlus size={18} strokeWidth={1.8} />
      <span>Batch Import</span>
    </button>
  )
}

export default BatchImportStudentsButton
