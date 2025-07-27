import React from 'react';
import {
  FaUserInjured,
  FaCalendarCheck,
  FaFileMedical,
  FaMoneyCheckAlt
} from 'react-icons/fa';

const PatientDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-800">
          👋 Hello, Patient
        </h1>
        <p className="text-gray-500 text-sm mt-2 sm:mt-0">
          Here's an overview of your health journey.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile Summary */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex items-center space-x-4 hover:shadow-md transition">
          <FaUserInjured className="text-blue-500 text-4xl" />
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="font-semibold text-gray-800">Jane Doe</p>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex items-center space-x-4 hover:shadow-md transition">
          <FaCalendarCheck className="text-green-500 text-4xl" />
          <div>
            <p className="text-gray-500 text-sm">Appointments</p>
            <p className="font-semibold text-gray-800">5</p>
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex items-center space-x-4 hover:shadow-md transition">
          <FaFileMedical className="text-purple-500 text-4xl" />
          <div>
            <p className="text-gray-500 text-sm">Prescriptions</p>
            <p className="font-semibold text-gray-800">3</p>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-5 flex items-center space-x-4 hover:shadow-md transition">
          <FaMoneyCheckAlt className="text-yellow-500 text-4xl" />
          <div>
            <p className="text-gray-500 text-sm">Payments Made</p>
            <p className="font-semibold text-gray-800">Ksh. 7,500</p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📅 Upcoming Appointment
        </h2>
        <div className="border border-blue-100 p-4 rounded-lg bg-blue-50 text-sm space-y-1">
          <p><strong>Date:</strong> 30th July, 2025</p>
          <p><strong>Time:</strong> 10:00 AM - 11:00 AM</p>
          <p><strong>Doctor:</strong> Dr. John Smith (Dermatology)</p>
          <p><strong>Status:</strong> <span className="text-blue-600 font-medium">Confirmed</span></p>
        </div>
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          💊 Recent Prescriptions
        </h2>
        <ul className="text-sm space-y-2 text-gray-700">
          <li>🧾 <strong>28th July:</strong> Antibiotic prescription by Dr. John</li>
          <li>🧾 <strong>24th July:</strong> Vitamin D supplements</li>
          <li>🧾 <strong>20th July:</strong> Painkillers for back pain</li>
        </ul>
      </div>
    </div>
  );
};

export default PatientDashboard;
