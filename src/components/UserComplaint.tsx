import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {type RootState}  from '../../src/app/store';
import {
  useGetComplaintsQuery, 
  useAddComplaintMutation,
  useGetComplaintsByUserIdQuery,
  type ComplaintData,
  type ComplaintStatus,
} from '../../src/features/api/ComplaintsApi'; // Adjust path if your services folder is elsewhere

const UserComplaintsPage: React.FC = () => {
  // --- Get current user ID from Redux auth state ---
  // Assuming your auth slice stores the user's ID as 'id' or 'userId'
  const currentUserId = useSelector((state: RootState) => state.auth.user?.id); // Or state.auth.user?.userId

  // State for fetching a single complaint by ID
  const [singleComplaintIdInput, setSingleComplaintIdInput] = useState<string>(''); // Input field value
  const [displaySingleComplaintId, setDisplaySingleComplaintId] = useState<string | null>(null); // ID to trigger query

  // RTK Query hook for a single complaint by its ID
  // This query will only run if displaySingleComplaintId is a non-empty string
  const {
    data: singleComplaintArray, // This will be ComplaintData[] | undefined
    isLoading: isSingleComplaintLoading,
    error: singleComplaintError,
  } = useGetComplaintsByUserIdQuery(displaySingleComplaintId || '', {
    skip: !displaySingleComplaintId, // Skip query if no ID is set
  });

  // Get the first complaint from the array (if any)
  const singleComplaint = Array.isArray(singleComplaintArray) ? singleComplaintArray[0] : undefined;

  // RTK Query hook to get complaints specific to the current user
  // This query will only run if currentUserId is available
  const {
    data: userComplaints, // This will be ComplaintData[] | undefined
    error: userComplaintsError,
    isLoading: isUserComplaintsLoading,
    isFetching: isUserComplaintsFetching,
    refetch: refetchUserComplaints,
  } = useGetComplaintsByUserIdQuery(currentUserId || '', { // Pass currentUserId directly (assuming it's string/number)
    skip: !currentUserId, // Skip query if no user ID
  });

  // Mutation hook for adding a new complaint
  const [addComplaint, { isLoading: isAddingComplaint }] = useAddComplaintMutation();

  // State for the new complaint form
  const [newComplaintSubject, setNewComplaintSubject] = useState('');
  const [newComplaintDescription, setNewComplaintDescription] = useState('');

  // Helper function to determine Tailwind CSS classes based on complaint status
  const getStatusClasses = (status: ComplaintStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler for submitting a new complaint
  const handleAddComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintSubject.trim() || !newComplaintDescription.trim()) {
      console.error('Subject and description cannot be empty.');
      // Consider showing a user-friendly message in the UI
      return;
    }
    if (!currentUserId) {
      console.error('User ID not available. Cannot submit complaint.');
      // Consider showing a user-friendly message in the UI or redirecting
      return;
    }

    try {
      await addComplaint({
        subject: newComplaintSubject,
        description: newComplaintDescription,
        userId: currentUserId,
      }).unwrap();
      setNewComplaintSubject('');
      setNewComplaintDescription('');
      // RTK Query's invalidatesTags will automatically re-fetch the user's complaints list
    } catch (error) {
      console.error('Failed to add complaint:', error);
      // Implement user-friendly error display here
    }
  };

  // Handler for viewing a single complaint details by button click
  const handleViewDetailsClick = (complaintId: string) => {
    setDisplaySingleComplaintId(complaintId);
    setSingleComplaintIdInput(complaintId); // Also update the input field
  };

  // Handler for manually triggering single complaint fetch from input
  const handleFetchSingleComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    // Only set the ID if the input is not empty to avoid unnecessary queries
    setDisplaySingleComplaintId(singleComplaintIdInput.trim() || null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gray-50 font-inter">
      <div className="container mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10 lg:p-12 max-w-4xl w-full">

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 text-center">
          My Complaints {currentUserId ? `(User ID: ${currentUserId})` : '(Not logged in)'}
        </h1>

        {/* Form to submit a new complaint */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Submit a New Complaint</h3>
          {!currentUserId ? (
            <p className="text-red-600 text-center">Please log in to submit a complaint.</p>
          ) : (
            <form onSubmit={handleAddComplaint} className="space-y-4">
              <div>
                <label htmlFor="newComplaintSubject" className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  id="newComplaintSubject"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2"
                  placeholder="e.g., Broken link, app crash"
                  value={newComplaintSubject}
                  onChange={(e) => setNewComplaintSubject(e.target.value)}
                  required
                  disabled={isAddingComplaint}
                />
              </div>
              <div>
                <label htmlFor="newComplaintDescription" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="newComplaintDescription"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2"
                  placeholder="Provide a detailed description of your issue..."
                  value={newComplaintDescription}
                  onChange={(e) => setNewComplaintDescription(e.target.value)}
                  required
                  disabled={isAddingComplaint}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isAddingComplaint}
              >
                {isAddingComplaint ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          )}
        </div>

        {/* User's Complaints List */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Submitted Complaints</h2>
        {!currentUserId ? (
            <p className="text-gray-600 text-center py-4">Log in to view your complaints.</p>
        ) : (
            <>
                {(isUserComplaintsLoading || isUserComplaintsFetching) && (
                <div className="text-center text-gray-600 text-lg py-4">
                    Loading your complaints...
                </div>
                )}
                {userComplaintsError && (
                <div className="text-center text-red-600 text-lg py-4">
                    Error loading your complaints: {JSON.stringify(userComplaintsError)}
                    <button onClick={() => refetchUserComplaints()} className="ml-4 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
                    Retry
                    </button>
                </div>
                )}
                {!isUserComplaintsLoading && !isUserComplaintsFetching && (!userComplaints || userComplaints.length === 0) && (
                <div className="text-center text-gray-600 text-lg py-4">
                    You have not submitted any complaints yet.
                </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                {userComplaints?.map((complaint: ComplaintData) => ( // Explicitly typed here
                    <div
                    key={complaint.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 hover:shadow-md transition duration-200 ease-in-out"
                    >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                        <h3 className="text-xl font-semibold text-gray-800">{complaint.subject}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(complaint.status)}`}>
                        {complaint.status}
                        </span>
                    </div>
                    <p className="text-gray-700 mb-3">{complaint.description}</p>
                    <p className="text-sm text-gray-500">
                        Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                    {complaint.updatedAt && complaint.createdAt !== complaint.updatedAt && (
                        <p className="text-xs text-gray-400 mt-1">
                        Last Updated: {new Date(complaint.updatedAt).toLocaleDateString()}
                        </p>
                    )}
                    <button
                        onClick={() => handleViewDetailsClick(complaint.id)}
                        className="mt-4 bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition-colors"
                    >
                        View Details
                    </button>
                    </div>
                ))}
                </div>
            </>
        )}


        {/* Section to get a single complaint by ID */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">View Single Complaint Details</h3>
          <form onSubmit={handleFetchSingleComplaint} className="mb-4">
            <label htmlFor="viewComplaintId" className="block text-sm font-medium text-gray-700">Enter Complaint ID:</label>
            <div className="flex gap-2 mt-1">
                <input
                    type="text"
                    id="viewComplaintId"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2"
                    placeholder="e.g., comp1"
                    value={singleComplaintIdInput}
                    onChange={(e) => setSingleComplaintIdInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    disabled={isSingleComplaintLoading}
                >
                    {isSingleComplaintLoading ? 'Fetching...' : 'Fetch'}
                </button>
            </div>
          </form>

          {isSingleComplaintLoading && (
            <div className="text-center text-gray-600 py-2">Loading single complaint...</div>
          )}
          {singleComplaintError && (
            <div className="text-center text-red-600 py-2">Error loading complaint: {JSON.stringify(singleComplaintError)}</div>
          )}
          {/* Display single complaint details if available */}
          {displaySingleComplaintId && !isSingleComplaintLoading && !singleComplaintError && singleComplaint && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Complaint ID: {singleComplaint.id}</h4>
              <p className="text-blue-700"><strong>Subject:</strong> {singleComplaint.subject}</p>
              <p className="text-blue-700"><strong>Description:</strong> {singleComplaint.description}</p>
              <p className="text-blue-700"><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(singleComplaint.status)}`}>{singleComplaint.status}</span></p>
              <p className="text-blue-700 text-sm">Submitted: {new Date(singleComplaint.createdAt).toLocaleDateString()}</p>
              {singleComplaint.userId && <p className="text-blue-700 text-sm">Submitted by User ID: {singleComplaint.userId}</p>}
            </div>
          )}
          {/* Message if no single complaint found for the given ID */}
          {displaySingleComplaintId && !isSingleComplaintLoading && !singleComplaintError && !singleComplaint && (
            <div className="text-center text-gray-600 py-2">No complaint found for ID: {displaySingleComplaintId}.</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserComplaintsPage;
