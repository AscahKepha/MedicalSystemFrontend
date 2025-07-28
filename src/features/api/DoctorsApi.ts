import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type RootState } from "../../app/types";


export interface DoctorData{
    availability: any;
    availableTime: ReactNode;
    availableDays: any;
    doctorId: number;
    userId?: number;
    firstName: string;
    lastName: string;
    specialization: string;
    contactPhone:string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
}


//Doctors Api

export const DoctorsApi = createApi({
    reducerPath: 'doctorsApi', // Unique path for this reducer in your Redux store
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/', // IMPORTANT: Adjust this to your actual API base URL
        prepareHeaders: (headers, { getState }) => {
            // Retrieve the authentication token from your Redux store
            const token = (getState() as RootState).auth?.token; // Adjust 'auth' and 'token' based on your actual auth slice structure
            if (token) {
                // Ensure the token is prefixed with 'Bearer'
                const formattedToken = token.startsWith('Bearer') ? token : `Bearer ${token}`;
                headers.set('Authorization', formattedToken);
                console.log('Using token in doctors API requests:', formattedToken.substring(0, 20) + '...');
            } else {
                console.warn('No token available for doctors API request');
            }
            return headers;
        },
    }),
    tagTypes:['Doctor'],
    endpoints: (builder)=>({
        //get all doctors
        getDoctors: builder.query<DoctorData[], void>({
            query:()=> 'doctors',
            providesTags: ['Doctor'],
        }),

        //Get doctors by id
        getDoctorById: builder.query<DoctorData, undefined>({
            query:()=> 'doctors',
            providesTags:['Doctor'],
        }),

        // Mutation to add a new doctor
        addDoctors: builder.mutation<DoctorData,{
            userId?: number;
            firstName: string;
            lastName: string;
            specialization: string;
            contactPhone:string;
            isAvailable: boolean;
        }>({
            query: (newDoctorData)=>({
                url: 'doctors',
                method: 'POST',
                body: newDoctorData,
            }),
            invalidatesTags: ['Doctor'],
        }),

        //update doctor
        updateDoctor: builder.mutation({
            query: (doctorUpdatePayload)=>({
                url: 'doctors',
                method: 'PUT',
                body: doctorUpdatePayload,
            }),
        }),

        //delete a doctor
        deleteDoctor: builder.mutation({
            query: (doctorId)=>({
                url: `doctors/${doctorId}`,
                method: 'DELETE',
            }),
            invalidatesTags:['Doctor']
        }),


        // //update doctors availability
        // updateDoctorsAvailability: builder.mutation<DoctorsData,
        // {
        //     doctorsId: number;
        //     doctorsAvailability: DoctorsAvailability;
        // }>({
        //     query:({doctorsId, doctorsAvailability})=>({
        //         url: `doctors/${doctorsId}`,
        //         method: 'PATCH',
        //         body: {doctorsAvailability},
        //     }),
        //     invalidatesTags['Doctors'],
        // }),
        //delete doctor
    
    })
})

export const {
    useGetDoctorsQuery,
      useAddDoctorsMutation,
      useUpdateDoctorMutation,
      useDeleteDoctorMutation,
}= DoctorsApi;
