// src/pages/PatientProfile.tsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import axios from "axios";

import type { RootState } from "../../app/types";
import { userApi } from "../../features/api/userApi";

import ProfileHeader from "./profile/ProfileHeader";
import ProfileDetails from "./profile/ProfileDetails";
import EditProfileModal from "./profile/EditProfileModal";
import ChangePasswordModal from "./profile/ChangePasswordModal";

const PatientProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, userType } = useSelector((state: RootState) => state.auth);
  const userId = user?.userId;

  console.log("Auth state =>", { user, isAuthenticated, userType, userId });

  const {
    data: userDetails,
    isLoading,
    isError,
    error,
  } = userApi.useGetUserByIdQuery(userId as number, {
    skip: !userId,
  });

  const [updateUserProfile] = userApi.useUpdateUserProfileMutation();
  const [updateUserProfileImage] = userApi.useUpdateUserProfileImageMutation();
  const [changePassword] = userApi.useChangePasswordMutation();

  const [imageProfile, setImageProfile] = useState<string | undefined>();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const displayProfilePicture =
    userDetails?.profile_picture ||
    user?.profile_picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userDetails?.firstName || user?.firstName || ""
    )}&background=4ade80&color=fff&size=128`;

  const cloud_name = "dksycyruq";
  const preset_key = "user-images";

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn("User not authenticated, redirecting to login...");
      navigate("/login");
    } else if (userType !== "patient") {
      console.warn(`User is not a patient (${userType}), redirecting...`);
      switch (userType) {
        case "admin":
          navigate("/admindashboard");
          break;
        case "doctor":
          navigate("/doctordashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [isAuthenticated, userType, navigate]);

  const handleFileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("Uploading file:", file.name);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset_key);
    const toastId = toast.loading("Uploading image...");
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        formData
      );
      setImageProfile(res.data.secure_url);
      console.log("Image uploaded:", res.data.secure_url);
      toast.success("Uploaded!", { id: toastId });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Image upload failed.", { id: toastId });
    }
  };

  useEffect(() => {
    const saveImageToBackend = async () => {
      if (imageProfile && userId) {
        const toastId = toast.loading("Saving image...");
        console.log("Saving image to backend:", { userId, imageProfile });
        try {
          const res = await updateUserProfileImage({
            userId,
            profile_picture: imageProfile,
          }).unwrap();
          console.log("Image saved response:", res);
          toast.success(res.message || "Image saved!", { id: toastId });
        } catch (error: any) {
          console.error("Backend image save failed:", error);
          toast.error(error?.data?.message || "Save failed.", { id: toastId });
        }
      }
    };
    saveImageToBackend();
  }, [imageProfile, userId]);

  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading profile...
      </div>
    );

  if (isError || !userDetails) {
    console.error("Error loading user profile:", error);
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Error loading profile.
      </div>
    );
  }

  console.log("Fetched user details:", userDetails);

  return (
    <div className="min-h-screen text-white py-10 px-5">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-5">
        <ProfileHeader
          userDetails={userDetails}
          displayProfilePicture={displayProfilePicture}
          handleFileImage={handleFileImage}
          onEditClick={() => setIsProfileModalOpen(true)}
        />

        <div className="w-200 h-80 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileDetails
            userDetails={userDetails}
            onChangePasswordClick={() => setIsPasswordModalOpen(true)}
          />
        </div>
      </div>

      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userDetails={userDetails}
        userId={userId}
        updateUserProfile={updateUserProfile}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userId={userId}
        changePassword={changePassword}
      />
    </div>
  );
};

export default PatientProfile;
