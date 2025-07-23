// src/features/api/userApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../app/types";

export type userType=  'admin' | 'doctor' | 'patient' ;

export interface UserData{
   userId: number,
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  contactPhone: string, 
  address: string,
  userType: userType,
  createdAt: string,
  updatedAt: string,
}

export const userApi = createApi({
  reducerPath: "userApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",

    prepareHeaders: (headers, { getState, endpoint }) => {
      // Only add Authorization header for protected endpoints
      const publicEndpoints = ["loginUser", "registerUser"];
      if (publicEndpoints.includes(endpoint)) {
        return headers;
      }

      const token = (getState() as RootState).auth.token;

      if (token) {
        const formattedToken = token.startsWith("Bearer")
          ? token
          : `Bearer ${token}`;
        headers.set("Authorization", formattedToken);
        console.log(
          "Using token in API request:",
          formattedToken.substring(0, 20) + "..."
        );
      } else {
        console.log("No token available for API request");
      }

      return headers;
    },
  }),

  tagTypes: ["users", "user"],

  endpoints: (builder) => ({
    // Authentication and login user
    // getAllUsers:builder.query({
    //   query:() => "users",
    //   providesTags:["users"],
    // }),
    loginUser: builder.mutation({
      query: (userLoginCredentials) => ({
        url: "auth/login",
        method: "POST",
        body: userLoginCredentials,
      }),
    }),

    registerUser: builder.mutation({
      query: (userRegisterPayload) => ({
        url: "auth/register",
        method: "POST",
        body: userRegisterPayload,
      }),
    }),

    // Get one user by ID
    getUserById: builder.query({
      query: (user_id: number) => `users/${user_id}`,
      providesTags: ["user"],
    }),

    // Get all user profiles
    getAllUsersProfiles: builder.query({
      query: () => "users",
      providesTags: ["users"],
    }),

    // Get logged-in user's profile
    getUserProfile: builder.query({
      query: (userId: number) => `users/${userId}`,
      providesTags: ["user"],
    }),

    // Update user profile (general info)
    updateUserProfile: builder.mutation({
      query: ({ user_id, ...patch }) => ({
        url: `users/${user_id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["user", "users"],
    }),

    // Update only the profile image
    updateUserProfileImage: builder.mutation({
      query: ({ user_id, profile_picture }) => ({
        url: `users/${user_id}`,
        method: "PUT",
        body: { profile_picture },
      }),
      invalidatesTags: ["user", "users"],
    }),

    // Delete user profile
    deleteUserprofile: builder.mutation({
      query: ({ user_id }) => ({
        url: `users/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user", "users"],
    }),
  }),
});

export const {
 //useGetAllUsersQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useGetAllUsersProfilesQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useDeleteUserprofileMutation,
} = userApi;
