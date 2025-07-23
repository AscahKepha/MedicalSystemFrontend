import React from "react";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
  redirectPath?: string;
  children?: React.ReactNode;
  className?: string;
}

const Logout: React.FC<LogoutProps> = ({
  redirectPath = "/login",
  children = "LOG OUT",
  className = "bg-transparent hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded transition-colors text-lg"
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local/session storage (tokens, user info)
    localStorage.clear();
    sessionStorage.clear();

    // Optional: show a toast or alert
    // alert("Logged out successfully");

    // Redirect to login or home
    navigate(redirectPath);
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
};

export default Logout;
