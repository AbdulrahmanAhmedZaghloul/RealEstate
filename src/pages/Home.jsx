import React, { useEffect } from "react";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
import classes from "../styles/Home.module.css";
import ChartLight from "../assets/Home/Chart.png";
import FrameLight from "../assets/Home/Frame 56.png";

import { Grid, GridCol } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "./Home/header";

function Home() {
  const navigate = useNavigate();


  useEffect(() => {
    if (location.pathname === "/") {
      console.log(location.pathname);
      localStorage.setItem("mantine-color-scheme-value", "light"); // ✅ حفظ الوضع
      localStorage.setItem("mantine-color-scheme", "light"); // ✅ حفظ الوضع
    }
  }, [location])
  return (
    <>
      {/* <HeaderMegaMenu /> */}


      <HeaderMegaMenu />

      <Header />

      <section className={classes.Built}>
        <h2>Built to Empower Your Real  <br /> Estate Workflow</h2>

        <p>
          From listings to contracts manage everything in one smart platform.
        </p>


        <Grid style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>

          <GridCol className={classes.BuiltGrid} span={{ base: 6, md: 6, sm: 12, lg: 7 }}>
            <div className={classes.BuiltGridFlex}>
              <h3>Business Overview at a Glance</h3>
              <p>Get a quick snapshot of your real estate performance total listings, contracts,
                team activity, and more. Everything you need to make informed decisions, instantly visible..</p>
            </div>
            <img src={ChartLight} alt=" image" />
          </GridCol>

          <GridCol className={classes.BuiltGride} span={{ base: 6, md: 6, sm: 12, lg: 5 }}>
            <div className={classes.BuiltGridCol}>
              <h4>Team & Role Management</h4>
              <p>Assign roles and track team activity <br /> without hassle.</p>
            </div>
            <img src={FrameLight} alt=" image" />
          </GridCol>

          <GridCol className={classes.BuiltGrid} span={{ base: 6, md: 6, sm: 12, lg: 6 }}>
            <div className={classes.BuiltGridFlex}>
              <h3>Smart Property Management</h3>
              <p>
                View, search, and manage all your property listings in one place.  Add new properties, update statuses, and filter with ease.
                Whether you're managing 10 or 1,000 listings  it's always simple.
              </p>
            </div>
            <img src={ChartLight} alt=" image" />
          </GridCol>

          

          <GridCol className={classes.BuiltGrid} span={{ base: 6, md: 6, sm: 12, lg: 6 }}>
             <div className={classes.BuiltGridFlex}>
            <h3>Built-In Team Chat</h3>
          <p>
          Communicate directly with your team without leaving the platform.
                       </p>
        </div>
        <img src={ChartLight} alt=" image" />
    </GridCol>
      

                
        </Grid>    
      </section>


    {/* <Footer></Footer> */ }
    </>
  );
}

export default Home;
