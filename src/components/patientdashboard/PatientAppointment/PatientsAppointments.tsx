// src/components/patientdashboard/PatientAppointments.tsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../app/types';
import {
  useGetAppointmentsByPatientIdQuery,
  useGetPatientIdByUserIdQuery,
} from '../../../features/api/AppointmentsApi';
import { useGetDoctorsQuery } from '../../../features/api/DoctorsApi';
import AppointmentTable from './AppointmentTable';
import BookAppointmentModal from './BookAppointmentModal';

const PatientAppointments: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  const [patientId, setPatientId] = useState<number | null>(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const { data: patientIdData } = useGetPatientIdByUserIdQuery(userId!, {
    skip: !userId,
  });

  useEffect(() => {
    if (patientIdData?.patientId) {
      setPatientId(patientIdData.patientId);
    }
  }, [patientIdData]);

  const {
    data: appointments,
    // isLoading: isLoadingAppointments,
    // isError: isErrorAppointments,
    // error: errorAppointments,
    refetch,
  } = useGetAppointmentsByPatientIdQuery(patientId as number, {
    skip: !patientId,
  });

  const { data: doctors} = useGetDoctorsQuery();

  const handleModalSuccess = () => {
    refetch();
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctorId = parseInt(e.target.value);
    const doctor = doctors?.find((doc: any) => doc.doctorId === doctorId);
    setSelectedDoctor(doctor);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">My Appointments</h1>

        <div className="mb-4 flex gap-4 justify-end">
          <select
            className="px-4 py-2 border rounded"
            onChange={handleDoctorChange}
            value={selectedDoctor?.doctorId || ''}
          >
            <option value="" disabled>
              Select a Doctor
            </option>
            {doctors?.map((doc: any) => (
              <option key={doc.doctorId} value={doc.doctorId}>
                Dr. {doc.firstName} {doc.lastName} - {doc.specialization}
              </option>
            ))}
          </select>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md"
            onClick={() => setShowBookModal(true)}
            disabled={!selectedDoctor}
          >
            Book New Appointment
          </button>
        </div>

        {appointments && appointments.length > 0 ? (
          <AppointmentTable appointments={appointments} />
        ) : (
          <p className="text-center text-gray-600">You have no appointments yet.</p>
        )}
      </div>

      {showBookModal && patientId && selectedDoctor && (
        <BookAppointmentModal
          patientId={patientId}
          doctor={selectedDoctor}
          onClose={() => setShowBookModal(false)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default PatientAppointments;
