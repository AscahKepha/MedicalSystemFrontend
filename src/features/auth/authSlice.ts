// src/redux/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'doctor' | 'patient';
  email: string;
  contactPhone?: string;
  address?: string;
  profile_picture?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  userType: 'admin' | 'user' | 'doctor' | 'patient' | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  userType: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userType = action.payload.user.role;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
