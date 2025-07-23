import React from 'react';

export const Error: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-lg mx-auto">
        {/* Large, prominent 404 */}
        <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg animate-bounce-slow">
          404
        </h1>
        {/* Page Not Found message */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-4">
          Page Not Found
        </h2>
        {/* Friendly message */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist or has been moved.
          Don't worry, you can always go back to the homepage.
        </p>
        {/* Button to go home */}
        <a
          href="/" // Link to your homepage
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg transform hover:scale-105"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default Error;