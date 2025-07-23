import React, { useState, useMemo } from 'react';
import {
  useGetPrescriptionsQuery,
  // Removed: useAddPrescriptionMutation,
  // Removed: useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  type PrescriptionData, // Using 'type' for interface import
} from '../../features/api/PrescriptionsApi';

// Removed: Define the shape of the form data (no longer needed for create/update)
// interface PrescriptionFormValues {
//   prescriptionId?: number;
//   appointmentId: number | '';
//   doctorId: number | '';
//   patientId: number | '';
//   notes: string;
//   medicationName: string;
//   dosage: string;
//   instructions: string;
//   totalAmount: number | '';
//   issueDate: string;
//   expiryDate?: string;
// }

const AllPrescriptions: React.FC = () => {
  // RTK Query hooks for data fetching and mutations
  const { data: prescriptions = [], error, isLoading, refetch } = useGetPrescriptionsQuery();
  // Removed: const [addPrescriptionMutation, { isLoading: isAdding }] = useAddPrescriptionMutation();
  // Removed: const [updatePrescriptionMutation, { isLoading: isUpdating }] = useUpdatePrescriptionMutation();
  const [deletePrescriptionMutation, { isLoading: isDeleting }] = useDeletePrescriptionMutation();

  // Removed: State to manage the form data for adding/editing a prescription
  // const [formData, setFormData] = useState<PrescriptionFormValues>({...});
  // Removed: State to manage the visibility of the add/edit form
  // const [isFormVisible, setIsFormVisible] = useState(false);

  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<PrescriptionData | null>(null);
  // State for displaying API errors from mutations
  const [apiError, setApiError] = useState<string | null>(null);

  // Combine all loading states for a global loading indicator
  // Removed isAdding, isUpdating
  const overallLoading = isLoading || isDeleting;

  // Helper function to extract error message from RTK Query error object
  const getErrorMessage = (err: any): string => {
    if (typeof err === 'object' && err !== null) {
      if ('data' in err && typeof err.data === 'object' && err.data !== null && 'message' in err.data) {
        return (err.data as { message: string }).message;
      }
      if ('error' in err && typeof err.error === 'string') {
        return err.error;
      }
      return JSON.stringify(err);
    }
    return String(err);
  };

  // Removed: handleInputChange (no form inputs)
  // Removed: handleSubmit (no form submission)
  // Removed: resetForm (no form)
  // Removed: handleAddPrescription (no add button)
  // Removed: handleEditPrescription (no edit button)

  // Function to handle prescription deletion confirmation
  const handleDeleteConfirmation = (prescription: PrescriptionData) => {
    setPrescriptionToDelete(prescription);
    setShowConfirmModal(true);
    setApiError(null); // Clear any previous API errors
  };

  // Function to delete a prescription after confirmation
  const handleDeletePrescription = async () => {
    if (!prescriptionToDelete) return;

    setApiError(null); // Clear previous API errors
    try {
      await deletePrescriptionMutation(prescriptionToDelete.prescriptionId).unwrap();
      setShowConfirmModal(false);
      setPrescriptionToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete prescription:', err);
      setApiError(`Failed to delete prescription: ${getErrorMessage(err)}`);
    }
  };

  // Filter and sort prescriptions based on backend data and search query
  const filteredAndSortedPrescriptions = useMemo(() => {
    let currentPrescriptions = [...prescriptions];

    // Apply search filter
    if (searchQuery) {
      currentPrescriptions = currentPrescriptions.filter(
        (prescription) =>
          prescription.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prescription.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prescription.dosage.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by issueDate (most recent first)
    currentPrescriptions.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return currentPrescriptions;
  }, [prescriptions, searchQuery]); // Re-run memoization if prescriptions data or search query changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans text-gray-800">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <style>
        {`
          body {
            font-family: 'Inter', sans-serif;
          }
          .modal-overlay {
            background-color: rgba(0, 0, 0, 0.5);
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-xl p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
          <i className="fas fa-prescription-bottle-alt mr-3 text-purple-500"></i>
          Prescriptions Administration
        </h1>

        {overallLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <p className="text-lg text-purple-700">Loading data...</p>
            </div>
          </div>
        )}

        {/* Global Fetch Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">
              Failed to load prescriptions: {getErrorMessage(error)}. Please ensure your backend API is running and accessible.
            </span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                onClick={() => refetch()}
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Retry</title>
                <path d="M10 3a7 7 0 00-7 7h-1.5a.5.5 0 00-.354.854l2.5 2.5a.5.5 0 00.708 0l2.5-2.5a.5.5 0 00-.354-.854H10a5 5 0 110 10 5 5 0 010-10zM10 14a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            </span>
          </div>
        )}

        {/* API Operation Error (Delete) */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Operation Error!</strong>
            <span className="block sm:inline ml-2">{apiError}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                onClick={() => setApiError(null)}
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}

        {/* Search Input */}
        <div className="flex justify-end items-center mb-6">
          {/* Removed: Add Prescription Button */}
          <input
            type="text"
            placeholder="Search prescriptions by notes, medication, or dosage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 w-full sm:max-w-xs"
          />
        </div>

        {/* Removed: Add/Edit Prescription Form */}
        {/* {isFormVisible && (...) } */}

        {/* Prescriptions List/Table */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-purple-600 mb-6">Prescriptions List</h2>
          {isLoading && <p className="text-center text-gray-600 text-lg py-8">Fetching prescriptions...</p>}
          {error && !isLoading && <p className="text-center text-red-600 text-lg py-8">Could not load prescriptions.</p>}
          {!isLoading && !error && filteredAndSortedPrescriptions.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-8">No prescriptions found. 📝</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appointment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medication
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedPrescriptions.map((prescription) => (
                    <tr key={prescription.prescriptionId} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {prescription.prescriptionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.appointmentId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prescription.doctorId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prescription.patientId}</td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.medicationName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{prescription.dosage}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {prescription.instructions}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Ksh {(prescription.totalAmount ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prescription.issueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          
                          <button
                            onClick={() => handleDeleteConfirmation(prescription)}
                            className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out transform hover:scale-110"
                            title="Delete Prescription"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm6 2a1 1 0 100 2v3a1 1 0 102 0v-3a1 1 0 00-2 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirmation Modal (remains for delete functionality) */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm mx-auto text-center border border-red-300">
              <h3 className="text-xl font-bold text-red-700 mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete prescription ID{' '}
                <span className="font-semibold">{prescriptionToDelete?.prescriptionId}</span> for{' '}
                <span className="font-semibold">{prescriptionToDelete?.medicationName}</span>? This action cannot be
                undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePrescription}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPrescriptions;