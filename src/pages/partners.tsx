import React from 'react';

// Define a type for a single partner
interface Partner {
  id: string;
  name: string;
  logoSrc: string;
  logoAlt: string;
  borderColor: string;
  bgColor: string; 
}
export const Partners: React.FC =()=>{
    const partners: Partner[] = [
    {
      id: '1',
      name: 'X-Ray Services',
      logoSrc: 'https://placehold.co/100x100/e0f2f7/0288d1?text=X-Ray',
      logoAlt: 'X-Ray Services Logo',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
    },
    {
      id: '2',
      name: 'HealthTech Innovations',
      logoSrc: 'https://placehold.co/100x100/e0f7fa/009688?text=Health',
      logoAlt: 'HealthTech Innovations Logo',
      borderColor: 'border-teal-200',
      bgColor: 'bg-teal-50',
    },
    {
      id: '3',
      name: 'Community Care Network',
      logoSrc: 'https://placehold.co/100x100/f3e5f5/9c27b0?text=Care',
      logoAlt: 'Community Care Network Logo',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
    },
    {
      id: '4',
      name: 'Pharma Solutions Inc.',
      logoSrc: 'https://placehold.co/100x100/fff3e0/ff9800?text=Pharma',
      logoAlt: 'Pharma Solutions Inc. Logo',
      borderColor: 'border-orange-200',
      bgColor: 'bg-orange-50',
    },
    {
      id: '5',
      name: 'Medical Devices Co.',
      logoSrc: 'https://placehold.co/100x100/e8f5e9/4caf50?text=Devices',
      logoAlt: 'Medical Devices Co. Logo',
      borderColor: 'border-green-200',
      bgColor: 'bg-green-50',
    },
    {
      id: '6',
      name: 'Research & Diagnostics',
      logoSrc: 'https://placehold.co/100x100/fbe9e7/ff5722?text=Labs',
      logoAlt: 'Research & Diagnostics Logo',
      borderColor: 'border-red-200',
      bgColor: 'bg-red-50',
    },
  ];

    return(
     <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gray-50 font-inter">
        <div className="container mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-6xl">
            {/*Left Section*/}
        <div className="lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            OUR VALUED PARTNERS
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">
            TEAM. CUSTOMER. COMMUNITY
          </p>
          <p className="text-md sm:text-lg text-gray-600 mb-6">
            We work with
          </p>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-lg lg:max-w-none mx-auto lg:mx-0">
            We collaborate with leading healthcare institutions, technology providers, and community organizations to enhance the quality and accessibility of our services. Our partnerships are integral to delivering comprehensive and reliable healthcare solutions.
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 self-center lg:self-start">
            Apply to partner with us
          </button>
        </div>
        {/*Right section*/}
        <div className='1g:w-1/2 grid grid-cols-2 gap-4 sm:gap-6'>
        {partners.map((partner)=>(
            <div
            key={partner.id}
            className={'flex flex-col items-center justify-center'}
            >
                <img 
                src={partner.logoSrc}
                alt={partner.logoAlt}
                className={`w-20 h-20 sm:w-24 sm:h-24 object-contain mb-2 rounded-full border-2 ${partner.borderColor}`}
              />
              <p className='text-sm sm:text-md font-medium text-gray-800 text-center'>{partner.name}</p>
            </div>
        ))}

        </div>
        </div>
     </div>   
    )
}
export default Partners;
