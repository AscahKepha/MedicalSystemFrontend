// routes/doctorRoutes.ts
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoutes';
import DoctorLayout from '../layouts/DoctorLayout';

import DoctorDashboard from '../components/doctordashboard/DoctorDashboard';
import UserComplaintsPage from '../components/doctordashboard/UserComplaintsPage';
import AppointmentsPage from '../components/doctordashboard/AppointmentsPage';
import PrescriptionsPage from '../components/doctordashboard/PrescriptionsPage';
import SupportPage from '../components/doctordashboard/SupportPage';
import PaymentsPage from '../components/doctordashboard/PaymentsPage';

export const doctorRoutes = {
    path: 'doctorsdashboard',
    element: (
        <ProtectedRoute>
            <DoctorLayout />
        </ProtectedRoute>
    ),
    children: [
        { index: true, element: <Navigate to="me" replace /> },
        { path: 'me', element: <DoctorDashboard /> },
        { path: 'appointments', element: <AppointmentsPage /> },
        { path: 'prescriptions', element: <PrescriptionsPage /> },
        { path: 'complaints', element: <UserComplaintsPage /> },
        { path: 'support', element: <SupportPage /> },
        { path: 'payments', element: <PaymentsPage /> },
    ]
};
