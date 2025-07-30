// src/pages/Admin/AllPaymentsPage.tsx (or a suitable path)
import React, { useState } from 'react';
import {
    useGetPaymentsQuery,
    useAddPaymentMutation,
    useUpdatePaymentMutation,
    useDeletePaymentMutation,
    type PaymentData
} from '../../features/api/PaymentsApi';
import { Modal, Button, Form, Input, Select, Table, Space, message, Popconfirm } from 'antd'; //using ant design for quality in ui and functionalities instead of native html
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

interface PaymentFormValues {
    appointmentId?: number;
    totalAmount: number;
    PaymentStatus: string;
    transactionId: string;
}

const AllPaymentsPage: React.FC = () => {
    const { data: payments, error, isLoading, refetch } = useGetPaymentsQuery();
    const [addPayment] = useAddPaymentMutation();
    const [updatePayment] = useUpdatePaymentMutation();
    const [deletePayment] = useDeletePaymentMutation();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPayment, setEditingPayment] = useState<PaymentData | null>(null);
    const [form] = Form.useForm<PaymentFormValues>();

    const showModal = (payment?: PaymentData) => {
        if (payment) {
            setEditingPayment(payment);
            form.setFieldsValue({
                ...payment,
                totalAmount: payment.amount, // Convert numeric to string for form
            });
        } else {
            setEditingPayment(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingPayment(null);
        form.resetFields();
    };

    const handleFormSubmit = async (values: PaymentFormValues) => {
        try {
            const paymentPayload: Partial<PaymentData> = {
                appointmentId: values.appointmentId,
                amount: values.totalAmount, // Drizzle expects string for numeric
                status: values.PaymentStatus as 'pending' | 'completed' | 'failed' | 'refunded',
                transactionId: values.transactionId,
            };

            if (editingPayment) {
                await updatePayment({ paymentId: editingPayment.paymentId, ...paymentPayload }).unwrap();
                message.success('Payment updated successfully! 🎉');
            } else {
                await addPayment(paymentPayload as Omit<PaymentData, 'paymentId' | 'createdAt' | 'updatedAt' | 'paymentDate'>).unwrap();
                message.success('Payment added successfully! ➕');
            }
            setIsModalVisible(false);
            form.resetFields();
            refetch(); // Re-fetch data to update the table
        } catch (err) {
            message.error('Failed to save payment. Please try again. 😞');
            console.error('Failed to save payment:', err);
        }
    };

    const handleDelete = async (paymentId: number) => {
        try {
            await deletePayment(paymentId).unwrap();
            message.success('Payment deleted successfully! 🗑️');
            refetch(); // Re-fetch data to update the table
        } catch (err) {
            message.error('Failed to delete payment. 😞');
            console.error('Failed to delete payment:', err);
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
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text: string) => `$${parseFloat(text).toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'PaymentStatus',
            key: 'PaymentStatus',
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
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: PaymentData) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                        aria-label={`Edit payment ${record.paymentId}`}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this payment?"
                        onConfirm={() => handleDelete(record.paymentId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            aria-label={`Delete payment ${record.paymentId}`}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (isLoading) return <div>Loading payments... ⏳</div>;
    if (error) {
        if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
            return <div>Error loading payments: {errMsg} ❗</div>;
        } else {
            // you can access "message" property here
            return <div>Error loading payments: {error.message} ❗</div>;
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>All Payments Management 💰</h2>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: '20px' }}
            >
                Add New Payment
            </Button>
            <Table
                columns={columns}
                dataSource={payments}
                rowKey="paymentId"
                loading={isLoading}
                scroll={{ x: 'max-content' }}
            />

            <Modal //modal is used to handle pop up windows
                title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    initialValues={editingPayment ? {
                        ...editingPayment,
                        totalAmount: editingPayment.amount?.toString(),
                    } : {
                        PaymentStatus: 'pending' // Default for new payment
                    }}
                >
                    <Form.Item
                        name="appointmentId"
                        label="Appointment ID"
                        rules={[{ type: 'number', message: 'Please enter a valid number for Appointment ID' }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item
                        name="totalAmount"
                        label="Total Amount"
                        rules={[
                            { required: true, message: 'Please enter the total amount!' },
                            { pattern: /^\d+(\.\d{1,2})?$/, message: 'Please enter a valid amount (e.g., 123.45)' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="PaymentStatus"
                        label="Payment Status"
                        rules={[{ required: true, message: 'Please select payment status!' }]}
                    >
                        <Select placeholder="Select a status">
                            <Option value="pending">Pending</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="failed">Failed</Option>
                            <Option value="refunded">Refunded</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="transactionId"
                        label="Transaction ID"
                        rules={[{ required: true, message: 'Please enter the transaction ID!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingPayment ? 'Update Payment' : 'Add Payment'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AllPaymentsPage;