import React from 'react';

export const IntroS: React.FC =()=>{
    return(
        <section className="p-4 md:p-8 bg-gray-100 py-2 md:py-4"> 
            <div>
                <h1 className="text-green-700 text-3xl md:text-4xl font-bold mb-2">Aura Health<span className='text-pink-800'>care</span></h1>
                <p className="text-gray-800 text-lg md:text-xl leading-relaxed">Welcome to our healthcare facility, where we're dedicated to your well-being. We're committed to providing comprehensive care designed to support your health journey and enhance your quality of life.</p>
            </div>
        </section>
    );
};
export default IntroS;
