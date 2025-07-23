import React from 'react';
import {
  useGetComplaintsQuery,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
  type ComplaintStatus,
  type ComplaintData,
} from '../../features/api/ComplaintsApi';

const AdminComplaintsPage: React.FC = () => {
  const {
    data: complaints = [], // Default to empty array to avoid undefined errors
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetComplaintsQuery();

  const [updateComplaintStatus, { isLoading: isUpdating }] =
    useUpdateComplaintStatusMutation();
  const [deleteComplaint, { isLoading: isDeleting }] =
    useDeleteComplaintMutation();

  const getStatusClasses = (status: ComplaintStatus) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (
    complaintId: string,
    currentStatus: ComplaintStatus
  ) => {
    const statusCycle: ComplaintStatus[] = ['open', 'In Progress', 'resolved', 'closed'];
    const nextIndex = (statusCycle.indexOf(currentStatus) + 1) % statusCycle.length;
    const nextStatus = statusCycle[nextIndex];

    try {
      await updateComplaintStatus({
        complaintsId: complaintId,
        complaintStatus: nextStatus,
      }).unwrap();
    } catch (err) {
      console.error('Error updating complaint status:', err);
      alert('Failed to update complaint status. Please try again.');
    }
  };

  const handleDeleteComplaint = async (complaintId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this complaint? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deleteComplaint(complaintId).unwrap();
    } catch (err) {
      console.error('Error deleting complaint:', err);
      alert('Failed to delete complaint. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          All Customer Complaints
        </h1>

        {/* Loading State */}
        {isLoading || isFetching ? (
          <p className="text-center text-gray-600 text-lg">Loading complaints...</p>
        ) : error ? (
          // Error State
          <div className="text-center text-red-600 text-lg">
            Error loading complaints.
            <button
              onClick={refetch}
              className="ml-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : complaints.length === 0 ? (
          // Empty State
          <p className="text-center text-gray-600 text-lg">No complaints found.</p>
        ) : (
          // List of Complaints
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(
                        complaint.status
                      )}`}
                    >
                      {complaint.status}
                    </span>
                    <button
                      onClick={() => handleUpdateStatus(complaint.id, complaint.status)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Change Status'}
                    </button>
                    <button
                      onClick={() => handleDeleteComplaint(complaint.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">{complaint.description}</p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
                {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    Last Updated: {new Date(complaint.updatedAt).toLocaleDateString()}
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

export default AdminComplaintsPage;
