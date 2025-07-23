import { Link } from "react-router-dom";
import { BiHome } from "react-icons/bi";
import { MdOutlineMedicalServices, MdContactSupport } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import logo from "../../assets/Screenshot 2025-07-08 114349.png";

export const NavbarH = () => {
  return (
    <div className="navbarh bg-gradient-to-r from-green-50 to-amber-50 shadow-lg sticky top-0 z-50 border-b border-green-200 px-4 py-3 flex flex-wrap justify-between items-center gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Aura Health" className="h-8 w-auto" />
        <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-lime-600 bg-clip-text text-transparent">
          Aura Health
        </span>
        <span className="font-bold text-xl bg-gradient-to-r from-pink-700 to-pink-400 bg-clip-text text-transparent">
          Care
        </span>
      </Link>

      {/* Horizontal Links */}
      <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium">
        <Link
          to="/"
          className="flex items-center gap-1 text-gray-700 hover:text-green-600"
        >
          <BiHome size={18} color="#22C55E" /> Home
        </Link>
        <Link
          to="/services"
          className="flex items-center gap-1 text-gray-700 hover:text-green-600"
        >
          <MdOutlineMedicalServices size={18} color="#22C55E" /> Services
        </Link>
        <Link
          to="/contact"
          className="flex items-center gap-1 text-gray-700 hover:text-green-600"
        >
          <MdContactSupport size={18} color="#22C55E" /> Contact
        </Link>
        <Link
          to="/location"
          className="flex items-center gap-1 text-gray-700 hover:text-green-600"
        >
          <FaLocationDot size={18} color="#22C55E" /> Locations
        </Link>
        <Link
          to="/login"
          className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition"
        >
          Login
        </Link>
        <Link
          to="/signin"
          className="btn bg-gradient-to-r from-teal-700 to-teal-400 hover:from-teal-600 hover:to-teal-400 text-white border-none shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-4 py-2 rounded"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};
