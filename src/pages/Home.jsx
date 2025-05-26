import React, { useEffect } from "react";
import { HeaderMegaMenu } from "../components/company/HeaderMegaMenu";
import classes from "../styles/Home.module.css";
import lap from "../assets/Home/Contracts (1) 1.png";
import Unlock from "../assets/Home/Contracts 2.png";
import Employees from "../assets/Home/Employees 1.png";
import mobile from "../assets/Home/Home (2) 1.png";
import mobile_2 from "../assets/Home/iphone 18.png";
import mobile_3 from "../assets/Home/Home (2) 1.png";

// import mop from "../assets/header/84ab9af47301aaabd64b04e9ab1be9c9.png";
import { Grid, GridCol } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  // const isSmallScreen = useMediaQuery("(min-width: 1020px)");

  useEffect(() => {
    if (location.pathname === "/") {
      console.log(location.pathname);
      localStorage.setItem("mantine-color-scheme-value", "light"); // ✅ حفظ الوضع
      localStorage.setItem("mantine-color-scheme", "light"); // ✅ حفظ الوضع
    }
  }, [location])
  return (
    <>
      <HeaderMegaMenu />

      <section className={classes.header}
      >
           <div className={classes.flex_auto}>

            <div className={classes.text}>
              <h1>
                Manage Your Real Estate <br /> Business with Ease
              </h1>

              <p>Track properties, analyze trends, and <br />
                make smarter decisions with our intuitive <br />
                real estate dashboard.</p>
              <button style={{
                cursor:"pointer",
              }} onClick={
                ()=> navigate('/StartAccount')
              }  className={classes.buttonText}>
                Get started
              </button>
            </div>

            <div className={classes.image}>

              <img src={lap} alt="xsxs" />
              <div className={classes.imagepostion}>
                <img src={mobile} alt="" />
              </div>
            </div>
          </div>
       </section>

      <section className={classes.Join}>
        <h2>Why Join Us?</h2>
        <Grid className={classes.GridJoin}>
          <GridCol span={{ base: 6, md: 6, sm: 6, lg: 3 }}>
            <div className={classes.Joindiv}>
              <div className={classes.Joindivsvg}>
                <div className={classes.backgroundColorSvg}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30 26.25H32.5V32.5H30V26.25ZM25 20H27.5V32.5H25V20ZM13.75 32.5C12.093 32.498 10.5044 31.8389 9.33277 30.6672C8.1611 29.4956 7.50198 27.907 7.5 26.25H10C10 26.9917 10.2199 27.7167 10.632 28.3334C11.044 28.9501 11.6297 29.4307 12.3149 29.7145C13.0002 29.9984 13.7542 30.0726 14.4816 29.9279C15.209 29.7833 15.8772 29.4261 16.4017 28.9017C16.9261 28.3772 17.2833 27.709 17.4279 26.9816C17.5726 26.2542 17.4984 25.5002 17.2145 24.8149C16.9307 24.1297 16.4501 23.544 15.8334 23.132C15.2167 22.7199 14.4917 22.5 13.75 22.5V20C15.4076 20 16.9973 20.6585 18.1694 21.8306C19.3415 23.0027 20 24.5924 20 26.25C20 27.9076 19.3415 29.4973 18.1694 30.6694C16.9973 31.8415 15.4076 32.5 13.75 32.5Z"
                      fill="var(--color-1)"
                    />
                    <path
                      d="M35 2.5H5C4.33696 2.5 3.70107 2.76339 3.23223 3.23223C2.76339 3.70107 2.5 4.33696 2.5 5V35C2.5 35.663 2.76339 36.2989 3.23223 36.7678C3.70107 37.2366 4.33696 37.5 5 37.5H35C35.6627 37.499 36.298 37.2353 36.7667 36.7667C37.2353 36.298 37.499 35.6627 37.5 35V5C37.5 4.33696 37.2366 3.70107 36.7678 3.23223C36.2989 2.76339 35.663 2.5 35 2.5ZM35 13.75H17.5V5H35V13.75ZM15 5V13.75H5V5H15ZM5 35V16.25H35L35.0025 35H5Z"
                      fill="var(--color-1)"
                    />
                  </svg>
                </div>

                <h3>All-in-One Dashboard</h3>

                <span>
                  Manage everything from property searches to portfolio tracking
                  in one powerful platform.
                </span>
              </div>
            </div>
          </GridCol>
          <GridCol span={{ base: 6, md: 6, sm: 6, lg: 3 }}>
            <div className={classes.Joindiv}>
              <div className={classes.Joindivsvg}>
                <div className={classes.backgroundColorSvg}>
                  <svg
                    width="24"
                    height="30"
                    viewBox="0 0 24 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0007 13.3333C13.3192 13.3333 14.6081 12.9423 15.7045 12.2098C16.8008 11.4773 17.6553 10.4361 18.1598 9.21789C18.6644 7.99972 18.7965 6.65927 18.5392 5.36607C18.282 4.07286 17.647 2.88497 16.7147 1.95262C15.7823 1.02027 14.5945 0.385336 13.3013 0.128101C12.008 -0.129134 10.6676 0.00288854 9.44943 0.507473C8.23125 1.01206 7.19006 1.86654 6.45752 2.96287C5.72498 4.0592 5.33398 5.34813 5.33398 6.66667C5.33398 8.43478 6.03636 10.1305 7.28661 11.3807C8.53685 12.631 10.2325 13.3333 12.0007 13.3333ZM12.0007 3.33334C12.6599 3.33334 13.3044 3.52883 13.8526 3.8951C14.4007 4.26138 14.828 4.78197 15.0803 5.39106C15.3325 6.00014 15.3986 6.67037 15.2699 7.31697C15.1413 7.96357 14.8238 8.55752 14.3577 9.02369C13.8915 9.48987 13.2976 9.80734 12.651 9.93596C12.0043 10.0646 11.3341 9.99856 10.725 9.74627C10.116 9.49398 9.59536 9.06673 9.22909 8.51857C8.86281 7.97041 8.66732 7.32594 8.66732 6.66667C8.66732 5.78262 9.01851 4.93477 9.64363 4.30965C10.2688 3.68453 11.1166 3.33334 12.0007 3.33334ZM12.0007 16.6667C8.90646 16.6667 5.939 17.8958 3.75107 20.0838C1.56315 22.2717 0.333984 25.2391 0.333984 28.3333C0.333984 28.7754 0.509579 29.1993 0.82214 29.5119C1.1347 29.8244 1.55862 30 2.00065 30C2.44268 30 2.8666 29.8244 3.17916 29.5119C3.49172 29.1993 3.66732 28.7754 3.66732 28.3333C3.66732 26.1232 4.54529 24.0036 6.10809 22.4408C7.6709 20.878 9.79051 20 12.0007 20C14.2108 20 16.3304 20.878 17.8932 22.4408C19.456 24.0036 20.334 26.1232 20.334 28.3333C20.334 28.7754 20.5096 29.1993 20.8221 29.5119C21.1347 29.8244 21.5586 30 22.0007 30C22.4427 30 22.8666 29.8244 23.1792 29.5119C23.4917 29.1993 23.6673 28.7754 23.6673 28.3333C23.6673 25.2391 22.4382 22.2717 20.2502 20.0838C18.0623 17.8958 15.0948 16.6667 12.0007 16.6667Z"
                      fill="var(--color-1)"
                    />
                  </svg>
                </div>

                <h3> For Every User</h3>

                <span>
                  Whether you're a curious buyer or a real estate pro, got you
                  covered. Our platform scales with your needs.
                </span>
              </div>
            </div>
          </GridCol>
          <GridCol span={{ base: 6, md: 6, sm: 6, lg: 3 }}>
            <div className={classes.Joindiv}>
              <div className={classes.Joindivsvg}>
                <div className={classes.backgroundColorSvg}>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.33333 26.6667H28.3333C28.7754 26.6667 29.1993 26.8423 29.5118 27.1548C29.8244 27.4674 30 27.8913 30 28.3333C30 28.7754 29.8244 29.1993 29.5118 29.5118C29.1993 29.8244 28.7754 30 28.3333 30H1.66667C1.22464 30 0.800716 29.8244 0.488155 29.5118C0.175595 29.1993 0 28.7754 0 28.3333V15C0 14.558 0.175595 14.134 0.488155 13.8215C0.800716 13.5089 1.22464 13.3333 1.66667 13.3333C2.10869 13.3333 2.53262 13.5089 2.84518 13.8215C3.15774 14.134 3.33333 14.558 3.33333 15V26.6667ZM11.6667 20C11.6667 20.442 11.4911 20.8659 11.1785 21.1785C10.8659 21.4911 10.442 21.6667 10 21.6667C9.55797 21.6667 9.13405 21.4911 8.82149 21.1785C8.50893 20.8659 8.33333 20.442 8.33333 20V5C8.33333 4.55797 8.50893 4.13405 8.82149 3.82149C9.13405 3.50893 9.55797 3.33333 10 3.33333C10.442 3.33333 10.8659 3.50893 11.1785 3.82149C11.4911 4.13405 11.6667 4.55797 11.6667 5V20ZM15 20V8.33333C15 7.89131 15.1756 7.46738 15.4882 7.15482C15.8007 6.84226 16.2246 6.66667 16.6667 6.66667C17.1087 6.66667 17.5326 6.84226 17.8452 7.15482C18.1577 7.46738 18.3333 7.89131 18.3333 8.33333V20C18.3333 20.442 18.1577 20.8659 17.8452 21.1785C17.5326 21.4911 17.1087 21.6667 16.6667 21.6667C16.2246 21.6667 15.8007 21.4911 15.4882 21.1785C15.1756 20.8659 15 20.442 15 20ZM21.6667 1.66667C21.6667 1.22464 21.8423 0.800716 22.1548 0.488155C22.4674 0.175595 22.8913 0 23.3333 0C23.7754 0 24.1993 0.175595 24.5118 0.488155C24.8244 0.800716 25 1.22464 25 1.66667V20C25 20.442 24.8244 20.8659 24.5118 21.1785C24.1993 21.4911 23.7754 21.6667 23.3333 21.6667C22.8913 21.6667 22.4674 21.4911 22.1548 21.1785C21.8423 20.8659 21.6667 20.442 21.6667 20V1.66667Z"
                      fill="var(--color-1)"
                    />
                  </svg>
                </div>

                <h3> Smarter Decisions</h3>

                <span>
                  Get real-time data, market trends, and performance analytics
                  at your fingertips.
                </span>
              </div>
            </div>
          </GridCol>
          <GridCol span={{ base: 6, md: 6, sm: 6, lg: 3 }}>
            <div className={classes.Joindiv}>
              <div className={classes.Joindivsvg}>
                <div className={classes.backgroundColorSvg}>
                  <svg
                    width="28"
                    height="34"
                    viewBox="0 0 28 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.9993 33.6663C10.1382 32.6941 6.95046 30.4786 4.43602 27.0197C1.92157 23.5608 0.664905 19.7208 0.666016 15.4997V5.33301L13.9993 0.333008L27.3327 5.33301V15.4997C27.3327 19.7219 26.076 23.5625 23.5627 27.0213C21.0494 30.4802 17.8616 32.6952 13.9993 33.6663ZM13.9993 30.1663C16.6938 29.333 18.9438 27.6869 20.7493 25.228C22.5549 22.7691 23.6105 20.0263 23.916 16.9997H13.9993V3.87467L3.99935 7.62467V16.2497C3.99935 16.4441 4.02713 16.6941 4.08268 16.9997H13.9993V30.1663Z"
                      fill="var(--color-1)"
                    />
                  </svg>
                </div>

                <h3>Secure & Reliable</h3>

                <span>
                  Your data is safe, your tools are up-to-date, and your
                  experience keeps getting better.
                </span>
              </div>
            </div>
          </GridCol>
        </Grid>
      </section>

      <section className={classes.Unlock}>
        <Grid>
          <GridCol
            style={{
              overflow: "hidden"
            }}
            span={{
              xs: 12, // شاشة صغيرة جدًا - خلي العنصر ياخد العرض كله
              sm: 12,
              md: 12, // من أول medium وأكبر، خلي العنصر ياخد نص العرض
              lg: 6,
              xl: 6,
            }}
            className={classes.GridColUnlock1}
          >

            <div className={classes.w901} >
              <h3>Unlock Insights with Real Estate Analytics</h3>
              <p>
                Make smarter decisions with powerful, data-driven insights into
                your real estate business. Our intuitive Analytics page provides
                you with the tools to track trends, measure performance, and
                identify opportunities for growth.
              </p>

              <div className={classes.spanSvg1}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1022_5040)">
                    <path
                      d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1022_5040">
                      <rect
                        width="19.1721"
                        height="19.1721"
                        fill="white"
                        transform="translate(0 0.171875)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span>Market Trends</span>
              </div>

              <div className={classes.spanSvg1}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1022_5040)">
                    <path
                      d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1022_5040">
                      <rect
                        width="19.1721"
                        height="19.1721"
                        fill="white"
                        transform="translate(0 0.171875)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span>Performance Metrics</span>
              </div>

              <div className={classes.spanSvg1}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1022_5040)">
                    <path
                      d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1022_5040">
                      <rect
                        width="19.1721"
                        height="19.1721"
                        fill="white"
                        transform="translate(0 0.171875)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span> Actionable Insights </span>
              </div>
            </div>

          </GridCol>
          <GridCol
            span={{
              xs: 12, // شاشة صغيرة جدًا - خلي العنصر ياخد العرض كله
              sm: 12,
              md: 12, // من أول medium وأكبر، خلي العنصر ياخد نص العرض
              lg: 6,
              xl: 6,
            }}

            className={classes.GridColUnlockImage1}
          >
            <div className={classes.w90image1}>
              <img src={Unlock} alt="" />
            </div>
          </GridCol>
        </Grid>
      </section>

      <section className={classes.Unlock}>
        <Grid>
          <GridCol
            span={{
              xs: 12, // شاشة صغيرة جدًا - خلي العنصر ياخد العرض كله
              sm: 12,
              md: 12, // من أول medium وأكبر، خلي العنصر ياخد نص العرض
              lg: 6,
              xl: 6,
            }}
            order={{ base: 2, md: 1 }} // 👈 هنا نجعلها تظهر ثاني في الشاشات الصغيرة

            className={classes.GridColUnlockImage}
          >
            <div className={classes.w90image}>
              <img src={Employees} alt="" />
            </div>
          </GridCol>

          <GridCol
            span={{
              xs: 12, // شاشة صغيرة جدًا - خلي العنصر ياخد العرض كله
              sm: 12,
              md: 12, // من أول medium وأكبر، خلي العنصر ياخد نص العرض
              lg: 6,
              xl: 6,
            }}
            order={{ base: 1, md: 2 }} // 👈 نجعلها تظهر أول في الشاشات الصغيرة

            className={classes.GridColUnlock}
            style={{
              overflow: "hidden"
            }}
          >
            <div className={classes.w90}>
              <h3>Lead Your Team Effectively</h3>

              <p>
                Take charge of your real estate business by efficiently managing
                your employees. Our intuitive Employee Management feature lets
                you assign roles, track performance.all in one place.
              </p>

              <div className={classes.spanSvg}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1022_5040)">
                    <path
                      d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1022_5040">
                      <rect
                        width="19.1721"
                        height="19.1721"
                        fill="white"
                        transform="translate(0 0.171875)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span>Role-Based Access </span>
              </div>

              <div className={classes.spanSvg}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1022_5040)">
                    <path
                      d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1022_5040">
                      <rect
                        width="19.1721"
                        height="19.1721"
                        fill="white"
                        transform="translate(0 0.171875)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span>Seamless Collaboration </span>
              </div>

              <div className={classes.spanSvg}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_1022_5040)">
                    <path
                      d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                      stroke="var(--color-1)"
                      strokeWidth="2.55628"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1022_5040">
                      <rect
                        width="19.1721"
                        height="19.1721"
                        fill="white"
                        transform="translate(0 0.171875)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span> Performance Tracking </span>
              </div>
            </div>
          </GridCol>
        </Grid>
      </section>

      <section className={classes.Matter}>
        <h2>
          No Matter Your Size, We Have the <br /> Perfect Real Estate Solution
        </h2>
        <div className={classes.MatterGrid}>
          <div className={classes.MatterGridCol}>
            <div>
              <svg
                width={48}
                height={48}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width={48} height={48} fill="url(#pattern0_1022_5019)" />
                <defs>
                  <pattern
                    id="pattern0_1022_5019"
                    patternContentUnits="objectBoundingBox"
                    width={1}
                    height={1}
                  >
                    <use
                      xlinkHref="#image0_1022_5019"
                      transform="scale(0.0111111)"
                    />
                  </pattern>
                  <image
                    id="image0_1022_5019"
                    width={90}
                    height={90}
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAABm0lEQVR4nO2YPU4EMQxGLTq4HweIi+3GEifYO/Aj9nxo3AINtIOQUiCqiUhwJnlPcmdporfWZ61FAAAAAAAARuR08psl+ZMlfzf1LaIW9TdTf7y7fbmWUbG0XqIE2+9K60VG5Hzerhb1z45Ef3y/SUYD0ZNGx5L8WUblewEtaX3ICykoMvzV0no/9DIEAAAAGOOOYTPcQ3r6M2Kj3kO6+3utg95DEP2PjBgdS4/3kC7uGDrZPSRclP6t5ChEizJEx0u0GSa6Vn/Ud7v7IRHtiP4JE61Exy6IDic6poiOo5Qg2hHNRDvRYY2jo1Y/GZ1BtMYuw1r9xUQ9yDoTh+gMopWJ3sVs0WGVdkAxiHZETzHRRylBtCOaiXaiwxpHR61+MjqDaI1dhrX6i4l6kHUmDtEZRCsTvYvZosMq7YBiEO2InmKij1KCaEc0E+1EhzWOjlr9ZHQG0Rq7DGv1FxP1IOtMHKIziFYmehezRYdV2gHFINoRPcVEt36QNf4uojOIZqI3okOJjk0KITqIjq1JdAAAAAAAAAAAyDH4AlClsyHg8cxOAAAAAElFTkSuQmCC"
                  />
                </defs>
              </svg>
              <h2>Company</h2>
              <p>
                Company Dashboard is built for real estate businesses and
                agencies that need to manage listings, monitor performance, and
                oversee teams. With tools like analytics, team collaboration,
                and property management, businesses can track sales.
              </p>
              <span onClick={() => navigate("/StartAccount")}>See more →</span>
            </div>
          </div>
          <div className={classes.MatterGridCol}>
            <div>
              <svg
                width={48}
                height={48}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width={48} height={48} fill="url(#pattern0_1022_5013)" />
                <defs>
                  <pattern
                    id="pattern0_1022_5013"
                    patternContentUnits="objectBoundingBox"
                    width={1}
                    height={1}
                  >
                    <use
                      xlinkHref="#image0_1022_5013"
                      transform="scale(0.0111111)"
                    />
                  </pattern>
                  <image
                    id="image0_1022_5013"
                    width={90}
                    height={90}
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEPElEQVR4nO2c24scRRTGS1fB+OjtRURjfMuTiiIICqJBER/HSy67c6qHUTZ9anfypi+rTwoivkSJwTcv/4H6qGC8oFExEjeu18yc06PreiMompi0nJ5xiZcsmZ3prt6q84MPlpmla85HzemaU6faGEVRFEVRFEVRFGV0Okn3GgTa7Sy97IA/ROAfHPDxQpZX5LXiPUuzOH10yzqGiJeFhfw8tLwDgd92lvMR9ZZLeHujkU/5jqPWYJLdiZaX1mHwP4TAR9DyNt/x1I52my9ES8+Pa/B/Daf9nUZ3k+/4asFDO/uXoaUPJm3yqoDeR8guNSZ2k4GPlGby6akkVrPbg3RR3kz+n5k9M/P1BSY2sIScfBZm7zMxgZa3VW7yUClkd5mI1slLvox2lhajWGc7yHb6M3nV7PtN6Djgd7wbDXTAhF67cL5NHszoU2mrv9mEChYFIt8mD5QmvQdNqLii0ubf5GH6eNGEClr+qEZGHzSh4qSG7NvgVdGyCRW0/Ed9ZjT/bkLF+Tb3XzKh4mpgrhpt1eiJgZqjq8HpqqMaUNfRFRkN9JLvG+DfQksvmFBxlmZ9GxxFrQOnj26Ryplvk+UzzM30rzIhg+vrQJp02njThI5LeLt3o4HuNaHTaORTVfRyrJE2DkexZyi4hO/wZXTa7N1mYgKB9nsw+lkTG51Gd5N0D1WWly2/G2WnkiD9cNXka1rc0+ZLTMygmG3pvTJncrQNjmdII/vKyMnRpou1SIFul6/5BFLF4ehWF6PSaORTKfAD0k002s91OiW/+OaadN/CQn6u7zg2FGmrv1mKP9KDMeylXpHNg0JA30vLgLwn/xN87UJRFEVRFEVRFEVRxmNPk66Yb/W3luWjXFvGMDGSJt0bHdATzvKhoiAEfByb/PAki0FyLWf5keHTauTg/cdo6XHXzG4wIYNF8ww/hsCfn7FID/y6a2XXjzuWXMNZemONzYAlBH50Hr692oSAzCpM6B4H9BoCnRyh5PnqnM1uGWWGF2NBdquMdda7L0An0fIrqe3dvSFLq3Le2yU044A/G7OA/92gRJrtQkvXyr5fu33wfJH8Pd/k6+agNz1onqTlMcdalGvJZzf1Jz9HHjzlgL4qYVsqr0Jo6UvZeJBYTB3BVu8m2Qj1bZSblOTMep1unLL5OVhB0J/ezbETnt3FfYWek6fleF9JINAnvg1x5euQtwcYFnf4Wp1J4bK1IiuhSk2W3OWAjtUg+LxSAf2aJnxzJSbv3kUXj7+U4g0sWu4k3YtKN9oBP+U/WPY8s/nJ0o32++AproUQ6NMqjP7Nd6DOt4COlW60A/rGe6DWu74o32jLe2sQaO5X9HTpRnemu5c74B/9B8t+BPxzZRsJg8M+9Iv3oG21Qss/Vd4OLJ2eCPzMoIhOJ4I1F+jEcKW1d9ZmV1ZqsqIoiqIoiqIoiqIoiqknfwGNqj2LuSGIBgAAAABJRU5ErkJggg=="
                  />
                </defs>
              </svg>

              <h2>Marketer </h2>

              <p>
                Marketer Dashboard is designed for individual agents to manage
                property listings, track leads, and integrate with CRM systems.
                With tools like lead management and analytics, marketers can
                stay organized and close more deals efficiently.{" "}
              </p>

              <span onClick={() => navigate("/StartAccount")}>See more →</span>
            </div>
          </div>
        </div>
      </section>

      <section className={classes.Realsection}>
        <Grid className={classes.RealGrid}>
          <GridCol span={{
            xs: 12, // شاشة صغيرة جدًا - خلي العنصر ياخد العرض كله
            sm: 12,
            md: 12, // من أول medium وأكبر، خلي العنصر ياخد نص العرض
            lg: 6,
            xl: 6,
          }} className={classes.RealGridCol1}>
            <h4>The Real Estate App That Works Like a Pro</h4>
            <p>
              Experience seamless property browsing with our powerful mobile
              app. Whether you're buying or renting, our app gives you
              everything you need in the palm of your hand.
            </p>

            <div className={classes.spanSvg}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1022_5040)">
                  <path
                    d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                    stroke="var(--color-1)"
                    strokeWidth="2.55628"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                    stroke="var(--color-1)"
                    strokeWidth="2.55628"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1022_5040">
                    <rect
                      width="19.1721"
                      height="19.1721"
                      fill="white"
                      transform="translate(0 0.171875)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <span>Real-Time Property Listings</span>
            </div>

            <div className={classes.spanSvg}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1022_5040)">
                  <path
                    d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                    stroke="var(--color-1)"
                    strokeWidth="2.55628"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                    stroke="var(--color-1)"
                    strokeWidth="2.55628"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1022_5040">
                    <rect
                      width="19.1721"
                      height="19.1721"
                      fill="white"
                      transform="translate(0 0.171875)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <span>Real-Time Sync with Dashboard</span>
            </div>

            <div className={classes.spanSvg}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1022_5040)">
                  <path
                    d="M15.9767 4.96484L7.1895 13.752L3.19531 9.75786"
                    stroke="var(--color-1)"
                    strokeWidth="2.55628"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.9767 5.28418L7.1895 14.0714L3.19531 10.0772"
                    stroke="var(--color-1)"
                    strokeWidth="2.55628"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1022_5040">
                    <rect
                      width="19.1721"
                      height="19.1721"
                      fill="white"
                      transform="translate(0 0.171875)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <span>Streamlined User Experience</span>
            </div>
            <div className={classes.svgflex}>
              <svg
                width="119"
                height="43"
                viewBox="0 0 119 43"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="118.154" height="43" rx="8" fill="#090909" />
                <path
                  d="M27.0814 22.1522C27.1047 20.3355 28.0766 18.6164 29.6183 17.6649C28.6457 16.2703 27.0166 15.3862 25.3217 15.3329C23.5139 15.1424 21.7613 16.4189 20.8401 16.4189C19.9011 16.4189 18.4827 15.3519 16.9554 15.3834C14.9646 15.448 13.1086 16.5843 12.1401 18.3315C10.058 21.9504 11.611 27.2688 13.6055 30.1939C14.6033 31.6263 15.7695 33.2263 17.2955 33.1696C18.7887 33.1074 19.3464 32.2137 21.1489 32.2137C22.9346 32.2137 23.4578 33.1696 25.0147 33.1335C26.6171 33.1074 27.6266 31.6948 28.5894 30.2488C29.3064 29.2282 29.8581 28.1002 30.2241 26.9066C28.3411 26.1071 27.0836 24.2047 27.0814 22.1522Z"
                  fill="white"
                />
                <path
                  d="M24.1406 13.4092C25.0143 12.3563 25.4447 11.003 25.3405 9.63672C24.0057 9.77745 22.7728 10.4179 21.8873 11.4303C21.0215 12.4196 20.5709 13.7491 20.6561 15.0632C21.9913 15.077 23.3039 14.4539 24.1406 13.4092Z"
                  fill="white"
                />
                <path
                  d="M80.3424 20.2755V22.477H78.9678V23.9207H80.3424V28.8262C80.3424 30.5012 81.0972 31.1713 82.9962 31.1713C83.3299 31.1713 83.6477 31.1314 83.9258 31.0835V29.6557C83.6874 29.6797 83.5364 29.6956 83.2742 29.6956C82.4241 29.6956 82.0506 29.2968 82.0506 28.3875V23.9207H83.9258V22.477H82.0506V20.2755H80.3424Z"
                  fill="white"
                />
                <path
                  d="M88.7632 31.2909C91.2899 31.2909 92.8392 29.5919 92.8392 26.7762C92.8392 23.9765 91.2819 22.2696 88.7632 22.2696C86.2366 22.2696 84.6793 23.9765 84.6793 26.7762C84.6793 29.5919 86.2287 31.2909 88.7632 31.2909ZM88.7632 29.7674C87.2775 29.7674 86.4432 28.6746 86.4432 26.7762C86.4432 24.8938 87.2775 23.7931 88.7632 23.7931C90.2411 23.7931 91.0833 24.8938 91.0833 26.7762C91.0833 28.6667 90.2411 29.7674 88.7632 29.7674Z"
                  fill="white"
                />
                <path
                  d="M94.1648 31.1234H95.8731V25.9946C95.8731 24.7742 96.7868 23.9526 98.0819 23.9526C98.3839 23.9526 98.8924 24.0084 99.0354 24.0563V22.3653C98.8526 22.3174 98.5269 22.2935 98.2726 22.2935C97.1444 22.2935 96.183 22.9157 95.9367 23.7691H95.8095V22.4371H94.1648V31.1234Z"
                  fill="white"
                />
                <path
                  d="M103.277 23.7293C104.54 23.7293 105.367 24.6146 105.406 25.9786H101.036C101.132 24.6226 102.014 23.7293 103.277 23.7293ZM105.398 28.7783C105.081 29.4563 104.373 29.8312 103.341 29.8312C101.974 29.8312 101.092 28.8661 101.036 27.3426V27.2469H107.146V26.6486C107.146 23.9207 105.692 22.2696 103.285 22.2696C100.846 22.2696 99.2963 24.0324 99.2963 26.8082C99.2963 29.5839 100.814 31.2909 103.293 31.2909C105.271 31.2909 106.654 30.3337 107.043 28.7783H105.398Z"
                  fill="white"
                />
                <path
                  d="M69.1399 27.9157C69.2716 30.0486 71.0422 31.4128 73.6774 31.4128C76.4939 31.4128 78.2562 29.9825 78.2562 27.7007C78.2562 25.9067 77.2515 24.9146 74.8139 24.3442L73.5045 24.0218C71.9563 23.658 71.3304 23.1702 71.3304 22.3187C71.3304 21.2439 72.3022 20.5412 73.7598 20.5412C75.1433 20.5412 76.0986 21.2274 76.2715 22.327H78.0668C77.9597 20.318 76.1974 18.9043 73.7845 18.9043C71.1904 18.9043 69.461 20.318 69.461 22.4427C69.461 24.1954 70.441 25.2371 72.5904 25.7414L74.1221 26.1134C75.6951 26.4854 76.3868 27.0311 76.3868 27.9405C76.3868 28.9987 75.2998 29.7676 73.8174 29.7676C72.2281 29.7676 71.1245 29.0483 70.9681 27.9157H69.1399Z"
                  fill="white"
                />
                <path
                  d="M51.444 22.2935C50.2681 22.2935 49.2511 22.8838 48.7267 23.8728H48.5996V22.4371H46.9549V34.0109H48.6631V29.8073H48.7982C49.2511 30.7246 50.2284 31.267 51.4599 31.267C53.6449 31.267 55.0353 29.5361 55.0353 26.7762C55.0353 24.0164 53.6449 22.2935 51.444 22.2935ZM50.9593 29.7275C49.5292 29.7275 48.6313 28.5949 48.6313 26.7842C48.6313 24.9656 49.5292 23.833 50.9673 23.833C52.4134 23.833 53.2794 24.9417 53.2794 26.7762C53.2794 28.6188 52.4134 29.7275 50.9593 29.7275Z"
                  fill="white"
                />
                <path
                  d="M61.0128 22.2935C59.8369 22.2935 58.8199 22.8838 58.2955 23.8728H58.1684V22.4371H56.5237V34.0109H58.2319V29.8073H58.367C58.8199 30.7246 59.7972 31.267 61.0287 31.267C63.2137 31.267 64.6041 29.5361 64.6041 26.7762C64.6041 24.0164 63.2137 22.2935 61.0128 22.2935ZM60.5282 29.7275C59.098 29.7275 58.2001 28.5949 58.2001 26.7842C58.2001 24.9656 59.098 23.833 60.5361 23.833C61.9822 23.833 62.8482 24.9417 62.8482 26.7762C62.8482 28.6188 61.9822 29.7275 60.5282 29.7275Z"
                  fill="white"
                />
                <path
                  d="M43.8899 31.1234H45.8499L41.5594 19.1937H39.5747L35.2842 31.1234H37.1783L38.2735 27.957H42.8029L43.8899 31.1234ZM40.4723 21.3597H40.6123L42.3335 26.4028H38.743L40.4723 21.3597Z"
                  fill="white"
                />
                <path
                  d="M35.2383 10.7789V15.4944H36.9342C38.3339 15.4944 39.1445 14.6284 39.1445 13.1219C39.1445 11.6383 38.3274 10.7789 36.9342 10.7789H35.2383ZM35.9674 11.4455H36.8528C37.8261 11.4455 38.4023 12.0664 38.4023 13.1318C38.4023 14.2134 37.8359 14.8278 36.8528 14.8278H35.9674V11.4455Z"
                  fill="white"
                />
                <path
                  d="M41.6268 15.563C42.662 15.563 43.2967 14.867 43.2967 13.7134C43.2967 12.5664 42.6587 11.8671 41.6268 11.8671C40.5917 11.8671 39.9537 12.5664 39.9537 13.7134C39.9537 14.867 40.5885 15.563 41.6268 15.563ZM41.6268 14.9389C41.0181 14.9389 40.6763 14.4912 40.6763 13.7134C40.6763 12.9422 41.0181 12.4913 41.6268 12.4913C42.2323 12.4913 42.5774 12.9422 42.5774 13.7134C42.5774 14.4879 42.2323 14.9389 41.6268 14.9389Z"
                  fill="white"
                />
                <path
                  d="M48.7022 11.9357H48.0024L47.3709 14.6513H47.3156L46.5864 11.9357H45.9158L45.1867 14.6513H45.1346L44.4998 11.9357H43.7902L44.7668 15.4944H45.4862L46.2153 12.8736H46.2706L47.0031 15.4944H47.729L48.7022 11.9357Z"
                  fill="white"
                />
                <path
                  d="M49.5082 15.4944H50.2081V13.4128C50.2081 12.8573 50.5369 12.5109 51.0544 12.5109C51.572 12.5109 51.8194 12.7952 51.8194 13.367V15.4944H52.5192V13.1906C52.5192 12.3442 52.0831 11.8671 51.292 11.8671C50.7582 11.8671 50.4066 12.1056 50.2341 12.5011H50.182V11.9357H49.5082V15.4944Z"
                  fill="white"
                />
                <path
                  d="M53.6214 15.4944H54.3213V10.5469H53.6214V15.4944Z"
                  fill="white"
                />
                <path
                  d="M56.9534 15.563C57.9886 15.563 58.6233 14.867 58.6233 13.7134C58.6233 12.5664 57.9853 11.8671 56.9534 11.8671C55.9183 11.8671 55.2803 12.5664 55.2803 13.7134C55.2803 14.867 55.915 15.563 56.9534 15.563ZM56.9534 14.9389C56.3447 14.9389 56.0029 14.4912 56.0029 13.7134C56.0029 12.9422 56.3447 12.4913 56.9534 12.4913C57.5589 12.4913 57.9039 12.9422 57.9039 13.7134C57.9039 14.4879 57.5589 14.9389 56.9534 14.9389Z"
                  fill="white"
                />
                <path
                  d="M60.7086 14.9618C60.3277 14.9618 60.051 14.7755 60.051 14.4552C60.051 14.1415 60.2724 13.9749 60.7606 13.9422L61.6265 13.8866V14.184C61.6265 14.6252 61.2359 14.9618 60.7086 14.9618ZM60.5295 15.5532C60.995 15.5532 61.3824 15.3506 61.594 14.9944H61.6493V15.4944H62.3231V13.0631C62.3231 12.3115 61.8218 11.8671 60.9332 11.8671C60.1291 11.8671 59.5562 12.2592 59.4846 12.8703H60.1617C60.2398 12.6187 60.51 12.4749 60.9006 12.4749C61.3791 12.4749 61.6265 12.6873 61.6265 13.0631V13.3703L60.6662 13.4259C59.8232 13.4781 59.3479 13.8474 59.3479 14.4879C59.3479 15.1382 59.8459 15.5532 60.5295 15.5532Z"
                  fill="white"
                />
                <path
                  d="M64.6981 15.5532C65.1863 15.5532 65.5998 15.3212 65.8113 14.9323H65.8667V15.4944H66.5372V10.5469H65.8374V12.5011H65.7853C65.5932 12.1089 65.1831 11.8769 64.6981 11.8769C63.8029 11.8769 63.2267 12.5893 63.2267 13.7134C63.2267 14.8408 63.7964 15.5532 64.6981 15.5532ZM64.8966 12.5076C65.4826 12.5076 65.8504 12.9749 65.8504 13.7167C65.8504 14.4618 65.4858 14.9225 64.8966 14.9225C64.3042 14.9225 63.9494 14.4683 63.9494 13.7134C63.9494 12.9651 64.3075 12.5076 64.8966 12.5076Z"
                  fill="white"
                />
                <path
                  d="M71.0756 15.563C72.1107 15.563 72.7455 14.867 72.7455 13.7134C72.7455 12.5664 72.1075 11.8671 71.0756 11.8671C70.0404 11.8671 69.4024 12.5664 69.4024 13.7134C69.4024 14.867 70.0372 15.563 71.0756 15.563ZM71.0756 14.9389C70.4669 14.9389 70.1251 14.4912 70.1251 13.7134C70.1251 12.9422 70.4669 12.4913 71.0756 12.4913C71.681 12.4913 72.0261 12.9422 72.0261 13.7134C72.0261 14.4879 71.681 14.9389 71.0756 14.9389Z"
                  fill="white"
                />
                <path
                  d="M73.6719 15.4944H74.3717V13.4128C74.3717 12.8573 74.7005 12.5109 75.2181 12.5109C75.7357 12.5109 75.983 12.7952 75.983 13.367V15.4944H76.6829V13.1906C76.6829 12.3442 76.2467 11.8671 75.4557 11.8671C74.9219 11.8671 74.5703 12.1056 74.3978 12.5011H74.3457V11.9357H73.6719V15.4944Z"
                  fill="white"
                />
                <path
                  d="M79.9062 11.0501V11.9521H79.343V12.5435H79.9062V14.5533C79.9062 15.2395 80.2154 15.514 80.9934 15.514C81.1301 15.514 81.2603 15.4977 81.3742 15.4781V14.8931C81.2766 14.9029 81.2147 14.9095 81.1073 14.9095C80.759 14.9095 80.606 14.7461 80.606 14.3735V12.5435H81.3742V11.9521H80.606V11.0501H79.9062Z"
                  fill="white"
                />
                <path
                  d="M82.3137 15.4944H83.0135V13.4161C83.0135 12.8769 83.3325 12.5141 83.9054 12.5141C84.4002 12.5141 84.6639 12.8017 84.6639 13.3703V15.4944H85.3638V13.1971C85.3638 12.3507 84.8983 11.8704 84.1431 11.8704C83.6092 11.8704 83.2349 12.1089 83.0624 12.5076H83.007V10.5469H82.3137V15.4944Z"
                  fill="white"
                />
                <path
                  d="M87.8884 12.4651C88.406 12.4651 88.7445 12.8278 88.7608 13.3866H86.9705C87.0096 12.8311 87.3709 12.4651 87.8884 12.4651ZM88.7576 14.5337C88.6274 14.8114 88.3377 14.965 87.9145 14.965C87.3546 14.965 86.9933 14.5696 86.9705 13.9454V13.9062H89.4737V13.6611C89.4737 12.5435 88.878 11.8671 87.8917 11.8671C86.8924 11.8671 86.2576 12.5893 86.2576 13.7265C86.2576 14.8637 86.8793 15.563 87.895 15.563C88.7055 15.563 89.2719 15.1709 89.4314 14.5337H88.7576Z"
                  fill="white"
                />
              </svg>

              <svg
                width="119"
                height="44"
                viewBox="0 0 119 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="118.053" height="44" rx="8" fill="#090909" />
                <g filter="url(#filter0_ii_1022_5093)">
                  <path
                    d="M11.7867 11.1414C11.5316 11.4124 11.3809 11.8331 11.3809 12.3778V31.8399C11.3809 32.3855 11.5316 32.8052 11.7867 33.0763L11.8516 33.1396L22.7115 22.2373V22.1088V21.9803L11.8516 11.0771L11.7867 11.1414Z"
                    fill="url(#paint0_linear_1022_5093)"
                  />
                  <path
                    d="M26.3323 25.8723L22.7129 22.2371V22.1086V21.9801L26.3332 18.3457L26.4147 18.3923L30.7038 20.8387C31.9284 21.5375 31.9284 22.6806 30.7038 23.3802L26.4147 25.8266L26.3323 25.8723Z"
                    fill="url(#paint1_linear_1022_5093)"
                  />
                  <g filter="url(#filter1_i_1022_5093)">
                    <path
                      d="M26.4108 25.8255L22.7081 22.1084L11.7842 33.0758C12.1874 33.5053 12.8545 33.5581 13.6057 33.1304L26.4108 25.8255Z"
                      fill="url(#paint2_linear_1022_5093)"
                    />
                  </g>
                  <path
                    d="M26.4108 18.3917L13.6057 11.0877C12.8545 10.6592 12.1874 10.7129 11.7842 11.1423L22.709 22.1097L26.4108 18.3917Z"
                    fill="url(#paint3_linear_1022_5093)"
                  />
                </g>
                <path
                  d="M59.1596 23.1737C57.2124 23.1737 55.6253 24.6541 55.6253 26.693C55.6253 28.7195 57.2124 30.2123 59.1596 30.2123C61.1077 30.2123 62.6948 28.7195 62.6948 26.693C62.6939 24.6541 61.1068 23.1737 59.1596 23.1737ZM59.1596 28.8271C58.0925 28.8271 57.1727 27.9475 57.1727 26.6938C57.1727 25.4269 58.0933 24.5606 59.1596 24.5606C60.2268 24.5606 61.1466 25.4269 61.1466 26.6938C61.1466 27.9466 60.2268 28.8271 59.1596 28.8271ZM51.4486 23.1737C49.5014 23.1737 47.9143 24.6541 47.9143 26.693C47.9143 28.7195 49.5014 30.2123 51.4486 30.2123C53.3966 30.2123 54.9837 28.7195 54.9837 26.693C54.9837 24.6541 53.3966 23.1737 51.4486 23.1737ZM51.4486 28.8271C50.3814 28.8271 49.4616 27.9475 49.4616 26.6938C49.4616 25.4269 50.3822 24.5606 51.4486 24.5606C52.5157 24.5606 53.4355 25.4269 53.4355 26.6938C53.4364 27.9466 52.5157 28.8271 51.4486 28.8271ZM42.2771 24.2544V25.7472H45.852C45.7452 26.5871 45.4653 27.2002 45.0381 27.6264C44.5182 28.146 43.7044 28.7195 42.2771 28.7195C40.0765 28.7195 38.3562 26.9462 38.3562 24.7468C38.3562 22.5473 40.0765 20.774 42.2771 20.774C43.4643 20.774 44.3311 21.2407 44.9711 21.8406L46.025 20.7873C45.1309 19.9341 43.9445 19.2813 42.2771 19.2813C39.2627 19.2813 36.7285 21.7339 36.7285 24.7468C36.7285 27.7596 39.2627 30.2123 42.2771 30.2123C43.9039 30.2123 45.1317 29.6785 46.0912 28.6789C47.0781 27.6926 47.3852 26.3057 47.3852 25.1862C47.3852 24.8403 47.3587 24.52 47.3049 24.2536L42.2771 24.2544ZM79.7876 25.4137C79.4945 24.6276 78.6004 23.1737 76.7732 23.1737C74.9593 23.1737 73.4517 24.6003 73.4517 26.693C73.4517 28.6657 74.946 30.2123 76.9462 30.2123C78.5598 30.2123 79.4937 29.2259 79.8811 28.6525L78.6807 27.8523C78.2808 28.439 77.7336 28.8254 76.9462 28.8254C76.1597 28.8254 75.5992 28.4655 75.2391 27.7588L79.9474 25.8126L79.7876 25.4137ZM74.9858 26.5871C74.946 25.2267 76.0397 24.5341 76.827 24.5341C77.4405 24.5341 77.9604 24.8411 78.1343 25.2805L74.9858 26.5871ZM71.1584 29.9996H72.7049V19.6553H71.1584V29.9996ZM68.6234 23.9607H68.5704C68.2235 23.5469 67.5562 23.1737 66.7167 23.1737C64.9558 23.1737 63.3422 24.7203 63.3422 26.7071C63.3422 28.6798 64.9558 30.2131 66.7167 30.2131C67.557 30.2131 68.2235 29.8399 68.5704 29.4137H68.6234V29.9202C68.6234 31.2665 67.9031 31.9864 66.7432 31.9864C65.7961 31.9864 65.2091 31.307 64.969 30.7336L63.622 31.2938C64.0086 32.2264 65.0352 33.3732 66.7432 33.3732C68.5571 33.3732 70.0912 32.3066 70.0912 29.7067V23.388H68.6242L68.6234 23.9607ZM66.85 28.8271C65.7828 28.8271 64.8895 27.9334 64.8895 26.7071C64.8895 25.4667 65.7828 24.5606 66.85 24.5606C67.9031 24.5606 68.7301 25.4667 68.7301 26.7071C68.7301 27.9334 67.9031 28.8271 66.85 28.8271ZM87.035 19.6553H83.3335V29.9996H84.8775V26.0807H87.0342C88.7463 26.0807 90.4302 24.8419 90.4302 22.8684C90.4302 20.8948 88.7471 19.6553 87.035 19.6553ZM87.0747 24.6408H84.8775V21.0951H87.0747C88.2297 21.0951 88.8854 22.0508 88.8854 22.8684C88.8854 23.6694 88.2297 24.6408 87.0747 24.6408ZM96.6221 23.1555C95.5036 23.1555 94.3454 23.6479 93.866 24.7393L95.237 25.3111C95.5301 24.7393 96.0765 24.5523 96.6486 24.5523C97.4475 24.5523 98.2597 25.0314 98.2729 25.8829V25.9896C97.9931 25.8299 97.3937 25.5908 96.6618 25.5908C95.184 25.5908 93.6789 26.4025 93.6789 27.9193C93.6789 29.3037 94.8909 30.1949 96.2487 30.1949C97.2869 30.1949 97.8598 29.729 98.2191 29.1829H98.2721V29.9814H99.764V26.0153C99.7648 24.1799 98.3921 23.1555 96.6221 23.1555ZM96.435 28.8246C95.93 28.8246 95.2238 28.5714 95.2238 27.9458C95.2238 27.1473 96.103 26.8411 96.8622 26.8411C97.5402 26.8411 97.8606 26.9876 98.2729 27.187C98.1529 28.1461 97.3275 28.8246 96.435 28.8246ZM105.197 23.3814L103.426 27.8664H103.373L101.535 23.3814H99.8708L102.627 29.6496L101.055 33.1366H102.667L106.915 23.3814H105.197ZM91.283 29.9996H92.827V19.6553H91.283V29.9996Z"
                  fill="white"
                />
                <path
                  d="M42.0859 13.5365C42.0859 14.2174 41.8808 14.7593 41.4697 15.164C41.0032 15.6449 40.3944 15.8854 39.6466 15.8854C38.9303 15.8854 38.3207 15.6417 37.8202 15.1542C37.319 14.6659 37.0684 14.0614 37.0684 13.3399C37.0684 12.6176 37.319 12.0131 37.8202 11.5256C38.3207 11.0373 38.9303 10.7936 39.6466 10.7936C40.0023 10.7936 40.3423 10.8618 40.6648 10.9975C40.9883 11.134 41.2472 11.3152 41.4407 11.5419L41.0048 11.9709C40.6764 11.5849 40.224 11.3924 39.6458 11.3924C39.123 11.3924 38.6714 11.5728 38.2901 11.9335C37.9087 12.2942 37.7185 12.7631 37.7185 13.3391C37.7185 13.9152 37.9087 14.384 38.2901 14.7447C38.6714 15.1055 39.123 15.2858 39.6458 15.2858C40.2 15.2858 40.6624 15.1046 41.0321 14.7415C41.272 14.505 41.4109 14.176 41.4482 13.7543H39.6458V13.1685H42.0503C42.0751 13.296 42.0859 13.4187 42.0859 13.5365Z"
                  fill="white"
                />
                <path
                  d="M45.8992 11.5005H43.6394V13.0458H45.6775V13.6316H43.6394V15.177H45.8992V15.7766H43.0016V10.9017H45.8992V11.5005Z"
                  fill="white"
                />
                <path
                  d="M48.5882 15.7766H47.9504V11.5005H46.5641V10.9017H49.9745V11.5005H48.5882V15.7766Z"
                  fill="white"
                />
                <path
                  d="M52.4419 15.7766V10.9017H53.0796V15.7766H52.4419Z"
                  fill="white"
                />
                <path
                  d="M55.9078 15.7766H55.2701V11.5005H53.8837V10.9017H57.2941V11.5005H55.9078V15.7766Z"
                  fill="white"
                />
                <path
                  d="M63.7499 15.1469C63.2619 15.6393 62.6556 15.8855 61.9302 15.8855C61.2047 15.8855 60.5984 15.6393 60.1112 15.1469C59.6232 14.6546 59.38 14.0517 59.38 13.3391C59.38 12.6266 59.6232 12.0237 60.1112 11.5314C60.5984 11.039 61.2047 10.792 61.9302 10.792C62.6514 10.792 63.2569 11.0398 63.7466 11.5346C64.2363 12.0294 64.4811 12.6307 64.4811 13.3391C64.4811 14.0517 64.2371 14.6546 63.7499 15.1469ZM60.5819 14.7382C60.9491 15.1039 61.3983 15.2859 61.9302 15.2859C62.462 15.2859 62.912 15.1031 63.2784 14.7382C63.6457 14.3726 63.8301 13.9063 63.8301 13.3391C63.8301 12.772 63.6457 12.3057 63.2784 11.94C62.912 11.5744 62.462 11.3924 61.9302 11.3924C61.3983 11.3924 60.9491 11.5752 60.5819 11.94C60.2155 12.3057 60.031 12.772 60.031 13.3391C60.031 13.9063 60.2155 14.3726 60.5819 14.7382Z"
                  fill="white"
                />
                <path
                  d="M65.3761 15.7766V10.9017H66.152L68.564 14.6936H68.5913L68.564 13.7543V10.9017H69.2017V15.7766H68.5359L66.0122 11.8003H65.9849L66.0122 12.7395V15.7766H65.3761Z"
                  fill="white"
                />
                <path
                  d="M42.0859 13.5365C42.0859 14.2174 41.8808 14.7593 41.4697 15.164C41.0032 15.6449 40.3944 15.8854 39.6466 15.8854C38.9303 15.8854 38.3207 15.6417 37.8202 15.1542C37.319 14.6659 37.0684 14.0614 37.0684 13.3399C37.0684 12.6176 37.319 12.0131 37.8202 11.5256C38.3207 11.0373 38.9303 10.7936 39.6466 10.7936C40.0023 10.7936 40.3423 10.8618 40.6648 10.9975C40.9883 11.134 41.2472 11.3152 41.4407 11.5419L41.0048 11.9709C40.6764 11.5849 40.224 11.3924 39.6458 11.3924C39.123 11.3924 38.6714 11.5728 38.2901 11.9335C37.9087 12.2942 37.7185 12.7631 37.7185 13.3391C37.7185 13.9152 37.9087 14.384 38.2901 14.7447C38.6714 15.1055 39.123 15.2858 39.6458 15.2858C40.2 15.2858 40.6624 15.1046 41.0321 14.7415C41.272 14.505 41.4109 14.176 41.4482 13.7543H39.6458V13.1685H42.0503C42.0751 13.296 42.0859 13.4187 42.0859 13.5365Z"
                  stroke="white"
                  strokeWidth="0.204511"
                  strokeMiterlimit="10"
                />
                <path
                  d="M45.8992 11.5005H43.6394V13.0458H45.6775V13.6316H43.6394V15.177H45.8992V15.7766H43.0016V10.9017H45.8992V11.5005Z"
                  stroke="white"
                  strokeWidth="0.204511"
                  strokeMiterlimit="10"
                />
                <path
                  d="M48.5882 15.7766H47.9504V11.5005H46.5641V10.9017H49.9745V11.5005H48.5882V15.7766Z"
                  stroke="white"
                  strokeWidth="0.204511"
                  strokeMiterlimit="10"
                />
                <path
                  d="M52.4419 15.7766V10.9017H53.0796V15.7766H52.4419Z"
                  stroke="white"
                  strokeWidth="0.204511"
                  strokeMiterlimit="10"
                />
                <path
                  d="M55.9078 15.7766H55.2701V11.5005H53.8837V10.9017H57.2941V11.5005H55.9078V15.7766Z"
                  stroke="white"
                  strokeWidth="0.204511"
                  strokeMiterlimit="10"
                />
                <path
                  d="M63.7499 15.1469C63.2619 15.6393 62.6556 15.8855 61.9302 15.8855C61.2047 15.8855 60.5984 15.6393 60.1112 15.1469C59.6232 14.6546 59.38 14.0517 59.38 13.3391C59.38 12.6266 59.6232 12.0237 60.1112 11.5314C60.5984 11.039 61.2047 10.792 61.9302 10.792C62.6514 10.792 63.2569 11.0398 63.7466 11.5346C64.2363 12.0294 64.4811 12.6307 64.4811 13.3391C64.4811 14.0517 64.2371 14.6546 63.7499 15.1469ZM60.5819 14.7382C60.9491 15.1039 61.3983 15.2859 61.9302 15.2859C62.462 15.2859 62.912 15.1031 63.2784 14.7382C63.6457 14.3726 63.8301 13.9063 63.8301 13.3391C63.8301 12.772 63.6457 12.3057 63.2784 11.94C62.912 11.5744 62.462 11.3924 61.9302 11.3924C61.3983 11.3924 60.9491 11.5752 60.5819 11.94C60.2155 12.3057 60.031 12.772 60.031 13.3391C60.031 13.9063 60.2155 14.3726 60.5819 14.7382Z"
                  stroke="white"
                  strokeWidth="0.204511"
                  strokeMiterlimit="10"
                />
                <path
                  d="M65.3761 15.7766V10.9017H66.152L68.564 14.6936H68.5913L68.564 13.7543V10.9017H69.2017V15.7766H68.5359L66.0122 11.8003H65.9849L66.0122 12.7395V15.7766H65.3761Z"
                  stroke="white"
                  strokeWidth="0.204511"
                  strokeMiterlimit="10"
                />
                <defs>
                  <filter
                    id="filter0_ii_1022_5093"
                    x="11.3809"
                    y="10.792"
                    width="20.2412"
                    height="22.6338"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="-0.795" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect1_innerShadow_1022_5093"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="0.795" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="effect1_innerShadow_1022_5093"
                      result="effect2_innerShadow_1022_5093"
                    />
                  </filter>
                  <filter
                    id="filter1_i_1022_5093"
                    x="11.7842"
                    y="22.1084"
                    width="14.627"
                    height="11.3174"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="BackgroundImageFix"
                      result="shape"
                    />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="-0.795" />
                    <feComposite
                      in2="hardAlpha"
                      operator="arithmetic"
                      k2="-1"
                      k3="1"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="shape"
                      result="effect1_innerShadow_1022_5093"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_1022_5093"
                    x1="21.7489"
                    y1="12.1719"
                    x2="6.98081"
                    y2="26.8825"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#00A0FF" />
                    <stop offset="0.0066" stopColor="#00A1FF" />
                    <stop offset="0.2601" stopColor="#00BEFF" />
                    <stop offset="0.5122" stopColor="#00D2FF" />
                    <stop offset="0.7604" stopColor="#00DFFF" />
                    <stop offset="1" stopColor="#00E3FF" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_1022_5093"
                    x1="32.2978"
                    y1="22.1086"
                    x2="11.0882"
                    y2="22.1086"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FFE000" />
                    <stop offset="0.4087" stopColor="#FFBD00" />
                    <stop offset="0.7754" stopColor="#FFA500" />
                    <stop offset="1" stopColor="#FF9C00" />
                  </linearGradient>
                  <linearGradient
                    id="paint2_linear_1022_5093"
                    x1="24.4"
                    y1="24.127"
                    x2="4.37266"
                    y2="44.0765"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#FF3A44" />
                    <stop offset="1" stopColor="#C31162" />
                  </linearGradient>
                  <linearGradient
                    id="paint3_linear_1022_5093"
                    x1="9.03295"
                    y1="4.66356"
                    x2="17.9757"
                    y2="13.5716"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#32A071" />
                    <stop offset="0.0685" stopColor="#2DA771" />
                    <stop offset="0.4762" stopColor="#15CF74" />
                    <stop offset="0.8009" stopColor="#06E775" />
                    <stop offset="1" stopColor="#00F076" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </GridCol>

          <GridCol span={{
            xs: 6, // شاشة صغيرة جدًا - خلي العنصر ياخد العرض كله
            sm: 6,
            md: 6, // من أول medium وأكبر، خلي العنصر ياخد نص العرض
            lg: 6,
            xl: 6,
          }} className={classes.RealGridCol}>
            <div className={classes.flexRealimage}>
              <div className={classes.Realimage}>
                <img src={mobile_2} alt="" />
              </div>
              <div className={classes.Realimagese}>
                <img src={mobile_3} alt="" />
              </div>
            </div>
          </GridCol>
        </Grid>
      </section>

      <Footer></Footer>
    </>
  );
}

export default Home;
