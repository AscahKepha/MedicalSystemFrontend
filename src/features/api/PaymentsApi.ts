import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentData {
    payments: any;
    paymentId: number;
    userId: number;
    appointmentId?: number;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    transactionId?: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
    patientId?: number;
    doctorId?: number;
}

export const PaymentsApi = createApi({
    reducerPath: 'paymentsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: backendUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth?.token;
            if (token) {
                const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
                headers.set('Authorization', formattedToken);
            }
            return headers;
        },
    }),
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        getPayments: builder.query<PaymentData[], void>({
            query: () => 'payments',
            providesTags: ['Payment'],
        }),

        getPaymentById: builder.query<PaymentData, number>({
            query: (paymentId) => `payments/${paymentId}`,
            providesTags: ['Payment'],
        }),

        addPayment: builder.mutation<
            PaymentData,
            Omit<PaymentData, 'paymentId' | 'paymentDate' | 'status' | 'createdAt' | 'updatedAt'> & { status?: PaymentStatus }
        >({
            query: (newPaymentData) => ({
                url: 'payments',
                method: 'POST',
                body: {
                    ...newPaymentData,
                    paymentDate: new Date().toISOString(),
                    status: newPaymentData.status || 'pending',
                },
            }),
            invalidatesTags: ['Payment'],
        }),

        updatePayment: builder.mutation<
            PaymentData,
            Partial<PaymentData> & { paymentId: number }
        >({
            query: ({ paymentId, ...patch }) => ({
                url: `payments/${paymentId}`,
                method: 'PUT', // ✅ match backend
                body: patch,
            }),
            invalidatesTags: ['Payment'],
        }),

        deletePayment: builder.mutation<void, number>({
            query: (paymentId) => ({
                url: `payments/${paymentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Payment'],
        }),

        getPaymentsByPatientId: builder.query<PaymentData[], number>({
            query: (patientId) => `payments/patient/${patientId}`,
            providesTags: (result, _error, patientId) =>
                result
                    ? [
                        { type: 'Payment', id: `LIST_BY_PATIENT_${patientId}` },
                        ...result.map(({ paymentId }) => ({ type: 'Payment' as const, id: paymentId })),
                    ]
                    : [{ type: 'Payment', id: `LIST_BY_PATIENT_${patientId}` }],
        }),

        getPaymentsByDoctorId: builder.query<PaymentData[], number>({
            query: (doctorId) => `payments/doctor/${doctorId}`,
            providesTags: (result, _error, doctorId) =>
                result
                    ? [
                        { type: 'Payment', id: `LIST_BY_DOCTOR_${doctorId}` },
                        ...result.map(({ paymentId }) => ({ type: 'Payment' as const, id: paymentId })),
                    ]
                    : [{ type: 'Payment', id: `LIST_BY_DOCTOR_${doctorId}` }],
        }),

        // ✅ Create Stripe Checkout Session
        createCheckoutSession: builder.mutation<
            { url?: string; message?: string },
            { appointmentId: number; paymentMethod: 'stripe' | 'cash' }
        >({
            query: (checkoutData) => ({
                url: 'payments/checkout',
                method: 'POST',
                body: checkoutData,
            }),
        }),

    }),
    // }),
});

export const {
    useGetPaymentsQuery,
    useGetPaymentByIdQuery,
    useAddPaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
    useGetPaymentsByPatientIdQuery,
    useGetPaymentsByDoctorIdQuery,
    useCreateCheckoutSessionMutation,
} = PaymentsApi;
