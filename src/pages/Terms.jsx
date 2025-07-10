import React from 'react'
import { HeaderMegaMenu } from '../components/company/HeaderMegaMenu'

import classes from "../styles/Terms.module.css";
import Footer from '../components/Footer';
function Terms() {

    return (
        <>
            <HeaderMegaMenu />
              <div style={{
                backgroundColor: " var(--color-11)"
            }}>

            <div className={classes.terms}>
                <h1> Terms and Conditions </h1>
                <div className={classes.terms80} >
                    <div>
                        <p>Last Updated: 2025-05-06</p>

                        <p className={classes.Welcome}>
                            Welcome to [App Name]! These Terms and Conditions ("Terms")
                            govern your use of our real estate mobile application and web platform
                            (collectively, the "Service") operated by us.
                        </p>

                        <p>
                            By accessing or using the Service, you agree to be bound by these Terms.
                            If you do not agree, please do not use the Service.
                        </p>

                    </div>

                    <section className={classes.Eligibility}>
                        <h2>1. Eligibility</h2>
                        <p>
                            You must be at least 18 years old and legally able to
                            enter into binding contracts to use our Service.
                            By using the platform, you confirm you meet this requirement.
                        </p>
                    </section>
                    <section className={classes.Services}>
                        <h2 >
                            2. Services Provided
                        </h2>

                        <p>Our platform allows users to:</p>

                        <ul>
                            <li> Browse and search real estate listings.</li>
                            <li> Contact agents or property owners.</li>
                            <li> Schedule viewings or request more information. </li>
                            <li> Post properties for sale or rent (for registered agents or owners). </li>
                            <li> Save favorite properties and receive notifications. </li>
                        </ul>

                        <p>
                            We do not own, sell, or lease properties.
                            We are a platform for connecting users with property information.
                        </p>
                    </section>
                </div>
                <div className={classes.terms80} >

                    <section className={classes.Eligibility}>
                        <h2>3. Eligibility</h2>
                        <p>
                            You must be at least 18 years old and legally able to
                            enter into binding contracts to use our Service.
                            By using the platform, you confirm you meet this requirement.
                        </p>
                    </section>
                    <section className={classes.Services}>
                        <h2 >
                            4. Services Provided
                        </h2>

                        <p>Our platform allows users to:</p>

                        <ul>
                            <li> Browse and search real estate listings.</li>
                            <li> Contact agents or property owners.</li>
                            <li> Schedule viewings or request more information. </li>
                            <li> Post properties for sale or rent (for registered agents or owners). </li>
                            <li> Save favorite properties and receive notifications. </li>
                        </ul>

                        <p>
                            We do not own, sell, or lease properties.
                            We are a platform for connecting users with property information.
                        </p>
                    </section>
                </div>

            </div>

            </div>


            <Footer />

        </>
    )
}

export default Terms