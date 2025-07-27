// src/pages/AdminProfile.tsx
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { FaCamera, FaEdit } from 'react-icons/fa';
import { userApi } from '../../features/api/userApi';
import { type RootState } from '../../app/types';
import EditProfileModal from './adminprofile/EditProfileModal';
import ChangePasswordModal from './adminprofile/ChangePasswordModal';
import ProfileDetails from './adminprofile/ProfileDetails';
import { toast } from 'sonner';
import axios from 'axios';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;
  const { data: userDetails, isLoading, isError } = userApi.useGetUserByIdQuery(userId as number, { skip: !userId });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [imageProfile, setImageProfile] = useState<string | undefined>(undefined);
  
  const displayProfilePicture = imageProfile || userDetails?.profile_picture || user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails?.firstName || user?.firstName || '')}&background=4ade80&color=fff&size=128`;

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (userType && userType !== 'admin') {
      const routeMap: Record<string, string> = {
        doctor: '/doctordashboard',
        patient: '/patientdashboard',
        user: '/userdashboard',
      };
      navigate(routeMap[userType] || '/services');
    }
  }, [isAuthenticated, userType, navigate]);

  const handleFileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "user-images");

    const toastId = toast.loading("Uploading image...");
    try {
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dksycyruq/image/upload`, formData);
      const url = res.data.secure_url;
      setImageProfile(url);
      toast.success("Image uploaded!", { id: toastId });
    } catch (error) {
      toast.error("Upload failed", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen text-white py-10 px-5">
      {isLoading && <p className="text-center">Loading profile...</p>}
      {isError && <p className="text-center text-red-500">Error loading profile.</p>}
      {userDetails && (
        <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-5">
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
                <h2 className="text-3xl font-bold">{userDetails.firstName} {userDetails.lastName}</h2>
                <p className="text-gray-400">{userDetails.email}</p>
              </div>
            </div>
            <button className="btn bg-green-600 flex items-center gap-2" onClick={() => setIsProfileModalOpen(true)}>
              <FaEdit /> Edit Profile
            </button>
          </div>

          <ProfileDetails userDetails={userDetails} onPasswordClick={() => setIsPasswordModalOpen(true)} />
        </div>
      )}

      {isProfileModalOpen && (
        <EditProfileModal
          userId={userId}
          userDetails={userDetails}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {isPasswordModalOpen && (
        <ChangePasswordModal
          userId={userId}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
};
export default AdminProfile;

