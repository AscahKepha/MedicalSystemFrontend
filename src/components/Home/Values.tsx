import values1 from "../../assets/Screenshot 2025-07-09 214946.png"
import values2 from "../../assets/Screenshot 2025-07-09 215022.png"

export const Values =()=>{
    return (
        <section className="bg-white min-h-fit flex items-center justify-center px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:p-12 lg:p-12 max-w-7xl w-full">
                {/* Top Heading*/}
                <div className="text-black lg:col-span-2 text-center mb-8 lg:mb-12 font-irish">
                    <p className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-md">We're building a movement.</p>
                    <p className="text-3xl md:text-4xl font-normal leading-tight drop-shadow-md">Your health is our heart's mission.</p>
                </div>

                 {/* First Row Content */}
                 {/*Left image*/}
                <div className="flex justify-center items-center">
                    <img
                    src={values1}
                    alt="Medical team work"
                    className="w-full h-auto round-lg shadow-xl object-cover max-h[400px] md:max-h-[500px]"/>
                </div>
                {/* Right section*/}
                    {/* Mission */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Mission:</h3>
                        <p className="text-lg md:text-xl leading-relaxed">
              Together towards a healthier tomorrow
            </p>
            </div>
            {/* Second row*/}
            {/*vision*/}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Vision:</h3>
                <p className="text-lg md:text-xl leading-relaxed">
              We're nurturing a global community where holistic well-being is a shared reality, actively caring for the wellness of all because we truly believe your health is at the heart of our mission. We're not just providing a service; we're building a movement
            </p>
            </div>
            {/* Right section*/}
            <div className="flex justify-center items-center">
                <img
            src={values2} // Using the imported solo image
            alt="Person in shadow"
            className="w-full h-auto rounded-lg shadow-xl object-cover max-h-[400px] md:max-h-[500px]"
          />

                    </div>
            </div>

        </section>
    );
};
export default Values;
