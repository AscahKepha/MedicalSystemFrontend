// src/components/patientdashboard/PatientAppointments.tsx

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../app/types';
import {
    useGetAppointmentsByPatientIdQuery, // Use the patient-specific hook
    useAddAppointmentMutation,
    type AppointmentData,
    type AppointmentStatus,
} from '../../features/api/AppointmentsApi'; // Adjust path if necessary

// --- Modal for Booking New Appointment ---
interface BookAppointmentModalProps {
    patientId: number; // The current logged-in patient's ID
    onClose: () => void;
    onSuccess: () => void;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ patientId, onClose, onSuccess }) => {
    const [addAppointment, { isLoading, isError, error }] = useAddAppointmentMutation();
    const [formData, setFormData] = useState({
        userId: '', // User ID from Redux state
        doctorId: '', // Doctor ID as string from input
        appointmentDate: '',
        timeSlot: '',   // New field: timeSlot
        startTime: '',  // New field: startTime
        endTime: '',
        totalAmount: '',
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
                patientId: patientId, // Automatically assign current patient's ID
                userId:parseInt(formData.userId,10),
                doctorId: parseInt(formData.doctorId, 10), 
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.timeSlot, // Use timeSlot for appointment time
                timeSlot: formData.timeSlot,
                startTime: formData.startTime,
                endTime: formData.endTime,
                reason: formData.reason,
                totalAmount: formData.totalAmount, 
                // appointmentStatus will default to 'pending' as per API definition
                // totalAmount will default to '0.00' as per API definition
            };
            await addAppointment(payload).unwrap();
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Failed to book appointment:', err);
            // Enhanced error message display
            alert(`Failed to book appointment: ${(err as any)?.data?.message || 'Unknown error.'}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Book New Appointment</h2>
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">Time Slot (e.g., 09:00:00)</label>
                        <input
                            type="time" // Use type="time" for time input, or text if you want freeform
                            id="timeSlot"
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleChange}
                            required
                            step="1" // Allows seconds if needed, otherwise omit for HH:MM
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time (e.g., 09:00:00)</label>
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
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time (e.g., 09:30:00)</label>
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
                            Error: {(error as any)?.data?.message || 'Failed to book appointment.'}
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
                            {isLoading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- PatientAppointments Component ---
const PatientAppointments: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const patientId = user?.userId; // Assuming userId from auth state is the patientId

    const [showBookModal, setShowBookModal] = useState(false);

    const { data: appointments, isLoading, isError, error, refetch } = useGetAppointmentsByPatientIdQuery(
        patientId as number, // Cast to number, but also handle `skip` if patientId is undefined
        {
            skip: !patientId, // Skip the query if patientId is not available
        }
    );

    const handleModalSuccess = () => {
        refetch(); // Refetch appointments after a successful booking
    };

    if (!patientId) {
        return <div className="text-red-500 p-4">Please log in as a patient to view appointments.</div>;
    }

    if (isLoading) {
        return <div className="text-center p-4">Loading your appointments...</div>;
    }

    if (isError) {
        console.error("Error fetching patient appointments:", error);
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

                <div className="mb-6 flex justify-end">
                    <button
                        onClick={() => setShowBookModal(true)}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:scale-105"
                    >
                        Book New Appointment
                    </button>
                </div>

                {appointments && appointments.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.appointmentId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.appointmentId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.doctorId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.appointmentDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{appointment.appointmentTime}</td> {/* Display timeSlot */}
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
                                        {/* You can add actions like 'View' or 'Cancel' for the patient here */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg mt-10">You have no upcoming appointments. Book one now!</p>
                )}
            </div>

            {showBookModal && patientId && (
                <BookAppointmentModal
                    patientId={patientId}
                    onClose={() => setShowBookModal(false)}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
};

export default PatientAppointments;