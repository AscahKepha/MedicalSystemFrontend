import React, { useState } from 'react';
import { useAddAppointmentMutation } from '../../../features/api/AppointmentsApi';
import type { AppointmentStatus } from '../../../types/appointmentTypes';

interface BookAppointmentModalProps {
  patientId: number;
  doctor: {
    doctorId: number;
    userId: number;
    firstName?: string;
    lastName?: string;
    availability: { day: string; start: string; end: string }[];
  };
  onClose: () => void;
  onSuccess: () => void;
 isOpen?: boolean; // Optional prop to control modal visibility
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  patientId,
  doctor,
  onClose,
  onSuccess,
//   isOpen = true, // Default to true if not provided
  
}) => {
  const [addAppointment, { isLoading, isError, error }] = useAddAppointmentMutation();

  const [formData, setFormData] = useState({
    appointmentDate: '',
    timeSlot: '',
    startTime: '',
    endTime: '',
    reason: '',
    totalAmount: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedAmount = parseFloat(formData.totalAmount);

    if (isNaN(parsedAmount)) {
      alert("❌ Total amount must be a valid number.");
      return;
    }

    try {
      const payload = {
        patientId,
        userId: doctor.userId,
        doctorId: doctor.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.timeSlot,
        timeSlot: formData.timeSlot,
        startTime: formData.startTime,
        endTime: formData.endTime,
        reason: formData.reason,
        totalAmount: parsedAmount,
        appointmentStatus: 'pending' as AppointmentStatus,
      };

      await addAppointment(payload).unwrap();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('[Appointment Error]', err);
      alert(`Failed to book appointment: ${(err as any)?.data?.message || 'Unknown error.'}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Book Appointment with {doctor.firstName} {doctor.lastName}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            placeholder="Time Slot (e.g. 9:00 - 10:00)"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Reason for appointment"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="totalAmount"
            value={formData.totalAmount}
            onChange={handleChange}
            placeholder="Total Amount"
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isLoading ? 'Booking...' : 'Book Appointment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>

          {isError && (
            <p className="text-red-500 text-sm">
              Error: {(error as any)?.data?.message || 'Something went wrong'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;
