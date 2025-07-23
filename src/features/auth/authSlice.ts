import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface UserProfile {
  userType: any;
  id: number; 
  firstName: string; 
  lastName: string; 
  role: 'admin' | 'user' | 'doctor' | 'patient'; 
  email: string; 
  contactPhone?: string; 
  address?: string; 
}

// Define the overall shape of your authentication state in Redux
interface AuthState {
  user: UserProfile | null; 
  token: string | null; 
  isAuthenticated: boolean; 
  userType: 'admin' | 'user' | 'doctor' | 'patient' | null;
}

// Initial state for the authentication slice
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
    
    // It updates the Redux state with the authenticated user's data and token.
    setCredentials: (state, action: PayloadAction<{ user: UserProfile; token: string }>) => {
      state.user = action.payload.user; 
      state.token = action.payload.token; 
      state.isAuthenticated = true; 
      state.userType = action.payload.user.role; 
    }, 

    // It resets the authentication state, effectively logging the user out.
    clearCredentials: (state) => {
      state.user = null; 
      state.token = null;
      state.isAuthenticated = false; 
      state.userType = null; 
  }
}});


export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
