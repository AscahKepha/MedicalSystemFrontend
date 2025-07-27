// components/ProfileHeader.tsx
import React from "react";
import { FaCamera, FaEdit } from "react-icons/fa";

type Props = {
  displayProfilePicture: string;
  handleFileImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userName: string;
  email: string;
  onEdit: () => void;
};

const ProfileHeader: React.FC<Props> = ({
  displayProfilePicture,
  handleFileImage,
  userName,
  email,
  onEdit,
}) => (
  <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-700 pb-5 mb-5">
    <div className="relative flex items-center gap-4 mb-4 md:mb-0">
      <img
        src={displayProfilePicture}
        alt="profile"
        className="w-24 h-24 rounded-full border-4 border-green-500"
      />
      <label className="absolute bottom-0 bg-green-500 p-2 rounded-full cursor-pointer">
        <FaCamera />
        <input type="file" className="hidden" onChange={handleFileImage} />
      </label>
      <div>
        <h2 className="text-3xl font-bold">{userName}</h2>
        <p className="text-gray-400">{email}</p>
      </div>
    </div>
    <button className="btn bg-green-600 flex items-center gap-2" onClick={onEdit}>
      <FaEdit /> Edit Profile
    </button>
  </div>
);

export default ProfileHeader;
