import React, { useState } from 'react';
import { useGetDoctorsQuery } from '../../features/api/DoctorsApi';
import { FaUserMd, FaPhone, FaStethoscope, FaCalendarAlt } from 'react-icons/fa';
import BookAppointmentModal from './BookAppointmentModal'; // <-- Create this file from the previous code

const FindDoctor: React.FC = () => {
  const { data: doctors, isLoading, isError } = useGetDoctorsQuery();
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingOpen, setBookingOpen] = useState(false);

  // You may get this from Redux/authSlice if available
  const patientId = 1; // 🔁 Replace this with the actual logged-in patient ID

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
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      doc.isAvailable ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {doc.isAvailable ? 'Available' : 'Not Available'}
                </p>
              </div>
            </div>

            {/* Availability Section */}
            {doc.availability?.length > 0 && (
              <div className="mt-4 text-sm text-gray-700">
                <div className="font-medium text-blue-600 flex items-center gap-1 mb-1">
                  <FaCalendarAlt /> Schedule:
                </div>
                <ul className="ml-4 list-disc space-y-1">
                  {doc.availability.map((slot: any, index: number) => (
                    <li key={index}>
                      <span className="font-medium">{slot.day}</span>: {slot.start} - {slot.end}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={!doc.isAvailable}
              onClick={() => {
                setSelectedDoctor(doc);
                setBookingOpen(true);
              }}
            >
              {doc.isAvailable ? 'Book Appointment' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookAppointmentModal
          isOpen={isBookingOpen}
          onClose={() => setBookingOpen(false)}
          doctor={selectedDoctor}
          patientId={patientId}
        />
      )}
    </div>
  );
};

export default FindDoctor;
