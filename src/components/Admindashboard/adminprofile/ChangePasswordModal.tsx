// src/components/profile/ChangePasswordModal.tsx
import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { userApi } from "../../../features/api/userApi";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

type Props = {
  userId: number;
  onClose: () => void;
};

const ChangePasswordModal: React.FC<Props> = ({ userId, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>();

  const [changePassword] = userApi.useChangePasswordMutation();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    if (data.newPassword !== data.confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const toastId = toast.loading("Changing password...");
    try {
      const res = await changePassword({ userId, currentPassword: data.currentPassword, newPassword: data.newPassword }).unwrap();
      toast.success(res.message, { id: toastId });
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to change password", { id: toastId });
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-2xl text-green-500 font-bold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="text-sm text-green-500">Current Password</label>
            <input type="password" {...register('currentPassword', { required: 'Required' })} className="input w-full text-blue-500" />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="text-sm text-green-500">New Password</label>
            <input type="password" {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} className="input w-full text-blue-500" />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="text-sm text-green-500">Confirm New Password</label>
            <input type="password" {...register('confirmNewPassword', {
              required: 'Required',
              validate: (val) => val === watch('newPassword') || 'Passwords do not match'
            })} className="input w-full text-blue-500" />
            {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="btn btn-error mr-2"><FaTimes /> Cancel</button>
            <button type="submit" className="btn btn-primary"><SaveIcon /> Change</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
