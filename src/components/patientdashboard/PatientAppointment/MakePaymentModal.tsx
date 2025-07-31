import React from 'react';
import { motion } from 'framer-motion';

interface MakePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  amount: number;
  onConfirm: () => void;
}

const MakePaymentModal: React.FC<MakePaymentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  amount,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl font-semibold mb-2">Make Payment</h2>
        <p className="mb-4 text-sm text-gray-700">
          You're about to pay <span className="font-bold">Ksh {amount}</span> for Appointment #{appointmentId}.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
          >
            Confirm Payment
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MakePaymentModal;
