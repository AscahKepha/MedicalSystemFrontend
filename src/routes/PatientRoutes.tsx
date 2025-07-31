import PatientDashboard from "../components/patientdashboard/PatientDashboard";
import UserComplaintsPage from "../components/patientdashboard/PatientComplaints";
import ProtectedRoute from "../ProtectedRoutes";
import PatientProfile from "../components/patientdashboard/patientProfile";
import PatientLayout from "../layouts/PatientLayout";
import PatientAppointments from "../components/patientdashboard/PatientAppointment/PatientsAppointments";
import { Contact } from "../pages/Contact";
import PatientsPrescription from "../components/patientdashboard/PatientsPrescriptions";
import PatientsPayment from "../components/patientdashboard/PatientsPayments";
import FindDoctor from "../components/patientdashboard/FindDoctor";

// ✅ Import Payment Success/Cancel pages
import PaymentSuccess from "../components/patientdashboard/PatientAppointment/payment-success";
import PaymentCancel from "../components/patientdashboard/PatientAppointment/payment-cancel";

export const patientRoutes = {
  path: "patientdashboard",
  element: (
    <ProtectedRoute>
      <PatientLayout />
    </ProtectedRoute>
  ),
  children: [
    // Dashboard is default
    { index: true, element: <PatientDashboard /> },

    // Profile
    { path: "profile", element: <PatientProfile /> },

    // Functional pages
    { path: "appointments", element: <PatientAppointments /> },
    { path: "prescriptions", element: <PatientsPrescription /> },
    { path: "payments", element: <PatientsPayment /> },
    { path: "complaints", element: <UserComplaintsPage /> },
    { path: "find-doctor", element: <FindDoctor /> },

    // Stripe Payment Redirect Pages ✅
    { path: "payment-success", element: <PaymentSuccess /> },
    { path: "payment-cancel", element: <PaymentCancel /> },

    // Support
    { path: "support", element: <Contact /> },
  ],
};
