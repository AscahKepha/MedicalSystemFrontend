import React, { useState } from 'react';
import { useAddAppointmentMutation } from '../../features/api/AppointmentsApi';

interface Props {
  doctorId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const DoctorCreateAppointmentModal: React.FC<Props> = ({
  doctorId,
  onClose,
  onSuccess,
}) => {
  const [addAppointment, { isLoading }] = useAddAppointmentMutation();
  const [form, setForm] = useState({
    patientId: '',
    appointmentDate: '',
    startTime: '',
    endTime: '',
    timeSlot: '',
    totalAmount: '',
    reason: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAppointment({
        ...form,
        doctorId,
        patientId: parseInt(form.patientId, 10),
        userId: 0,
        appointmentTime: ''
      }).unwrap();

      setForm({
        patientId: '',
        appointmentDate: '',
        startTime: '',
        endTime: '',
        timeSlot: '',
        totalAmount: '',
        reason: '',
      });

      onSuccess();
      onClose();
    } catch (err) {
      alert('❌ Failed to create appointment.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">📅 New Appointment</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Patient ID</label>
            <input
              name="patientId"
              type="number"
              value={form.patientId}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              name="appointmentDate"
              type="date"
              value={form.appointmentDate}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Time Slot</label>
            <input
              name="timeSlot"
              type="time"
              step="1"
              value={form.timeSlot}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Start Time</label>
              <input
                name="startTime"
                type="time"
                step="1"
                value={form.startTime}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">End Time</label>
              <input
                name="endTime"
                type="time"
                step="1"
                value={form.endTime}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Total Amount</label>
            <input
              name="totalAmount"
              type="number"
              step="0.01"
              value={form.totalAmount}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Reason</label>
            <textarea
              name="reason"
              rows={3}
              value={form.reason}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorCreateAppointmentModal;
