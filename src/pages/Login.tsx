import React, { useState } from "react";
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice"
import { useLoginUserMutation } from "../features/api/userApi"
// Adjust paths as needed, e.g., '../../store/authSlice', '../../features/api/userApi'

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Use the RTK Query mutation hook
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoginError(null); // Clear previous errors
    console.log("Attempting login...");

    try {
      // Define the expected LoginResponse type with your new role enums
      type UserRole = 'admin' | 'doctor' | 'patient' | 'user'; // Updated role types
      type LoginResponse = {
        token: string;
        user: {
          id: number;
          role: UserRole; // Use the updated role type
          username: string;
          userType: string;
          firstName: string;
          lastName: string;
          email: string;
          // Add other user profile fields your backend returns
        };
      };

      // --- IMPORTANT: REPLACE THIS SIMULATION WITH YOUR ACTUAL RTK QUERY CALL ---
      // This block is for demonstration/testing only if your backend isn't ready.
      // In your real application, you will use:
      const response: LoginResponse = await loginUser({ email, password }).unwrap();
      // For immediate testing, you can uncomment the simulation below:
      /*
      const response: LoginResponse = await new Promise(resolve => setTimeout(() => {
        const simulatedSuccess = true;
        const simulatedRole: UserRole = "doctor"; // Change to 'admin', 'patient', or 'user' for testing
        const simulatedUserId = 123;
        const simulatedUsername = "Test User";

        if (simulatedSuccess) {
          resolve({
            token: "Your_jwt_token_here_12345",
            user: { id: simulatedUserId, role: simulatedRole, username: simulatedUsername }
          });
        } else {
          // Simulate a failed login error structure
          throw { data: { message: "Invalid credentials" } };
        }
      }, 1500));
      */
      // --- END OF SIMULATION BLOCK ---


      dispatch(setCredentials({
        token: response.token,
        user: {
          id: response.user.id,
          role: response.user.role,
          userType: response.user.userType,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email
        }
      }));

      // Navigation based on role
      switch (response.user.role) {
        case 'admin':
          navigate('/admindashboard');
          break;
        case 'doctor':
          navigate('/doctorsdashboard'); // Changed to /dashboard/me
          break;
        case 'patient':
          navigate('/patientdashboard'); // Changed to /dashboard/me
          break;
        default: // Fallback for any unexpected role or if role is not defined
          console.warn(`Unknown user role: ${response.user.role}. Navigating to default login page.`);
          navigate('/login'); // Fallback to login page
          break;
      }
    } catch (error: any) { // Type 'any' for error as RTK Query errors can be complex
      console.error("Login request failed:", error);
      // RTK Query errors often have a 'data' property with backend error messages
      setLoginError(error.data?.message || "An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
      <div className="min-h-screen bg-white flex flex-col items-center ">
        {/* Header Section */}
        <header className="w-full max-w-md text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">AURA Healthcare</h1>
          <p className="text-gray-700 text-lg">Wellness in Your Hands. Together Towards a Healthier Tomorrow.</p>
        </header>
        {/* Login Form Container */}
        <div className="w-full max-w-md bg-white border-2 border-transparent rounded-lg shadow-lg overflow-hidden">
          {/* Welcome Section */}
          <div className="bg-white p-6 sm:p-8 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaUserCircle className="h-8 w-6 object-contain text-blue-500" />
            </div>
            <div>
              <p className="text-gray-700 text-lg font-medium">Welcome back!</p>
              <h2 className="text-2xl font-bold text-gray-900">Login in to your account</h2>
            </div>
          </div>
          {/* Form Fields */}
          <form className="p-6 sm:p-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-200"
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-200"
                disabled={isLoggingIn}
              />
              <div className="text-right mt-2">
                <a href="#" className="font-medium text-blue-700 hover:text-blue-800 text-sm">
                  forgot password?
                </a>
              </div>
            </div>
            {/* Error Message Display */}
            {loginError && (
              <div className="text-red-600 text-sm text-center">
                {loginError}
              </div>
            )}
            {/* Login Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Logging In...' : 'LOGIN NOW'}
              </button>
            </div>
          </form>
          {/* Sign up link */}
          <div className="p-6 sm:p-8 pt-0 text-center">
            <p className="text-sm text-gray-600">Don't have an account?{' '}
              <a href="/signin" className="font-medium text-blue-800 hover:text-blue-900">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
