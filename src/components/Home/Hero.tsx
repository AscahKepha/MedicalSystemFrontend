import React from 'react';
import hero1 from "../../assets/Screenshot 2025-07-09 131101.png"


export const Hero:React.FC = () =>{
//animations
const customAnimationStyles =`@keyframes zoomIn{
0% {transform: scale(1);}
50% {transform: scale(1.05);}
100% {transform: scale(1);}
}

.animate-zoomIn-local{
animation: zoomIn 10s ease-in-out infinite;}`;

    return (
        <section className="relative w-full min-h-[500px] flex items-center justify-center p-4 overflow-hidden">
            <style>{customAnimationStyles}</style>
            {/* Background Image Layer with Animation */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-zoomIn-local"
                style={{
                    backgroundImage: `url(${hero1})`,
                }}
                >
            </div>
            {/*for text visibility semi-transparent overlay placed directly on top of your background image*/}
            <div className='absolute inset-0 bg-black opacity-60 z-10'></div>

            {/* Content (above overlay) */}
            <div className="relative z-20 text-center max-w-4xl mx-auto">
            <h1 className="text-white text-5xl md:text-7xl font-extrabold uppercase tracking-wide leading-tight mb-6 drop-shadow-lg">
          Wellness in Your Hands. Together Towards a Healthier Tomorrow.
        </h1>
        <p className="text-gray-100 text-xl md:text-2xl font-medium leading-relaxed drop-shadow-md">
          To nurture the mental and emotional well-being of every individual and build healthier, stronger communities—because true wellness grows when we care for each other deeply and compassionately
        </p>
        </div>
        </section> 
        

        //    style={{ backgroundImage: 'url("../../assets/Screenshot 2025-07-09 131101.png")',
        //     backgroundSize: 'cover',
        //     backgroundPosition: 'center center',
        //     backgroundRepeat: 'no-repeat',
        //     }}>
        //     //text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
       
    );
};

export default Hero;