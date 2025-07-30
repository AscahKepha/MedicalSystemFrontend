// Import some icons from react-icons. You might need to install: npm install react-icons
import { FaStethoscope, FaBrain, FaDollarSign, FaBookOpen, FaCalendarAlt } from 'react-icons/fa';
import {RiWomenFill} from "react-icons/ri";
import { GiHealing } from "react-icons/gi";
import { SiThealgorithms } from "react-icons/si";
import { RiMentalHealthFill } from "react-icons/ri";
import { MdBloodtype } from "react-icons/md";
import { BiHealth } from "react-icons/bi";


export const HeroS = () => {
    return (
        <section className="p-8 md:p-12 bg-white min-h-[calc(100vh*1.2)] shadow-xl rounded-lg"> {/* Added shadow-xl and rounded-lg */}
            {/* Inner div to control max width and center content, creating the grid */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

                {/* Column 1: Core Medical Services */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-200 pb-2">List of Core Medical Services</h2> {/* Added bottom border */}
                    <div className="space-y-4"> {/* Changed to div with space-y for individual cards */}
                        {/* Example of a service item as a card */}
                        <div className="flex items-center p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <FaStethoscope className="text-blue-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">General Practitioner Consultations</p>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <RiMentalHealthFill className="text-blue-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Routine Check-ups and Vaccinations</p>
                        </div>
                        {/* Continue converting other list items to this card format */}
                        <div className="flex items-center p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <FaStethoscope className="text-blue-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Management of Acute Illnesses</p>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <GiHealing className="text-blue-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Chronic Disease Management (e.g., Diabetes, Hypertension)</p>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <BiHealth className="text-blue-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Minor Surgical Procedures</p>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <MdBloodtype className="text-blue-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Diagnostic Tests (e.g., Blood Tests, Urine Analysis)</p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Specialised Services */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-purple-700 border-b-2 border-purple-200 pb-2">Specialised Services</h2> {/* Added bottom border */}
                    <div className="space-y-4"> {/* Changed to div with space-y for individual cards */}
                        <div className="flex items-center p-3 bg-purple-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <FaBrain className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Mental Health Services</p>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <RiWomenFill className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Women and Children Health</p>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <GiHealing className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Chronic Diseases (Specialised Management)</p>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <FaStethoscope className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Theatre Services (Surgical Procedures)</p>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            < SiThealgorithms  className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Cardiology Consultations</p>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <FaStethoscope className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Dermatology Services</p>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                            <FaStethoscope className="text-purple-600 text-2xl mr-3 flex-shrink-0" />
                            <p className="text-lg text-gray-800">Paediatric Care</p>
                        </div>
                    </div>
                </div>

                {/* Full-width Section: Insurance and Payment Info */}
                <div className="md:col-span-2 mt-12 pt-8 border-t border-gray-200"> {/* Increased mt- and pt- for more separation */}
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-green-700">
                        <FaDollarSign className="inline mr-3 text-green-600 text-3xl" />Insurance and Payment Info
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        We accept a wide range of insurance providers. Please check with our front desk or visit our insurance information page for a detailed list. We also offer various payment options for your convenience, including cash, credit cards, and mobile money.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mt-2">
                        For specific queries regarding billing and insurance, please don't hesitate to contact our billing department.
                    </p>
                </div>

                {/* Full-width Section: Patient Education Resources */}
                <div className="md:col-span-2 mt-12 pt-8 border-t border-gray-200"> {/* Increased mt- and pt- for more separation */}
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-orange-700">
                        <FaBookOpen className="inline mr-3 text-orange-600 text-3xl" />Patient Education Resources
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Empowering our patients with knowledge is a priority. Explore our collection of educational materials, including brochures, articles, and online resources, to learn more about various health conditions, treatment options, and preventative care.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mt-2">
                        Visit our dedicated Patient Education section on our website for more information.
                    </p>
                </div>

                {/* Full-width Section: Book an appointment with us */}
                <div className="md:col-span-2 text-center mt-12 pt-8 border-t border-gray-200"> {/* Increased mt- and pt- for more separation */}
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-red-700">
                        <FaCalendarAlt className="inline mr-3 text-red-600 text-3xl" />Book an appointment with us
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        Ready to take the next step in your healthcare journey? Scheduling an appointment is easy. You can call our clinic directly, use our online booking portal, or send us an email.
                    </p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-transform duration-200 ease-in-out">
                        Book Online Now
                    </button>
                    <p className="text-sm text-gray-600 mt-2">Or call us at: (0712344)</p>
                </div>
            </div>
        </section>
    );
};

export default HeroS;