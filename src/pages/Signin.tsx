import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaFacebookF, FaYoutube, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../features/api/userApi";
import { setCredentials } from "../features/auth/authSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Signin: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'doctor' | 'patient'>('patient');
  const [contactPhone, setContactPhone] = useState('');
  const [address, setAddress] = useState('');

  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerUser, { isLoading: isRegistering }] = useRegisterUserMutation();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisterError(null);

    try {
      const response = await registerUser({
        firstName,
        lastName,
        email,
        password,
        role,
        contactPhone,
        address,
      }).unwrap();

      dispatch(setCredentials({
        token: response.token,
        user: response.user,
      }));

      toast.success("✅ Registration successful!");
      navigate('/login'); // ✅ redirect to login page only

    } catch (error: any) {
      const message = error?.data?.message || "An error occurred during registration.";
      console.error("Registration failed:", error);
      setRegisterError(message);
      toast.error(`❌ ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
      <div className='grid md:grid-cols-4 gap-6 max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden'>

        <div className="md:col-span-3 p-8 flex flex-col justify-center">
          <header className='w-full text-center mb-8'>
            <h1 className='text-green-700 text-3xl font-extrabold'>AURA Health <span className="text-pink-800">care</span></h1>
            <p className='text-gray-600 text-base mt-2'>Wellness in Your Hands. Together Towards a Healthier Tomorrow.</p>
          </header>

          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaUserCircle className='h-7 w-5 text-blue-500' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Create an account</h1>
              <p className='text-gray-600 mt-1 text-sm'>Start Your Journey now with us</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                id="firstname"
                type='text'
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled={isRegistering}
              />
            </div>

            <div>
              <label htmlFor='lastname' className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
              <input
                id='lastname'
                type='text'
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled={isRegistering}
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
              <input
                id='email'
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled={isRegistering}
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
              <input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled={isRegistering}
              />
            </div>

            <div>
              <label htmlFor='contactPhone' className='block text-sm font-medium text-gray-700 mb-1'>Phone Number</label>
              <input
                id='contactPhone'
                type='tel'
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled={isRegistering}
              />
            </div>

            <div>
              <label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
              <input
                id='address'
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled={isRegistering}
              />
            </div>

            <div>
              <label htmlFor='role' className='block text-sm font-medium text-gray-700 mb-1'>Register as</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'doctor' | 'patient')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                disabled={isRegistering}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {registerError && (
              <div className="text-red-600 text-sm text-center">{registerError}</div>
            )}

            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-lg font-medium text-white bg-green-800 hover:bg-green-900 disabled:opacity-50"
              disabled={isRegistering}
            >
              {isRegistering ? 'REGISTERING...' : 'SIGNIN NOW'}
            </button>

            <button
              type="button"
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md text-lg font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isRegistering}
            >
              <FcGoogle className="mr-2 text-xl" /> Continue with Google
            </button>
          </form>

          <div className="p-6 pt-0 text-center bg-white">
            <p className="text-sm text-gray-600">
              Have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Login</a>
            </p>
          </div>
        </div>

        <div className="md:col-span-1 bg-white p-9 flex flex-col items-center space-y-20">
          <h2 className="text-xl font-bold text-gray-800 text-center">Find Us On:</h2>
          <div className="flex flex-col space-y-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, index) => (
              <a key={index} href="#" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
                <Icon className="text-gray-800 text-xl" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
