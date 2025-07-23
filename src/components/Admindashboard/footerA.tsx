import React from "react";
import {
  FaFacebook,
  FaYoutube,
  FaTwitter,
  FaInstagramSquare,
  FaLinkedin
} from "react-icons/fa";

export const FooterA: React.FC = () => {
  return (
    <section className="bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto flex justify-end items-center">
        {/* Right Section: Social Media Icons */}
        <div className="flex space-x-6 md:space-x-8">
          <a
            href="https://facebook.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaFacebook className="text-3xl md:text-4xl" />
          </a>

          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaLinkedin className="text-3xl md:text-4xl" />
          </a>

          <a
            href="https://instagram.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaInstagramSquare className="text-3xl md:text-4xl" />
          </a>

          <a
            href="https://twitter.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaTwitter className="text-3xl md:text-4xl" />
          </a>

          <a
            href="https://youtube.com/yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600 transition-colors"
          >
            <FaYoutube className="text-3xl md:text-4xl" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FooterA;
