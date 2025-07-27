// src/pages/patient/FindDoctor.tsx
import React from 'react';
import { useGetDoctorsQuery } from '../../features/api/DoctorsApi'; // Adjust the path if needed
import { FaUserMd, FaPhone, FaStethoscope } from 'react-icons/fa';

const FindDoctor: React.FC = () => {
  const { data: doctors, isLoading, isError } = useGetDoctorsQuery();

  if (isLoading) return <p className="text-gray-600">Loading doctors...</p>;
  if (isError) return <p className="text-red-500">Failed to load doctors.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Available Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map((doc) => (
          <div
            key={doc.doctorId}
            className="border border-gray-200 rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <FaUserMd className="text-blue-600 text-3xl" />
              <div>
                <h3 className="text-xl font-semibold">
                  Dr. {doc.firstName} {doc.lastName}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FaStethoscope className="text-gray-500" /> {doc.specialization}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FaPhone className="text-gray-500" /> {doc.contactPhone}
                </p>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindDoctor;
