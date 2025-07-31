import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export const FooterP: React.FC = () => {
    return(
        <section className="bg-gray-100 py-8 px-4"> {/* Light gray background, adjust as needed */}
        <div className="max-w-7xl mx-auto flex justify-between items-center"> 
          {/* Left Section: LOG OUT button */}
          {/* <div className="order-1"> {/* Ensures it's first */}
          {/*<button className="bg-transparent hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded transition-colors text-lg">
            LOG OUT
          </button>
        </div> */}

      {/* Right Section: Social Media Icons */}
        <div className="flex space-x-6 md:space-x-8 order-2"> {/* order-2 makes it second */}
          {/* Facebook Icon */}
        {/* Facebook Icon */}
        <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
          <FaFacebook className="text-3xl md:text-4xl" />
        </a>

        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
          <FaLinkedin className="text-3xl md:text-4xl" />
        </a>

        <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
          <FaInstagramSquare className="text-3xl md:text-4xl" />
        </a>

        <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
          <FaTwitter className="text-3xl md:text-4xl" />
        </a>

        <a href="https://youtube.com/yourchannel" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
          <FaYoutube className="text-3xl md:text-4xl" />
        </a>
      </div>
      </div>
    </section>
    );
}; 
export default FooterP;
