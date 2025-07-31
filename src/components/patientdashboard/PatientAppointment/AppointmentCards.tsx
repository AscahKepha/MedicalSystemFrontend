import React, { useState } from 'react';
import type { AppointmentData } from '../../../types/appointmentTypes';
import type { Doctor } from '../../../types/doctorTypes';
import { motion } from 'framer-motion';
import MakePaymentModal from './MakePaymentModal';
import RescheduleModal from './RescheduleModal';

interface AppointmentCardsProps {
  appointments: AppointmentData[];
  doctors?: Doctor[];
}

const getStatusBadgeClasses = (status: string) => {
  switch (status) {
    case 'rescheduled':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'canceled':
      return 'bg-red-100 text-red-800';
    case 'confirmed':
      return 'bg-orange-100 text-orange-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AppointmentCards: React.FC<AppointmentCardsProps> = ({ appointments, doctors = [] }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  const getDoctorInfo = (doctorId: number | string) => {
    const match = doctors.find((doc) => String(doc.doctorId) === String(doctorId));
    if (!match) {
      console.warn(`[⚠️ Doctor Match Not Found] No doctor found for doctorId: ${doctorId}`);
    }
    return match;
  };

  const handlePayment = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setShowPaymentModal(true);
  };

  const handleReschedule = (appointment: AppointmentData) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {appointments.map((appointment) => {
          const doctor = getDoctorInfo(appointment.doctorId);
          const doctorName = doctor?.user
            ? `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`
            : '—';
          const specialization = doctor?.specialization ?? '—';
          const status = appointment.appointmentStatus ?? 'pending';
          const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);
          const totalAmount = appointment.totalAmount ?? 0;

          return (
            <motion.div
              key={appointment.appointmentId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg bg-white shadow-md border border-gray-200 p-4 hover:shadow-lg transition-all"
            >
              <div className="mb-2 text-sm text-gray-600">Appointment ID: #{appointment.appointmentId}</div>
              <h2 className="text-lg font-semibold text-gray-800">{doctorName}</h2>
              <div className="text-sm text-gray-500 mb-1">{specialization}</div>
              <div className="text-sm text-gray-600">📅 {appointment.appointmentDate}</div>
              <div className="text-sm text-gray-600">⏰ {appointment.startTime} - {appointment.endTime}</div>
              <div className="text-sm text-gray-600">📝 {appointment.reason || '—'}</div>
              <div className="text-sm text-gray-600">💵 Total: Ksh {totalAmount}</div>
              <div className="mt-2">
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(status)}`}>
                  {capitalizedStatus}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
                  onClick={() => handlePayment(appointment)}
                >
                  Make Payment
                </button>
                <button
                  className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600 transition"
                  onClick={() => handleReschedule(appointment)}
                >
                  Reschedule
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {selectedAppointment && showPaymentModal && (
        <MakePaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          appointmentId={selectedAppointment.appointmentId}
          amount={selectedAppointment.totalAmount ?? 500}
        />
      )}


      {selectedAppointment && showRescheduleModal && (
        <RescheduleModal
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          appointmentId={selectedAppointment.appointmentId}
          onSubmit={(newDate, newTime) => {
            console.log('Rescheduling to', newDate, newTime);
            setShowRescheduleModal(false);
          }}
        />
      )}
    </>
  );
};

export default AppointmentCards;
