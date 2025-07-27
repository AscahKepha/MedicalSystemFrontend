import React, { useState } from 'react';
import {
  useGetComplaintsByUserIdQuery,
  useAddComplaintMutation,
  type ComplaintData,
  type ComplaintStatus,
} from '../../features/api/ComplaintsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types'; // Assuming your RootState is here

const DoctorsComplaints: React.FC = () => {
  // Assuming you store the logged-in user's ID in your Redux store,
  // typically in an auth slice. Adjust the selector path as needed.
  const userId = useSelector((state: RootState) => state.auth.user?.id); // Get userId from Redux store
  const userRole = useSelector((state: RootState) => state.auth.user?.role); // Get userRole if needed for conditional rendering

  // State for the new complaint form
  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    description: '',
    relatedAppointmentId: '', // Optional: if you want to link complaints to appointments
  });

  const {
    data: complaints = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetComplaintsByUserIdQuery(userId?.toString() || '', {
    // Skip the query if userId is not available (e.g., user not logged in)
    skip: !userId,
  });

  const [addComplaint, { isLoading: isAddingComplaint }] =
    useAddComplaintMutation();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewComplaint((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('You must be logged in to submit a complaint.');
      return;
    }

    if (!newComplaint.subject || !newComplaint.description) {
      alert('Subject and description are required.');
      return;
    }

    try {
      await addComplaint({
        subject: newComplaint.subject,
        description: newComplaint.description,
        userId: userId, // Pass the logged-in userId
        relatedAppointmentId: newComplaint.relatedAppointmentId
          ? parseInt(newComplaint.relatedAppointmentId) // Parse to number if it exists
          : undefined, // Send undefined if not provided
      }).unwrap();
      alert('Complaint submitted successfully!');
      setNewComplaint({ subject: '', description: '', relatedAppointmentId: '' }); // Clear form
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert('Failed to submit complaint. Please try again.');
    }
  };

  const getStatusClasses = (status: ComplaintStatus) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'In Progress': // Ensure case matches your enum/backend values exactly
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          My Complaints
        </h1>

        {/* Create Complaint Section */}
        <div className="mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Submit a New Complaint
          </h2>
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={newComplaint.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={newComplaint.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <div>
              <label htmlFor="relatedAppointmentId" className="block text-sm font-medium text-gray-700 mb-1">
                Related Appointment ID (Optional)
              </label>
              <input
                type="number" // Use type number for IDs
                id="relatedAppointmentId"
                name="relatedAppointmentId"
                value={newComplaint.relatedAppointmentId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 123"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isAddingComplaint}
            >
              {isAddingComplaint ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </div>

        {/* View Complaints Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          My Existing Complaints
        </h2>

        {isLoading || isFetching ? (
          <p className="text-center text-gray-600 text-lg">Loading your complaints...</p>
        ) : error ? (
          <div className="text-center text-red-600 text-lg">
            Error loading your complaints.
            <button
              onClick={refetch}
              className="ml-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : complaints.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You have no complaints submitted yet.
          </p>
        ) : (
          <div className="space-y-6">
            {complaints.map((complaint: ComplaintData) => (
              <div
                key={complaint.id}
                className="border border-gray-200 rounded-lg p-5 hover:shadow transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {complaint.subject}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                      complaint.status
                    )}`}
                  >
                    {complaint.status}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{complaint.description}</p>
                {complaint.relatedAppointmentId && (
                  <p className="text-sm text-gray-600 mb-1">
                    Related Appointment ID: {complaint.relatedAppointmentId}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Submitted:{' '}
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
                {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last Updated:{' '}
                    {new Date(complaint.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsComplaints;