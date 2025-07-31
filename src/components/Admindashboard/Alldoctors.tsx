import React, { useState, useMemo } from 'react';
import {
  useGetDoctorsQuery,
  useAddDoctorsMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} from '../../features/api/DoctorsApi';

import { type DoctorData, type DoctorInput } from '../../types/appointmentTypes';

const Alldoctors: React.FC = () => {
  // RTK Query hooks for data fetching and mutations
  const { data: doctors = [], error, isLoading, refetch } = useGetDoctorsQuery();
  const [addDoctorMutation, { isLoading: isAdding }] = useAddDoctorsMutation();
  const [updateDoctorMutation, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [deleteDoctorMutation, { isLoading: isDeleting }] = useDeleteDoctorMutation();

  // State to manage the form data for adding/editing a doctor
  // We use DoctorInput for the base, as this represents what we send to the backend for create/update.
  // We add doctorId for internal component logic when editing.
  const [formData, setFormData] = useState<DoctorInput & { doctorId?: number }>({
    doctorId: undefined, // Used for editing: undefined for new, doctorId for existing
    userId: 0, // Assuming userId is required for the doctor input
    firstName: '',
    lastName: '',
    specialization: '',
    contactPhone: '',
    isAvailable: false,
    availability: [], // Initialize as an empty array based on DoctorData
  });

  // State to manage the visibility of the add/edit form
  const [isFormVisible, setIsFormVisible] = useState(false);
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<DoctorData | null>(null);
  // State for displaying API errors from mutations
  const [apiError, setApiError] = useState<string | null>(null);


  // Combine all loading states for a global loading indicator
  const overallLoading = isLoading || isAdding || isUpdating || isDeleting;

  // Helper function to extract error message from RTK Query error object
  const getErrorMessage = (err: any): string => {
    if (typeof err === 'object' && err !== null) {
      // Check for FetchBaseQueryError structure (common for API responses)
      if ('data' in err && typeof err.data === 'object' && err.data !== null && 'message' in err.data) {
        return (err.data as { message: string }).message;
      }
      // Check for network errors or other generic errors
      if ('error' in err && typeof err.error === 'string') {
        return err.error;
      }
      // Fallback for other error structures
      return JSON.stringify(err);
    }
    return String(err); // Convert non-object errors to string
  };

  // Corrected handleInputChange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Conditionally get 'checked' property only if the element is an HTMLInputElement and type is checkbox
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission (add or edit doctor)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Clear previous API errors

    // Prepare data based on DoctorInput
    const payload: DoctorInput = {
      userId: formData.userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      specialization: formData.specialization,
      contactPhone: formData.contactPhone,
      isAvailable: formData.isAvailable,
      availability: formData.availability, // Now 'availability' exists on DoctorInput
    };

    try {
      if (formData.doctorId) {
        // Editing an existing doctor
        await updateDoctorMutation({ doctorId: formData.doctorId, ...payload }).unwrap();
      } else {
        // Adding a new doctor
        await addDoctorMutation(payload).unwrap();
      }
      resetForm();
      setIsFormVisible(false);
    } catch (err: any) {
      console.error('Failed to save doctor:', err);
      setApiError(`Failed to save doctor: ${getErrorMessage(err)}`);
    }
  };

  // Function to reset the form data
  const resetForm = () => {
    setFormData({
      doctorId: undefined,
      userId: 0,
      firstName: '',
      lastName: '',
      specialization: '',
      contactPhone: '',
      isAvailable: false,
      availability: [],
    });
  };

  // Function to open the form for adding a new doctor
  const handleAddDoctor = () => {
    resetForm();
    setIsFormVisible(true);
    setApiError(null); // Clear any previous API errors
  };

  // Function to open the form for editing an existing doctor
  const handleEditDoctor = (doctor: DoctorData) => {
    setFormData({
      doctorId: doctor.doctorId,
      userId: doctor.user.userId, // Assuming userId comes from the nested user object
      firstName: doctor.firstName || '', // Handle potential undefined values
      lastName: doctor.lastName || '',
      specialization: doctor.specialization || '',
      contactPhone: doctor.contactPhone || '',
      isAvailable: doctor.isAvailable || false,
      availability: doctor.availability || [], // Ensure it's an array
    });
    setIsFormVisible(true);
    setApiError(null); // Clear any previous API errors
  };

  // Function to handle doctor deletion confirmation
  const handleDeleteConfirmation = (doctor: DoctorData) => {
    setDoctorToDelete(doctor);
    setShowConfirmModal(true);
    setApiError(null); // Clear any previous API errors
  };

  // Function to delete a doctor after confirmation
  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;

    setApiError(null); // Clear previous API errors
    try {
      await deleteDoctorMutation(doctorToDelete.doctorId).unwrap();
      setShowConfirmModal(false);
      setDoctorToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete doctor:', err);
      setApiError(`Failed to delete doctor: ${getErrorMessage(err)}`);
    }
  };

  // Function to toggle doctor availability
  const toggleAvailability = async (doctor: DoctorData) => {
    setApiError(null); // Clear previous API errors
    try {
      // Send only the necessary fields for the update.
      // We need to create a DoctorInput payload for the mutation.
      const payload: DoctorInput = {
        userId: doctor.user.userId, // Ensure userId is included for update payload
        firstName: doctor.firstName || '',
        lastName: doctor.lastName || '',
        specialization: doctor.specialization || '',
        contactPhone: doctor.contactPhone || '',
        isAvailable: !doctor.isAvailable, // Toggle the availability
        availability: doctor.availability || [],
      };
      await updateDoctorMutation({ doctorId: doctor.doctorId, ...payload }).unwrap();
    } catch (err: any) {
      console.error('Failed to toggle availability:', err);
      setApiError(`Failed to update availability: ${getErrorMessage(err)}`);
    }
  };

  // Filter and sort doctors based on backend data and search query
  const filteredAndSortedDoctors = useMemo(() => {
    let currentDoctors = [...doctors]; // Create a mutable copy to sort

    // Apply search filter
    if (searchQuery) {
      currentDoctors = currentDoctors.filter(
        (doctor) =>
          doctor.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doctor.contactPhone && doctor.contactPhone.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by firstName alphabetically. Adjust this logic for different sorting needs.
    currentDoctors.sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''));

    return currentDoctors;
  }, [doctors, searchQuery]); // Re-run memoization if doctors data or search query changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans text-gray-800">
      {/* Tailwind CSS and Inter font are typically linked in index.html or public/index.html */}
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}

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
        <h1 className="text-4xl font-extrabold text-center text-green-600 mb-8">
          <i className="fas fa-user-md mr-3 text-green-700"></i>
          Doctors Administration
        </h1>

        {overallLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              <p className="text-lg text-indigo-700">Loading data...</p>
            </div>
          </div>
        )}

        {/* Global Fetch Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">
              Failed to load doctors: {getErrorMessage(error)}. Please ensure your backend API is running and accessible.
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

        {/* API Operation Error (Add/Update/Delete) */}
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

        {/* Add Doctor Button and Search Input */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <button
            onClick={handleAddDoctor}
            className="flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75 w-full sm:w-auto justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Doctor
          </button>
          <input
            type="text"
            placeholder="Search doctors by name, specialization, or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 w-full sm:max-w-xs"
          />
        </div>

        {/* Add/Edit Doctor Form */}
        {isFormVisible && (
          <div className="bg-white p-6 rounded-lg shadow-xl border border-indigo-200 mb-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6">
              {formData.doctorId ? 'Edit Doctor' : 'Add New Doctor'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                />
              </div>
              {/* If 'availability' is a simple text input for demonstration or stringified JSON */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability (e.g., "Monday, Wednesday")
                </label>
                <textarea
                  id="availability"
                  name="availability"
                  value={Array.isArray(formData.availability) ? formData.availability.join(', ') : ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value.split(',').map(s => s.trim()) }))}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Enter comma-separated availability, e.g., Monday, Wednesday, Friday"
                ></textarea>
              </div>
              <div className="md:col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange} // This input will correctly have 'checked'
                  className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm font-medium text-gray-700">
                  Is Available
                </label>
              </div>
              <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormVisible(false);
                    resetForm();
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
                >
                  {formData.doctorId ? 'Update Doctor' : 'Save Doctor'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Doctors List/Table */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-indigo-200">
          <h2 className="text-2xl font-bold text-green-600 mb-6">Doctors List</h2>
          {isLoading && <p className="text-center text-gray-600 text-lg py-8">Fetching doctors...</p>}
          {error && !isLoading && <p className="text-center text-red-600 text-lg py-8">Could not load doctors.</p>}
          {!isLoading && !error && filteredAndSortedDoctors.length === 0 ? (
            <p className="text-center text-gray-600 text-lg py-8">No doctors found. Try adding one!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Full Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedDoctors.map((doctor) => (
                    <tr key={doctor.doctorId} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {doctor.doctorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.firstName} {doctor.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.specialization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.contactPhone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleAvailability(doctor)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${doctor.isAvailable
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } transition duration-200 ease-in-out`}
                        >
                          {doctor.isAvailable ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleEditDoctor(doctor)}
                            className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out transform hover:scale-110"
                            title="Edit Doctor"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.827-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteConfirmation(doctor)}
                            className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out transform hover:scale-110"
                            title="Delete Doctor"
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

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 modal-overlay">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm mx-auto text-center border border-red-300">
              <h3 className="text-xl font-bold text-red-700 mb-4">Confirm Deletion</h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete doctor{' '}
                <span className="font-semibold">
                  {doctorToDelete?.firstName} {doctorToDelete?.lastName}
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDoctor}
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

export default Alldoctors;