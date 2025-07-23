import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';

export type ComplaintStatus = 'open' | 'In Progress' | 'resolved' | 'closed';

export interface ComplaintData {
    id: string;
    userId?: number;
    relatedAppointmentId?: number;
    subject: string;
    description: string;
    status: ComplaintStatus;
    createdAt: string;
    updatedAt: string;
}

export const complaintsApi = createApi({
    reducerPath: 'complaintsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth?.token;
            if (token) {
                const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
                headers.set('Authorization', formattedToken);
                console.log('Using token in complaints API requests:', formattedToken.substring(0, 20) + '...');
            } else {
                console.log('No token available for complaints API request');
            }
            return headers;
        },
    }),
    tagTypes: ['Complaint'],
    endpoints: (builder) => ({
        // Get all complaints
        getComplaints: builder.query<ComplaintData[], void>({
            query: () => 'complaints',
            providesTags: ['Complaint'],
        }),

        // Add a new complaint
        addComplaint: builder.mutation<
            ComplaintData,
            {
                subject: string;
                description: string;
                userId?: number;
                relatedAppointmentId?: number;
            }
        >({
            query: (newComplaintData) => ({
                url: 'complaints',
                method: 'POST',
                body: newComplaintData,
            }),
            invalidatesTags: ['Complaint'],
        }),

        // Update a complaint status
        updateComplaintStatus: builder.mutation<
            ComplaintData,
            {
                complaintsId: string;
                complaintStatus: ComplaintStatus;
            }
        >({
            query: ({ complaintsId, complaintStatus }) => ({
                url: `complaints/${complaintsId}`,
                method: 'PATCH',
                body: { complaintStatus },
            }),
            invalidatesTags: ['Complaint'],
        }),

        // Get complaints by user ID
        getComplaintsByUserId: builder.query<ComplaintData[], string>({
            query: (userId) => `users/${userId}/complaints`,
            providesTags: (result, _error, userId) =>
                result
                    ? [
                        { type: 'Complaint', id: `LIST_BY_USER_${userId}` },
                        ...result.map(({ id }) => ({ type: 'Complaint' as const, id })),
                    ]
                    : [{ type: 'Complaint', id: `LIST_BY_USER_${userId}` }],
        }),

        // Delete a complaint
        deleteComplaint: builder.mutation<void, string>({
            query: (complaintsId) => ({
                url: `complaints/${complaintsId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Complaint'],
        }),
    }),
});

// Export hooks
export const {
    useGetComplaintsQuery,
    useAddComplaintMutation,
    useUpdateComplaintStatusMutation,
    useDeleteComplaintMutation,
    useGetComplaintsByUserIdQuery,
} = complaintsApi;
