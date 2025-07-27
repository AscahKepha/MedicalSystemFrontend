// src/components/profile/EditProfileModal.tsx
import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { userApi } from "../../../features/api/userApi";

type Props = {
  userId: number;
  userDetails: any;
  onClose: () => void;
};

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const EditProfileModal: React.FC<Props> = ({ userId, userDetails, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
    },
  });

  const [updateUserProfile] = userApi.useUpdateUserProfileMutation();

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    const toastId = toast.loading("Updating profile...");
    try {
      const res = await updateUserProfile({ userId, ...data }).unwrap();
      toast.success(res.message, { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed", { id: toastId });
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="text-2xl text-green-500 font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="firstName" className="text-sm text-green-500">First Name</label>
            <input id="firstName" {...register('firstName', { required: 'Required' })} className="input w-full text-blue-500" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="text-sm text-green-500">Last Name</label>
            <input id="lastName" {...register('lastName', { required: 'Required' })} className="input w-full text-blue-500" />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="text-sm text-green-500">Email</label>
            <input id="email" type="email" disabled {...register('email')} className="input w-full bg-gray-900 text-white" />
          </div>
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
