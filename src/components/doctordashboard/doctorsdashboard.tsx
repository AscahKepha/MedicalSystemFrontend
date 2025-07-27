import React from 'react';
import {
  FaCalendarAlt,
  FaUserInjured,
  FaFilePrescription,
  FaCheckCircle,
  FaBriefcaseMedical,
} from 'react-icons/fa';

const DoctorDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Greeting */}
      <h1 className="text-3xl font-bold text-gray-800">
        Hello, Doctor 👋
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Patients Seen */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <FaUserInjured className="text-blue-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Patients Seen</p>
            <p className="font-semibold text-gray-800">24</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <FaCalendarAlt className="text-green-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Upcoming Appointments</p>
            <p className="font-semibold text-gray-800">4</p>
          </div>
        </div>

        {/* Prescriptions Written */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <FaFilePrescription className="text-purple-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Prescriptions</p>
            <p className="font-semibold text-gray-800">12</p>
          </div>
        </div>

        {/* Availability Status */}
        <div className="bg-white shadow-md rounded-2xl p-4 flex items-center space-x-4">
          <FaCheckCircle className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Availability</p>
            <p className="font-semibold text-green-600">Available</p>
          </div>
        </div>
      </div>

      {/* Today’s Appointments Section */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        <div className="space-y-4 text-sm">
          <div className="border p-4 rounded-lg">
            <p><strong>Patient:</strong> Jane Doe</p>
            <p><strong>Time:</strong> 10:00 AM - 10:30 AM</p>
            <p><strong>Status:</strong> <span className="text-blue-600 font-medium">Confirmed</span></p>
          </div>
          <div className="border p-4 rounded-lg">
            <p><strong>Patient:</strong> John Smith</p>
            <p><strong>Time:</strong> 11:00 AM - 11:30 AM</p>
            <p><strong>Status:</strong> <span className="text-yellow-600 font-medium">Pending</span></p>
          </div>
        </div>
      </div>

      {/* Recent Prescriptions Section */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Prescriptions</h2>
        <ul className="text-sm space-y-2">
          <li>🧾 <strong>26th July:</strong> Painkillers for headache - Jane Doe</li>
          <li>🧾 <strong>24th July:</strong> Antihistamines - Mark Kip</li>
          <li>🧾 <strong>22nd July:</strong> Antibiotics - Alice M.</li>
        </ul>
      </div>

      {/* Quick Tools or Actions */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
            <FaBriefcaseMedical /> <span>View Schedule</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2">
            <FaFilePrescription /> <span>Write Prescription</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
