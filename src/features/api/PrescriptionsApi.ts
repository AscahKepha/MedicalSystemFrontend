import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types'; // Assuming your store path is correct

// Define the PrescriptionData interface based on a hypothetical prescriptionsTable schema
export interface PrescriptionData {
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

// Define the Prescriptions API slice
export const PrescriptionsApi = createApi({
    reducerPath: 'prescriptionsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
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
        // Query to get all prescriptions
        getPrescriptions: builder.query<PrescriptionData[], void>({
            query: () => 'prescriptions',
            providesTags: ['Prescription'],
        }),

        // Query to get a single prescription by ID
        getPrescriptionById: builder.query<PrescriptionData, number>({
            query: (prescriptionId) => `prescriptions/${prescriptionId}`,
            providesTags: ['Prescription'],
        }),

        // Mutation to add a new prescription
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

        // Mutation to update an existing prescription
        updatePrescription: builder.mutation<
            PrescriptionData,
            Partial<PrescriptionData> & { prescriptionId: number }
        >({
            query: ({ prescriptionId, ...patch }) => ({
                url: `prescriptions/${prescriptionId}`, 
                method: 'PATCH',
                body: patch, 
            }),
            invalidatesTags: (result, error, { prescriptionId }) => [{ type: 'Prescription', id: prescriptionId }, 'Prescription'], // Invalidate specific prescription and general list
        }),

        // Mutation to delete a prescription
        deletePrescription: builder.mutation<void, number>({
            query: (prescriptionId) => ({
                url: `prescriptions/${prescriptionId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, prescriptionId) => [{ type: 'Prescription', id: prescriptionId }, 'Prescription'], // Invalidate specific prescription and general list
        }),

        // Query to get prescriptions by patient ID
        getPrescriptionsByPatientId: builder.query<PrescriptionData[], number>({
            query: (patientId) => `patients/${patientId}/prescriptions`, 
            providesTags: (result, _error, patientId) =>
                result
                    ? [
                        { type: 'Prescription', id: `LIST_BY_PATIENT_${patientId}` },
                        ...result.map(({ prescriptionId }) => ({ type: 'Prescription' as const, id: prescriptionId })),
                    ]
                    : [{ type: 'Prescription', id: `LIST_BY_PATIENT_${patientId}` }],
        }),

        // Query to get prescriptions by doctor ID
        getPrescriptionsByDoctorId: builder.query<PrescriptionData[], number>({
            query: (doctorId) => `doctors/${doctorId}/prescriptions`,
            providesTags: (result, _error, doctorId) =>
                result
                    ? [
                        { type: 'Prescription', id: `LIST_BY_DOCTOR_${doctorId}` },
                        ...result.map(({ prescriptionId }) => ({ type: 'Prescription' as const, id: prescriptionId })),
                    ]
                    : [{ type: 'Prescription', id: `LIST_BY_DOCTOR_${doctorId}` }],
        }),

        // Query to get prescriptions by appointment ID
        getPrescriptionsByAppointmentId: builder.query<PrescriptionData[], number>({
            query: (appointmentId) => `prescriptions/${appointmentId}`, 
            providesTags: (result, _error, appointmentId) =>
                result
                    ? [
                        { type: 'Prescription', id: `LIST_BY_APPOINTMENT_${appointmentId}` },
                        ...result.map(({ prescriptionId }) => ({ type: 'Prescription' as const, id: prescriptionId })),
                    ]
                    : [{ type: 'Prescription', id: `LIST_BY_APPOINTMENT_${appointmentId}` }],
        }),
    }),
});

// Export hooks for use in your React components
export const {
    useGetPrescriptionsQuery,
    useGetPrescriptionByIdQuery,
    useAddPrescriptionMutation,
    useUpdatePrescriptionMutation,
    useDeletePrescriptionMutation,
    useGetPrescriptionsByPatientIdQuery,
    useGetPrescriptionsByDoctorIdQuery,
    useGetPrescriptionsByAppointmentIdQuery,
} = PrescriptionsApi;
