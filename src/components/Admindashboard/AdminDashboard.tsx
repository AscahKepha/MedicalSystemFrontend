import React from "react";
import {
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartBar,
  FaExclamationTriangle,
} from "react-icons/fa";

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Hello Admin 👋</h1>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Patients */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FaUserInjured className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Registered Patients</p>
            <p className="text-lg font-semibold text-gray-800">230</p>
          </div>
        </div>

        {/* Total Doctors */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FaUserMd className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Active Doctors</p>
            <p className="text-lg font-semibold text-gray-800">45</p>
          </div>
        </div>

        {/* Appointments Count */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FaCalendarCheck className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Appointments This Month</p>
            <p className="text-lg font-semibold text-gray-800">120</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FaMoneyBillWave className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Revenue (Ksh)</p>
            <p className="text-lg font-semibold text-gray-800">Ksh. 150,000</p>
          </div>
        </div>

        {/* Complaints */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FaExclamationTriangle className="text-red-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Open Complaints</p>
            <p className="text-lg font-semibold text-gray-800">6</p>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white shadow-md rounded-2xl p-5 flex items-center space-x-4">
          <FaChartBar className="text-indigo-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Monthly Growth</p>
            <p className="text-lg font-semibold text-gray-800">+12%</p>
          </div>
        </div>
      </div>

      {/* Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doctor Management */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Doctor Management</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Add/Remove Doctors</li>
            <li>• Update Specializations</li>
            <li>• Toggle Doctor Availability</li>
          </ul>
        </div>

        {/* Patient Management */}
        <div className="bg-white shadow rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Patient Management</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• View Patient Records</li>
            <li>• Monitor Appointments</li>
            <li>• Handle Complaints</li>
          </ul>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-gray-500 pt-10">
        Admin Panel • Last updated: July 2025
      </p>
    </div>
  );
};

export default AdminDashboard;
