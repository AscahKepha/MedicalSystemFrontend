import React from 'react';

type AvailabilitySlot = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotFee?: number;
};

type Props = {
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    address?: string;
    specialization?: string;
    contactPhone?: string;
    isAvailable?: boolean;
    availability?: AvailabilitySlot[];
  };
  onPasswordClick: () => void;
};

const ProfileDetails: React.FC<Props> = ({ userDetails, onPasswordClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Personal Info */}
    <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4 text-white">
      <h3 className="text-2xl font-bold mb-3">Personal Information</h3>
      <p className="mb-2"><span className="font-bold">First Name:</span> {userDetails.firstName}</p>
      <p className="mb-2"><span className="font-bold">Last Name:</span> {userDetails.lastName}</p>
      <p className="mb-2"><span className="font-bold">Email:</span> {userDetails.email}</p>
      <p className="mb-2"><span className="font-bold">Address:</span> {userDetails.address || 'N/A'}</p>
      <p className="mb-2"><span className="font-bold">Specialization:</span> {userDetails.specialization || 'N/A'}</p>
      <p className="mb-2"><span className="font-bold">Phone:</span> {userDetails.contactPhone || 'N/A'}</p>

      {userDetails.isAvailable !== undefined && (
        <p className="mb-2">
          <span className="font-bold">Availability:</span>{" "}
          <span className={`font-semibold ${userDetails.isAvailable ? 'text-green-200' : 'text-red-300'}`}>
            {userDetails.isAvailable ? "Available" : "Not Available"}
          </span>
        </p>
      )}

      {/* Show Availability Schedule if provided */}
      {userDetails.availability && userDetails.availability.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xl font-semibold mb-2">Availability Schedule:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {userDetails.availability.map((slot, index) => (
              <li key={index}>
                <span className="font-bold">{slot.dayOfWeek}:</span>{" "}
                {slot.startTime} - {slot.endTime}
                {slot.slotFee !== undefined && (
                  <span className="ml-2 text-xs text-gray-200">(Fee: ${slot.slotFee.toFixed(2)})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    {/* Security Settings */}
    <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-lg p-4 text-white">
      <h3 className="text-2xl font-bold mb-3">Security Settings</h3>
      <p className="mb-2"><span className="font-bold">Password:</span> *****</p>
      <button
        onClick={onPasswordClick}
        className="btn bg-teal-600 hover:bg-emerald-600 text-white mt-2"
      >
        Change Password
      </button>
    </div>
  </div>
);

export default ProfileDetails;
