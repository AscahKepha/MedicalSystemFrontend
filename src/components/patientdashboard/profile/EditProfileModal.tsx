// components/patientprofile/EditProfileModal.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { SaveIcon } from 'lucide-react';
import type { UserProfile } from '../../../features/auth/authSlice'; // Adjust path if needed

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: UserProfile;
  userId: number;
  updateUserProfile: (payload: Partial<UserProfile> & { userId: number }) => any;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  userDetails,
  userId,
  updateUserProfile,
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
    }
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      await updateUserProfile({ ...data, userId }).unwrap();
      onClose();
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-box bg-white text-black rounded p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="First Name"
            {...register('firstName', { required: true })}
            className="input w-full mb-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            {...register('lastName', { required: true })}
            className="input w-full mb-2"
          />
          <input
            type="email"
            disabled
            {...register('email')}
            className="input w-full bg-gray-200 mb-4"
          />
          <div className="flex justify-end">
            <button type="button" className="btn btn-error mr-2" onClick={onClose}><FaTimes /> Cancel</button>
            <button type="submit" className="btn btn-primary"><SaveIcon /> Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
