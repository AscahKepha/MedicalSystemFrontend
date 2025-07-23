import React from 'react';

const DoctorDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-8">
        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-semibold">
          user profile
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-gray-700 w-full">
          <div><p className="font-semibold">Fullname</p><p>John Doe</p></div>
          <div><p className="font-semibold">Date of birth</p><p>1990-01-15</p></div>
          <div><p className="font-semibold">Contact</p><p>+254 7XX XXX XXX</p></div>
          <div><p className="font-semibold">Email</p><p>john.doe@example.com</p></div>
          <div><p className="font-semibold">Gender</p><p>Male</p></div>
          <div><p className="font-semibold">Next of kin</p><p>Jane Doe</p></div>
          <div><p className="font-semibold">Address</p><p>123 Main St</p></div>
          <div><p className="font-semibold">Age</p><p>34</p></div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Professional Qualifications</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li>Cardiovascular diseases</li>
          <li>Respiratory conditions</li>
          <li>Diabetes and metabolic disorders</li>
          <li>Infectious diseases</li>
          <li>Wound care</li>
        </ul>
      </div>

      {/* Certifications */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Certifications</h2>
        <p className="text-gray-700">
          Certified by [Certification Body]. Experience in general medicine, minor procedures, and preventative care.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Appointments</h3>
          <div className="bg-gray-200 p-4 rounded-md text-center text-lg font-semibold">
            No appointments
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4">Payments</h3>
          <div className="bg-gray-200 p-4 rounded-md text-center text-lg font-semibold">
            N/L
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
