import React from "react";
import { FaRegUserCircle, FaSearch } from 'react-icons/fa';
import { HiOutlineChatBubbleLeft, HiOutlineBell } from 'react-icons/hi2';
import logo from '../../assets/Screenshot 2025-07-08 114349.png'


export const NavbarD:React.FC =()=>{
    return(
        <nav className="bg-gray-200 p-4 shadow-md">
          <div className="max-w-full mx-auto flex items-center justify-between">
            {/* Left Section: Logo/Title */}
            <div className="flex items-center">
                <div>
                    <img 
                    src={logo}
                    alt="Aura Health"
                    className="h-6 w-6"/>
                </div>
                <span className="text-teal-700 text-xl md:text-2xl font-bold">Aura Health<span className="text-pink-800">care</span>
                </span>
            </div>

            {/* Middle Section: Search Bar */}
            <div className="flex-grow flex justify-center mx-4 sm:mx-8">
            <div className="flex-grow flex justify-center mx-4 sm:mx-8">
                <input 
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none cocus:ring-blue-500"/>
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>
            {/* Right Section*/}
            <div className="flex items-center space-x-4 md:space-x-6">
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                <HiOutlineChatBubbleLeft className="h-7 w-7 md:h-8 md:w-8" />
                </a>
                <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
            <HiOutlineBell className="h-7 w-7 md:h-8 md:w-8" />
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
            <FaRegUserCircle className="h-8 w-8 md:h-9 md:w-9 mr-2" />
            <span className="font-semibold text-lg hidden sm:inline">Hey Doctor</span>
          </a>
          </div>
          </div>
        </nav>
    );
};

export default NavbarD;

