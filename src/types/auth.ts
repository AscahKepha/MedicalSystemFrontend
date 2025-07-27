// src/types/auth.ts

export interface BackendUser {
    userId: any;
    id: number; // The user ID from your backend
    email: string;
    firstName: string;
    lastName: string;
    userType: 'admin' | 'doctor' | 'patient' | 'user'; // The user's role/type from the backend
    role: 'admin' | 'doctor' | 'patient' | 'user'; // Your backend also sends a 'role' field
    contactPhone?: string;
    address?: string;
    profile_picture?: string;
    username?: string; // Add if your backend actually sends this
}

export interface BackendLoginResponse {
    token: string;
    user: BackendUser;
}