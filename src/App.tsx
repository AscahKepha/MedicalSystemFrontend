import { createBrowserRouter, RouterProvider, useRouteError } from "react-router-dom";
import { userRoutes } from "./routes/UserRoutes";
import { adminRoutes } from "./routes/AdminRoutes";
import { doctorRoutes } from "./routes/DoctorRoutes";
import { patientRoutes } from "./routes/PatientRoutes";

// Error boundary component
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

// Main app with router
function App() {
  const router = createBrowserRouter([
    {
      ...userRoutes,
      ErrorBoundary: RouteErrorBoundary,
    },
    {
      ...doctorRoutes,
      ErrorBoundary: RouteErrorBoundary,
    },
    {
      ...patientRoutes,
      ErrorBoundary: RouteErrorBoundary,
    },
    {
      ...adminRoutes,
      ErrorBoundary: RouteErrorBoundary,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
