

// Define the expected structure of your authentication state
// This is used by API slices to access the token from getState()
export interface AuthState {
  token: string | null;
  user: any;
  isAuthenticated: boolean;
  userType: string | null;
}

// Define a generic RootState type that includes the slices your APIs might need.
export type RootState = {
  auth: AuthState;
  // You can add other top-level reducer paths here if your API slices
  // need to access other parts of the state for type inference.
  // For example:
  // [someOtherApi.reducerPath]: any;
};

// Define a generic AppDispatch type. It will be properly inferred in store.ts.
export type AppDispatch = any; // This will be properly inferred in store.ts