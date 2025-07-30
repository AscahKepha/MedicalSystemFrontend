import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FaUserMd, FaUsers, FaCalendarAlt, FaClipboardList,
  FaRegFileAlt, FaDonate, FaChartBar, FaCreditCard
} from 'react-icons/fa';
import { IoSettingsOutline, IoPersonCircleOutline } from 'react-icons/io5';

import NavbarA from '../components/Admindashboard/NavbarA';
import FooterA from '../components/Admindashboard/footerA';

// Sidebar navigation items
const navItems = [
  { to: 'management', icon: <IoSettingsOutline className="mr-3" />, label: 'Management Hub' },
  { to: 'doctors', icon: <FaUserMd className="mr-3" />, label: 'Doctors' },
  { to: 'patients', icon: <FaUsers className="mr-3" />, label: 'Patients' },
  { to: 'appointments', icon: <FaCalendarAlt className="mr-3" />, label: 'Appointments' },
  { to: 'prescriptions', icon: <FaRegFileAlt className="mr-3" />, label: 'Prescriptions' },
  { to: 'complaints', icon: <FaClipboardList className="mr-3" />, label: 'Complaints' },
  { to: 'donations', icon: <FaDonate className="mr-3" />, label: 'Donations' },
  { to: 'charts', icon: <FaChartBar className="mr-3" />, label: 'Charts' },
  { to: 'payments', icon: <FaCreditCard className="mr-3" />, label: 'Payments' },
  { to: 'hr', icon: <IoPersonCircleOutline className="mr-3" />, label: 'Human Resource' },
];

const AdminLayout: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Navbar */}
      <NavbarA />

      {/* Sidebar - Fixed on the left */}
      <aside className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white shadow-lg p-6 hidden md:flex flex-col z-40">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Admin Panel</h2>
        <nav className="flex-grow">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg transition-colors text-base font-medium ${isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content with left margin to offset sidebar */}
      <main className="ml-0 md:ml-64 pt-20 px-4 md:px-8 pb-10">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8 min-h-[calc(100vh-8rem)]">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <FooterA />
    </div>
  );
};

export default AdminLayout;
