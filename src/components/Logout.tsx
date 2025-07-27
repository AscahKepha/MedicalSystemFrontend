import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCredentials } from "../features/auth/authSlice";

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
  const dispatch = useDispatch();

  const handleLogout = () => {
    // 1. Dispatch the Redux action to clear credentials
    dispatch(clearCredentials());

    navigate(redirectPath);
  };

  return (
    <button onClick={handleLogout} className={className}>
      {children}
    </button>
  );
};

export default Logout;