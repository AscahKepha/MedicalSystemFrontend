// components/patientprofile/ChangePasswordModal.tsx
import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { SaveIcon } from 'lucide-react';

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  changePassword: (payload: { userId: number; currentPassword: string; newPassword: string }) => any;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  changePassword,
}) => {
  const {
    register,
    handleSubmit,
    watch,
  } = useForm<ChangePasswordFormValues>();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await changePassword({
        userId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to change password:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-box bg-white text-black rounded p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="password"
            placeholder="Current Password"
            {...register('currentPassword', { required: true })}
            className="input w-full mb-2"
          />
          <input
            type="password"
            placeholder="New Password"
            {...register('newPassword', { required: true, minLength: 6 })}
            className="input w-full mb-2"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmNewPassword', {
              required: true,
              validate: val => val === watch('newPassword') || "Passwords don't match",
            })}
            className="input w-full mb-4"
          />
          <div className="flex justify-end">
            <button type="button" className="btn btn-error mr-2" onClick={onClose}>
              <FaTimes /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <SaveIcon /> Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
