import React from 'react';
// Import icons for the sidebar
import { FaHome, FaUser, FaCalendarAlt, FaRegFileAlt, FaClipboardList, FaCreditCard, FaQuestionCircle } from 'react-icons/fa';

export const HeroP: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100"> {/* Main container for the layout */}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col hidden md:flex"> {/* Sidebar styling */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <a href="/" className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-lg font-medium">
                <FaHome className="mr-3 text-xl" /> Home
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-blue-600 bg-blue-50 px-4 py-2 rounded-lg transition-colors text-lg font-medium"> {/* Highlighted User Profile */}
                <FaUser className="mr-3 text-xl" /> User profile
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-lg font-medium">
                <FaCalendarAlt className="mr-3 text-xl" /> Appointments
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-lg font-medium">
                <FaRegFileAlt className="mr-3 text-xl" /> Prescriptions
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-lg font-medium">
                <FaClipboardList className="mr-3 text-xl" /> Complaints
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-lg font-medium">
                <FaQuestionCircle className="mr-3 text-xl" /> Help/Support
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors text-lg font-medium">
                <FaCreditCard className="mr-3 text-xl" /> Payments
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area: User Profile */}
      <main className="flex-grow p-6 md:p-8 bg-white shadow-md rounded-lg mx-4 my-6"> {/* Profile card styling */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1> {/* This 'Dashboard' title is consistent with the image */}

        {/* Profile Header Section (Basic Info) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
          {/* User Profile Image Placeholder */}
          <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-semibold flex-shrink-0">
            user profile
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-gray-700 flex-grow w-full sm:w-auto">
            <div>
              <p className="font-semibold text-gray-900">Fullname</p>
              <p>John Doe</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Date of birth</p>
              <p>1990-01-15</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Contact</p>
              <p>+254 7XX XXX XXX</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Email</p>
              <p>john.doe@example.com</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Gender</p>
              <p>Male</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Next of kin</p>
              <p>Jane Doe (+254 7YY YYY YYY)</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Address</p>
              <p>123 Main St, Nairobi, Kenya</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Age</p>
              <p>34</p> {/* Example Data */}
            </div>
          </div>
        </div>

        {/* Medical History Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Medical History</h2>
          <div className="space-y-2 text-gray-700 text-lg">
            <p className="font-semibold">Seasonal Allergies</p>
            <p>no current</p> {/* As per image */}
            <p className="font-semibold mt-4">Family medical history</p>
            <p>No significant family history reported.</p> {/* Example content */}
            {/* You would populate this with actual medical history data */}
          </div>
        </div>

        {/* Vital Signs / Measurements Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 text-gray-700">
            <div>
              <p className="font-semibold text-gray-900">Weight</p>
              <p>75 kg</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Height</p>
              <p>175 cm</p> {/* Example Data */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">BMI</p>
              <p>24.5</p> {/* Example Data (you might calculate this) */}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Bloodgroup</p>
              <p>O+</p> {/* Example Data */}
            </div>
          </div>
          {/* Input field as seen in the image, likely for recording new measurements */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Input new measurements or notes..."
              className="w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 text-lg"
            />
          </div>
        </div>

        {/* Appointments and Payments Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
          {/* Appointments Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Appointments</h3>
            <div className="bg-gray-200 p-4 rounded-md text-gray-700 text-center text-lg font-semibold">
              no appointments
            </div>
          </div>

          {/* Payments Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Payments</h3>
            <div className="bg-gray-200 p-4 rounded-md text-gray-700 text-center text-lg font-semibold">
              N/L {/* As seen in the image */}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default HeroP;