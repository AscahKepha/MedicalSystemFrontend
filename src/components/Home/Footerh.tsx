import type React from "react";
import { FaHandshakeSimple } from "react-icons/fa6";
import { BiSolidDonateHeart } from "react-icons/bi";
import { IoNewspaperSharp } from "react-icons/io5";
import { BiSolidPhoneCall } from "react-icons/bi";


export const Footerh: React.FC =()=>{
    return(
        <footer className="bg-white text-gray-800 py-8 px-4 md:px-8 lg:px-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12 items-center text-center md:text-left">
            {/*Left column*/}
            <div className="flex flex-col space-y-4 order-1">
                <a href="flex items-center justify-center md:justify-start text-lg md:text-xl hover:text-blue-600 transition-colors">
                    <BiSolidDonateHeart className="text-2xl mr-2" />Adopt a patient
                </a>
                <a href="#" className="flex items-center justify-center md:justify-start text-lg md:text-xl hover:text-blue-600 transition-colors">
            <FaHandshakeSimple className="text-2xl mr-2"/>our trusted partners
          </a>
            </div>
            {/* Middle Column */}
            <div className="order-3 lg:order-2 md:col-span-2 lg:col-span-1 text-base md:text-lg text-gray-600">
          <p>© 2023 Aura Health Services. All rights reserved.</p>
          <p>Wellness in Your Hands.</p>
          <p>Together Towards a Healthier Tomorrow.</p>
        </div>
        {/* Right Column*/}
        <div className="flex flex-col space-y-4 order-2 lg:order-3"> {/* order-2/3 to control stacking on smaller screens */}
          <a href="#" className="flex items-center justify-center md:justify-start lg:justify-end text-lg md:text-xl hover:text-blue-600 transition-colors">
            <IoNewspaperSharp className="text-2xl mr-2"/> Notification and news
          </a>
          <a href="#" className="flex items-center justify-center md:justify-start lg:justify-end text-lg md:text-xl hover:text-blue-600 transition-colors">
            <BiSolidPhoneCall className="text-2xl mr-2"/>Hotline numbers
          </a>
        </div>
        </div>
         </footer>
    );
};
export default Footerh;

