import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { userApi } from "../../../features/api/userApi";

type Props = {
  userId: number;
  userDetails: any;
  onClose: () => void;
};

interface AvailabilityItem {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotFee?: number;
}

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
  contactPhone?: string;
  isAvailable?: boolean | string;
  availability?: AvailabilityItem[];
}

const EditProfileModal: React.FC<Props> = ({ userId, userDetails, onClose }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      specialization: userDetails.specialization,
      contactPhone: userDetails.contactPhone,
      isAvailable: userDetails.isAvailable,
      availability:
        userDetails.availability?.map((slot: any) => ({
          dayOfWeek: slot.dayOfWeek || slot.day || "",
          startTime: slot.startTime || slot.start || "",
          endTime: slot.endTime || slot.end || "",
          slotFee: slot.slotFee || 0,
        })) || [
          { dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00", slotFee: 0 },
        ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  const [updateUserProfile] = userApi.useUpdateUserProfileMutation();

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    const payload = {
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: userDetails.role || "doctor",
      specialization: data.specialization,
      contactPhone: data.contactPhone,
      isAvailable:
        typeof data.isAvailable === "string"
          ? data.isAvailable === "true"
          : data.isAvailable ?? true,
      availability: data.availability?.map((slot) => ({
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotFee: slot.slotFee ?? 0,
      })),
    };

    const toastId = toast.loading("Updating profile...");
    try {
      const res = await updateUserProfile(payload).unwrap();
      toast.success(res.message, { id: toastId });
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.error || "Update failed", { id: toastId });
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl text-green-500 font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First Name */}
          <div className="mb-4">
            <label className="text-sm text-green-500">First Name</label>
            <input {...register("firstName", { required: "Required" })} className="input w-full text-black bg-white" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Last Name</label>
            <input {...register("lastName", { required: "Required" })} className="input w-full text-black bg-white" />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>

          {/* Email (read-only) */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Email</label>
            <input type="email" disabled {...register("email")} className="input w-full bg-gray-900 text-white" />
          </div>

          {/* Specialization */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Specialization</label>
            <input {...register("specialization")} className="input w-full text-black bg-white" />
          </div>

          {/* Contact Phone */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Phone</label>
            <input {...register("contactPhone")} className="input w-full text-black bg-white" />
          </div>

          {/* Availability Toggle */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Currently Available?</label>
            <select {...register("isAvailable")} className="select w-full text-black bg-white">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          {/* Availability Schedule */}
          <div className="mb-6">
            <label className="text-sm text-green-500 mb-2 block">Availability Schedule</label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-center mb-2">
                <input
                  {...register(`availability.${index}.dayOfWeek` as const, { required: "Required" })}
                  placeholder="Day (e.g., Monday)"
                  className="input input-sm w-[25%] bg-white text-black border border-gray-300"
                />
                <input
                  type="time"
                  {...register(`availability.${index}.startTime` as const, { required: "Required" })}
                  className="input input-sm w-[20%] bg-white text-black border border-gray-300"
                />
                <input
                  type="time"
                  {...register(`availability.${index}.endTime` as const, { required: "Required" })}
                  className="input input-sm w-[20%] bg-white text-black border border-gray-300"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Fee"
                  {...register(`availability.${index}.slotFee` as const)}
                  className="input input-sm w-[20%] bg-white text-black border border-gray-300"
                />
                <button type="button" onClick={() => remove(index)} className="btn btn-xs btn-error">
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ dayOfWeek: "", startTime: "", endTime: "", slotFee: 0 })}
              className="btn btn-sm btn-outline mt-2"
            >
              Add Time Slot
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button type="button" className="btn btn-error mr-2" onClick={onClose}>
              <FaTimes className="mr-1" /> Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <SaveIcon className="mr-1" /> Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
