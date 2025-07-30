export type AppointmentStatus =
  | 'confirmed'
  | 'canceled'
  | 'completed'
  | 'rescheduled'
  | 'pending';

export interface UserData {
  userId: number;         // include userId, present in backend
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;      // password is in backend response, though you might not use it in frontend
  contactPhone?: string;
  address?: string;
  userType?: 'admin' | 'doctor' | 'patient';
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface DoctorData {
  doctorId: number;
  userId: number;         // also present on doctor level
  firstName?: string;     // backend also sends these fields on doctor level
  lastName?: string;
  specialization?: string | null;
  contactPhone?: string;
  isAvailable?: boolean;
  availability?: any[];   // keep as any[] or more specific if known
  createdAt: string;
  updatedAt: string;
  user: UserData;
  [key: string]: any;
}

export interface PatientData {
  patientId: number;
  userId: number;
  firstName?: string;    // also present at patient level
  lastName?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
  user: UserData;
  [key: string]: any;
}

export interface AppointmentData {
  appointmentId: number;
  userId: number;                 // this appears on your original type, but is it needed? Keep if backend sends it.
  status?: AppointmentStatus;    // you had both `status` and `appointmentStatus`, keep optional to avoid conflicts
  appointmentStatus: AppointmentStatus;
  doctorId: number;
  patientId: number;
  totalAmount: number;            // backend sends string, so reflect that
  timeSlot: string;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  appointmentTime?: string;       // optional if backend sends
  reason: string;
  createdAt: string;
  updatedAt: string;

  // Optional nested objects
  doctor?: DoctorData;
  patient?: PatientData;
}
