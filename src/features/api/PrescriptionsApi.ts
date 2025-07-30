import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Define the PrescriptionData interface
export interface PrescriptionData {
    patient: any;
    doctor: any;
    prescriptionId: number;
    patientId: number | null;
    doctorId: number | null;
    appointmentId?: number | null;
    medicationName: string;
    notes: string;
    dosage: string;
    instructions: string;
    totalAmount: number | null;
    issueDate: string;
    expiryDate?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorIdResponse {
  doctorId: number;
}

export interface PatientIdResponse {
  patientId: number;
}

export const PrescriptionsApi = createApi({
    reducerPath: 'prescriptionsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: backendUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth?.token;
            if (token) {
                const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
                headers.set('Authorization', formattedToken);
                console.log('Using token in prescriptions API requests:', formattedToken.substring(0, 20) + '...');
            } else {
                console.warn('No token available for prescriptions API request');
            }
            return headers;
        },
    }),
    tagTypes: ['Prescription'],
    endpoints: (builder) => ({
        // 🔄 Get all prescriptions (admin only)
        getPrescriptions: builder.query<PrescriptionData[], void>({
            query: () => 'prescriptions',
            providesTags: ['Prescription'],
        }),

        // 🔍 Get a prescription by its ID
        getPrescriptionById: builder.query<PrescriptionData, number>({
            query: (prescriptionId) => `prescriptions/${prescriptionId}`,
            providesTags: ['Prescription'],
        }),

        // ➕ Add a new prescription
        addPrescription: builder.mutation<
            PrescriptionData,
            Omit<PrescriptionData, 'prescriptionId' | 'createdAt' | 'updatedAt'>
        >({
            query: (newPrescriptionData) => ({
                url: 'prescriptions',
                method: 'POST',
                body: newPrescriptionData,
            }),
            invalidatesTags: ['Prescription'],
        }),

        // ✏️ Update prescription
        updatePrescription: builder.mutation<
            PrescriptionData,
            Partial<PrescriptionData> & { prescriptionId: number }
        >({
            query: ({ prescriptionId, ...patch }) => ({
                url: `prescriptions/${prescriptionId}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: ['Prescription'],
        }),

        // ❌ Delete a prescription
        deletePrescription: builder.mutation<void, number>({
            query: (prescriptionId) => ({
                url: `prescriptions/${prescriptionId}`,
                method: 'DELETE',
            }),
            invalidatesTags:  ['Prescription'],
        }),

        // 👤 Get prescriptions by patient ID
        getPrescriptionsByPatientId: builder.query<PrescriptionData[], number>({
            query: (patientId) => `patients/${patientId}/prescriptions`,
            providesTags: (result, _error, patientId) =>
                result
                    ? [
                        { type: 'Prescription', id: `LIST_BY_PATIENT_${patientId}` },
                        ...result.map(({ prescriptionId }) => ({
                            type: 'Prescription' as const,
                            id: prescriptionId,
                        })),
                    ]
                    : [{ type: 'Prescription', id: `LIST_BY_PATIENT_${patientId}` }],
        }),

        // 👨‍⚕️ Get prescriptions by doctor ID
        getPrescriptionsByDoctorId: builder.query<PrescriptionData[], number>({
            query: (doctorId) => `doctors/${doctorId}/prescriptions`,
            providesTags: (result, _error, doctorId) =>
                result
                    ? [
                        { type: 'Prescription', id: `LIST_BY_DOCTOR_${doctorId}` },
                        ...result.map(({ prescriptionId }) => ({
                            type: 'Prescription' as const,
                            id: prescriptionId,
                        })),
                    ]
                    : [{ type: 'Prescription', id: `LIST_BY_DOCTOR_${doctorId}` }],
        }),

        // 📅 Get prescriptions by appointment ID (NOTE: check if endpoint exists)
        getPrescriptionsByAppointmentId: builder.query<PrescriptionData[], number>({
            query: (appointmentId) => `prescriptions/${appointmentId}`,
            providesTags: (result, _error, appointmentId) =>
                result
                    ? [
                        { type: 'Prescription', id: `LIST_BY_APPOINTMENT_${appointmentId}` },
                        ...result.map(({ prescriptionId }) => ({
                            type: 'Prescription' as const,
                            id: prescriptionId,
                        })),
                    ]
                    : [{ type: 'Prescription', id: `LIST_BY_APPOINTMENT_${appointmentId}` }],
        }),

        // 🧑‍💼 NEW: Get prescriptions by user ID (mapped to patient ID in backend)
        getPrescriptionsByUserId: builder.query<PrescriptionData[], number>({
            query: (userId) => `users/${userId}/prescriptions`,
            providesTags: (result, _error, userId) =>
                result
                    ? [
                        { type: 'Prescription', id: `LIST_BY_USER_${userId}` },
                        ...result.map(({ prescriptionId }) => ({
                            type: 'Prescription' as const,
                            id: prescriptionId,
                        })),
                    ]
                    : [{ type: 'Prescription', id: `LIST_BY_USER_${userId}` }],
        }),

        getDoctorIdByUserId: builder.query<DoctorIdResponse, number>({
              query: (userId) => `doctor-id/by-user/${userId}`,
            }),
        
            // ✅ New endpoint to get patientId from userId
            getPatientIdByUserId: builder.query<PatientIdResponse, number>({
              query: (userId) => `patient-id/${userId}`,
            }),
    }),
});

// Export all auto-generated hooks
export const {
    useGetPrescriptionsQuery,
    useGetPrescriptionByIdQuery,
    useAddPrescriptionMutation,
    useUpdatePrescriptionMutation,
    useDeletePrescriptionMutation,
    useGetPrescriptionsByPatientIdQuery,
    useGetPrescriptionsByDoctorIdQuery,
    useGetPrescriptionsByAppointmentIdQuery,
    useGetPrescriptionsByUserIdQuery, // ✅ NEW HOOK
    useGetDoctorIdByUserIdQuery,
    useGetPatientIdByUserIdQuery, // ✅ Export the hook
} = PrescriptionsApi;
