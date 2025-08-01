import React, { useState } from 'react';
import {
  useGetComplaintsByUserIdQuery,
  useAddComplaintMutation,
  type ComplaintData,
  type ComplaintStatus,
} from '../../features/api/ComplaintsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types';
import toast, { Toaster } from 'react-hot-toast';

const UserComplaintsPage: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [newComplaint, setNewComplaint] = useState({
    subject: '',
    description: '',
    relatedAppointmentId: '',
  });

  const {
    data: complaints = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetComplaintsByUserIdQuery(userId?.toString() || '', {
    skip: !userId,
  });

  const [addComplaint, { isLoading: isAddingComplaint }] = useAddComplaintMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComplaint((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error('You must be logged in to submit a complaint.');
      return;
    }

    if (!newComplaint.subject || !newComplaint.description) {
      toast.error('Subject and description are required.');
      return;
    }

    try {
      await addComplaint({
        subject: newComplaint.subject,
        description: newComplaint.description,
        userId,
        relatedAppointmentId: newComplaint.relatedAppointmentId
          ? parseInt(newComplaint.relatedAppointmentId)
          : undefined,
      }).unwrap();

      toast.success('Complaint submitted successfully!');
      setNewComplaint({ subject: '', description: '', relatedAppointmentId: '' });
    } catch (err) {
      console.error('Error submitting complaint:', err);
      toast.error('Failed to submit complaint. Please try again.');
    }
  };

  const getStatusClasses = (status: ComplaintStatus) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!userId) {
    return (
      <div className="text-center mt-16 text-xl text-red-600">
        You must be logged in to view and submit complaints.
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 font-inter">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-10">
          My Complaints
        </h1>

        {/* Complaint Form */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Submit a New Complaint
          </h2>
          <form onSubmit={handleSubmitComplaint} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-600 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={newComplaint.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={newComplaint.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="relatedAppointmentId" className="block text-sm font-medium text-gray-600 mb-1">
                Related Appointment ID (Optional)
              </label>
              <input
                id="relatedAppointmentId"
                name="relatedAppointmentId"
                type="number"
                value={newComplaint.relatedAppointmentId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={isAddingComplaint}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            >
              {isAddingComplaint ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>
        </section>

        {/* Complaints List */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            My Existing Complaints
          </h2>

          {isLoading || isFetching ? (
            <p className="text-center text-gray-600 text-lg">Loading your complaints...</p>
          ) : error ? (
            <div className="text-center text-red-600">
              Failed to load complaints.
              <button
                onClick={refetch}
                className="ml-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : complaints.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">You haven't submitted any complaints yet.</p>
          ) : (
            <div className="space-y-6">
              {complaints.map((complaint: ComplaintData) => (
                <div
                  key={complaint.id}
                  className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {complaint.subject}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-2">{complaint.description}</p>
                  {complaint.relatedAppointmentId && (
                    <p className="text-sm text-gray-500 mt-2">
                      Related Appointment ID: {complaint.relatedAppointmentId}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                  {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                    <p className="text-xs text-gray-400">
                      Last Updated: {new Date(complaint.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default UserComplaintsPage;
