// src/components/doctordashboard/DoctorsPrescription.tsx
import React, { useState, useEffect } from 'react'; // Import useEffect
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

// Reusable Input Field Component
interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  step?: string;
  isTextArea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type,
  value,
  onChange,
  required = false,
  placeholder = '',
  rows = 1,
  step,
  isTextArea = false,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {isTextArea ? (
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        required={required}
        placeholder={placeholder}
      ></textarea>
    ) : (
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        required={required}
        placeholder={placeholder}
        step={step}
      />
    )}
  </div>
);

// Prescription Form State Interface
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

  const [editingPrescription, setEditingPrescription] = useState<PrescriptionFormState | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Update newPrescription.doctorId when doctorId becomes available
  useEffect(() => {
    if (doctorId && newPrescription.doctorId === '') {
      setNewPrescription((prev) => ({ ...prev, doctorId: doctorId.toString() }));
    }
  }, [doctorId, newPrescription.doctorId]);

  // -----------------------------------------------------------
  // END OF HOOK DECLARATIONS
  // -----------------------------------------------------------

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleNewPrescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewPrescription((prev) => ({ ...prev, [name]: value }));
  };

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
        patient: undefined, // Explicitly set to undefined as per your original code
        doctor: undefined, // Explicitly set to undefined as per your original code
      };
      await addPrescription(payload).unwrap();
      showMessage('success', 'Prescription created successfully!');
      setNewPrescription({
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
      setShowCreateForm(false);
    } catch (err) {
      console.error('Error creating prescription:', err);
      showMessage('error', 'Failed to create prescription. Please check the inputs and try again.');
    }
  };

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        patient: undefined,
        doctor: undefined,
      };
      await updatePrescription(payload).unwrap();
      showMessage('success', 'Prescription updated successfully!');
      setEditingPrescription(null);
    } catch (err) {
      console.error('Error updating prescription:', err);
      showMessage('error', 'Failed to update prescription. Please try again.');
    }
  };

  const handleDeleteClick = (prescriptionId: number) => {
    setPrescriptionToDelete(prescriptionId);
    setShowConfirmModal(true);
  };

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

  // Access check and loading states
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

  if (isLoadingPrescriptions || isFetchingPrescriptions || isLoadingDoctorId) {
    return <div className="text-center text-gray-600 text-lg p-8">Loading your prescriptions...</div>;
  }

  if (prescriptionsError || doctorIdError) {
    return (
      <div className="text-center text-red-600 text-lg p-8">
        Error loading prescriptions.
        <button
          onClick={() => refetchPrescriptions()}
          className="ml-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Retry
        </button>
      </div>
    );
  }

  const prescriptions = prescriptionsData ?? [];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-inter">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4">
            My Prescriptions Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Effortlessly manage patient prescriptions.
          </p>
        </header>

        {/* Action Buttons Section */}
        <section className="text-center mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 text-white py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            + Create New Prescription
          </button>
        </section>

        {/* Message Display */}
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg text-center font-semibold text-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            } shadow-md`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        {/* Prescriptions List Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
            Your Issued Prescriptions ({prescriptions.length})
          </h2>

          {prescriptions.length === 0 ? (
            <div className="bg-blue-50 p-6 rounded-lg text-center text-blue-700 text-lg border border-blue-200">
              <p>You haven't issued any prescriptions yet. Click "Create New Prescription" to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prescriptions.map((prescription: PrescriptionData) => (
                <article
                  key={prescription.prescriptionId}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow duration-200 ease-in-out"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-blue-800">
                      {prescription.medicationName}
                    </h3>
                    <div className="flex-shrink-0">
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mr-2">
                        PID: {prescription.patientId}
                      </span>
                      {prescription.appointmentId && (
                        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                          AID: {prescription.appointmentId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-700 text-sm mb-4 flex-grow">
                    <p className="mb-1">
                      <strong className="text-gray-900">Dosage:</strong> {prescription.dosage}
                    </p>
                    <p className="mb-1">
                      <strong className="text-gray-900">Instructions:</strong> {prescription.instructions}
                    </p>
                    {prescription.notes && (
                      <p className="mb-1">
                        <strong className="text-gray-900">Notes:</strong> {prescription.notes}
                      </p>
                    )}
                    {prescription.totalAmount !== null && (
                      <p className="mb-1">
                        <strong className="text-gray-900">Amount:</strong> Ksh {prescription.totalAmount?.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                    <p>Issued: {new Date(prescription.issueDate).toLocaleDateString()}</p>
                    {prescription.expiryDate && (
                      <p>Expires: {new Date(prescription.expiryDate).toLocaleDateString()}</p>
                    )}
                    <p>Created: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                    {prescription.updatedAt && prescription.updatedAt !== prescription.createdAt && (
                      <p>Last Updated: {new Date(prescription.updatedAt).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-5">
                    <button
                      onClick={() => handleEditClick(prescription)}
                      className="bg-yellow-500 text-white px-5 py-2 rounded-md text-sm hover:bg-yellow-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
                      disabled={isUpdating}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(prescription.prescriptionId)}
                      className="bg-red-500 text-white px-5 py-2 rounded-md text-sm hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
                      disabled={isDeleting}
                    >
                      {isDeleting && prescriptionToDelete === prescription.prescriptionId ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Create Prescription Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-2xl w-full my-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Create New Prescription
            </h2>
            <form onSubmit={handleCreatePrescription} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField
                label="Patient ID"
                id="patientId"
                name="patientId"
                type="number"
                value={newPrescription.patientId}
                onChange={handleNewPrescriptionChange}
                required
              />
              <InputField
                label="Appointment ID (Optional)"
                id="appointmentId"
                name="appointmentId"
                type="number"
                value={newPrescription.appointmentId}
                onChange={handleNewPrescriptionChange}
                placeholder="e.g., 123"
              />
              <InputField
                label="Medication Name"
                id="medicationName"
                name="medicationName"
                type="text"
                value={newPrescription.medicationName}
                onChange={handleNewPrescriptionChange}
                required
              />
              <InputField
                label="Dosage"
                id="dosage"
                name="dosage"
                type="text"
                value={newPrescription.dosage}
                onChange={handleNewPrescriptionChange}
                required
              />
              <div className="md:col-span-2">
                <InputField
                  label="Instructions"
                  id="instructions"
                  name="instructions"
                  type="text"
                  value={newPrescription.instructions}
                  onChange={handleNewPrescriptionChange}
                  required
                  rows={3}
                  isTextArea
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Notes"
                  id="notes"
                  name="notes"
                  type="text"
                  value={newPrescription.notes}
                  onChange={handleNewPrescriptionChange}
                  rows={2}
                  isTextArea
                />
              </div>
              <InputField
                label="Total Amount (Optional)"
                id="totalAmount"
                name="totalAmount"
                type="number"
                step="0.01"
                value={newPrescription.totalAmount}
                onChange={handleNewPrescriptionChange}
              />
              <InputField
                label="Issue Date"
                id="issueDate"
                name="issueDate"
                type="date"
                value={newPrescription.issueDate}
                onChange={handleNewPrescriptionChange}
                required
              />
              <InputField
                label="Expiry Date (Optional)"
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={newPrescription.expiryDate}
                onChange={handleNewPrescriptionChange}
              />

              <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-5 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAdding}
                >
                  {isAdding ? 'Creating...' : 'Create Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Prescription Modal */}
      {editingPrescription && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-2xl w-full my-8 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Prescription
            </h2>
            <form onSubmit={handleUpdatePrescription} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <InputField
                label="Patient ID"
                id="editPatientId"
                name="patientId"
                type="number"
                value={editingPrescription.patientId}
                onChange={handleEditPrescriptionChange}
                required
              />
              <InputField
                label="Appointment ID (Optional)"
                id="editAppointmentId"
                name="appointmentId"
                type="number"
                value={editingPrescription.appointmentId || ''}
                onChange={handleEditPrescriptionChange}
                placeholder="e.g., 123"
              />
              <InputField
                label="Medication Name"
                id="editMedicationName"
                name="medicationName"
                type="text"
                value={editingPrescription.medicationName}
                onChange={handleEditPrescriptionChange}
                required
              />
              <InputField
                label="Dosage"
                id="editDosage"
                name="dosage"
                type="text"
                value={editingPrescription.dosage}
                onChange={handleEditPrescriptionChange}
                required
              />
              <div className="md:col-span-2">
                <InputField
                  label="Instructions"
                  id="editInstructions"
                  name="instructions"
                  type="text"
                  value={editingPrescription.instructions}
                  onChange={handleEditPrescriptionChange}
                  required
                  rows={3}
                  isTextArea
                />
              </div>
              <div className="md:col-span-2">
                <InputField
                  label="Notes"
                  id="editNotes"
                  name="notes"
                  type="text"
                  value={editingPrescription.notes}
                  onChange={handleEditPrescriptionChange}
                  rows={2}
                  isTextArea
                />
              </div>
              <InputField
                label="Total Amount"
                id="editTotalAmount"
                name="totalAmount"
                type="number"
                step="0.01"
                value={editingPrescription.totalAmount}
                onChange={handleEditPrescriptionChange}
              />
              <InputField
                label="Issue Date"
                id="editIssueDate"
                name="issueDate"
                type="date"
                value={editingPrescription.issueDate}
                onChange={handleEditPrescriptionChange}
                required
              />
              <InputField
                label="Expiry Date (Optional)"
                id="editExpiryDate"
                name="expiryDate"
                type="date"
                value={editingPrescription.expiryDate || ''}
                onChange={handleEditPrescriptionChange}
              />

              <div className="md:col-span-2 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingPrescription(null)}
                  className="bg-gray-300 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full text-center animate-fade-in-up">
            <h3 className="text-2xl font-bold text-red-700 mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6 text-lg">
              Are you sure you want to delete this prescription? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-800 py-2 px-5 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePrescription}
                className="bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPrescription;