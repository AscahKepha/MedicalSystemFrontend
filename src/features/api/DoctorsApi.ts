// 📁 src/features/api/DoctorsApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type RootState } from "../../app/types";
import type { Doctor } from "../../types/doctorTypes";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const DoctorsApi = createApi({
  reducerPath: "doctorsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: backendUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth?.token;
      if (token) {
        const formattedToken = token.startsWith("Bearer") ? token : `Bearer ${token}`;
        headers.set("Authorization", formattedToken);
        console.log("Using token in doctors API requests:", formattedToken.substring(0, 20) + "...");
      } else {
        console.warn("No token available for doctors API request");
      }
      return headers;
    },
  }),
  tagTypes: ["Doctor"],
  endpoints: (builder) => ({
    // ✅ Get all doctors
    getDoctors: builder.query<Doctor[], void>({
      query: () => "doctors",
      providesTags: ["Doctor"],
    }),

    // ✅ Get a doctor by ID
    getDoctorById: builder.query<Doctor, number>({
      query: (doctorId) => `doctors/${doctorId}`,
      providesTags: ["Doctor"],
    }),

    // ✅ Get doctor by userId
    getDoctorByUserId: builder.query<Doctor, number>({
      query: (userId) => `doctors/user/${userId}`,
      providesTags: ["Doctor"],
    }),

    // ✅ Add new doctor
    addDoctors: builder.mutation<
      Doctor,
      {
        userId?: number;
        firstName: string;
        lastName: string;
        specialization: string;
        contactPhone: string;
        isAvailable: boolean;
      }
    >({
      query: (newDoctorData) => ({
        url: "doctors",
        method: "POST",
        body: newDoctorData,
      }),
      invalidatesTags: ["Doctor"],
    }),

    // ✅ Update doctor
    updateDoctor: builder.mutation<
      Doctor,
      Partial<Doctor> & { doctorId: number }
    >({
      query: ({ doctorId, ...patch }) => ({
        url: `doctors/${doctorId}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Doctor"],
    }),

    // ✅ Delete doctor
    deleteDoctor: builder.mutation<void, number>({
      query: (doctorId) => ({
        url: `doctors/${doctorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Doctor"],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useGetDoctorByUserIdQuery,
  useAddDoctorsMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = DoctorsApi;
