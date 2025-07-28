import { FaTimes } from "react-icons/fa";
import { SaveIcon } from "lucide-react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { userApi } from "../../../features/api/userApi";

type Props = {
  userId: number;
  userDetails: any;
  onClose: () => void;
};

interface AvailabilityItem {
  day: string;
  start: string;
  end: string;
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
  console.log("🧠 userDetails from props:", userDetails);

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
      availability: userDetails.availability || [
        { day: "Monday", start: "09:00", end: "17:00" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availability",
  });

  const [updateUserProfile] = userApi.useUpdateUserProfileMutation();

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    console.log("📦 Submitted form data:", data);

    const fullPayload = {
      userId,
      firstName: data.firstName || userDetails.firstName,
      lastName: data.lastName || userDetails.lastName,
      email: userDetails.email,
      role: userDetails.role || "doctor",
      password: userDetails.password || "",
      specialization: data.specialization || userDetails.specialization || "",
      contactPhone: data.contactPhone || userDetails.contactPhone || "",
      isAvailable:
        typeof data.isAvailable === "string"
          ? data.isAvailable === "true"
          : data.isAvailable ?? userDetails.isAvailable ?? true,
      availability: data.availability || [],
    };

    console.log("📤 Full payload sent to API:", fullPayload);

    const toastId = toast.loading("Updating profile...");
    try {
      const res = await updateUserProfile(fullPayload).unwrap();
      console.log("✅ Update response:", res);
      toast.success(res.message, { id: toastId });
      onClose();
    } catch (error: any) {
      console.error("❌ Update failed:", error);
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
            <input {...register("firstName", { required: "Required" })} className="input w-full text-blue-500" />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Last Name</label>
            <input {...register("lastName", { required: "Required" })} className="input w-full text-blue-500" />
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
            <input {...register("specialization")} className="input w-full text-blue-500" />
          </div>

          {/* Contact Phone */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Phone</label>
            <input {...register("contactPhone")} className="input w-full text-blue-500" />
          </div>

          {/* Availability Toggle */}
          <div className="mb-4">
            <label className="text-sm text-green-500">Currently Available?</label>
            <select {...register("isAvailable")} className="select w-full text-blue-500">
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
                  {...register(`availability.${index}.day` as const, { required: "Required" })}
                  placeholder="Day (e.g., Monday)"
                  className="input input-sm w-[30%]"
                />
                <input
                  type="time"
                  {...register(`availability.${index}.start` as const, { required: "Required" })}
                  className="input input-sm w-[30%]"
                />
                <input
                  type="time"
                  {...register(`availability.${index}.end` as const, { required: "Required" })}
                  className="input input-sm w-[30%]"
                />
                <button type="button" onClick={() => remove(index)} className="btn btn-xs btn-error">
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => append({ day: "", start: "", end: "" })}
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
