import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white shadow-md rounded-xl p-6 max-w-md text-center">
        <XCircle size={64} className="text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Canceled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was canceled. You can try again or reschedule your appointment.
        </p>
        <Link
          to="/patientdashboard/appointments" 
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Back to Appointments
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;
