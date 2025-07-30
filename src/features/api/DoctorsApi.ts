import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type RootState } from "../../app/types";
import type { ReactNode } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export interface DoctorData {
  availability: any;
  availableTime: ReactNode;
  availableDays: any;
  doctorId: number;
    userId: number;            // <-- add this here

  // userId?: number;
  firstName: string;
  lastName: string;
  specialization: string;
  contactPhone: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

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
    getDoctors: builder.query<DoctorData[], void>({
      query: () => "doctors",
      providesTags: ["Doctor"],
    }),

    // ✅ Get a doctor by ID (your existing version was incorrect — fixed below)
    getDoctorById: builder.query<DoctorData, number>({
      query: (doctorId) => `doctors/${doctorId}`,
      providesTags: ["Doctor"],
    }),

    // ✅ Get doctor by userId
    getDoctorByUserId: builder.query<DoctorData, number>({
      query: (userId) => `doctors/user/${userId}`,
      providesTags: ["Doctor"],
    }),

    // ✅ Add new doctor
    addDoctors: builder.mutation<
      DoctorData,
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
      DoctorData,
      Partial<DoctorData> & { doctorId: number }
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
