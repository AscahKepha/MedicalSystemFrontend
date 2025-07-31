import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import { userRoutes } from "./routes/UserRoutes";
import { adminRoutes } from "./routes/AdminRoutes";
import { doctorRoutes } from "./routes/DoctorRoutes";
import { patientRoutes } from "./routes/PatientRoutes";
import { Toaster } from "react-hot-toast";

// ✅ Import payment pages
import PaymentSuccess from "./components/patientdashboard/PatientAppointment/payment-success";
import PaymentCancel from "./components/patientdashboard/PatientAppointment/payment-cancel";

function RouteErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold text-red-700">Something went wrong!</h2>
      <p className="text-gray-700 mt-2">
        {(error as { message?: string })?.message || "An unexpected error occurred."}
      </p>
    </div>
  );
}
//test
function App() {
  const router = createBrowserRouter([
    {
      ...userRoutes,
      errorElement: <RouteErrorBoundary />,
    },
    {
      ...doctorRoutes,
      errorElement: <RouteErrorBoundary />,
    },
    {
      ...patientRoutes,
      errorElement: <RouteErrorBoundary />,
    },
    {
      ...adminRoutes,
      errorElement: <RouteErrorBoundary />,
    },
    // ✅ Payment result routes
    {
      path: "/user/payment-success",
      element: <PaymentSuccess />,
    },
    {
      path: "/user/payment-cancel",
      element: <PaymentCancel />,
    },
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
