// Dependency imports
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Burger, Drawer, ScrollArea } from "@mantine/core";

// Local imports
import classes from "../../styles/HeaderMegaMenu.module.css";
import Logo from "../../assets/header/logo-43.png";
import { HomeThemeToggle } from "../../pages/Home/HomeThemeToggle";
import { useTranslation } from "../../context/LanguageContext";

export function HeaderMegaMenu() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const hiddenLogoPages = ["/", "/about", "/privacy", "/Terms", "/ContactUs"];

  return (
    <>
      {!hiddenLogoPages.includes(location.pathname) && (
        <header className={classes.header}>
          <div className={classes.inner}>
            <div className={classes.logo}>
              <img
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
                src={Logo}
                alt="Logo"
              />
            </div>
          </div>
        </header>
      )}

      {hiddenLogoPages.includes(location.pathname) && (
        <header className={classes.header}>
          <div className={classes.inner}>
            {/* Logo Section */}
            <div className={classes.logo}>
              <img
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
                src={Logo}
                alt="Logo"
              />
            </div>

            {/* Links Section */}
            <div>
              <nav className={classes.links}>
                <Link to="/" className={classes.alinks}>
                  {t.Home}
                </Link>
                <Link to="/Terms" className={classes.alinks}>
                  {t.Terms}
                </Link>
                <Link to="/privacy" className={classes.alinks}>
                  {t.Privacy}
                </Link>
                <Link to="/about" className={classes.alinks}>
                  {t.About}
                </Link>
                <Link to="/ContactUs" className={classes.alinks}>
                  {t.ContactUs}
                </Link>
              </nav>
            </div>

            {/* Auth Buttons */}
            <div className={classes.authButtons}>
              <HomeThemeToggle />

              <button
                className={classes.SignButtons}
                onClick={() => navigate("/login")}
              >
                {t.SignIn}
              </button>
            </div>

            {/* Burger Icon for Mobile */}
            <span
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              className={classes.burger}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8H28M4 16H28M4 24H28"
                  stroke="#E3E3E3"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* Mobile Drawer Menu */}
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            padding="md"
            size="100%"
            className={classes.drawer}
            hiddenFrom="md"
          >
            <ScrollArea style={{ height: "calc(100vh - 60px)" }}>
              <nav className={classes.drawerLinks}>
                <nav className={classes.linksMobile}>
                  <Link to="/">{t.Home}</Link>
                  <Link to="/Terms">{t.Terms}</Link>
                  <Link to="/privacy">{t.Privacy}</Link>
                  <Link to="/about">{t.About}</Link>
                  <Link to="/ContactUs">{t.ContactUs}</Link>
                </nav>

                <Button
                  fullWidth
                  onClick={() => navigate("/login")}
                  mt="md"
                  variant="default"
                >
                  {t.SignIn}
                </Button>
              </nav>
            </ScrollArea>
          </Drawer>
        </header>
      )}
    </>
  );
}
// //Dependency imports
// import { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button, Burger, Drawer, ScrollArea } from "@mantine/core";

// //Local imports
// import classes from "../../styles/HeaderMegaMenu.module.css";
// import Logo from "../../assets/header/logo-43.png";
// import { HomeThemeToggle } from "../../pages/Home/HomeThemeToggle";
// import { useTranslation } from "../../context/LanguageContext";

// export function HeaderMegaMenu() {
//   const [opened, setOpened] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation(); //  تحديد الصفحة الحالية
//   location.pathname === "/", "/about", "/privacy", "/Terms", "/ContactUs";
//   const hiddenLogoPages = ["/", "/about", "/privacy", "/Terms", "/ContactUs"];
//   const { t } = useTranslation();

//   return (
//     <>
//       {!hiddenLogoPages.includes(location.pathname) && (
//         <header
//           className={classes.header}
//         >
//           {/* Drawer for laptop menu */}
//           <div className={classes.inner}>
//             {/* Logo Section */}
//             <div className={classes.logo}>
//               <img
//                 style={{
//                   cursor: "pointer",
//                 }}
//                 onClick={() => navigate("/")}
//                 src={Logo}
//                 alt=""
//               />
//             </div>
//           </div>

//         </header>
//       )}
//       {hiddenLogoPages.includes(location.pathname) && (
//         <header
//           className={classes.header}
//         >
//           {/* Drawer for laptop menu */}
//           <div className={classes.inner}>
//             {/* Logo Section */}
//             <div className={classes.logo}>
//               <img
//                 style={{
//                   cursor: "pointer",
//                 }}
//                 onClick={() => navigate("/")}
//                 src={Logo}
//                 alt=""
//               />
//             </div>

//             {/* Links Section - Hidden on mobile */}
//             <div>
//               <nav className={classes.links}>
//                 <Link
//                   to="/"
//                   className={classes.alinks}
//                 >
//                   Home
//                 </Link>
//                 <Link
//                   className={classes.alinks}
//                   to="/Terms"
//                 >
//                   Terms
//                 </Link>
//                 <Link
//                   className={classes.alinks}
//                   to="/privacy"
//                 >
//                   Privacy
//                 </Link>
//                 <Link
//                   className={classes.alinks}
//                   to="/about"
//                 >
//                   about
//                 </Link>
//                 <Link
//                   className={classes.alinks}
//                   to="/ContactUs"
//                 >
//                   ContactUs
//                 </Link>
//               </nav>
//             </div>
//             {/* Auth Buttons - Hidden on mobile */}
//             <div className={classes.authButtons}>
              
//               <HomeThemeToggle />

//               <button 
//                 className={classes.SignButtons}
//                 onClick={() => navigate("/login")}
//               >
//                 Sign In
//               </button>
//             </div>

//             {/* Burger Icon - Visible only on mobile */}
 
//             <span
//               opened={opened}
//               onClick={() => setOpened((o) => !o)}
//               className={classes.burger}
//               style={{
//                 // color: location.pathname === "/" ? "#fff" : "#000", // يتغير حسب الصفحة
//               }}
//             >
//               <svg
//                 style={{
//                   // color: location.pathname === "/" ? "#fff" : "#000", // يتغير حسب الصفحة
//                 }}
//                 width="32"
//                 height="32"
//                 viewBox="0 0 32 32"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M4 8H28M4 16H28M4 24H28"
//                   stroke="#E3E3E3"
//                   stroke-width="2.5"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                 />
//               </svg>
//             </span>
//           </div>

//           {/* Drawer for mobile menu */}
//           <Drawer
//             opened={opened}
//             onClose={() => setOpened(false)}
//             // title="Navigation"
//             padding="md"
//             size="100%"
//             className={classes.drawer}
//             hiddenFrom="md"
//           >
//             <ScrollArea style={{ height: "calc(100vh - 60px)" }}>
//               <nav className={classes.drawerLinks}>
//                 <nav className={classes.linksMobile}>
//                   <Link to="/">
//                     Home
//                   </Link>
//                   <Link to="/Terms">
//                     Terms
//                   </Link>
//                   <Link to="/privacy">
//                     Privacy
//                   </Link>
//                   <Link to="/about">
//                     about
//                   </Link>


//                 </nav> 
//                 <Button
//                   fullWidth
//                   onClick={() => navigate("/login")}
//                   mt="md"
//                   variant="default"
//                 >
//                   Sign In
//                 </Button>
//               </nav>
//             </ScrollArea>
//           </Drawer>
//         </header>
//       )}
//     </>
//   );
// }
