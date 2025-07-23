// src/routes/adminRoutes.ts
import AdminLayout from "../layouts/AdminLayout";
import AdminProfile from "../components/Admindashboard/adminprofile";
import Alldoctors from "../components/Admindashboard/Alldoctors";
import AdminComplaintsPage from "../components/Admindashboard/AllComplaints";
import ProtectedRoute from "../ProtectedRoutes";
import PatientDashboard from "../pages/patientdashboard";
import ManagementHub from "../components/Admindashboard/ManagementHub";
import AllPatients from "../components/Admindashboard/AllPatients";
import AllAppointments from "../components/Admindashboard/AllAppointments";
import AllPrescriptions from "../components/Admindashboard/AllPrescriptions";
import DonationsPage from "../components/Admindashboard/DonationsPage";
import ChartsPage from "../components/Admindashboard/ChartsPage";
import AdminPaymentsPage from "../components/Admindashboard/PaymentsPage";
import HRPage from "../components/Admindashboard/HRPage";

export const adminRoutes = {
    path: "admindashboard",
    element: (
        <ProtectedRoute>
            <AdminLayout />
        </ProtectedRoute>
    ),
    children: [
        { path: "", element: <AdminProfile /> },
        { path: "management", element: <ManagementHub /> },
        { path: "doctors", element: <Alldoctors /> },
        { path: "patients", element: <AllPatients /> },
        { path: "appointments", element: <AllAppointments /> },
        { path: "prescriptions", element: <AllPrescriptions /> },
        { path: "complaints", element: <AdminComplaintsPage /> },
        { path: "donations", element: <DonationsPage /> },
        { path: "charts", element: <ChartsPage /> },
        { path: "payments", element: <AdminPaymentsPage /> },
        { path: "hr", element: <HRPage /> },
        { path: "me", element: <PatientDashboard /> }, // if admin wants a "profile" or user info page
    ],
};
