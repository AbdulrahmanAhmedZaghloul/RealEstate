import React from 'react'
import { HeaderMegaMenu } from '../components/company/HeaderMegaMenu'
import Footer from '../components/Footer'
import classes from "../styles/About.module.css";


function About() {
    return (
        <>
            <HeaderMegaMenu />
            <div className={classes.contact}>
                <h1>Contact Us</h1>
                <p>B06 Cairo — Sokhna Road, District 5, New Cairo, Egypt</p>
                <div className={classes.contactSpan}>
                    <span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.4406 13.0004C19.2206 13.0004 18.9906 12.9304 18.7706 12.8804C18.325 12.7823 17.8872 12.652 17.4606 12.4904C16.9967 12.3216 16.4867 12.3304 16.0289 12.515C15.5711 12.6996 15.1977 13.047 14.9806 13.4904L14.7606 13.9404C13.7867 13.3983 12.8917 12.7254 12.1006 11.9404C11.3155 11.1492 10.6426 10.2542 10.1006 9.28036L10.5206 9.00036C10.964 8.78327 11.3114 8.40989 11.496 7.95205C11.6806 7.49421 11.6894 6.98427 11.5206 6.52036C11.3609 6.0931 11.2306 5.65541 11.1306 5.21036C11.0806 4.99036 11.0406 4.76036 11.0106 4.53036C10.8892 3.82598 10.5202 3.1881 9.97021 2.7316C9.42021 2.27509 8.72529 2.02997 8.01059 2.04036H5.01059C4.57962 2.03631 4.15284 2.12517 3.7593 2.30089C3.36576 2.4766 3.0147 2.73505 2.73002 3.05864C2.44534 3.38222 2.23372 3.76335 2.10958 4.17607C1.98543 4.58879 1.95167 5.02342 2.01059 5.45036C2.54333 9.63974 4.45662 13.5322 7.44824 16.513C10.4399 19.4938 14.3393 21.3929 18.5306 21.9104H18.9106C19.648 21.9114 20.36 21.6409 20.9106 21.1504C21.227 20.8674 21.4797 20.5205 21.6521 20.1327C21.8244 19.7448 21.9126 19.3248 21.9106 18.9004V15.9004C21.8983 15.2057 21.6454 14.5369 21.1949 14.008C20.7445 13.4791 20.1244 13.123 19.4406 13.0004ZM19.9406 19.0004C19.9404 19.1423 19.91 19.2827 19.8514 19.412C19.7927 19.5413 19.7073 19.6566 19.6006 19.7504C19.4892 19.8474 19.3586 19.9198 19.2173 19.9629C19.076 20.0059 18.9272 20.0187 18.7806 20.0004C15.0355 19.5202 11.5568 17.8068 8.89331 15.1306C6.22978 12.4545 4.533 8.96769 4.07059 5.22036C4.05525 5.0739 4.06948 4.92586 4.11242 4.785C4.15536 4.64414 4.22615 4.51335 4.32059 4.40036C4.4143 4.29369 4.52965 4.2082 4.65897 4.14957C4.78829 4.09095 4.9286 4.06054 5.07059 4.06036H8.07059C8.30314 4.05518 8.53021 4.13124 8.71273 4.27543C8.89525 4.41962 9.0218 4.62293 9.07059 4.85036C9.11059 5.12369 9.16059 5.39369 9.22059 5.66036C9.33569 6.18761 9.48944 6.70567 9.68059 7.21036L8.28059 7.86036C8.16089 7.91528 8.05321 7.9933 7.96375 8.08995C7.87428 8.1866 7.80479 8.29997 7.75926 8.42355C7.71373 8.54713 7.69306 8.67849 7.69844 8.81008C7.70381 8.94167 7.73513 9.0709 7.79059 9.19036C9.2305 12.2726 11.7083 14.7504 14.7906 16.1904C15.0341 16.2904 15.3071 16.2904 15.5506 16.1904C15.6753 16.1457 15.7899 16.0768 15.8878 15.9875C15.9856 15.8983 16.0648 15.7905 16.1206 15.6704L16.7406 14.2704C17.2578 14.4545 17.7854 14.6081 18.3206 14.7304C18.5873 14.7904 18.8573 14.8404 19.1306 14.8804C19.358 14.9291 19.5613 15.0557 19.7055 15.2382C19.8497 15.4207 19.9258 15.6478 19.9206 15.8804L19.9406 19.0004Z" fill="var(--color-2);" />
                        </svg>
                        16665
                    </span>
                    <span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" fill="var(--color-2);" />
                        </svg>

                        Company@gmail.com
                    </span>
                </div>

            </div>
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