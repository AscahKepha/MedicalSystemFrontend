import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types'; 

// Define possible statuses for a payment
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Define the PaymentData interface
export interface PaymentData {
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
}

// Define the Payments API slice
export const PaymentsApi = createApi({
    reducerPath: 'paymentsApi', 
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/', 
        prepareHeaders: (headers, { getState }) => {
            // Retrieve the authentication token from your Redux store
            const token = (getState() as RootState).auth?.token; 
            if (token) {
                // Ensure the token is prefixed with 'Bearer'
                const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
                headers.set('Authorization', formattedToken);
                console.log('Using token in payments API requests:', formattedToken.substring(0, 20) + '...');
            } else {
                console.warn('No token available for payments API request');
            }
            return headers;
        },
    }),
    tagTypes: ['Payment'], //tag type for caching and invalidation
    endpoints: (builder) => ({
        // Query to get all payments
        getPayments: builder.query<PaymentData[], void>({
            query: () => 'payments', 
            providesTags: ['Payment'],
        }),

        // Query to get a single payment by ID
        getPaymentById: builder.query<PaymentData, number>({
            query: (paymentId) => `payments/${paymentId}`,
            providesTags: ['Payment'],
        }),

        // Mutation to add a new payment
        addPayment: builder.mutation<
            PaymentData, // Expected response type
            Omit<PaymentData, 'paymentId' | 'paymentDate' | 'status' | 'createdAt' | 'updatedAt'> & { status?: PaymentStatus } // Request body type
        >({
            query: (newPaymentData) => ({
                url: 'payments',
                method: 'POST',
                body: {
                    ...newPaymentData,
                    paymentDate: new Date().toISOString(), // Set payment date on creation
                    status: newPaymentData.status || 'Pending' 
                },
            }),
            invalidatesTags: ['Payment'], 
        }),

        // Mutation to update an existing payment
        updatePayment: builder.mutation<
            PaymentData, 
            Partial<PaymentData> & { paymentId: number } 
        >({
            query: ({ paymentId, ...patch }) => ({
                url: `payments/${paymentId}`, 
                method: 'PATCH',
                body: patch, 
            }),
            invalidatesTags: ['Payment'], 
        }),

        //delete a payment
        deletePayment: builder.mutation<void, number>({ 
            query: (paymentId) => ({
                url: `payments/${paymentId}`, 
                method: 'DELETE',
            }),
            invalidatesTags: ['Payment'],
        }),

        // Query to get payments by user ID
        getPaymentsByUserId: builder.query<PaymentData[], number>({
            query: (userId) => `users/${userId}/payments`, // Assuming this endpoint exists
            providesTags: (result, _error, userId) =>
                result
                    ? [
                        { type: 'Payment', id: `LIST_BY_USER_${userId}` },
                        ...result.map(({ paymentId }) => ({ type: 'Payment' as const, id: paymentId })),
                    ]
                    : [{ type: 'Payment', id: `LIST_BY_USER_${userId}` }],
        }),
    }),
});

// Export hooks for use in your React components
export const {
    useGetPaymentsQuery,
    useGetPaymentByIdQuery,
    useAddPaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
    useGetPaymentsByUserIdQuery,
} = PaymentsApi;
