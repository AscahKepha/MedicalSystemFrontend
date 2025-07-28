import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

// Define possible statuses for an appointment
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';

// Define the AppointmentData interface
export interface AppointmentData {
  patientId: number;
  appointmentId: number;
  userId: number;
  doctorId: number;
  appointmentDate: string;
  timeSlot: string;
  appointmentTime: string;
  reason: string;
  totalAmount: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

// Define the Doctor ID Response type
export interface DoctorIdResponse {
  doctorId: number;
}

// Define the Appointments API slice
export const AppointmentsApi = createApi({
  reducerPath: 'appointmentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
        headers.set('Authorization', formattedToken);
        console.log('Using token in appointments API requests:', formattedToken.substring(0, 20) + '...');
      } else {
        console.warn('No token available for appointments API request');
      }
      return headers;
    },
  }),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    // Get all appointments
    getAppointments: builder.query<AppointmentData[], void>({
      query: () => 'appointments',
      providesTags: ['Appointment'],
    }),

    // Get a single appointment by ID
    getAppointmentById: builder.query<AppointmentData, number>({
      query: (appointmentId) => `appointments/${appointmentId}`,
      providesTags: ['Appointment'],
    }),

    // Add new appointment
    addAppointment: builder.mutation<
      AppointmentData,
      Omit<AppointmentData, 'appointmentId' | 'status' | 'createdAt' | 'updatedAt'>
    >({
      query: (newAppointmentData) => ({
        url: 'appointments',
        method: 'POST',
        body: {
          ...newAppointmentData,
          status: 'scheduled',
        },
      }),
      invalidatesTags: ['Appointment'],
    }),

    // Update appointment
    updateAppointment: builder.mutation<
      AppointmentData,
      Partial<AppointmentData> & { appointmentId: number }
    >({
      query: ({ appointmentId, ...patch }) => ({
        url: `appointments/${appointmentId}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { appointmentId }) => [
        { type: 'Appointment', id: appointmentId },
        'Appointment',
      ],
    }),

    // Delete appointment
    deleteAppointment: builder.mutation<void, number>({
      query: (appointmentId) => ({
        url: `appointments/${appointmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, appointmentId) => [
        { type: 'Appointment', id: appointmentId },
        'Appointment',
      ],
    }),

    // Get appointments by patient ID
    getAppointmentsByPatientId: builder.query<AppointmentData[], number>({
      query: (patientId) => `patients/${patientId}/appointments`,
      providesTags: (result, _error, patientId) =>
        result
          ? [
              { type: 'Appointment', id: `LIST_BY_USER_${patientId}` },
              ...result.map(({ appointmentId }) => ({
                type: 'Appointment' as const,
                id: appointmentId,
              })),
            ]
          : [{ type: 'Appointment', id: `LIST_BY_USER_${patientId}` }],
    }),



    // Get appointments by doctor ID
    getAppointmentsByDoctorId: builder.query<AppointmentData[], number>({
      query: (doctorId) => `doctors/${doctorId}/appointments`,
      providesTags: (result, _error, doctorId) =>
        result
          ? [
              { type: 'Appointment', id: `LIST_BY_DOCTOR_${doctorId}` },
              ...result.map(({ appointmentId }) => ({
                type: 'Appointment' as const,
                id: appointmentId,
              })),
            ]
          : [{ type: 'Appointment', id: `LIST_BY_DOCTOR_${doctorId}` }],
    }),

    // ✅ Get doctorId by userId
    getDoctorIdByUserId: builder.query<DoctorIdResponse, number>({
      query: (userId) => `/doctor-id/by-user/${userId}`,
    }),
  }),
});

// Export hooks
export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useAddAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsByPatientIdQuery,
  useGetAppointmentsByDoctorIdQuery,
  useGetDoctorIdByUserIdQuery,
} = AppointmentsApi;
