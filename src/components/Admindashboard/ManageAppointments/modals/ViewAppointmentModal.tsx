import { useEffect } from 'react';
import { useGetAppointmentByIdQuery } from '../../../../features/api/AppointmentsApi';
import { skipToken } from '@reduxjs/toolkit/query';
import type { AppointmentStatus } from '../../../../types/appointmentTypes';

interface ViewAppointmentModalProps {
  appointmentId: number | undefined;
  onClose: () => void;
}

const ViewAppointmentModal = ({ appointmentId, onClose }: ViewAppointmentModalProps) => {
  useEffect(() => {
    console.log('🧾 appointmentId passed to modal:', appointmentId);
  }, [appointmentId]);

  const {
    data: appointment,
    isLoading,
    isError,
    error,
  } = useGetAppointmentByIdQuery(appointmentId ?? skipToken);

  useEffect(() => {
    if (appointment) {
      console.log('📦 Appointment data fetched:', appointment);
    }
  }, [appointment]);

  useEffect(() => {
    if (isError) {
      console.error('❌ Error fetching appointment:', error);
    }
  }, [isError, error]);

  const getStatusBadgeColor = (status: AppointmentStatus | undefined): string => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-cyan-100 text-cyan-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: unknown): string => {
    const num =
      typeof amount === 'number'
        ? amount
        : typeof amount === 'string'
        ? parseFloat(amount)
        : NaN;
    return isNaN(num) ? 'N/A' : `$${num.toFixed(2)}`;
  };

  if (!appointmentId) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-xl font-semibold text-red-600">❌ Missing Appointment ID</h2>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Appointment Details</h2>

        {isLoading && <p className="text-gray-600">Loading appointment details...</p>}

        {isError && (
          <p className="text-red-500">
            Error:{' '}
            {error &&
            typeof error === 'object' &&
            'data' in error &&
            error.data &&
            typeof error.data === 'object' &&
            'message' in error.data
              ? (error.data as { message?: string }).message
              : 'Failed to load appointment details.'}
          </p>
        )}

        {appointment && (
          <div className="space-y-2 text-gray-700">
            <p><strong>ID:</strong> {appointment.appointmentId}</p>
            <p><strong>Doctor:</strong> {appointment.doctor?.firstName} {appointment.doctor?.lastName}</p>
            <p><strong>Patient:</strong> {appointment.patient?.firstName} {appointment.patient?.lastName}</p>
            <p><strong>Total Amount:</strong> {formatAmount(appointment.totalAmount)}</p>
            <p><strong>Time Slot:</strong> {appointment.timeSlot || 'N/A'}</p>
            <p><strong>Start Time:</strong> {appointment.startTime || 'N/A'}</p>
            <p><strong>End Time:</strong> {appointment.endTime || 'N/A'}</p>
            <p><strong>Date:</strong> {appointment.appointmentDate}</p>
            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
            <p><strong>Reason:</strong> {appointment.reason || 'N/A'}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                {appointment.status ?? 'Unknown'}
              </span>
            </p>
            <p><strong>Created At:</strong> {new Date(appointment.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(appointment.updatedAt).toLocaleString()}</p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointmentModal;
