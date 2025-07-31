import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: number;
  onSubmit: (newDate: string, newTime: string) => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  onSubmit,
}) => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl font-semibold mb-4">Reschedule Appointment #{appointmentId}</h2>
        <div className="mb-3">
          <label className="text-sm text-gray-700 block mb-1">New Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-700 block mb-1">New Time</label>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(newDate, newTime)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            Reschedule
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RescheduleModal;
