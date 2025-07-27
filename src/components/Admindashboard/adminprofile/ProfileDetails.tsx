// src/components/profile/ProfileDetails.tsx
import React from 'react';

type Props = {
  userDetails: any;
  onPasswordClick: () => void;
};

const ProfileDetails: React.FC<Props> = ({ userDetails, onPasswordClick }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4">
      <h3 className="text-2xl font-bold mb-3">Personal Information</h3>
      <p className="mb-2"><span className="font-bold">First Name:</span> {userDetails.firstName}</p>
      <p className="mb-2"><span className="font-bold">Last Name:</span> {userDetails.lastName}</p>
      <p className="mb-2"><span className="font-bold">Email:</span> {userDetails.email}</p>
      <p className="mb-2"><span className="font-bold">Address:</span> {userDetails.address || 'N/A'}</p>
    </div>
    <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-lg p-4">
      <h3 className="text-2xl font-bold mb-3">Security Settings</h3>
      <p className="mb-2"><span className="font-bold">Password:</span> *****</p>
      <button onClick={onPasswordClick} className="btn bg-teal-600 hover:bg-emerald-600 text-white">
        Change Password
      </button>
    </div>
  </div>
);

export default ProfileDetails;
