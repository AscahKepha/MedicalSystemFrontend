import React from "react";
import Container from '../components/Container'
// import { NavbarH } from "../components/Home/Navbarh";
import {Hero} from '../components/Home/Hero'
import {Footerh} from '../components/Home/Footerh'
import {About} from '../components/Home/About'
import {Values} from '../components/Home/Values'


export const Home: React.FC = () => {
    return (
        <>
        <Container className="bg-white flex flex-col gap-6">
            {/* <NavbarH/> */}
            <Hero/>
            <Values/>
            <About/>
            <hr className="mt-6" />
            <Footerh/>
        </Container>
        </>
    )
}