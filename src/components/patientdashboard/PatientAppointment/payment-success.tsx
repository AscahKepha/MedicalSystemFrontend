import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
            <div className="bg-white shadow-md rounded-xl p-6 max-w-md text-center">
                <CheckCircle size={64} className="text-green-600 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-6">
                    Thank you for your payment. Your appointment has been confirmed.
                </p>
                <Link
                    to="/patientdashboard/appointments"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                >
                    Go to Appointments
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
