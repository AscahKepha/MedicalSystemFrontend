import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaFilePrescription,
  FaClipboardList,
  FaCreditCard,
  FaQuestionCircle,
  FaUserMd
} from 'react-icons/fa';
import NavbarP from '../components/patientdashboard/NavbarP'; // 👈 Imported your new Topbar

const patientNavItems = [
  { to: '.', icon: <FaHome className="mr-3" />, label: 'Dashboard' },
  { to: 'profile', icon: <FaUser className="mr-3" />, label: 'User Profile' },
  { to: 'appointments', icon: <FaCalendarAlt className="mr-3" />, label: 'Appointments' },
  { to: 'prescriptions', icon: <FaFilePrescription className="mr-3" />, label: 'Prescriptions' },
  { to: 'complaints', icon: <FaClipboardList className="mr-3" />, label: 'Complaints' },
  { to: 'find-doctor', icon: <FaUserMd className="mr-3" />, label: 'Find Doctor' },
  { to: 'support', icon: <FaQuestionCircle className="mr-3" />, label: 'Help/Support' },
  { to: 'payments', icon: <FaCreditCard className="mr-3" />, label: 'Payments' },
];

const PatientLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <NavbarP />

      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg p-6 hidden md:flex flex-col">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
          <nav className="flex-grow">
            <ul className="space-y-4">
              {patientNavItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg transition-colors text-lg font-medium ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    {item.icon} {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 md:p-8 bg-white shadow-md rounded-lg mx-4 my-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;