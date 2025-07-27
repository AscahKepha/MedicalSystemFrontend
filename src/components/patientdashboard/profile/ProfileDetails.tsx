// components/patientprofile/ProfileDetails.tsx
import React from 'react';

interface ProfileDetailsProps {
  userDetails: any;
  onChangePasswordClick: () => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userDetails, onChangePasswordClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4">
        <h3 className="text-2xl font-bold mb-3">Personal Information</h3>
        <p className="mb-2"><strong>First Name:</strong> {userDetails.firstName}</p>
        <p className="mb-2"><strong>Last Name:</strong> {userDetails.lastName}</p>
        <p className="mb-2"><strong>Email:</strong> {userDetails.email}</p>
        <p className="mb-2"><strong>Address:</strong> {userDetails.address || 'N/A'}</p>
        <p className="mb-2"><strong>Phone:</strong> {userDetails.contactPhone || 'N/A'}</p>
      </div>
      <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-lg p-4">
        <h3 className="text-2xl font-bold mb-3">Security Settings</h3>
        <p className="mb-2"><strong>Password:</strong> *****</p>
        <button className="btn bg-teal-600 hover:bg-emerald-600 text-white mt-2" onClick={onChangePasswordClick}>Change Password</button>
      </div>
    </div>
  );
};

export default ProfileDetails;
