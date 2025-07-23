import React from "react";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaPaperPlane, FaUser, FaLock, FaBullhorn } from 'react-icons/fa';
import contactImage from '../assets/Screenshot 2025-07-15 112004.png'

export const Contact: React.FC =()=>{
    return(
        <section className="min-h-screen bg-gradient-to-br from-emerald-50 to-lime-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center font-inter">
            <div className="max-w-6xl w-full bg-white rounded-xl shadow-2xl overflow-hidden md:grid md:grid-cols-2 gap-8 p-8">
        
                {/* Left Section: Image */}
                <div className="flex items-center justify-center p-4">
                    <img
                        src={contactImage}
                        alt="Contact Us"
                        className="rounded-lg shadow-lg max-w-full h-full object-cover"
                    /> 
                </div>

                {/* Right Section: Contact Form and Info */}
                <div className="flex flex-col justify-center p-4">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-8 text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-300">
                        Here to Help
                    </h1>

                    {/* Contact Form */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-emerald-300 pb-3 flex items-center">
                            <FaPaperPlane className="mr-3 text-emerald-500" /> Send Us a Message
                        </h2>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="fullName" className="sr-only">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="emailAddress" className="sr-only">Email Address</label>
                                {/* <div className="relative"> */}
                                <div>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="emailAddress"
                                        id="emailAddress"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        placeholder="Enter email address"
                                    />
                                </div>
                            </div>
                            <div>
                                {/* //sr -screen readers is used to hide the labels example when you only want to use icons */}
                                <label htmlFor="contactNumber"className="sr-only">Contact Number</label> 
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhoneAlt className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel" // Use type="tel" for phone numbers
                                        name="contactNumber"
                                        id="contactNumber"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                        placeholder="Enter contact number"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="block w-full p-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                                    placeholder="Enter message"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Newsletter and Alternative Contact */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg shadow-inner">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-blue-300 pb-2 flex items-center">
                            <FaBullhorn className="mr-2 text-blue-500" /> Join Our Newsletter
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Stay updated with our latest news and offers!
                        </p>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="newsletterEmail"
                                    id="newsletterEmail"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <button
                                type="button"
                                className="px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Sign Up
                            </button>
                            
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b border-blue-300 pb-2 flex items-center">
                            <FaPhoneAlt className="mr-2 text-blue-500" /> Alternatively Contact Us:
                        </h2>
                        <ul className="space-y-3 text-gray-700 text-lg">
                            <li className="flex items-center">
                                <FaPhoneAlt className="mr-3 text-blue-500" />
                                <strong>Contact:</strong> 0764321
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3 text-blue-500" />
                                <strong>Email:</strong> aurahealth@mail.com
                            </li>
                            <li className="flex items-center">
                                <FaInstagram className="mr-3 text-blue-500" />
                                <strong>Instagram:</strong> aurahealth
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;