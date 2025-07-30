// src/pages/Doctor/DoctorsPaymentPage.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  useGetPaymentsByDoctorIdQuery,
  type PaymentData,
} from '../../features/api/PaymentsApi';
import { useGetDoctorByUserIdQuery } from '../../features/api/DoctorsApi';
import type { RootState } from '../../app/types';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const DoctorsPayment: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.userId;
  console.log('👤 userId:', userId);

  // Get doctor by userId
  const {
    data: doctor,
    isLoading: doctorLoading,
    error: doctorError,
  } = useGetDoctorByUserIdQuery(userId!, {
    skip: !userId,
  });
  console.log('🩺 doctor:', doctor);
  console.log('❌ doctorError:', doctorError);

  const doctorId = doctor?.doctorId;
  console.log('🆔 doctorId:', doctorId);

  // Get payments by doctorId
  const {
    data: payments,
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetPaymentsByDoctorIdQuery(doctorId!, {
    skip: !doctorId,
  });
  console.log('💵 payments:', payments);
  console.log('❌ paymentsError:', paymentsError);

  // Auth check
  if (!userId) {
    return <div>Please log in as a doctor to view your payments.</div>;
  }

  // Loading state
  if (doctorLoading || paymentsLoading) {
    return <div>Loading your payments... ⏳</div>;
  }

  // Error state
  if (doctorError || paymentsError) {
    const err = doctorError ?? paymentsError;

    let errMsg = 'An unknown error occurred.';

    if (err) {
      if ('status' in err) {
        errMsg =
          'error' in err
            ? String(err.error ?? 'Unknown error')
            : JSON.stringify((err as FetchBaseQueryError).data ?? 'No data');
      } else if ('message' in err) {
        errMsg = err.message ?? 'An error occurred';
      }
    }

    return <div>Error loading payments: {errMsg} ❗</div>;
  }

  // Table columns
  const columns: ColumnsType<PaymentData> = [
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
      render: (amount: string) => `$${parseFloat(amount).toFixed(2)}`,
    },
    {
      title: 'Payment Status',
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
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>💰 My Payments (Doctor View)</h2>
      <p>Below are payments associated with your appointments.</p>
      <Table
        columns={columns}
        dataSource={(payments ?? []).map((item) => ({
          ...item.payments,
        }))}
        rowKey="paymentId"
        loading={paymentsLoading}
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'No payments found for your account.' }}
      />
    </div>
  );
};

export default DoctorsPayment;
