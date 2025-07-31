
import { FaUsers, FaDollarSign, FaUserMd, FaHospitalUser, FaCalendarCheck, FaPrescriptionBottleAlt, FaExclamationTriangle } from 'react-icons/fa';
import {motion} from 'framer-motion';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { DoctorsApi } from '../../features/api/DoctorsApi';
import type { DoctorData } from '../../types/appointmentTypes'
import { patientsApi } from '../../features/api/PatientsApi';
import { userApi, type userData } from '../../features/api/userApi';
import type { AppointmentData } from '../../types/appointmentTypes';
import { complaintsApi, type ComplaintData } from '../../features/api/ComplaintsApi';
import { PrescriptionsApi, type PrescriptionData } from '../../features/api/PrescriptionsApi';
import { PaymentsApi, type PaymentData } from '../../features/api/PaymentsApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/types';
import {PuffLoader} from 'react-spinners';
import { AppointmentsApi } from '../../features/api/AppointmentsApi';

const cardVariants = {
    hover: {
        scale: 1.05,
        transition: {type: "spring" as const, stiffness: 300},
    },
    tap: {scale: 0.95},
    loading:{
        opacity: 0.5,
        transition: {duration:0.5},
    },
};

const COLORS = ['#00C49F', '#055730ff', '#19cf1fff', '#055730ff'];

export const ManagementHubPage = () =>{
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

     // Fetching data from your existing APIs
  const { data: usersData = [], isLoading: isLoadingUsers } = userApi.useGetAllUsersProfilesQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: doctorsData = [], isLoading: isLoadingDoctors } = DoctorsApi.useGetDoctorsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: patientsData = [], isLoading: isLoadingPatients } = patientsApi.useGetPatientsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: appointmentsData = [], isLoading: isLoadingAppointments } = AppointmentsApi.useGetAppointmentsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: prescriptionsData = [], isLoading: isLoadingPrescriptions } = PrescriptionsApi.useGetPrescriptionsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: paymentsData = [], isLoading: isLoadingPayments } = PaymentsApi.useGetPaymentsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: complaintsData = [], isLoading: isLoadingComplaints } = complaintsApi.useGetComplaintsQuery(undefined, {
    skip: !isAuthenticated,
  });

  //when loading 
  const overallLoading =
    isLoadingUsers ||
    isLoadingDoctors ||
    isLoadingPatients ||
    isLoadingAppointments ||
    isLoadingPrescriptions ||
    isLoadingPayments ||
    isLoadingComplaints;

    // --- Data Processing for Summary Cards ---
      // Total Users & Breakdown
  const totalUsers = usersData.length;
  const adminUsersCount = usersData.filter((user: any) => user.role === 'admin').length;
  const doctorUsersCount = usersData.filter((user: any) => user.role === 'doctor').length;
  const patientUsersCount = usersData.filter((user: any) => user.role === 'patient').length;

  // Total Doctors
  const totalDoctors = doctorsData.length;

  // Total Patients
  const totalPatients = patientsData.length;

  // Total Appointments & Breakdown


  // 'confirmed'
  // | 'canceled'
  // | 'completed'
  // | 'rescheduled'
  // | 'pending';
  const totalAppointments = appointmentsData.length;
  const confirmedAppointments = appointmentsData.filter((app: AppointmentData) => app.status === 'pending').length;
  const canceledAppointments = appointmentsData.filter((app: AppointmentData) => app.status === 'rescheduled').length;
  const completedAppointments = appointmentsData.filter((app: AppointmentData) => app.status === 'completed').length;
  const rescheduledAppointments = appointmentsData.filter((app: AppointmentData) => app.status === 'canceled').length;
  // const pendingAppointments = appointmentsData.filter((app: AppointmentData) => app.status === 'confirmed').length;

  // Total Prescriptions
  const totalPrescriptions = prescriptionsData.length;

  // Total Revenue (from completed payments)
  const totalRevenue = paymentsData
    .filter((payment: PaymentData) => payment.status === 'completed')
    .reduce((sum: number, payment: PaymentData) => sum + Number(payment.amount), 0);

  // Total Complaints & Breakdown
  const totalComplaints = complaintsData.length;
  const openComplaints = complaintsData.filter((comp: ComplaintData) => comp.status === 'open').length;
  const inProgressComplaints = complaintsData.filter((comp: ComplaintData) => comp.status === 'In Progress').length;
  const resolvedComplaints = complaintsData.filter((comp: ComplaintData) => comp.status === 'resolved').length;
  const closedComplaints = complaintsData.filter((comp: ComplaintData) => comp.status === 'closed').length;

  // --- Data Processing for Charts ---
  // 1. Appointments Over Time (Line Chart)
  // Group by date and count
  const appointmentsByDate = appointmentsData.reduce((acc: { [key: string]: number }, app: AppointmentData) => {
    const date = app.createdAt.split('T')[0]; // Assuming createdAt is an ISO string like "2023-01-01T..."
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const appointmentTrendsLineData = Object.keys(appointmentsByDate)
    .sort() // Sort dates chronologically
    .map(date => ({
      name: date,
      Appointments: appointmentsByDate[date],
    }));

  // 2. Revenue Trends (Line Chart) - Monthly/Weekly
  const revenueByMonth = paymentsData
  .filter((payment: PaymentData) => payment.status === 'completed')
  .reduce((acc: { [key: string]: number }, payment: PaymentData) => {
    // Assuming paymentDate is an ISO string, extract YYYY-MM
    const month = payment.paymentDate ? payment.paymentDate.substring(0, 7) : 'Unknown';
    acc[month] = (acc[month] || 0) + Number(payment.amount);
    return acc;
  }, {});

  const revenueTrendsLineData = Object.keys(revenueByMonth)
    .sort()
    .map(month => ({
      name: month,
      Revenue: revenueByMonth[month],
    }));

  // 3. User Registration Trends (Line Chart) - Monthly
  const userRegistrationsByMonth = (usersData as userData[]).reduce((acc: { [key: string]: number }, user: userData) => {
    const month = user.createdAt.substring(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const userRegistrationTrendsLineData = Object.keys(userRegistrationsByMonth)
    .sort()
    .map(month => ({
      name: month,
      Users: userRegistrationsByMonth[month],
    }));


  // 4. Complaint Status Distribution (Pie Chart)
  const complaintStatusPieData = [
    { name: 'Open', value: openComplaints },
    { name: 'In Progress', value: inProgressComplaints },
    { name: 'Resolved', value: resolvedComplaints },
    { name: 'Closed', value: closedComplaints },
  ].filter(item => item.value > 0); // Only show slices with values

  // 5. Appointment Status Distribution (Pie Chart)
  const appointmentStatusPieData = [
    { name: 'Confirmed', value: confirmedAppointments },
    { name: 'Canceled', value: canceledAppointments },
    { name: 'Completed', value: completedAppointments },
    { name: 'Rescheduled', value: rescheduledAppointments },
  ].filter(item => item.value > 0);

  // 6. Top Doctors by Appointments (Bar Chart data preparation - using LineChart for now due to Recharts simplicity, but BarChart is more suitable)
  const doctorsAppointmentCounts = appointmentsData.reduce((acc: { [key: number]: { count: number, name: string } }, app: AppointmentData) => {
    const doctor = doctorsData.find((d: DoctorData) => d.doctorId === app.doctorId);
    if (doctor) {
      const doctorName = `${doctor.firstName} ${doctor.lastName}`;
      acc[doctor.doctorId] = {
        count: (acc[doctor.doctorId]?.count || 0) + 1,
        name: doctorName
      };
    }
    return acc;
  }, {});

  const topDoctorsByAppointmentsData = Object.values(doctorsAppointmentCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 doctors


  // 7. Top Doctors by Revenue (Bar Chart data preparation)
  // This is a more complex join logic. Assuming a payment is linked to an appointment, which is linked to a doctor.
  const doctorsRevenue = paymentsData.reduce((acc: { [key: number]: { revenue: number, name: string } }, payment: PaymentData) => {
    const appointment = appointmentsData.find((app: AppointmentData) => app.appointmentId === payment.appointmentId);
    if (appointment && payment.status === 'completed') {
      const doctor = doctorsData.find((d: DoctorData) => d.doctorId === appointment.doctorId);
      if (doctor) {
        const doctorName = `${doctor.firstName} ${doctor.lastName}`;
        acc[doctor.doctorId] = {
          revenue: (acc[doctor.doctorId]?.revenue || 0) + Number(payment.amount),
          name: doctorName
        };
      }
    }
    return acc;
  }, {});

  const topDoctorsByRevenueData = Object.values(doctorsRevenue)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // Top 5 doctors

  // 8. Most Common Medications/Dosages (Bar Chart data preparation)
  // This relies on your 'notes' field in prescriptions.
  // A more robust solution would involve a separate 'medications' table and a join table for prescription items.
  const medicationCounts = prescriptionsData.reduce((acc: { [key: string]: number }, prescription: PrescriptionData) => {
    if (prescription.notes) {
      // Simple approach: split notes by common delimiters and count words
      // This is a very basic parsing. For real-world, you'd need structured medication data.
      const medications = prescription.notes.split(/[,;\n]/).map(m => m.trim()).filter(m => m.length > 0);
      medications.forEach(med => {
        acc[med] = (acc[med] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const mostCommonMedicationsData = Object.keys(medicationCounts)
    .map(medicationName => ({
      name: medicationName,
      count: medicationCounts[medicationName]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 common medications


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-xl p-8 space-y-8">
          <h1 className="text-4xl font-extrabold text-center text-green-600 mb-8">
            <i className="fas fa-chart-line mr-3 text-purple-500"></i>
            Admin Analytics Dashboard 📈
          </h1>

          {/* Overall Loading Overlay */}
          {overallLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-200 bg-opacity-75 z-50">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-lg">
                <PuffLoader color="#169145ff" size={60} />
                <p className="text-xl text-purple-700">Loading analytics data...</p>
              </div>
            </div>
          )}

          {/* Summary Cards Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview Statistics 📊</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Total Users Card */}
              <motion.div
                className="card bg-green-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div>
                  <p className="text-sm font-medium opacity-80">Total Users</p>
                  <p className="text-4xl font-bold">{totalUsers}</p>
                  <p className="text-xs mt-1">
                    Admins: {adminUsersCount} | Doctors: {doctorUsersCount} | Patients: {patientUsersCount}
                  </p>
                </div>
                <FaUsers size={40} className="opacity-30" />
              </motion.div>

              {/* Total Doctors Card */}
              <motion.div
                className="card bg-teal-800 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div>
                  <p className="text-sm font-medium opacity-80">Total Doctors</p>
                  <p className="text-4xl font-bold">{totalDoctors}</p>
                </div>
                <FaUserMd size={40} className="opacity-30" />
              </motion.div>

              {/* Total Patients Card */}
              <motion.div
                className="card bg-green-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div>
                  <p className="text-sm font-medium opacity-80">Total Patients</p>
                  <p className="text-4xl font-bold">{totalPatients}</p>
                </div>
                <FaHospitalUser size={40} className="opacity-30" />
              </motion.div>

              {/* Total Appointments Card */}
              <motion.div
                className="card bg-teal-800 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div>
                  <p className="text-sm font-medium opacity-80">Total Appointments</p>
                  <p className="text-4xl font-bold">{totalAppointments}</p>
                  <p className="text-xs mt-1">
                    Completed: {completedAppointments} | Canceled: {canceledAppointments}
                  </p>
                </div>
                <FaCalendarCheck size={40} className="opacity-30" />
              </motion.div>

              {/* Total Prescriptions Card */}
              <motion.div
                className="card bg-green-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div>
                  <p className="text-sm font-medium opacity-80">Total Prescriptions</p>
                  <p className="text-4xl font-bold">{totalPrescriptions}</p>
                </div>
                <FaPrescriptionBottleAlt size={40} className="opacity-30" />
              </motion.div>

              {/* Total Revenue Card */}
              <motion.div
                className="card bg-teal-800 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div>
                  <p className="text-sm font-medium opacity-80">Total Revenue (Completed)</p>
                  <p className="text-4xl font-bold">Ksh {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <FaDollarSign size={40} className="opacity-30" />
              </motion.div>

              {/* Total Complaints Card */}
              <motion.div
                className="card bg-green-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <div>
                  <p className="text-sm font-medium opacity-80">Total Complaints</p>
                  <p className="text-4xl font-bold">{totalComplaints}</p>
                  <p className="text-xs mt-1">
                    Open: {openComplaints} | In Progress: {inProgressComplaints} | Resolved: {resolvedComplaints} | Closed: {closedComplaints}
                  </p>
                </div>
                <FaExclamationTriangle size={40} className="opacity-30" />
              </motion.div>
            </div>
          </section>

          <hr className="my-8 border-gray-200" />

          {/* Charts Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Trends and Visualizations 📊</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Appointments Over Time Line Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Appointments Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart //LineChart is the main container for your line graph.
                    data={appointmentTrendsLineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" /> {/*strokeDasharray privides a grid horizontal or vertical like lines to help users to read*/}
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip /> {/*provides pop up boxes when a users hovers on the graph*/}
                    <Legend /> {/*shows colour and name of eac line*/}
                    <Line type="monotone" dataKey="Appointments" stroke="#8884d8" activeDot={{ r: 8 }} /> {/*draws the actual linegraph */}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Trends Line Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Monthly Revenue Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={revenueTrendsLineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `Ksh ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey="Revenue" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Registration Trends Line Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">New User Registrations Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={userRegistrationTrendsLineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Users" stroke="#ffc658" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Complaint Status Distribution Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Complaint Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complaintStatusPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>{
                        if (typeof percent === 'number'){
                          return `${name} (${(percent * 100).toFixed(0)}%)`;
                        }
                        return `${name} (N/A)`; }}
                    >
                      {complaintStatusPieData.map((_entry, index) => (
                        <Cell key={`cell-complaint-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Appointment Status Distribution Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Appointment Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={appointmentStatusPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#82ca9d"
                      dataKey="value"
                      label={({ name, percent }) =>{
                        if (typeof percent === 'number'){
                          return `${name} (${(percent * 100).toFixed(0)}%)`;
                        }
                        return `${name} (N/A)`; }}
                    >
                      {appointmentStatusPieData.map((_entry, index) => (
                        <Cell key={`cell-appointment-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Doctors by Appointments (Bar Chart) */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Top Doctors by Appointments</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart // Using LineChart as a stand-in; BarChart is more appropriate
                    data={topDoctorsByAppointmentsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#ff7300" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Doctors by Revenue (Bar Chart) */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Top Doctors by Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart // Using LineChart as a stand-in; BarChart is more appropriate
                    data={topDoctorsByRevenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value:any) => `Ksh ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <Tooltip formatter={(value: number) => `Ksh ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#387902" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Most Common Medications (Bar Chart) */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-center">Most Common Prescribed Items</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart // Using LineChart as a stand-in; BarChart is more appropriate
                    data={mostCommonMedicationsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#9932CC" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ManagementHubPage;

