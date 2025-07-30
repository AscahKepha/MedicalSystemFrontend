// src/components/doctordashboard/DoctorsPrescription.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetPrescriptionsByDoctorIdQuery,
  useAddPrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  type PrescriptionData,
  useGetDoctorIdByUserIdQuery,
} from '../../features/api/PrescriptionsApi';
import type { RootState } from '../../app/types';

interface PrescriptionFormState {
  prescriptionId: number | null;
  patientId: string;
  appointmentId: string;
  medicationName: string;
  notes: string;
  dosage: string;
  instructions: string;
  totalAmount: string;
  issueDate: string;
  expiryDate: string;
  doctorId: string;
}

export const DoctorsPrescription: React.FC = () => {
  // -----------------------------------------------------------
  // ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL, UNCONDITIONALLY
  // -----------------------------------------------------------

  // Get the logged-in doctor's specific ID
  const userId = useSelector((state: RootState) => state.auth.user?.userId);

  const {
    data: doctorIdResponse,
    isLoading: isLoadingDoctorId,
    error: doctorIdError,
  } = useGetDoctorIdByUserIdQuery(userId!, { skip: !userId });

  const doctorId = doctorIdResponse?.doctorId;
  const userType = useSelector((state: RootState) => state.auth.userType);

  const {
    data: prescriptionsData,
    error: prescriptionsError,
    isLoading: isLoadingPrescriptions,
    isFetching: isFetchingPrescriptions,
    refetch: refetchPrescriptions,
  } = useGetPrescriptionsByDoctorIdQuery(doctorId as number, {
    skip: !doctorId || userType !== 'doctor',
  });

  const [addPrescription, { isLoading: isAdding }] = useAddPrescriptionMutation();
  const [updatePrescription, { isLoading: isUpdating }] = useUpdatePrescriptionMutation();
  const [deletePrescription, { isLoading: isDeleting }] = useDeletePrescriptionMutation();

  // State for the new prescription form
  const [newPrescription, setNewPrescription] = useState<PrescriptionFormState>({
    prescriptionId: null,
    patientId: '',
    appointmentId: '',
    medicationName: '',
    notes: '',
    dosage: '',
    instructions: '',
    totalAmount: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    doctorId: doctorId?.toString() || '',
  });

  // State for editing a prescription
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionFormState | null>(null);

  // State for alert messages
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<number | null>(null);

  // NEW STATE: Control visibility of the "Create Prescription" form modal
  const [showCreateForm, setShowCreateForm] = useState(false); // Initially hidden

  // -----------------------------------------------------------
  // END OF HOOK DECLARATIONS
  // -----------------------------------------------------------

  // Utility function to show a temporary message
  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  // Handle form input changes for new prescription
  const handleNewPrescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form input changes for editing prescription
  const handleEditPrescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingPrescription) {
      setEditingPrescription((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  // Submit new prescription
  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId) {
      showMessage('error', 'Error: Doctor ID not found. Please log in again.');
      return;
    }
    if (
      !newPrescription.patientId ||
      !newPrescription.medicationName ||
      !newPrescription.dosage ||
      !newPrescription.instructions ||
      !newPrescription.issueDate
    ) {
      showMessage('error', 'Please fill in all required fields (Patient ID, Medication, Dosage, Instructions, Issue Date).');
      return;
    }

    try {
      const payload = {
        patientId: parseInt(newPrescription.patientId),
        doctorId: doctorId,
        appointmentId: newPrescription.appointmentId ? parseInt(newPrescription.appointmentId) : null,
        medicationName: newPrescription.medicationName,
        notes: newPrescription.notes,
        dosage: newPrescription.dosage,
        instructions: newPrescription.instructions,
        totalAmount: newPrescription.totalAmount ? parseFloat(newPrescription.totalAmount) : null,
        issueDate: newPrescription.issueDate,
        expiryDate: newPrescription.expiryDate || null,
         patient: undefined,
        doctor: undefined
      };
      await addPrescription(payload).unwrap();
      showMessage('success', 'Prescription created successfully!');
      setNewPrescription({ // Reset form fields
        prescriptionId: null,
        patientId: '',
        appointmentId: '',
        medicationName: '',
        notes: '',
        dosage: '',
        instructions: '',
        totalAmount: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        doctorId: doctorId.toString() || '',
      });
      setShowCreateForm(false); // Close the modal on success
    } catch (err) {
      console.error('Error creating prescription:', err);
      showMessage('error', 'Failed to create prescription. Please check the inputs and try again.');
    }
  };

  // Open edit modal/form
  const handleEditClick = (prescription: PrescriptionData) => {
    if (prescription.prescriptionId === null || typeof prescription.prescriptionId === 'undefined') {
      showMessage('error', 'Cannot edit: Prescription ID is missing.');
      return;
    }

    setEditingPrescription({
      prescriptionId: prescription.prescriptionId,
      patientId: prescription.patientId?.toString() || '',
      doctorId: prescription.doctorId?.toString() || '',
      appointmentId: prescription.appointmentId?.toString() || '',
      medicationName: prescription.medicationName,
      notes: prescription.notes,
      dosage: prescription.dosage,
      instructions: prescription.instructions,
      totalAmount: prescription.totalAmount !== null ? prescription.totalAmount.toString() : '',
      issueDate: prescription.issueDate.split('T')[0],
      expiryDate: prescription.expiryDate ? prescription.expiryDate.split('T')[0] : '',
    });
  };

  // Submit updated prescription
  const handleUpdatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrescription) return;

    if (editingPrescription.prescriptionId === null) {
      showMessage('error', 'Error: Prescription ID missing for update.');
      return;
    }

    try {
      const payload: PrescriptionData = {
        prescriptionId: editingPrescription.prescriptionId,
        patientId: parseInt(editingPrescription.patientId),
        doctorId: parseInt(editingPrescription.doctorId),
        appointmentId: editingPrescription.appointmentId ? parseInt(editingPrescription.appointmentId) : null,
        medicationName: editingPrescription.medicationName,
        notes: editingPrescription.notes,
        dosage: editingPrescription.dosage,
        instructions: editingPrescription.instructions,
        totalAmount: editingPrescription.totalAmount ? parseFloat(editingPrescription.totalAmount) : null,
        issueDate: editingPrescription.issueDate,
        expiryDate: editingPrescription.expiryDate || null,
        createdAt: new Date().toISOString(), // Placeholder - adjust if your API handles this
        updatedAt: new Date().toISOString(),
        patient: undefined,
        doctor: undefined
      };
      await updatePrescription(payload).unwrap();
      showMessage('success', 'Prescription updated successfully!');
      setEditingPrescription(null);
    } catch (err) {
      console.error('Error updating prescription:', err);
      showMessage('error', 'Failed to update prescription. Please try again.');
    }
  };

  // Prepare for deletion (show confirmation modal)
  const handleDeleteClick = (prescriptionId: number) => {
    setPrescriptionToDelete(prescriptionId);
    setShowConfirmModal(true);
  };

  // Confirm and delete prescription
  const confirmDeletePrescription = async () => {
    if (prescriptionToDelete === null) return;
    try {
      await deletePrescription(prescriptionToDelete).unwrap();
      showMessage('success', 'Prescription deleted successfully!');
    } catch (err) {
      console.error('Error deleting prescription:', err);
      showMessage('error', 'Failed to delete prescription. Please try again.');
    } finally {
      setShowConfirmModal(false);
      setPrescriptionToDelete(null);
    }
  };

  // Access check: If not a doctor or no doctorId, show access denied message
  if (!doctorId || userType !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-red-600">
          <p className="text-lg font-semibold">
            Please log in as a doctor to view and manage prescriptions.
          </p>
        </div>
      </div>
    );
  }

  // Loading/Error states for the main prescription display
  // These can come after the unconditional hook calls.
  if (isLoadingPrescriptions || isFetchingPrescriptions || isLoadingDoctorId) {
    return <p className="text-center text-gray-600 text-lg">Loading your prescriptions...</p>;
  }

  if (prescriptionsError || doctorIdError) {
    return (
      <div className="text-center text-red-600 text-lg">
        Error loading prescriptions.
        <button
          onClick={() => refetchPrescriptions()}
          className="ml-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const prescriptions = prescriptionsData ?? []; // Ensure prescriptions is always an array

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-blue-900">
          My Prescriptions
        </h1>

        {/* Add New Prescription Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add New Prescription
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`p-3 mb-4 rounded-md text-center font-medium ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* View Prescriptions Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          My Created Prescriptions
        </h2>

        {prescriptions.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You have not created any prescriptions yet.
          </p>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription: PrescriptionData) => (
              <div
                key={prescription.prescriptionId}
                className="border border-gray-200 rounded-lg p-5 hover:shadow transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {prescription.medicationName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Patient ID: {prescription.patientId}
                    </span>
                    {prescription.appointmentId && (
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        Appt ID: {prescription.appointmentId}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Dosage:</span> {prescription.dosage}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Instructions:</span> {prescription.instructions}
                </p>
                {prescription.notes && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Notes:</span> {prescription.notes}
                  </p>
                )}
                {prescription.totalAmount !== null && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Amount:</span> Ksh {prescription.totalAmount?.toFixed(2)}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  Issued: {new Date(prescription.issueDate).toLocaleDateString()}
                  {prescription.expiryDate && (
                    <span> | Expires: {new Date(prescription.expiryDate).toLocaleDateString()}</span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {new Date(prescription.createdAt).toLocaleDateString()}
                  {prescription.updatedAt && prescription.updatedAt !== prescription.createdAt && (
                    <span> | Last Updated: {new Date(prescription.updatedAt).toLocaleDateString()}</span>
                  )}
                </p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => handleEditClick(prescription)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-600 disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(prescription.prescriptionId)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Prescription Modal/Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create New Prescription
            </h2>
            <form onSubmit={handleCreatePrescription} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="patientId"
                  name="patientId"
                  value={newPrescription.patientId}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment ID (Optional)
                </label>
                <input
                  type="number"
                  id="appointmentId"
                  name="appointmentId"
                  value={newPrescription.appointmentId}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 123"
                />
              </div>
              <div>
                <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="medicationName"
                  name="medicationName"
                  value={newPrescription.medicationName}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  value={newPrescription.dosage}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={3}
                  value={newPrescription.instructions}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={newPrescription.notes}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount (Optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="totalAmount"
                  name="totalAmount"
                  value={newPrescription.totalAmount}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={newPrescription.issueDate}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={newPrescription.expiryDate}
                  onChange={handleNewPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <button
                  type="button" // Important: set type="button" to prevent form submission
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isAdding}
                >
                  {isAdding ? 'Creating...' : 'Create Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Prescription Modal/Form */}
      {editingPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Prescription
            </h2>
            <form onSubmit={handleUpdatePrescription} className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="editPatientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="number"
                  id="editPatientId"
                  name="patientId"
                  value={editingPrescription.patientId}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="editAppointmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment ID (Optional)
                </label>
                <input
                  type="number"
                  id="editAppointmentId"
                  name="appointmentId"
                  value={editingPrescription.appointmentId || ''}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 123"
                />
              </div>
              <div>
                <label htmlFor="editMedicationName" className="block text-sm font-medium text-gray-700 mb-1">
                  Medication Name
                </label>
                <input
                  type="text"
                  id="editMedicationName"
                  name="medicationName"
                  value={editingPrescription.medicationName}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="editDosage" className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage
                </label>
                <input
                  type="text"
                  id="editDosage"
                  name="dosage"
                  value={editingPrescription.dosage}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="editInstructions" className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  id="editInstructions"
                  name="instructions"
                  rows={3}
                  value={editingPrescription.instructions}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="editNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="editNotes"
                  name="notes"
                  rows={2}
                  value={editingPrescription.notes}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="editTotalAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="editTotalAmount"
                  name="totalAmount"
                  value={editingPrescription.totalAmount}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="editIssueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  id="editIssueDate"
                  name="issueDate"
                  value={editingPrescription.issueDate}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="editExpiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  id="editExpiryDate"
                  name="expiryDate"
                  value={editingPrescription.expiryDate || ''}
                  onChange={handleEditPrescriptionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingPrescription(null)}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this prescription? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePrescription}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPrescription;