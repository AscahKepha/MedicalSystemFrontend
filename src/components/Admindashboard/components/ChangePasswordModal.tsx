// components/ChangePasswordModal.tsx
import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: () => void;
};

const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose, onChangePassword }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        {/* Your password form here */}
        <button onClick={onChangePassword} className="btn bg-green-600 text-white mt-4">Save</button>
        <button onClick={onClose} className="btn bg-gray-300 text-black mt-2 ml-2">Cancel</button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;