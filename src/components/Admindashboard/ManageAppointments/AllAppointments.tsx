import { useState } from 'react';
import {
  useGetAppointmentsQuery,
  useDeleteAppointmentMutation,
} from '../../../features/api/AppointmentsApi';
import CreateAppointmentModal from './modals/CreateAppointmentModal';
import UpdateAppointmentModal from './modals/UpdateAppointmentModal';
import ViewAppointmentModal from './modals/ViewAppointmentModal';
import type { AppointmentData, AppointmentStatus } from '../../../types/appointmentTypes';

export const AllAppointments = () => {
  const { data: rawAppointments, error, isLoading, refetch } = useGetAppointmentsQuery();
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [appointmentIdToView, setAppointmentIdToView] = useState<number | null>(null);

  const appointments: AppointmentData[] = (rawAppointments ?? []).map((a) => {
    const record = a as Record<string, any>;

    return {
      ...(a as AppointmentData),
      totalAmount: typeof record.totalAmount === 'string' ? parseFloat(record.totalAmount) : 0,
      status: record.appointmentStatus as AppointmentStatus ?? 'pending',
      patientId: record.patientId,
      doctor: record.doctor, // Ensure backend sends doctor: { firstName, lastName }
      patient: record.patient, // Ensure backend sends patient: { firstName, lastName }
    };
  });

  const handleDelete = async (id: number) => {
    if (window.confirm(`Are you sure you want to delete appointment ${id}?`)) {
      try {
        await deleteAppointment(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Failed to delete appointment:', err);
        alert('Failed to delete appointment. Please try again.');
      }
    }
  };

  const handleEditClick = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setShowUpdateModal(true);
  };

  const handleViewClick = (id: number) => {
    setAppointmentIdToView(id);
    setShowViewModal(true);
  };

  const handleModalSuccess = () => {
    refetch();
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-700">
        Loading appointments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 text-lg">
        Error:{' '}
        {'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data
          ? (error.data as { message?: string }).message
          : 'Failed to load appointments.'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Admin Appointments Management
        </h1>

        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            Create New Appointment
          </button>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
          >
            Refresh Appointments
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.appointmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.patient?.firstName ?? 'N/A'} {appointment.patient?.lastName ?? ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.doctor?.firstName ?? 'N/A'} {appointment.doctor?.lastName ?? ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.appointmentDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {appointment.appointmentTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">
                      {appointment.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status ?? 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(appointment.appointmentId)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(appointment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.appointmentId)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-10">
            No appointments found. Start by creating one!
          </p>
        )}
      </div>

      {showCreateModal && (
        <CreateAppointmentModal onClose={() => setShowCreateModal(false)} onSuccess={handleModalSuccess} />
      )}

      {showUpdateModal && selectedAppointment && (
        <UpdateAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {showViewModal && appointmentIdToView !== null && (
        <ViewAppointmentModal
          appointmentId={appointmentIdToView}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default AllAppointments;
