import React from 'react';

export const About: React.FC = () =>{
   return(
    <section className="bg-green-900 text-white font-irish py-12 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">

        {/* Column 1: About us */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">About us</h3>
          <ul className="space-y-2 text-lg md:text-xl">
            <li>Home</li>
            <li>Notifications</li>
            <li>Our Services</li>
            <li>Our partners</li>
            <li>Adopt a patient</li>
            <li>Contact us</li>
          </ul>
        </div>

        {/* Column 2: Our Services */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">Our Services</h3>
          <ul className="space-y-2 text-lg md:text-xl">
            <li>Core medical services</li>
            <li>Specialised services</li>
            <li>Insurance</li>
            <li>Webinars and resources</li>
          </ul>
        </div>

        {/* Column 3: Locations */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">Locations</h3>
          <ul className="space-y-2 text-lg md:text-xl">
            <li>western Naharmgh,</li>
            <li>Nairobi, Akyr.</li>
            <li>Nakuru, warten .</li>
            <li>Eldoret , Infa building.</li>
          </ul>
        </div>

        {/* Column 4: Contact us */}
        <div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-md">Contact us</h3>
          <ul className="space-y-2 text-lg md:text-xl">
            <li>Contact:</li>
            <li>0166728</li>
            <li className="mt-4">email:</li>
            <li>aurahealth@mail.com</li>
            <li className="mt-4">insta:</li>
            <li>aurahealth</li>
            <li className="mt-4">linkedin:</li>
            <li>aurahealth</li>
          </ul>
        </div>

      </div>

    </section>
   ) ;
};
export default About;
