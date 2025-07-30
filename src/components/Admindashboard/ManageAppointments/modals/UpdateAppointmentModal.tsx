// src/components/modals/UpdateAppointmentModal.tsx

import React, { useState } from 'react';
import { useUpdateAppointmentMutation } from '../../../../features/api/AppointmentsApi';
import type { AppointmentData, AppointmentStatus } from '../../../../types/appointmentTypes';

interface UpdateAppointmentModalProps {
  appointment: AppointmentData;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateAppointmentModal = ({ appointment, onClose, onSuccess }: UpdateAppointmentModalProps) => {
  const [updateAppointment, { isLoading, isError, error }] = useUpdateAppointmentMutation();

const [formData, setFormData] = useState<{
  userId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: AppointmentStatus;
  totalAmount: number; // assuming you accept it as number here
}>({
  userId: appointment.userId,
  doctorId: appointment.doctorId,
  appointmentDate: appointment.appointmentDate,
  appointmentTime: appointment.appointmentTime ?? '', // ✅ fixed
  reason: appointment.reason,
  status: appointment.status ?? 'pending',
  totalAmount: Number(appointment.totalAmount ?? 0), // just in case
});



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'doctorId' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        appointmentId: appointment.appointmentId,
        ...formData,
      };
      await updateAppointment(payload).unwrap();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('❌ Failed to update appointment:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">Doctor ID</label>
            <input
              type="number"
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="rescheduled">Rescheduled</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {isError && (
            <p className="text-red-500 text-sm">
              Error:{' '}
              {(error as any)?.data?.message ?? 'Failed to update appointment.'}
            </p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAppointmentModal;
