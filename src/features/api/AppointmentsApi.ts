// src/features/api/AppointmentsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import type { AppointmentData } from '../../types/appointmentTypes';

// ✅ Read the backend URL from .env
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface DoctorIdResponse {
  doctorId: number;
}

export interface PatientIdResponse {
  patientId: number;
}

export const AppointmentsApi = createApi({
  reducerPath: 'appointmentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
        headers.set('Authorization', formattedToken);
        console.log('🛡️ Using token in appointments API requests:', formattedToken.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No token available for appointments API request');
      }
      return headers;
    },
  }),
  tagTypes: ['Appointment'],
  endpoints: (builder) => ({
    getAppointments: builder.query<AppointmentData[], void>({
      query: () => 'appointments',
      providesTags: ['Appointment'],
    }),

    getAppointmentById: builder.query<AppointmentData, number>({
      query: (appointmentId) => `appointments/${appointmentId}`,
      providesTags: ['Appointment'],
    }),

    addAppointment: builder.mutation<
      AppointmentData,
      Omit<AppointmentData, 'appointmentId' | 'status' | 'createdAt' | 'updatedAt'>
    >({
      query: (newAppointmentData) => ({
        url: 'appointments',
        method: 'POST',
        body: {
          ...newAppointmentData,
          status: 'Scheduled', // Match the enum casing from appointmentTypes.ts
        },
      }),
      invalidatesTags: ['Appointment'],
    }),

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

    getDoctorIdByUserId: builder.query<DoctorIdResponse, number>({
      query: (userId) => `doctor-id/by-user/${userId}`,
    }),

    getPatientIdByUserId: builder.query<PatientIdResponse, number>({
      query: (userId) => `patient-id/${userId}`,
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useAddAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentsByPatientIdQuery,
  useGetAppointmentsByDoctorIdQuery,
  useGetDoctorIdByUserIdQuery,
  useGetPatientIdByUserIdQuery,
} = AppointmentsApi;
