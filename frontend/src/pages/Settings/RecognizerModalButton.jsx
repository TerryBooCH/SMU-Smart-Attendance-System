import React from 'react';
import { Info } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import RecognizerModalContent from './RecognizerModalContent';

const RecognizerModalButton = () => {
  const { openModal } = useModal();

  const handleOpenModal = () => {
    openModal(
      <RecognizerModalContent />,
      "Recognizer Models Information"
    );
  };

  return (
    <button
      type="button"
      className="p-2 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100"
      onClick={handleOpenModal}
    >
      <Info size={18} className="text-gray-700" />
    </button>
  );
};

export default RecognizerModalButton;
