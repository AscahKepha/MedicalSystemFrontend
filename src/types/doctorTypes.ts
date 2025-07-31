export interface DoctorAvailability {
  id: number;
  doctorId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  slotFee: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone: string;
  address: string | null;
  userType: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  doctorId: number;
  userId: number;
  firstName: string;
  lastName: string;
  specialization?: string;
  contactPhone?: string;
  isAvailable?: boolean;
  defaultSlotDuration?: number;
  createdAt: string;
  updatedAt: string;
  user: DoctorUser;
  availability: DoctorAvailability[];
}
