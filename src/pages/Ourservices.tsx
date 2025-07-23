import React from 'react'
import Container from "../components/Container";
import HeroS from "../../src/components/OurServices/HeroS"
import FooterS from "../components/OurServices/Footer";
import IntroS from "../../src/components/OurServices/IntroS"



export const Services: React.FC =()=>{
    return(
        <>
        <Container className='bg-gradient-to-br from-green-100 via-emarald-50 to-teal-50 flex flex-col'>
            <IntroS/>
            <HeroS/>
            <FooterS/>
        </Container>
        </>
    );
};

