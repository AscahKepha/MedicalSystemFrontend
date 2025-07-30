// src/components/patientdashboard/AppointmentTable.tsx
import React from 'react';
import type { AppointmentData } from '../../../types/appointmentTypes';

interface AppointmentTableProps {
  appointments: AppointmentData[];
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

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointments }) => {
  console.log('[Rendering Appointments]', appointments);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor ID</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reason</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => {
            const status = appointment.status ?? 'pending'; // fallback if undefined
            const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1);

            return (
              <tr key={appointment.appointmentId}>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.doctorId}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.appointmentTime || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{appointment.reason || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClasses(status)}`}>
                    {capitalizedStatus}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
