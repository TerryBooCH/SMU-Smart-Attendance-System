import React from 'react';
import { Info } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import DetectorModalContent from './DetectorModalContent';

const DetectorModalButton = () => {
  const { openModal } = useModal();

  const handleOpenModal = () => {
    openModal(
      <DetectorModalContent />,
      "Detector Models Information"
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

export default DetectorModalButton;
