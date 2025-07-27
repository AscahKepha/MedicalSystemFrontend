import React, { useState, useRef, useEffect } from "react";
import { FaRegUserCircle, FaSearch } from "react-icons/fa";
import { HiOutlineChatBubbleLeft, HiOutlineBell } from "react-icons/hi2";
import logo from "../../assets/Screenshot 2025-07-08 114349.png";
import Logout from "../../components/Logout";

export const NavbarP: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Fixed top navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-200 p-4 shadow-md">
        <div className="max-w-full mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Aura Health" className="h-6 w-6" />
            <span className="text-teal-700 text-xl md:text-2xl font-bold ml-2">
              Aura Health<span className="text-pink-800">care</span>
            </span>
          </div>

          {/* Middle: Search Bar */}
          <div className="flex-grow flex justify-center mx-4 sm:mx-8 relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none"
            />
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Right: Icons + Profile */}
          <div
            className="flex items-center space-x-4 md:space-x-6 relative"
            ref={dropdownRef}
          >
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <HiOutlineChatBubbleLeft className="h-7 w-7 md:h-8 md:w-8" />
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <HiOutlineBell className="h-7 w-7 md:h-8 md:w-8" />
            </a>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FaRegUserCircle className="h-8 w-8 md:h-9 md:w-9 mr-1" />
                <span className="font-semibold text-lg hidden sm:inline">
                  Hey Patient
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-md z-50">
                  <a
                    href="/patientdashboard"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <div className="border-t border-gray-200" />
                  <Logout />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Placeholder to push content below fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default NavbarP;
