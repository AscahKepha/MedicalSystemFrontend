import { useEffect, useState } from "react";
import {FaCamera, FaEdit, FaTimes } from 'react-icons/fa';
import { useSelector} from "react-redux";
import { useNavigate } from "react-router";
import {useForm, type SubmitHandler} from 'react-hook-form';
import type { RootState } from "../../app/types";
import {SaveIcon} from 'lucide-react';


interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password?: string;
}

const AdminProfile = () =>{
  const navigate = useNavigate();
  const {user, isAuthenticated, userType} =useSelector((state: RootState) =>state.auth);
  const profilePicture =user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}&background=4ade80&color=fff&size=128`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalToggle = ()=>{
    setIsModalOpen(!isModalOpen);
  };

  const {register, handleSubmit, formState: {errors} } =useForm<FormValues>();

  const onSubmit:SubmitHandler<FormValues> = async (data) =>{
    console.log(data)
  };


  return (
    <div className="min-h-screen text-white py-10 px-5">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-5">
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-700 pb-5 mb-5">
          <div className="relative flex items-center gap-4 mb-4 md:mb-0">
            <img 
            src={user?.profilrUrl || profilePicture}
            alt= "profile"
            className="w-24 h-24 rounded-full border-4 border-green-500"
            />
            <label className="absolute bottom-0 bg-green-500 p-2 rounded-full cursor-pointer">
              <FaCamera/>
              <input type="file" className="hidden"/> {/*we add an input where we can allow someone to input a file example a file image */}
            </label>
            <div>
              <h2 className="text-3xl font-bold">{user?.firstname}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>
          <button
          className="btnbtn-warning flex items-center gap-2"
          onClick={handleModalToggle}
          >
            <FaEdit /> Edit Profile
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-4">
            <h3 className="text-2xl font-bold mb-3">Personal Information</h3>
            <p className="mb-2">
              <span className="font-bold">First Name:</span> {user?.firstName}
            </p>
            <p className="mb-2">
              <span className="font-bold">Last Name:</span> {user?.lastName}
            </p>
          </div>
          <div className="bg-gradient-to-r from-teal-600 to-green-600 rounded-lg p-4">
            <h3 className="text-2xl font-bold mb-3">Security Settings</h3>
            <p className="mb-2">
              <span className="font-bold">Password:</span> *****
            </p>
            <button className="btn btn-secondary">Change Password</button>
          </div>
        </div>
      </div>
      (isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-center items-center mb-4 ">
              <h2 className="text-2xl font-bold text-green-500 ">Edit Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-green-500">Full Name</label>
                <input
                  type="text"
                  id="firstName"
                  className="input  w-full  text-blue-500 text-sm"
                  defaultValue={user?.firstName}
                  {...register('firstName', { required: 'firstName is required' })} //spread operator takes the results in the html and inputs them and starts to validate the inputs
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-green-500">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="input  w-full  text-blue-500 text-sm"
                  defaultValue={user?.lastName}
                  {...register('lastName', { required: 'firstName is required' })}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-green-500">Email</label>
                <input
                  type="email"
                  id="email"
                  disabled
                  className="input input-bordered w-full bg-gray-900 border-gray-600 text-white"
                  defaultValue={user?.email}
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="flex justify-end">
                <button onClick={handleModalToggle} className="btn mr-2 btn-erro">
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <SaveIcon /> Save Profile 
                </button>
              </div>
             </form>
          </div>
        </div>
      ))
    </div>
  );
};

export default AdminProfile;
