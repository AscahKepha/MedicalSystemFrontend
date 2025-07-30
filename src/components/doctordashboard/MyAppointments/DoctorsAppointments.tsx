// src/components/doctordashboard/DoctorsAppointments.tsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../app/types';
import {
  useGetDoctorIdByUserIdQuery,
  useGetAppointmentsByDoctorIdQuery,
} from '../../../features/api/AppointmentsApi';
import DoctorCreateAppointmentModal from './DoctorCreateAppointmentModal';
import type { AppointmentData } from '../../../types/appointmentTypes';
import { Skeleton } from '../../ui/skeleton';
import { Button } from '../../ui/button';
import {
  CalendarDays,
  Clock,
  FileText,
  User,
  Hash,
  CalendarCheck,
  Coins,
  ArrowRightLeft,
  CircleDot,
  BadgeInfo,
  Clock9,
  Clock10,
} from 'lucide-react';

const DoctorsAppointments: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.userId);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: doctorData,
    isLoading: isLoadingDoctorId,
    isError: isErrorDoctorId,
    error: doctorError,
  } = useGetDoctorIdByUserIdQuery(userId!, {
    skip: !userId,
  });

  const {
    data: appointments,
    isLoading: isLoadingAppointments,
    isError: isErrorAppointments,
    error: appointmentsError,
  } = useGetAppointmentsByDoctorIdQuery(doctorId!, {
    skip: !doctorId,
  });

  // Helper function to get patient full name
  const getPatientFullName = (appointment: AppointmentData): string => {
    const patient = appointment.patient;
    if (!patient) return 'N/A';

    if (patient.firstName && patient.lastName) {
      return `${patient.firstName} ${patient.lastName}`;
    }
    if (patient.user && patient.user.firstName && patient.user.lastName) {
      return `${patient.user.firstName} ${patient.user.lastName}`;
    }
    return 'N/A';
  };

  // Log patient object for debugging
  useEffect(() => {
    if (appointments) {
      appointments.forEach((appointment) => {
        console.log('Patient object:', appointment.patient);
      });
    }
  }, [appointments]);

  useEffect(() => {
    if (doctorData?.doctorId) {
      setDoctorId(doctorData.doctorId);
      console.log('🩺 Doctor ID:', doctorData.doctorId);
    }
  }, [doctorData]);

  useEffect(() => {
    if (appointments) {
      console.log('📅 Appointments:', appointments);
      appointments.forEach((appointment: AppointmentData) => {
        console.log(
          `👤 Patient Name for Appointment ${appointment.appointmentId}:`,
          getPatientFullName(appointment)
        );
      });
    }
  }, [appointments]);

  useEffect(() => {
    if (isErrorDoctorId) {
      console.error('❌ Error fetching doctorId:', doctorError);
    }
    if (isErrorAppointments) {
      console.error('❌ Error fetching appointments:', appointmentsError);
    }
  }, [isErrorDoctorId, doctorError, isErrorAppointments, appointmentsError]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarCheck className="w-6 h-6" /> Doctor Appointments
        </h1>
        <Button onClick={() => setShowModal(true)}>+ Create Appointment</Button>
      </div>

      {doctorId !== null && showModal && (
        <DoctorCreateAppointmentModal
          doctorId={doctorId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            // Optional: trigger refetch if needed
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
          {appointments.map((appointment: AppointmentData) => {
            const fullName = getPatientFullName(appointment);

            return (
              <li
                key={appointment.appointmentId}
                className="border rounded-xl p-4 shadow-sm space-y-1"
              >
                <div className="font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Appointment ID: {appointment.appointmentId}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Patient: {fullName}
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Date: {appointment.appointmentDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Slot: {appointment.timeSlot}
                </div>
                <div className="flex items-center gap-2">
                  <Clock9 className="w-4 h-4" />
                  Start Time: {appointment.startTime}
                </div>
                <div className="flex items-center gap-2">
                  <Clock10 className="w-4 h-4" />
                  End Time: {appointment.endTime}
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Total Amount: KES {appointment.totalAmount}
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Reason: {appointment.reason ?? '—'}
                </div>
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4" />
                  Status:{' '}
                  {appointment.appointmentStatus
                    ? appointment.appointmentStatus.charAt(0).toUpperCase() +
                      appointment.appointmentStatus.slice(1)
                    : '—'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BadgeInfo className="w-4 h-4" />
                  Created: {new Date(appointment.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ArrowRightLeft className="w-4 h-4" />
                  Updated: {new Date(appointment.updatedAt).toLocaleString()}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-gray-600">No appointments available.</div>
      )}
    </div>
  );
};

export default DoctorsAppointments;
