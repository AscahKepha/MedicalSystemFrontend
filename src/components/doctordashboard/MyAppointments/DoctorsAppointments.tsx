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

  // Helper function to get status badge classes
  const getStatusBadgeClasses = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };


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
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 md:p-10"> {/* Added background and increased padding */}
      <div className="max-w-7xl mx-auto"> {/* Center content and limit width */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3"> {/* Larger, bolder heading */}
            <CalendarCheck className="w-8 h-8 text-green-600" /> {/* Larger icon, green color */}
            Doctor Appointments
          </h1>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105" // Enhanced button
          >
            + Create New Appointment
          </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Skeleton grid */}
            <Skeleton className="h-48 w-full bg-gray-200 rounded-xl" />
            <Skeleton className="h-48 w-full bg-gray-200 rounded-xl" />
            <Skeleton className="h-48 w-full bg-gray-200 rounded-xl" />
          </div>
        ) : isErrorDoctorId || isErrorAppointments ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center gap-3"> {/* Enhanced error message */}
            <BadgeInfo className="w-6 h-6" />
            <p className="font-medium">Oops! Failed to load appointments.</p>
            <p className="text-sm">Please try again later or contact support.</p>
          </div>
        ) : appointments && appointments.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Responsive grid for cards */}
            {appointments.map((appointment: AppointmentData) => {
              const fullName = getPatientFullName(appointment);
              const appointmentStatus = appointment.appointmentStatus
                ? appointment.appointmentStatus.charAt(0).toUpperCase() +
                  appointment.appointmentStatus.slice(1)
                : '—';

              return (
                <li
                  key={appointment.appointmentId}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out space-y-3" // Enhanced card styling
                >
                  <div className="font-semibold text-xl text-green-700 flex items-center gap-2 mb-2"> {/* Green for Appointment ID */}
                    <Hash className="w-5 h-5 text-green-600" />
                    Appointment ID: <span className="text-gray-800">{appointment.appointmentId}</span>
                  </div>
                  <div className="space-y-2 text-gray-700"> {/* Spacing for details */}
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Patient:</span> {fullName}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-indigo-500" />
                      <span className="font-medium">Date:</span> {appointment.appointmentDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      <span className="font-medium">Time Slot:</span> {appointment.timeSlot}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock9 className="w-5 h-5 text-teal-500" />
                      <span className="font-medium">Start Time:</span> {appointment.startTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock10 className="w-5 h-5 text-cyan-500" />
                      <span className="font-medium">End Time:</span> {appointment.endTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium">Total Amount:</span> KES {appointment.totalAmount}
                    </div>
                    <div className="flex items-start gap-2"> {/* Use items-start for multiline reasons */}
                      <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                      <span className="font-medium">Reason:</span> <p className="flex-1">{appointment.reason ?? 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2"> {/* Status badge */}
                      <CircleDot className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Status:</span>{' '}
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadgeClasses(appointment.appointmentStatus)}`}>
                        {appointmentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3 text-sm text-gray-500 space-y-1"> {/* Separator and timestamps */}
                    <div className="flex items-center gap-2">
                      <BadgeInfo className="w-4 h-4" />
                      Created: {new Date(appointment.createdAt).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="w-4 h-4" />
                      Updated: {new Date(appointment.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-6 rounded-lg text-center flex flex-col items-center justify-center space-y-3">
            <CalendarDays className="w-12 h-12 text-blue-400" />
            <p className="text-xl font-semibold">No appointments scheduled yet!</p>
            <p className="text-md">Click "Create New Appointment" to add your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsAppointments;