import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAddAppointmentMutation } from '../../features/api/AppointmentsApi';
import type { AppointmentStatus } from '../../types/appointmentTypes';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: {
    doctorId: number;
    userId: number;
    // firstName?: string;
    firstName: string;
    lastName: string;
    availability: { day: string; start: string; end: string }[];
  };
  patientId: number;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  doctor,
  patientId,
}) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [reason, setReason] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [addAppointment, { isLoading }] = useAddAppointmentMutation();

  const handleBook = async () => {
    const selectedSlot = doctor.availability.find(a => a.day === selectedDay);
    if (!selectedSlot) {
      console.warn('No slot found for selected day');
      return;
    }

    const parsedTotalAmount = parseFloat(totalAmount);
    if (isNaN(parsedTotalAmount)) {
      alert('Total Amount must be a valid number');
      return;
    }

    const payload = {
      patientId,
      doctorId: doctor.doctorId,
      appointmentDate,
      reason,
      totalAmount: parsedTotalAmount,
      timeSlot: selectedTime,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
      userId: patientId,
      appointmentTime: selectedTime,
      appointmentStatus: 'pending' as AppointmentStatus,
    };

    try {
      const response = await addAppointment(payload).unwrap();
      console.log('✅ Appointment created:', response);
      onClose();
    } catch (err) {
      console.error('❌ Failed to create appointment:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Book Appointment with Dr. {doctor.firstName} {doctor.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
            <Input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available Days</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            >
              <option value="">Select a day</option>
              {doctor.availability.map((slot, index) => (
                <option key={index} value={slot.day}>
                  {slot.day} ({slot.start} - {slot.end})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Time Slot</label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              min={doctor.availability.find(a => a.day === selectedDay)?.start}
              max={doctor.availability.find(a => a.day === selectedDay)?.end}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <Input
              type="text"
              placeholder="e.g. Consultation, Checkup"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Amount</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="Total Amount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>

          <Button
            onClick={handleBook}
            disabled={
              isLoading ||
              !appointmentDate ||
              !selectedDay ||
              !selectedTime ||
              !totalAmount
            }
          >
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentModal;
