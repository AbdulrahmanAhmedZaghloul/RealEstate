import React from 'react'
import { HeaderMegaMenu } from '../components/company/HeaderMegaMenu'
import Footer from '../components/Footer'
import classes from "../styles/About.module.css";


function About() {
    return (
        <>
            <HeaderMegaMenu />
            
            <div className={classes.about}>

                <h2>About Us</h2>
                <p>
                    At [Your Company Name], we are revolutionizing the real estate industry through intelligent software that empowers professionals to make faster, smarter, and more profitable decisions. Our flagship product—the Real Estate Dashboard System—is a centralized platform designed to streamline every stage of the real estate process, from property listing
                    and lead tracking to analytics, team collaboration, and client communication.
                </p>
                <p>
                    Founded by a team of real estate experts and technology innovators, our mission is simple: to bridge the gap between complex property management tasks and the simplicity of digital automation. We understand the fast-paced nature of the industry, and we’ve built our platform to meet the demands of modern real estate professionals—whether you’re a
                    solo agent, managing a brokerage, or running a national real estate agency.
                </p>
                <p>
                Our dashboard provides a full suite of tools that help you gain visibility into your operations and act on insights in real time. With features like advanced market analytics, customizable reports, real-time activity tracking, and integrated CRM capabilities, we help you eliminate guesswork 
                 focus on what truly matters: growing your business and serving your clients.
                </p>
            </div>
            <Footer />
        </>
    )
}

export default About