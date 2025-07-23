import PatientDashboard from "../pages/patientdashboard";
import UserComplaintsPage from "../components/UserComplaint";
import ProtectedRoute from "../ProtectedRoutes";

export const patientRoutes = {
  path: 'patientdashboard',
  element: (
    <ProtectedRoute>
      <PatientDashboard />
    </ProtectedRoute>
  ),
  children: [
    { path: "me", element: <PatientDashboard /> },
    { path: "complaints", element: <UserComplaintsPage /> }
  ]
};
