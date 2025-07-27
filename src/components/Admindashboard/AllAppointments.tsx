import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  type AppointmentStatus,
  type AppointmentData,
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useAddAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsByPatientIdQuery,
  useGetAppointmentsByDoctorIdQuery,
} from '../../features/api/AppointmentsApi'; // Adjust this path to your actual AppointmentsApi.ts

// Define prop types for CreateAppointmentModal
interface CreateAppointmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Define prop types for UpdateAppointmentModal
interface UpdateAppointmentModalProps {
  appointment: AppointmentData;
  onClose: () => void;
  onSuccess: () => void;
}

// Define prop types for ViewAppointmentModal
interface ViewAppointmentModalProps {
  appointmentId: number;
  onClose: () => void;
}


// --- 1. src/components/Modals/CreateAppointmentModal.jsx ---
const CreateAppointmentModal = ({ onClose, onSuccess }: CreateAppointmentModalProps) => {
  // These hooks now come directly from your imported AppointmentsApi
  const [addAppointment, { isLoading, isError, error }] = useAddAppointmentMutation();
  // FIX: Initializing userId and doctorId as numbers or null/undefined if they can be empty
  const [formData, setFormData] = useState<{ userId: number | ''; doctorId: number | ''; appointmentDate: string; appointmentTime: string; reason: string; }>({
    userId: '', // Keep as string initially if input type is text, or use 0 if number
    doctorId: '', // Keep as string initially if input type is text, or use 0 if number
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });

  // FIX: Added type annotation for 'e' as React.ChangeEvent
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // FIX: Added type annotation for 'e' as React.FormEvent
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        // FIX: Ensure userId and doctorId are parsed to numbers before sending
        userId: parseInt(formData.userId as string, 10),
        doctorId: parseInt(formData.doctorId as string, 10),
      };
      await addAppointment(payload).unwrap();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to create appointment:', err);
      // Error message will be displayed by `isError` and `error` state
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="number"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          {isError && (
            <p className="text-red-500 text-sm">
              Error: {
                (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data)
                  ? (error.data as { message?: string }).message
                  : 'Failed to create appointment.'
              }
            </p>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 2. src/components/Modals/UpdateAppointmentModal.jsx ---
const UpdateAppointmentModal = ({ appointment, onClose, onSuccess }: UpdateAppointmentModalProps) => {
  const [updateAppointment, { isLoading, isError, error }] = useUpdateAppointmentMutation();
  const [formData, setFormData] = useState<{ userId: number | ''; doctorId: number | ''; appointmentDate: string; appointmentTime: string; reason: string; status: AppointmentStatus; }>({
    userId: appointment.userId,
    doctorId: appointment.doctorId,
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    reason: appointment.reason,
    status: appointment.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        appointmentId: appointment.appointmentId,
        ...formData,
        userId: parseInt(formData.userId as string, 10),
        doctorId: parseInt(formData.doctorId as string, 10),
      };
      await updateAppointment(payload).unwrap();
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to update appointment:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="number"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>
          {isError && (
            <p className="text-red-500 text-sm">
              Error: {
                (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data)
                  ? (error.data as { message?: string }).message
                  : 'Failed to update appointment.'
              }
            </p>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
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

// --- 3. src/components/Modals/ViewAppointmentModal.jsx ---
const ViewAppointmentModal = ({ appointmentId, onClose }: ViewAppointmentModalProps) => {
  const { data: appointment, isLoading, isError, error } = useGetAppointmentByIdQuery(appointmentId);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Appointment Details</h2>
        {isLoading && <p className="text-gray-600">Loading appointment details...</p>}
        {isError && (
          <p className="text-red-500">
            Error: {
              (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data)
                ? (error.data as { message?: string }).message
                : 'Failed to load appointment details.'
            }
          </p>
        )}
        {appointment && (
          <div className="space-y-2 text-gray-700">
            <p><strong>ID:</strong> {appointment.appointmentId}</p>
            <p><strong>User ID:</strong> {appointment.userId}</p>
            <p><strong>Doctor ID:</strong> {appointment.doctorId}</p>
            <p><strong>Date:</strong> {appointment.appointmentDate}</p>
            <p><strong>Time:</strong> {appointment.appointmentTime}</p>
            <p><strong>Reason:</strong> {appointment.reason}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${
              appointment.status === 'scheduled' ? 'text-blue-600' :
              appointment.status === 'completed' ? 'text-green-600' :
              appointment.status === 'cancelled' ? 'text-red-600' :
              'text-orange-600'
            }`}>{appointment.status}</span></p>
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


// --- 4. src/pages/AppointmentsPage.jsx ---
export const AllAppointments = () => {
  const { data: appointments, error, isLoading, refetch } = useGetAppointmentsQuery();
  const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();

  // FIX: Explicitly type selectedAppointment to be AppointmentData or null
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [appointmentIdToView, setAppointmentIdToView] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    // IMPORTANT: Replace window.confirm with a custom modal for production apps in Canvas
    if (window.confirm(`Are you sure you want to delete appointment ${id}?`)) {
      try {
        await deleteAppointment(id).unwrap();
        // RTK Query automatically refetches if invalidatesTags is set up correctly
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
    refetch(); // Manually refetch after a successful create/update/delete if needed, though RTK Query often handles this with invalidatesTags
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-screen text-lg font-semibold text-gray-700">Loading appointments...</div>;
  if (error) return (
    <div className="flex items-center justify-center min-h-screen text-red-600 text-lg">
      Error: {
        (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data)
          ? (error.data as { message?: string }).message
          : 'Failed to load appointments.'
      }
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Admin Appointments Management</h1>

        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Create New Appointment
          </button>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Refresh Appointments
          </button>
        </div>

        {appointments && appointments.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.appointmentId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.doctorId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.appointmentDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.appointmentTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">{appointment.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(appointment.appointmentId)}
                          className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditClick(appointment)}
                          className="text-blue-600 hover:text-blue-900 transition duration-150 ease-in-out"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.appointmentId)}
                          className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
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
          <p className="text-center text-gray-600 text-lg mt-10">No appointments found. Start by creating one!</p>
        )}
      </div>

      {showCreateModal && (
        <CreateAppointmentModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {showUpdateModal && selectedAppointment && ( // FIX: Conditionally render based on selectedAppointment not being null
        <UpdateAppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}

      {showViewModal && appointmentIdToView !== null && ( // FIX: Conditionally render based on appointmentIdToView not being null
        <ViewAppointmentModal
          appointmentId={appointmentIdToView}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default AllAppointments;
