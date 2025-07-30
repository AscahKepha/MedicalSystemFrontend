// routes/doctorRoutes.ts

import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoutes';
import DoctorLayout from '../layouts/DoctorLayout';

// Page components
import AdminDashboard from '../components/doctordashboard/doctorsdashboard'; // ✅ this is your dashboard layout (NavbarD, HeroD, FooterD)
import DoctorProfile from '../components/doctordashboard/DoctorProfile';
import { DoctorsPrescription } from '../components/doctordashboard/PrescriptionsPage';
import DoctorsPayment from '../components/doctordashboard/PaymentsPage';
import DoctorsComplaints from '../components/doctordashboard/DoctorComplaints';
import DoctorsAppointments from '../components/doctordashboard/MyAppointments/DoctorsAppointments';
import Contact from '../pages/Contact';

export const doctorRoutes = {
  path: 'doctordashboard', // ✅ Must match exactly with your navigate('/doctordashboard')
  element: (
    <ProtectedRoute>
      <DoctorLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <AdminDashboard /> }, // ✅ Default dashboard landing page
    { path: 'profile', element: <DoctorProfile /> },
    { path: 'appointments', element: <DoctorsAppointments /> },
    { path: 'prescriptions', element: <DoctorsPrescription /> },
    { path: 'complaints', element: <DoctorsComplaints /> },
    { path: 'support', element: < Contact /> },
    { path: 'payments', element: <DoctorsPayment /> },

    // Optional fallback for unknown subroutes under /doctordashboard
    { path: '*', element: <Navigate to="." replace /> }
  ]
};
