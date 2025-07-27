// src/features/api/userApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/types';
import type { UserProfile } from '../../features/auth/authSlice';
import type { BackendLoginResponse } from '../../types/auth';

export interface userData {
  createdAt: any;
  userType: string;
  userId: number;
  firstName: string;
  lastName: string;
  role: 'admin' | 'doctor' | 'patient';
  email: string;
  contactPhone?: string;
  address?: string;
  profile_picture?: string;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        // ✅ FIXED: Use standard capitalization
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    loginUser: builder.mutation<BackendLoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    registerUser: builder.mutation<any, any>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    getUserById: builder.query<UserProfile, number>({
      query: (userId) => `users/${userId}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    updateUserProfile: builder.mutation<
      { message: string; user: UserProfile },
      Partial<UserProfile> & { userId: number }
    >({
      query: ({ userId, ...patch }) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),

    updateUserProfileImage: builder.mutation<
      { message: string; profile_picture: string },
      { userId: number; profile_picture: string }
    >({
      query: ({ userId, profile_picture }) => ({
        url: `users/${userId}/profile-picture`,
        method: 'PUT',
        body: { profile_picture },
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),

    changePassword: builder.mutation<
      { message: string },
      { userId: number; currentPassword: string; newPassword: string }
    >({
      query: ({ userId, currentPassword, newPassword }) => ({
        url: `users/${userId}/change-password`,
        method: 'PUT',
        body: { currentPassword, newPassword },
      }),
      invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
    }),

    getAllUsersProfiles: builder.query<UserProfile[], void>({
      query: () => 'users',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ userId }) => ({ type: 'User' as const, id: userId })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserByIdQuery,
  useUpdateUserProfileMutation,
  useUpdateUserProfileImageMutation,
  useChangePasswordMutation,
  useGetAllUsersProfilesQuery,
} = userApi;
