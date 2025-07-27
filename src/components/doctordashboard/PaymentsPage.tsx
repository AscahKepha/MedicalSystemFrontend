// src/pages/Doctor/DoctorsPaymentPage.tsx
import React from 'react';
import {
    useGetPaymentsByDoctorIdQuery,
    type PaymentData,
} from '../../features/api/PaymentsApi'; // Adjust the import path as needed
import { Table, message } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types'; // Import RootState to access auth token

const DoctorsPayment: React.FC = () => {
    // Assume the doctor's ID is available in your Redux store,
    // from an authentication slice. Replace `doctorIdFromAuth`
    // with the actual selector for your doctor's ID.
    const doctorId = useSelector((state: RootState) => state.auth.user?.id); // Example: assuming userId is stored in auth.user.id

    const { data: payments, error, isLoading } = useGetPaymentsByDoctorIdQuery(doctorId!, {
        skip: !doctorId, // Skip the query if doctorId is not available
    });

    const columns = [
        {
            title: 'Payment ID',
            dataIndex: 'paymentId',
            key: 'paymentId',
        },
        {
            title: 'Patient/User ID', 
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: 'Appointment ID',
            dataIndex: 'appointmentId',
            key: 'appointmentId',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text: number) => `$${text.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Transaction ID',
            dataIndex: 'transactionId',
            key: 'transactionId',
        },
        {
            title: 'Payment Date',
            dataIndex: 'paymentDate',
            key: 'paymentDate',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Created At', // Useful for doctors to track when records were made
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString(),
        },
    ];

    if (!doctorId) {
        return <div>Please log in as a doctor to view your payments.</div>;
    }

    if (isLoading) return <div>Loading your payments... ⏳</div>;
    if (error) {
        if ('status' in error) {
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
            return <div>Error loading your payments: {errMsg} ❗</div>;
        } else {
            return <div>Error loading your payments: {error.message} ❗</div>;
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Payments (Doctor View) 💰</h2>
            <p>Here you can see all payments associated with your services.</p>
            <Table
                columns={columns}
                dataSource={payments}
                rowKey="paymentId"
                loading={isLoading}
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: "No payments found for your account." }}
            />
        </div>
    );
};

export default DoctorsPayment;