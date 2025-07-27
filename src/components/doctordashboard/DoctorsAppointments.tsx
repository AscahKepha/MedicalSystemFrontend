// src/components/doctordashboard/DoctorsAppointments.tsx

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../app/types';
import {
    useGetAppointmentsByDoctorIdQuery, // Use the doctor-specific hook
    useAddAppointmentMutation,
    useUpdateAppointmentMutation, // For editing
    useDeleteAppointmentMutation, // If doctors can delete
    type AppointmentData,
    type AppointmentStatus,
} from '../../features/api/AppointmentsApi'; // Adjust path if necessary

// --- 1. Reusable CreateAppointmentModal (Slightly adjusted for doctor's context) ---
interface DoctorCreateAppointmentModalProps {
    onClose: () => void;
    onSuccess: () => void;
    prefillDoctorId?: number; // Optional prop to pre-fill doctor ID
}

const DoctorCreateAppointmentModal: React.FC<DoctorCreateAppointmentModalProps> = ({ onClose, onSuccess, prefillDoctorId }) => {
    const [addAppointment, { isLoading, isError, error }] = useAddAppointmentMutation();
    const [formData, setFormData] = useState<{
        patientId: number | ''; // Patient ID to be selected
        doctorId: number | '';
        userId: number | '';
        appointmentDate: string;
        totalAmount:string;
        timeSlot: string;
        startTime: string;
        endTime: string;
        reason: string;
    }>({
        patientId: '',
        doctorId: prefillDoctorId || '', // Pre-fill if provided
        userId: '',
        appointmentDate: '',
        totalAmount: '',
        timeSlot: '',
        startTime: '',
        endTime: '',
        reason: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                patientId: parseInt(formData.patientId as string, 10),
                doctorId: parseInt(formData.doctorId as string, 10),
                userId:parseInt(formData.userId as string ,10),
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.timeSlot, // Use timeSlot for appointment time
                timeSlot: formData.timeSlot,
                startTime: formData.startTime,
                endTime: formData.endTime,
                reason: formData.reason,
                totalAmount: formData.totalAmount, 
            };
            await addAppointment(payload).unwrap();
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to create appointment:', err);
            alert(`Failed to create appointment: ${(err as any)?.data?.message || 'Unknown error.'}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID</label>
                        <input
                            type="number"
                            id="patientId"
                            name="patientId"
                            value={formData.patientId}
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
                            readOnly={!!prefillDoctorId} // Make read-only if pre-filled
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${prefillDoctorId ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
                        <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Time Slot (HH:MM:SS)</label>
                        <input
                            type="time"
                            id="timeSlot"
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleChange}
                            required
                            step="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time (HH:MM:SS)</label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            step="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time (HH:MM:SS)</label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            step="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Appointment</label>
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
                            Error: {(error as any)?.data?.message || 'Failed to create appointment.'}
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

// --- 2. Reusable UpdateAppointmentModal (Adjusted for Doctor's context) ---
interface DoctorUpdateAppointmentModalProps {
    appointment: AppointmentData;
    onClose: () => void;
    onSuccess: () => void;
}

const DoctorUpdateAppointmentModal: React.FC<DoctorUpdateAppointmentModalProps> = ({ appointment, onClose, onSuccess }) => {
    const [updateAppointment, { isLoading, isError, error }] = useUpdateAppointmentMutation();
    const [formData, setFormData] = useState<{
        patientId: number | '';
        doctorId: number | '';
        appointmentDate: string;
        timeSlot: string;
        startTime: string;
        endTime: string;
        reason: string;
        appointmentStatus: AppointmentStatus; // Changed to match schema
        totalAmount: string; // Add totalAmount for doctors to potentially update
    }>({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentDate: appointment.appointmentDate,
        timeSlot: appointment.timeSlot,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        reason: appointment.reason,
        appointmentStatus: appointment.status, 
        totalAmount: appointment.totalAmount,
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
                patientId: parseInt(formData.patientId as string, 10),
                doctorId: parseInt(formData.doctorId as string, 10),
                totalAmount: formData.totalAmount, // Ensure it's a string for numeric type
            };
            await updateAppointment(payload).unwrap();
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to update appointment:', err);
            alert(`Failed to update appointment: ${(err as any)?.data?.message || 'Unknown error.'}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Update Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient ID</label>
                        <input
                            type="number"
                            id="patientId"
                            name="patientId"
                            value={formData.patientId}
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
                            readOnly // Doctors usually can't change their own ID for an appointment
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
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
                        <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Time Slot (HH:MM:SS)</label>
                        <input
                            type="time"
                            id="timeSlot"
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleChange}
                            required
                            step="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time (HH:MM:SS)</label>
                        <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            step="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time (HH:MM:SS)</label>
                        <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            step="1"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount</label>
                        <input
                            type="text" // Use text for numeric to handle string representation
                            id="totalAmount"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
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
                        <label htmlFor="appointmentStatus" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            id="appointmentStatus"
                            name="appointmentStatus"
                            value={formData.appointmentStatus}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rescheduled">Rescheduled</option>
                        </select>
                    </div>
                    {isError && (
                        <p className="text-red-500 text-sm">
                            Error: {(error as any)?.data?.message || 'Failed to update appointment.'}
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


// --- DoctorsAppointments Component ---
const DoctorsAppointments: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const doctorId = user?.userId; // Assuming userId from auth state is the doctorId

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

    const { data: appointments, isLoading, isError, error, refetch } = useGetAppointmentsByDoctorIdQuery(
        doctorId as number,
        {
            skip: !doctorId, // Skip the query if doctorId is not available
        }
    );

    const [deleteAppointment, { isLoading: isDeleting }] = useDeleteAppointmentMutation();

    const handleModalSuccess = () => {
        refetch(); // Refetch appointments after a successful CUD operation
    };

    const handleEditClick = (appointment: AppointmentData) => {
        setSelectedAppointment(appointment);
        setShowUpdateModal(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm(`Are you sure you want to delete appointment ${id}? This action cannot be undone.`)) {
            try {
                await deleteAppointment(id).unwrap();
                // RTK Query invalidatesTags should handle refetching
            } catch (err) {
                console.error('Failed to delete appointment:', err);
                alert(`Failed to delete appointment: ${(err as any)?.data?.message || 'Unknown error.'}`);
            }
        }
    };

    if (!doctorId) {
        return <div className="text-red-500 p-4">Please log in as a doctor to view appointments.</div>;
    }

    if (isLoading) {
        return <div className="text-center p-4">Loading your appointments...</div>;
    }

    if (isError) {
        console.error("Error fetching doctor appointments:", error);
        return (
            <div className="text-red-500 p-4">
                Error loading your appointments: {(error as any)?.data?.message || 'Please try again later.'}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">My Appointments</h1>

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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.appointmentId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.patientId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.appointmentDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.timeSlot}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.startTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.endTime}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate max-w-xs">{appointment.reason}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(appointment.totalAmount).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-orange-100 text-orange-800' // For 'rescheduled'
                                            }`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
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
                    <p className="text-center text-gray-600 text-lg mt-10">No appointments found.</p>
                )}
            </div>

            {showCreateModal && doctorId && (
                <DoctorCreateAppointmentModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleModalSuccess}
                    prefillDoctorId={doctorId} // Pre-fill doctor ID
                />
            )}

            {showUpdateModal && selectedAppointment && (
                <DoctorUpdateAppointmentModal
                    appointment={selectedAppointment}
                    onClose={() => setShowUpdateModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
};

export default DoctorsAppointments;