import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAddAppointmentMutation } from '../../features/api/AppointmentsApi';
import type { AppointmentStatus } from '../../types/appointmentTypes';
import { toast } from 'react-hot-toast'; // or your toast library

interface Slot {
  slotFee: string;
  day: string;
  start: string;
  end: string;
}

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  doctor: {
    doctorId: number;
    userId: number;
    firstName: string;
    lastName: string;
    availability: Slot[];
  };
  patientId: number;
}

const generateSlots = (start: string, end: string, duration: number) => {
  const slots: string[] = [];
  const [startHour, startMin] = start.split(':').map(Number);
  const [endHour, endMin] = end.split(':').map(Number);

  let current = new Date();
  current.setHours(startHour, startMin, 0, 0);

  const endTime = new Date();
  endTime.setHours(endHour, endMin, 0, 0);

  while (current < endTime) {
    const next = new Date(current.getTime() + duration * 60000);
    if (next > endTime) break;

    const time = current.toTimeString().substring(0, 5);
    slots.push(time);
    current = next;
  }

  return slots;
};

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  doctor,
  patientId,
}) => {
  const [appointmentDate, setAppointmentDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [addAppointment, { isLoading }] = useAddAppointmentMutation();

  const availableDays = useMemo(() => doctor.availability.map((slot) => slot.day), [doctor]);

  const selectedDay = useMemo(() => {
    return appointmentDate ? getDayName(appointmentDate) : null;
  }, [appointmentDate]);

  const selectedSlot = useMemo(() => {
    return doctor.availability.find((slot) => slot.day === selectedDay) || null;
  }, [selectedDay, doctor.availability]);

  const availableTimes = useMemo(() => {
    if (!selectedSlot) return [];
    return generateSlots(selectedSlot.start, selectedSlot.end, 30);
  }, [selectedSlot]);

  const slotFee = selectedSlot?.slotFee ?? '0';

  const isDateAllowed = (dateStr: string) => {
    const day = getDayName(dateStr);
    return availableDays.includes(day);
  };

  const handleBook = async () => {
    if (!appointmentDate || !selectedTime || !selectedDay || !selectedSlot || !reason) {
      toast.error('Please fill all fields');
      return;
    }

    const payload = {
      userId: patientId,
      patientId,
      doctorId: doctor.doctorId,
      appointmentDate,
      reason,
      totalAmount: parseFloat(slotFee),
      timeSlot: selectedTime,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
      appointmentTime: selectedTime,
      appointmentStatus: 'pending' as AppointmentStatus,
    };

    try {
      await addAppointment(payload).unwrap();
      toast.success('Appointment booked successfully');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Failed to book appointment. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            Book Appointment with Dr. {doctor.firstName} {doctor.lastName}
          </DialogTitle>
        </DialogHeader>

        {/* Doctor Available Days */}
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">Doctor is available on:</p>
          <div className="flex flex-wrap gap-2">
            {availableDays.map((day, i) => (
              <span
                key={i}
                className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium"
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        {/* Appointment Date */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Select Appointment Date
          </label>
          <Input
            type="date"
            value={appointmentDate}
            onChange={(e) => {
              const date = e.target.value;
              if (isDateAllowed(date)) {
                setAppointmentDate(date);
                setSelectedTime(null);
              } else {
                toast.error('Doctor is not available on that day');
              }
            }}
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>

        {/* Charge Message */}
        {selectedSlot && (
          <p className="text-sm text-blue-600 font-medium">
            You will be charged <strong>Ksh {slotFee}</strong>
          </p>
        )}

        {/* Time Slots */}
        {selectedSlot && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Select Time Slot</label>
            <div className="flex flex-wrap gap-2">
              {availableTimes.map((time, i) => (
                <Button
                  key={i}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Reason for Visit</label>
          <Input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Checkup, Consultation"
          />
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleBook}
          disabled={
            isLoading ||
            !appointmentDate ||
            !selectedTime ||
            !selectedDay ||
            !selectedSlot ||
            !reason
          }
        >
          {isLoading ? 'Booking...' : 'Confirm Appointment'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BookAppointmentModal;
