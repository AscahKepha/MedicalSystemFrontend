import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types';
import {
  useGetDoctorIdByUserIdQuery,
  useGetAppointmentsByDoctorIdQuery,
} from '../../features/api/AppointmentsApi';
import DoctorCreateAppointmentModal from './DoctorCreateAppointmentModal';
import type { AppointmentData } from '../../features/api/AppointmentsApi';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

const DoctorsAppointments: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false); // ⬅️ Modal toggle

  const {
    data: doctorData,
    isLoading: isLoadingDoctorId,
    isError: isErrorDoctorId,
  } = useGetDoctorIdByUserIdQuery(userId!, {
    skip: !userId,
  });

  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
  } = useGetAppointmentsByDoctorIdQuery(doctorId!, {
    skip: !doctorId,
  });

  useEffect(() => {
    if (doctorData?.doctorId) {
      setDoctorId(doctorData.doctorId);
    }
  }, [doctorData]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📅 Doctor Appointments</h1>
        <Button onClick={() => setShowModal(true)}>+ Create Appointment</Button>
      </div>

      {/* ⬇️ Modal only opens when showModal is true */}
      {doctorId !== null && showModal && (
        <DoctorCreateAppointmentModal
          doctorId={doctorId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            // You can also refetch appointments here if needed
          }}
        />
      )}

      {isLoadingDoctorId || isLoadingAppointments ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : isErrorDoctorId || isErrorAppointments ? (
        <div className="text-red-500">❌ Failed to load appointments.</div>
      ) : appointments && appointments.length > 0 ? (
        <ul className="space-y-2">
          {appointments.map((appointment: AppointmentData) => (
            <li
              key={appointment.appointmentId}
              className="border rounded-xl p-4 shadow-sm"
            >
              <div className="font-medium">Patient ID: {appointment.patientId}</div>
              <div>Date: {appointment.appointmentDate}</div>
              <div>Time: {appointment.timeSlot}</div>
              <div>Status: {appointment.status}</div>
              <div>Reason: {appointment.reason}</div>
              <div className="text-sm text-gray-500">
                Created: {new Date(appointment.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-600">No appointments available.</div>
      )}
    </div>
  );
};

export default DoctorsAppointments;
