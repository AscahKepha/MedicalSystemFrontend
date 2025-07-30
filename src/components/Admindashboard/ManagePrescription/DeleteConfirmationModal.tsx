// src/components/prescriptions/DeleteConfirmationModal.tsx
import React from 'react';
import { type PrescriptionData } from '../../../features/api/PrescriptionsApi';

interface DeleteConfirmationModalProps {
  show: boolean;
  prescription: PrescriptionData | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  show,
  prescription,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm mx-auto text-center border border-red-300">
        <h3 className="text-xl font-bold text-red-700 mb-4">Confirm Deletion</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete prescription ID{' '}
          <span className="font-semibold">{prescription?.prescriptionId}</span>? This action cannot be undone.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;