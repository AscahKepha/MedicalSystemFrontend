import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginUserMutation } from "../features/api/userApi";
import { toast } from "sonner";
import { type BackendLoginResponse } from "../types/auth";

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

    const validRoles = ["admin", "doctor", "patient", "user"] as const;
    type ValidRole = typeof validRoles[number];

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoginError(null);

        console.log("🔐 Attempting login with:", { email, password });

        try {
            const response: BackendLoginResponse = await loginUser({
                email,
                password,
            }).unwrap();

            console.log("✅ Login response received:", response);
            console.log("🧠 Full user object from backend:", response.user);

            const rawRole = response.user?.role?.toLowerCase() ?? "user";
            const userRole: ValidRole = validRoles.includes(rawRole as ValidRole)
                ? (rawRole as ValidRole)
                : "user";

            console.log(`👤 Mapped user role: "${rawRole}" → "${userRole}"`);

            const userId = response.user?.userId;
            if (!userId) {
                console.error("❗ userId not found in response.user");
                toast.error("Login failed: Missing user ID.");
                return;
            }

            dispatch(
                setCredentials({
                    token: response.token,
                    user: {
                        userId,
                        firstName: response.user.firstName,
                        lastName: response.user.lastName,
                        email: response.user.email,
                        role: userRole,
                        contactPhone: response.user.contactPhone,
                        address: response.user.address,
                        profile_picture: response.user.profile_picture,
                    },
                })
            );

            toast.success("Login successful!");
            console.log(`🚀 Navigating based on user role: ${userRole}`);

            switch (userRole) {
                case "admin":
                    navigate("/admindashboard"); // ✅ now lands on ManagementHub
                    break;
                case "doctor":
                    navigate("/doctordashboard");
                    break;
                case "patient":
                    navigate("/patientdashboard");
                    break;
                default:
                    navigate("/login");
                    console.warn(`⚠️ Unexpected role "${userRole}". Navigating to login.`);
            }

        } catch (error: any) {
            console.error("❌ Login request failed:", error);
            const errorMessage =
                error?.data?.message || "An error occurred during login. Please try again.";
            setLoginError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
            <div className="min-h-screen bg-white flex flex-col items-center">
                <header className="w-full max-w-md text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-600 mb-2">AURA Healthcare</h1>
                    <p className="text-gray-700 text-lg">
                        Wellness in Your Hands. Together Towards a Healthier Tomorrow.
                    </p>
                </header>

                <div className="w-full max-w-md bg-white border-2 border-transparent rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-white p-6 sm:p-8 flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <FaUserCircle className="h-8 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-gray-700 text-lg font-medium">Welcome back!</p>
                            <h2 className="text-2xl font-bold text-gray-900">Log in to your account</h2>
                        </div>
                    </div>

                    <form className="p-6 sm:p-8 space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                                required
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                disabled={isLoggingIn}
                            />
                            <div className="text-right mt-2">
                                <a href="#" className="text-sm font-medium text-blue-700 hover:text-blue-800">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        {loginError && (
                            <div className="text-red-600 text-sm text-center">{loginError}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoggingIn}
                            >
                                {isLoggingIn ? "Logging In..." : "LOGIN NOW"}
                            </button>
                        </div>
                    </form>

                    <div className="p-6 sm:p-8 pt-0 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
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
