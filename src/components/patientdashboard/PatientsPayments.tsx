// src/pages/Patient/PatientsPaymentPage.tsx
import React, { useState } from 'react';
import {
    useGetPaymentsByPatientIdQuery,
    useAddPaymentMutation,
    type PaymentData
} from '../../features/api/PaymentsApi';
// import type { PaymentStatus } from '../../features/api/PaymentsApi';
import { Modal, Button, Form, Input, Select, Table, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types'; // Import RootState to access auth token

const { Option } = Select;

// Define the form values for adding a new payment
interface AddPaymentFormValues {
    appointmentId?: number;
    amount: number;
    paymentMethod: string;
    transactionId?: string;
}

export const PatientsPayment: React.FC = () => {
    const patientId = useSelector((state: RootState) => state.auth.user?.id); // Example: assuming userId is stored in auth.user.id

    const { data: payments, error, isLoading, refetch } = useGetPaymentsByPatientIdQuery(patientId!, {
        skip: !patientId, // Skip the query if patientId is not available
    });
    const [addPayment] = useAddPaymentMutation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm<AddPaymentFormValues>();

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleFormSubmit = async (values: AddPaymentFormValues) => {
        if (!patientId) {
            message.error('Patient ID not found. Please log in again.');
            return;
        }

        try {
            const newPaymentPayload: Omit<PaymentData, 'paymentId' | 'paymentDate' | 'status' | 'createdAt' | 'updatedAt'> = {
                userId: patientId, // Assign the logged-in patient's ID
                appointmentId: values.appointmentId,
                payments: values.appointmentId ? values.appointmentId : null, // Optional field
                amount: values.amount,
                paymentMethod: values.paymentMethod,
                transactionId: values.transactionId,
                // status defaults to 'pending' as per your addPayment mutation
            };

            await addPayment(newPaymentPayload).unwrap();
            message.success('Payment initiated successfully! Please complete the transaction. 🎉');
            setIsModalVisible(false);
            form.resetFields();
            refetch(); // Re-fetch data to update the table
        } catch (err) {
            message.error('Failed to initiate payment. Please try again. 😞');
            console.error('Failed to initiate payment:', err);
        }
    };

    const columns = [
        {
            title: 'Payment ID',
            dataIndex: 'paymentId',
            key: 'paymentId',
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
    ];

    if (!patientId) {
        return <div>Please log in to view your payments.</div>;
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
            <h2>My Payments 💰</h2>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
                style={{ marginBottom: '20px' }}
            >
                Make a New Payment
            </Button>
            <Table
                columns={columns}
                dataSource={payments}
                rowKey="paymentId"
                loading={isLoading}
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: "No payments found for your account." }}
            />

            <Modal
                title="Make a New Payment"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="appointmentId"
                        label="Appointment ID (Optional)"
                        rules={[{ type: 'number', message: 'Please enter a valid number for Appointment ID' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="amount"
                        label="Amount"
                        rules={[
                            { required: true, message: 'Please enter the amount!' },
                            { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount (e.g., 123.45)' }
                        ]}
                    >
                        <Input type="number" step="0.01" />
                    </Form.Item>
                    <Form.Item
                        name="paymentMethod"
                        label="Payment Method"
                        rules={[{ required: true, message: 'Please select a payment method!' }]}
                    >
                        <Select placeholder="Select payment method">
                            <Option value="Credit Card">Credit Card</Option>
                            <Option value="M-Pesa">M-Pesa</Option>
                            <Option value="Bank Transfer">Bank Transfer</Option>
                            <Option value="PayPal">PayPal</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="transactionId"
                        label="Transaction ID (Optional)"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Confirm Payment
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PatientsPayment;