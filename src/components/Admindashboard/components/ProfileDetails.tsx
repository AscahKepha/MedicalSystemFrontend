// components/ProfileDetails.tsx
import React from "react";

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
};

const ProfileDetails: React.FC<Props> = ({ firstName, lastName, email, address }) => (
  <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4">
    <h3 className="text-2xl font-bold mb-3">Personal Info</h3>
    <p><strong>First Name:</strong> {firstName}</p>
    <p><strong>Last Name:</strong> {lastName}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Address:</strong> {address || 'N/A'}</p>
  </div>
);

export default ProfileDetails;

