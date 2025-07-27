// src/AdminProfile.tsx

import { useEffect, useState } from "react";
import { FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { RootState } from "../../app/types";
import { SaveIcon } from 'lucide-react';
import { userApi } from '../../features/api/userApi';
import { toast } from 'sonner';
import axios from 'axios';

// Interface for general profile edits
interface ProfileFormValues {
    firstName: string;
    lastName: string;
    email: string;
}

// Interface for password change form
interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export const DoctorProfile = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, userType } = useSelector((state: RootState) => state.auth);

    console.log("AdminProfile Debug: isAuthenticated =", isAuthenticated);
    console.log("AdminProfile Debug: userType =", userType);
    console.log("AdminProfile Debug: Redux user object (state.auth.user) =", user);

    const userId = user?.userId;

    console.log("AdminProfile Debug: userId derived from Redux =", userId, "typeof userId =", typeof userId);


    const { data: userDetails, isLoading, isError, error, isSuccess } = userApi.useGetUserByIdQuery(userId as number, {
        skip: !userId,
    });

    console.log("AdminProfile Debug: RTK Query isLoading =", isLoading);
    console.log("AdminProfile Debug: RTK Query isError =", isError);
    console.log("AdminProfile Debug: RTK Query isSuccess =", isSuccess);
    console.log("AdminProfile Debug: RTK Query userDetails data =", userDetails);
    console.log("AdminProfile Debug: RTK Query error object =", error);

    // RTK Query Mutations
    const [updateUserProfile] = userApi.useUpdateUserProfileMutation();
    const [updateUserProfileImage] = userApi.useUpdateUserProfileImageMutation();
    const [changePassword] = userApi.useChangePasswordMutation();

    // Component State
    const [imageProfile, setImageProfile] = useState<string | undefined>();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    // Display Profile Picture Logic
    const displayProfilePicture = userDetails?.profile_picture || user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDetails?.firstName || user?.firstName || '')}&background=4ade80&color=fff&size=128`;

    // Modal Toggles
    const handleProfileModalToggle = () => {
        setIsProfileModalOpen(!isProfileModalOpen);
    };

    const handlePasswordModalToggle:any = () => {
        setIsPasswordModalOpen(!isPasswordModalOpen);
        if (!isPasswordModalOpen) {
            resetPassword();
        }
    };

    // Cloudinary Credentials
    const cloud_name = "dksycyruq";
    const preset_key = "user-images";

    // Authentication and Authorization Redirects
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (userType !== 'admin') {
            switch (userType) {
                case 'admin':
                    navigate('/admindashboard');
                    break;
                case 'patient':
                    navigate('/patientdashboard');
                    break;
                case 'user':
                    navigate('/userdashboard');
                    break;
                default:
                    navigate('/services');
                    break;
            }
        }
    }, [isAuthenticated, userType, navigate]);

    // React Hook Form for Profile Edits
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormValues>({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
    });

    // React Hook Form for Password Changes
    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
        watch: watchPassword
    } = useForm<ChangePasswordFormValues>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
    });

    // Effect to update profile form fields when userDetails becomes available
    useEffect(() => {
        if (userDetails) {
            reset({
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
            });
            // Update imageProfile state if userDetails has a new profile picture
            // This ensures the local state is in sync with the fetched data
            if (userDetails.profile_picture && userDetails.profile_picture !== imageProfile) {
                setImageProfile(userDetails.profile_picture);
            }
        }
    }, [userDetails, reset, imageProfile]);

    // Profile Update Submission Handler
    const onSubmitProfile: SubmitHandler<ProfileFormValues> = async (data) => {
        console.log("Profile form data submitted:", data);
        if (!userId) {
            toast.error("User ID not found for profile update.");
            return;
        }
        const loadingToastId = toast.loading("Updating profile...");
        try {
            const res = await updateUserProfile({ userId, ...data }).unwrap();
            toast.success(res.message, { id: loadingToastId });
            handleProfileModalToggle();
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error?.data?.message || "Failed to update profile", { id: loadingToastId });
        }
    };

    // Password Change Submission Handler
    const onSubmitChangePassword: SubmitHandler<ChangePasswordFormValues> = async (data) => {
        console.log("Change password form data submitted:", data);
        if (!userId) {
            toast.error("User ID not found for password change.");
            return;
        }

        if (data.newPassword !== data.confirmNewPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        const loadingToastId = toast.loading("Changing password...");
        try {
            const res = await changePassword({
                userId,
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }).unwrap();
            toast.success(res.message || "Password changed successfully!", { id: loadingToastId });
            resetPassword();
            handlePasswordModalToggle();
        } catch (error: any) {
            console.error("Error changing password:", error);
            toast.error(error?.data?.message || "Failed to change password. Please check your current password and try again.", { id: loadingToastId });
        }
    };

    // File Image Upload Handler (Cloudinary)
    const handleFileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset_key);

        const loadingToastId = toast.loading("Uploading profile image...");
        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData);
            const data = res.data;
            console.log("Cloudinary response:", data.secure_url);
            setImageProfile(data.secure_url); // This will trigger the useEffect below
            toast.success("Image uploaded successfully to Cloudinary!", { id: loadingToastId });
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error);
            toast.error("Failed to upload image to Cloudinary", { id: loadingToastId });
        }
    };

    // Effect to update profile picture on the backend when imageProfile state changes
    useEffect(() => {
        const updateProfileImageOnBackend = async () => {
            if (imageProfile && userId) {
                const loadingToastId = toast.loading("Saving new profile picture to backend...");
                try {
                    const res = await updateUserProfileImage({ userId: userId, profile_picture: imageProfile }).unwrap();
                    toast.success(res.message || "Profile picture updated on server!", { id: loadingToastId });
                    console.log("Profile picture update response from backend:", res);
                } catch (error: any) {
                    console.error("Error saving profile image to backend:", error);
                    toast.error(error?.data?.message || "Failed to update profile image on server.", { id: loadingToastId });
                }
            }
        };
        updateProfileImageOnBackend();
    }, [imageProfile, userId, updateUserProfileImage]); // Dependency array

    if (isLoading) {
        return (
            <div className="min-h-screen text-white py-10 px-5 flex items-center justify-center">
                <p>Loading user profile details...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen text-white py-10 px-5 flex items-center justify-center">
                <p>Error loading user profile details. Please try again later.</p>
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="min-h-screen text-white py-10 px-5 flex items-center justify-center">
                <p>User profile details not found. It might be a new user or an issue with the user ID.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white py-10 px-5">
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
                    <button
                        className="btn bg-green-600 flex items-center gap-2"
                        onClick={handleProfileModalToggle}
                    >
                        <FaEdit /> Edit Profile
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4">
                        <h3 className="text-2xl font-bold mb-3">Personal Information</h3>
                        <p className="mb-2">
                            <span className="font-bold">First Name:</span> {userDetails.firstName}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold">Last Name:</span> {userDetails.lastName}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold">Email:</span> {userDetails.email}
                        </p>
                        <p className="mb-2">
                            <span className="font-bold">Address:</span> {userDetails.address || 'N/A'}
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-lg p-4">
                        <h3 className="text-2xl font-bold mb-3">Security Settings</h3>
                        <p className="mb-2">
                            <span className="font-bold">Password:</span> *****
                        </p>
                        <button
                        className="btn bg-teal-600 hover:bg-emerald-600 text-white" 
                               onClick={handlePasswordModalToggle}
                               >
                               Change Password
                             </button>
                    </div>
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

            {/* Edit Profile Modal (controlled by isProfileModalOpen) */}
            {isProfileModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex justify-center items-center mb-4 ">
                            <h2 className="text-2xl font-bold text-green-500 ">Edit Profile</h2>
                        </div>
                        <form onSubmit={handleSubmit(onSubmitProfile)}>
                            <div className="mb-4">
                                <label htmlFor="firstName" className="block text-sm font-medium text-green-500">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    className="input w-full text-blue-500 text-sm"
                                    {...register('firstName', { required: 'First Name is required' })}
                                />
                                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="lastName" className="block text-sm font-medium text-green-500">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    className="input w-full text-blue-500 text-sm"
                                    {...register('lastName', { required: 'Last Name is required' })}
                                />
                                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-green-500">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    disabled
                                    className="input input-bordered w-full bg-gray-900 border-gray-600 text-white"
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={handleProfileModalToggle} className="btn mr-2 btn-error">
                                    <FaTimes /> Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <SaveIcon /> Save Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Change Password Modal (new modal structure) */}
            {isPasswordModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex justify-center items-center mb-4 ">
                            <h2 className="text-2xl font-bold text-green-500 ">Change Password</h2>
                        </div>
                        <form onSubmit={handleSubmitPassword(onSubmitChangePassword)}>
                            <div className="mb-4">
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-green-500">Current Password</label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    className="input w-full text-blue-500 text-sm"
                                    {...registerPassword('currentPassword', { required: 'Current Password is required' })}
                                />
                                {passwordErrors.currentPassword && <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-green-500">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="input w-full text-blue-500 text-sm"
                                    {...registerPassword('newPassword', {
                                        required: 'New Password is required',
                                        minLength: {
                                            value: 6,
                                            message: 'New password must be at least 6 characters'
                                        }
                                    })}
                                />
                                {passwordErrors.newPassword && <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-green-500">Confirm New Password</label>
                                <input
                                    type="password"
                                    id="confirmNewPassword"
                                    {...registerPassword('confirmNewPassword', {
                                        required: 'Confirm New Password is required',
                                        validate: (value) => value === watchPassword('newPassword') || 'Passwords do not match'
                                    })}
                                />
                                {passwordErrors.confirmNewPassword && <p className="text-red-500 text-sm">{passwordErrors.confirmNewPassword.message}</p>}
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={handlePasswordModalToggle} className="btn mr-2 btn-error">
                                    <FaTimes /> Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <SaveIcon /> Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfile;