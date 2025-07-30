// src/components/prescriptions/AllPrescriptions.tsx
import React, { useState, useMemo } from 'react';
import {
  useGetPrescriptionsQuery,
  useDeletePrescriptionMutation,
  type PrescriptionData,
} from '../../../features/api/PrescriptionsApi';
import LoadingSpinner from './common/LoadingSpinner';
import ErrorAlert from './common/ErrorAlert';
import PrescriptionsHeader from './PrescriptionsHeader';
import PrescriptionsList from './PrescriptionsList';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const AllPrescriptions: React.FC = () => {
  const { data: prescriptions = [], error, isLoading, refetch } = useGetPrescriptionsQuery();
  const [deletePrescriptionMutation, { isLoading: isDeleting }] = useDeletePrescriptionMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [prescriptionToDelete, setPrescriptionToDelete] = useState<PrescriptionData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const overallLoading = isLoading || isDeleting;

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

  const handleDeleteConfirmation = (prescription: PrescriptionData) => {
    setPrescriptionToDelete(prescription);
    setShowConfirmModal(true);
    setApiError(null);
  };

  const handleDeletePrescription = async () => {
    if (!prescriptionToDelete) return;

    setApiError(null);
    try {
      await deletePrescriptionMutation(prescriptionToDelete.prescriptionId).unwrap();
      setShowConfirmModal(false);
      setPrescriptionToDelete(null);
    } catch (err: any) {
      console.error('Failed to delete prescription:', err);
      setApiError(`Failed to delete prescription: ${getErrorMessage(err)}`);
    }
  };

  const filteredAndSortedPrescriptions = useMemo(() => {
    let currentPrescriptions = [...prescriptions];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentPrescriptions = currentPrescriptions.filter(
        (prescription) =>
          prescription.notes.toLowerCase().includes(lowerCaseQuery) ||
          String(prescription.prescriptionId).includes(lowerCaseQuery) ||
          String(prescription.appointmentId || '').includes(lowerCaseQuery) ||
          String(prescription.doctorId || '').includes(lowerCaseQuery) ||
          String(prescription.patientId || '').includes(lowerCaseQuery)
      );
    }

    currentPrescriptions.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());

    return currentPrescriptions;
  }, [prescriptions, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans text-gray-800">
      {/* Tailwind CSS and Inter font are linked globally or via your main CSS file */}
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
        <PrescriptionsHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {overallLoading && <LoadingSpinner />}

        {error && (
          <ErrorAlert
            message={`Failed to load prescriptions: ${getErrorMessage(error)}. Please ensure your backend API is running and accessible.`}
            onRetry={refetch}
            isRetry={true}
          />
        )}

        {apiError && <ErrorAlert message={apiError} onClose={() => setApiError(null)} />}

        <div className="bg-white p-6 rounded-xl shadow-xl border border-purple-200">
          <h2 className="text-2xl font-bold text-green-600 mb-6">Prescriptions List</h2>
          <PrescriptionsList
            prescriptions={filteredAndSortedPrescriptions}
            onDeleteConfirmation={handleDeleteConfirmation}
            isLoading={isLoading}
            error={error}
            refetch={refetch}
          />
        </div>

        <DeleteConfirmationModal
          show={showConfirmModal}
          prescription={prescriptionToDelete}
          onConfirm={handleDeletePrescription}
          onCancel={() => setShowConfirmModal(false)}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default AllPrescriptions;