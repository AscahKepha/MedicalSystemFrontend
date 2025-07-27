import React from 'react';
import { useSelector } from 'react-redux';
import {
  useGetPrescriptionsByPatientIdQuery,
  type PrescriptionData,
} from '../../features/api/PrescriptionsApi';
import type { RootState } from '../../app/types'; // Adjust path if needed

export const PatientsPrescription: React.FC = () => {
  const patientId = useSelector((state: RootState) => state.auth.user?.userId);
  const userType = useSelector((state: RootState) => state.auth.user?.userType);

  console.log("PatientsPrescription Debug: patientId from Redux:", patientId, "Type:", typeof patientId);
  console.log("PatientsPrescription Debug: userType from Redux:", userType);

  const {
    data: prescriptions = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetPrescriptionsByPatientIdQuery(patientId || 0, {
    skip: !patientId,
  });

  if (!patientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-red-600">
          <p className="text-lg font-semibold">
            Please log in as a patient to view your prescriptions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
          My Prescriptions
        </h1>

        {isLoading || isFetching ? (
          <p className="text-center text-gray-600 text-lg">
            Loading your prescriptions...
          </p>
        ) : error ? (
          <div className="text-center text-red-600 text-lg">
            Error loading your prescriptions.
            <button
              onClick={refetch}
              className="ml-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            You have no prescriptions recorded yet.
          </p>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((prescription: PrescriptionData) => (
              <div
                key={prescription.prescriptionId}
                className="border border-gray-200 rounded-lg p-5 hover:shadow transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {prescription.medicationName}
                </h3>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Dosage:</span>{' '}
                  {prescription.dosage}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Instructions:</span>{' '}
                  {prescription.instructions}
                </p>
                {prescription.notes && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Notes:</span>{' '}
                    {prescription.notes}
                  </p>
                )}
                {prescription.totalAmount !== null && (
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Amount:</span> Ksh{' '}
                    {prescription.totalAmount.toFixed(2)}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Issued:{' '}
                  {new Date(prescription.issueDate).toLocaleDateString()}
                  {prescription.expiryDate && (
                    <span>
                      {' '}
                      | Expires:{' '}
                      {new Date(prescription.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Prescribed by Doctor ID: {prescription.doctorId || 'N/A'}
                  {prescription.appointmentId && (
                    <span>
                      {' '}
                      | Related Appointment ID: {prescription.appointmentId}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsPrescription;