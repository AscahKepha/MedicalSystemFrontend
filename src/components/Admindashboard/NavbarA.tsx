import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegUserCircle, FaSearch } from 'react-icons/fa';
import { HiOutlineChatBubbleLeft, HiOutlineBell } from 'react-icons/hi2';
import logo from '../../assets/Screenshot 2025-07-08 114349.png';
import Logout from "../../components/Logout";

export const NavbarA: React.FC = () => {
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
      {/* Fixed Top Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white p-4 shadow-md border-b border-gray-200">
        <div className="max-w-full mx-auto flex items-center justify-between px-4 md:px-8">
          {/* Left: Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Aura Health" className="h-8 w-8" />
            <span className="text-teal-700 text-xl md:text-2xl font-bold ml-2">
              Aura Health<span className="text-pink-700">care</span>
            </span>
          </div>

          {/* Middle: Search Bar */}
          <div className="hidden lg:flex flex-grow justify-center mx-4 relative max-w-md">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none border border-gray-300"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Right: Icons and Profile */}
          <div className="flex items-center space-x-4 md:space-x-6 relative" ref={dropdownRef}>
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <HiOutlineChatBubbleLeft className="h-6 w-6 md:h-7 md:w-7" />
            </button>
            <button className="text-gray-700 hover:text-blue-600 transition-colors">
              <HiOutlineBell className="h-6 w-6 md:h-7 md:w-7" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <FaRegUserCircle className="h-7 w-7 md:h-8 md:w-8 mr-1" />
                <span className="font-semibold text-base md:text-lg hidden sm:inline">Hey Admin</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <Link
                    to="/admindashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    Profile
                  </Link>

                  <div className="border-t border-gray-100" />
                  <div className="px-4 py-2">
                    <Logout />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below navbar */}
      <div className="h-20" />
    </>
  );
};

export default NavbarA;
