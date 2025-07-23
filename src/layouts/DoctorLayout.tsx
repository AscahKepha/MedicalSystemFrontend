import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FaUser,
  FaCalendarAlt,
  FaRegFileAlt,
  FaClipboardList,
  FaCreditCard,
  FaQuestionCircle
} from 'react-icons/fa';

const navItems = [
  { to: 'me', icon: <FaUser className="mr-3" />, label: 'User profile' },
  { to: 'appointments', icon: <FaCalendarAlt className="mr-3" />, label: 'Appointments' },
  { to: 'prescriptions', icon: <FaRegFileAlt className="mr-3" />, label: 'Prescriptions' },
  { to: 'complaints', icon: <FaClipboardList className="mr-3" />, label: 'Complaints' },
  { to: 'support', icon: <FaQuestionCircle className="mr-3" />, label: 'Help/Support' },
  { to: 'payments', icon: <FaCreditCard className="mr-3" />, label: 'Payments' },
];

const DoctorLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:flex flex-col">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
        <nav className="flex-grow">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
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
  );
};

export default DoctorLayout;
