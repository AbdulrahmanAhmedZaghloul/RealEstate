//Dependency imports
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Burger, Drawer, ScrollArea } from "@mantine/core";

//Local imports
import classes from "../../styles/HeaderMegaMenu.module.css";
import Logo from "../../assets/header/logo-43.png";
import { HomeThemeToggle } from "../../pages/Home/HomeThemeToggle";
import { useTranslation } from "../../context/LanguageContext"; 

export function HeaderMegaMenu() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); //  تحديد الصفحة الحالية
  location.pathname === "/";
  const hiddenLogoPages = ["/", "/about", "/privacy", "/Terms"];
  const { t } = useTranslation();

  return (
    <>
      {!hiddenLogoPages.includes(location.pathname) && (
        <div className={classes.logo}>
          <img
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
            src={Logo}
            alt=""
          />
        </div>
      )}
      {hiddenLogoPages.includes(location.pathname) && (
        <header 
          className={classes.header}
        >
          {/* Drawer for laptop menu */}
          <div className={classes.inner}>
            {/* Logo Section */}
            <div className={classes.logo}>
              <img
                style={{
                  cursor: "pointer",
                }}
                onClick={() => navigate("/")}
                src={Logo}
                alt=""
              />
            </div>

            {/* Links Section - Hidden on mobile */}
            <div>
              <nav className={classes.links}>
                <Link
                  to="/"
                  className={classes.alinks}
                >
                  Home
                </Link>
                <Link
                  className={classes.alinks}
                  to="/Terms"
                >
                  Terms
                </Link>
                <Link
                  className={classes.alinks}
                  to="/privacy"
                >
                  Privacy
                </Link>
                <Link
                  className={classes.alinks}
                  to="/about"
                >
                  about
                </Link>
                <Link
                  className={classes.alinks}
                  to="/ContactUs"
                >
                  ContactUs
                </Link>
              </nav>
            </div>
            {/* Auth Buttons - Hidden on mobile */}
            <div className={classes.authButtons}>
              {location.pathname === "/" ? null : (
                <Button
                  className={classes.GetButtons}
                  onClick={() => navigate("/StartAccount")}
                >
                  Get Started
                </Button>
              )}
              <HomeThemeToggle />

              <button
                // style={{
                //   color: location.pathname === "/" ? "#fff" : "var(--color-1)",
                //   border:
                //     location.pathname === "/"
                //       ? "1px solid #fff"
                //       : "1px solid var(--color-1)",
                // }}
                className={classes.SignButtons}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

            {/* Burger Icon - Visible only on mobile */}

            {/* <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            className={classes.burger}
            size="md"
            style={{
              color: location.pathname === "/" ? "#fff" : "#000", // يتغير حسب الصفحة
            }}
          /> */}
            <span
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              className={classes.burger}
              style={{
                // color: location.pathname === "/" ? "#fff" : "#000", // يتغير حسب الصفحة
              }}
            >
              <svg
                style={{
                  // color: location.pathname === "/" ? "#fff" : "#000", // يتغير حسب الصفحة
                }}
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8H28M4 16H28M4 24H28"
                  stroke="#E3E3E3"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>

          {/* Drawer for mobile menu */}
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            // title="Navigation"
            padding="md"
            size="100%"
            className={classes.drawer}
            hiddenFrom="md"
          >
            <ScrollArea style={{ height: "calc(100vh - 60px)" }}>
              <nav className={classes.drawerLinks}>
                <nav className={classes.linksMobile}>
                  <Link style={{}} to="/">
                    Home
                  </Link>
                  <Link style={{}} to="/Terms">
                    Terms
                  </Link>
                  <Link style={{}} to="/privacy">
                    Privacy
                  </Link>
                  <Link style={{}} to="/about">
                    about
                  </Link>


                </nav>
                <Button
                  fullWidth
                  onClick={() => navigate("/StartAccount")}
                  mt="sm"
                >
                  Get Started
                </Button>
                <Button
                  fullWidth
                  onClick={() => navigate("/login")}
                  mt="md"
                  variant="default"
                >
                  Sign In
                </Button>
              </nav>
            </ScrollArea>
          </Drawer>
        </header>
      )}
    </>
  );
}
