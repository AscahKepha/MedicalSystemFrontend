import React from 'react';
import { type PrescriptionData } from '../../../features/api/PrescriptionsApi';

interface PrescriptionsListProps {
  prescriptions: PrescriptionData[];
  onDeleteConfirmation: (prescription: PrescriptionData) => void;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const PrescriptionsList: React.FC<PrescriptionsListProps> = ({
  prescriptions,
  onDeleteConfirmation,
  isLoading,
  error,
  refetch,
}) => {
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

  if (isLoading) {
    return <p className="text-center text-gray-600 text-lg py-8">Fetching prescriptions...</p>;
  }

  if (error && !isLoading) {
    return (
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
    );
  }

  if (prescriptions.length === 0) {
    return <p className="text-center text-gray-600 text-lg py-8">No prescriptions found. 📝</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-purple-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
              Prescription ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Appointment ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Doctor Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Issue Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
              Expiry Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {prescriptions.map((prescription) => (
            <tr key={prescription.prescriptionId} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {prescription.prescriptionId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {prescription.appointmentId ?? 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {prescription.doctor?.user
                  ? `${prescription.doctor.user.firstName} ${prescription.doctor.user.lastName}`
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {prescription.patient?.user
                  ? `${prescription.patient.user.firstName} ${prescription.patient.user.lastName}`
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {prescription.notes}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(prescription.issueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {prescription.expiryDate
                  ? new Date(prescription.expiryDate).toLocaleDateString()
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onDeleteConfirmation(prescription)}
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
  );
};

export default PrescriptionsList;
