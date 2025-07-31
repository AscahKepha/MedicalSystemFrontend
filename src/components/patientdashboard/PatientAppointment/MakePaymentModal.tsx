import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCreateCheckoutSessionMutation } from '../../../features/api/PaymentsApi';
import { toast } from 'react-hot-toast';

interface MakePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: number;
    amount: number;
}

const MakePaymentModal: React.FC<MakePaymentModalProps> = ({
    isOpen,
    onClose,
    appointmentId,
    amount,
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cash'>('stripe');
    const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();

    const handleConfirm = async () => {
        try {
            const res = await createCheckoutSession({
                appointmentId,
                paymentMethod,
            }).unwrap();

            if (paymentMethod === 'stripe') {
                if (res?.url) {
                    toast.success('Redirecting to Stripe...');
                    window.location.href = res.url;
                } else {
                    toast.error('Stripe session creation failed.');
                }
            } else if (paymentMethod === 'cash') {
                toast.success('Cash payment selected. Pay at appointment.');
                onClose(); // Close modal after successful cash flow
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error(error?.data?.error || 'Payment failed. Try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
            >
                <h2 className="text-xl font-semibold mb-2">Make Payment</h2>
                <p className="mb-4 text-sm text-gray-700">
                    You're about to pay <span className="font-bold">Ksh {amount}</span> for Appointment #{appointmentId}.
                </p>

                <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Select Payment Method:</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'cash')}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="stripe">Pay with Card (Stripe)</option>
                        <option value="cash">Pay with Cash</option>
                    </select>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                        {isLoading
                            ? paymentMethod === 'cash'
                                ? 'Processing...'
                                : 'Redirecting...'
                            : paymentMethod === 'cash'
                                ? 'Confirm Cash'
                                : 'Pay with Stripe'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default MakePaymentModal;
