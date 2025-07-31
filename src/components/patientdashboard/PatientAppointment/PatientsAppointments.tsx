// src/components/patientdashboard/PatientAppointments.tsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../app/types';
import {
  useGetAppointmentsByPatientIdQuery,
  useGetPatientIdByUserIdQuery,
} from '../../../features/api/AppointmentsApi';
import { useGetDoctorsQuery } from '../../../features/api/DoctorsApi';
import AppointmentCards from './AppointmentCards';

const PatientAppointments: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  const [patientId, setPatientId] = useState<number | null>(null);

  const { data: patientIdData } = useGetPatientIdByUserIdQuery(userId!, {
    skip: !userId,
  });

  useEffect(() => {
    if (patientIdData?.patientId) {
      setPatientId(patientIdData.patientId);
    }
  }, [patientIdData]);

  const { data: appointments } = useGetAppointmentsByPatientIdQuery(patientId as number, {
    skip: !patientId,
  });

  const { data: doctors } = useGetDoctorsQuery();

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">My Appointments</h1>

        {appointments && appointments.length > 0 ? (
          <AppointmentCards appointments={appointments} doctors={doctors} />
        ) : (
          <p className="text-center text-gray-600">You have no appointments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;