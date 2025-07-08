import { useMantineColorScheme } from '@mantine/core';
import React from 'react'
import { useNavigate } from 'react-router-dom';

import classes from "../../styles/Home.module.css";
import lapLight from "../../assets/Home/SystemLight.png";
import lapDark from "../../assets/Home/SystemDark.png";
function Header() {
    
      const navigate = useNavigate();
      const { colorScheme } = useMantineColorScheme(); // Get the current theme
    
      // Dynamically select the image based on the theme
      const selectedImage = colorScheme === "dark" ? lapDark : lapLight;
    
  return (
    <>
      <section className={classes.header}
           >
             <div className={classes.flex_auto}>
     
               <div className={classes.text}>
                 <h1>
                   Manage Your
                   <span style={{
                     color: "var(--color-1)"
                   }}>
                     Real Estate
                   </span>
                   <br /> Business with Ease
                 </h1>
     
                 <p>
                   Track properties, analyze trends, and <br />
                   make smarter decisions with our intuitive <br />
                   real estate dashboard.
                 </p>
     
                 <button style={{
                   cursor: "pointer",
                 }} onClick={
                   () => navigate('/StartAccount')
                 } className={classes.buttonText}>
                   Get started
                 </button>
               </div>
     
               <div className={classes.image}>
                 <img src={colorScheme === "dark" ? lapDark : lapLight} alt="image" />
     
               </div>
             </div>
           </section>   
    </>
  )
}

export default Header