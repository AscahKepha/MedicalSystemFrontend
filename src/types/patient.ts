// src/types/patient.ts

// Adjust the import path for UserProfile based on its actual location.
// Based on your previous code, it's likely:
import { type UserProfile } from '../../src/features/auth/authSlice'; 

// Import the specific data types for Appointments and Payments
import { type AppointmentData } from '../../src/types/appointmentTypes'; 
import { type PaymentData } from '../features/api/PaymentsApi';     

export interface PatientProfileDisplay extends UserProfile {
    dateOfBirth?: string; // YYYY-MM-DD
    gender?: 'Male' | 'Female' | 'Other';
    nextOfKinName?: string;
    nextOfKinContact?: string;
    medicalHistoryNotes?: string; // For allergies, family history
    weightKg?: number;
    heightCm?: number;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

    currentMeasurementNote?: string;

    // These will now use the specific types you defined
    appointments?: AppointmentData[]; 
    payments?: PaymentData[]; 
}