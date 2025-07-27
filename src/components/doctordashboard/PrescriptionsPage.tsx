import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  useGetPrescriptionsByDoctorIdQuery,
  useAddPrescriptionMutation,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  type PrescriptionData,
} from '../../features/api/PrescriptionsApi';
import type { RootState } from '../../app/types'; // Adjust path if needed

// Interface for the form state (for adding/editing)
interface PrescriptionFormState {
  patientId: string; // Keep as string for input, parse to number on submit
  appointmentId: string; // Keep as string for input, parse to number on submit
  medicationName: string;
  notes: string;
  dosage: string;
  instructions: string;
  totalAmount: string; // Keep as string for input, parse to number on submit
  issueDate: string;
  expiryDate: string; // Optional, can be empty string
}

export const DoctorsPrescription: React.FC = () => {
  // Get the logged-in doctor's ID from Redux store
  const doctorId = useSelector((state: RootState) => state.auth.user?.id);

  // State for the new prescription form
  const [newPrescription, setNewPrescription] = useState<PrescriptionFormState>({
    patientId: '',
    appointmentId: '',
    medicationName: '',
    notes: '',
    dosage: '',
    instructions: '',
    totalAmount: '',
    issueDate: new Date().toISOString().split('T')[0], // Default to today's date
    expiryDate: '',
  });

  // State for editing a prescription
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionData | null>(null);

  // RTK Query hooks
  const {
    data: prescriptions = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetPrescriptionsByDoctorIdQuery(doctorId || 0, { // Pass 0 or handle skip if doctorId is null/undefined
    skip: !doctorId, // Skip query if doctorId is not available
  });

  const [addPrescription, { isLoading: isAdding }] = useAddPrescriptionMutation();
  const [updatePrescription, { isLoading: isUpdating }] = useUpdatePrescriptionMutation();
  const [deletePrescription, { isLoading: isDeleting }] = useDeletePrescriptionMutation();

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
        ...prev!, // Use ! because we know it's not null here
        [name]: value,
      }));
    }
  };

  // Submit new prescription
  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId) {
      alert('Error: Doctor ID not found. Please log in again.');
      return;
    }
    if (
      !newPrescription.patientId ||
      !newPrescription.medicationName ||
      !newPrescription.dosage ||
      !newPrescription.instructions ||
      !newPrescription.issueDate
    ) {
      alert('Please fill in all required fields (Patient ID, Medication, Dosage, Instructions, Issue Date).');
      return;
    }

    try {
      const payload = {
        patientId: parseInt(newPrescription.patientId),
        doctorId: doctorId,
        appointmentId: newPrescription.appointmentId ? parseInt(newPrescription.appointmentId) : undefined,
        medicationName: newPrescription.medicationName,
        notes: newPrescription.notes,
        dosage: newPrescription.dosage,
        instructions: newPrescription.instructions,
        totalAmount: parseFloat(newPrescription.totalAmount || '0'), // Parse totalAmount
        issueDate: newPrescription.issueDate,
        expiryDate: newPrescription.expiryDate || undefined, // Send undefined if empty
      };
      await addPrescription(payload).unwrap();
      alert('Prescription created successfully!');
      // Clear form
      setNewPrescription({
        patientId: '',
        appointmentId: '',
        medicationName: '',
        notes: '',
        dosage: '',
        instructions: '',
        totalAmount: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
      });
    } catch (err) {
      console.error('Error creating prescription:', err);
      alert('Failed to create prescription. Please check the inputs and try again.');
    }
  };

  // Open edit modal/form
  const handleEditClick = (prescription: PrescriptionData) => {
    setEditingPrescription({
      ...prescription,
      patientId: prescription.patientId || 0, // Ensure numbers are handled
      doctorId: prescription.doctorId || 0,
      appointmentId: prescription.appointmentId || undefined,
      totalAmount: prescription.totalAmount !== null ? prescription.totalAmount : 0, // Keep as number for form
      issueDate: prescription.issueDate.split('T')[0], // Format date for input type="date"
      expiryDate: prescription.expiryDate ? prescription.expiryDate.split('T')[0] : '', // Format date for input type="date"
    });
  };

  // Submit updated prescription
  const handleUpdatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrescription) return;

    try {
      const payload = {
        prescriptionId: editingPrescription.prescriptionId,
        patientId: parseInt(editingPrescription.patientId as any), // Cast back to number
        doctorId: parseInt(editingPrescription.doctorId as any), // Cast back to number
        appointmentId: editingPrescription.appointmentId ? parseInt(editingPrescription.appointmentId as any) : undefined,
        medicationName: editingPrescription.medicationName,
        notes: editingPrescription.notes,
        dosage: editingPrescription.dosage,
        instructions: editingPrescription.instructions,
        totalAmount: parseFloat(editingPrescription.totalAmount as unknown as string || '0'), // Parse back to number
        issueDate: editingPrescription.issueDate,
        expiryDate: editingPrescription.expiryDate || undefined,
      };
      await updatePrescription(payload).unwrap();
      alert('Prescription updated successfully!');
      setEditingPrescription(null); // Close edit modal
    } catch (err) {
      console.error('Error updating prescription:', err);
      alert('Failed to update prescription. Please try again.');
    }
  };

  // Delete prescription
  const handleDeletePrescription = async (prescriptionId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this prescription? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await deletePrescription(prescriptionId).unwrap();
      alert('Prescription deleted successfully!');
    } catch (err) {
      console.error('Error deleting prescription:', err);
      alert('Failed to delete prescription. Please try again.');
    }
  };

  if (!doctorId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-red-600">
          <p className="text-lg font-semibold">Please log in as a doctor to view and manage prescriptions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          My Prescriptions
        </h1>

        {/* Create Prescription Section */}
        <div className="mb-10 p-6 border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
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
                step="0.01" // For decimal values
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
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isAdding}
              >
                {isAdding ? 'Creating...' : 'Create Prescription'}
              </button>
            </div>
          </form>
        </div>

        {/* View Prescriptions Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          My Created Prescriptions
        </h2>

        {isLoading || isFetching ? (
          <p className="text-center text-gray-600 text-lg">Loading your prescriptions...</p>
        ) : error ? (
          <div className="text-center text-red-600 text-lg">
            Error loading prescriptions.
            <button
              onClick={refetch}
              className="ml-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : prescriptions.length === 0 ? (
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
                    <span className="font-medium">Amount:</span> Ksh {prescription.totalAmount.toFixed(2)}
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
                    onClick={() => handleDeletePrescription(prescription.prescriptionId)}
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
                  value={editingPrescription.patientId ?? ''}
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
                  value={editingPrescription.totalAmount || ''}
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
                  onClick={() => setEditingPrescription(null)} // Close modal
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
    </div>
  );
};

export default DoctorsPrescription;