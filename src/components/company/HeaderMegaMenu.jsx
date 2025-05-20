//Dependency imports
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Burger, Drawer, ScrollArea } from "@mantine/core";

//Local imports
import classes from "../../styles/HeaderMegaMenu.module.css";
import Logo from "../../assets/header/logo-43.png";

export function HeaderMegaMenu() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); //  تحديد الصفحة الحالية
  location.pathname === "/"

  return (
    <header style={{
      backgroundColor: location.pathname === "/" ? "#000" : "#fff",
      borderBottom: location.pathname === "/" ? "none" : "1px solid #eee",
      color: location.pathname === "/" ? "#fff" : "#5e5e5e"

    }} className={classes.header}>
      {/* Drawer for laptop menu */}
      <div className={classes.inner}>
        {/* Logo Section */}
        <div className={classes.logo}>
          <img src={Logo} alt="" />
        </div>

        {/* Links Section - Hidden on mobile */}
        <div>
          <nav className={classes.links}>
            <Link style={{
              color: location.pathname === "/" ? "#fff" : "#5e5e5e"
            }} to="/">Home</Link>
            <Link style={{
              color: location.pathname === "/" ? "#fff" : "#5e5e5e"
            }} to="/Terms">Terms</Link>
            <Link style={{
              color: location.pathname === "/" ? "#fff" : "#5e5e5e"
            }} to="/privacy">Privacy</Link>
            <Link style={{
              color: location.pathname === "/" ? "#fff" : "#5e5e5e"
            }} to="/about">about</Link>
          </nav>
        </div>
        {/* Auth Buttons - Hidden on mobile */}
        <div className={classes.authButtons}>
          {
            location.pathname === "/" ? null : <Button
              className={classes.GetButtons}
              onClick={() => navigate("/StartAccount")}
            >
              Get Started
            </Button>

          }

          <Button
            style={{
              color: location.pathname === "/" ? "#fff" : "var(--color-1)",
              border: location.pathname === "/" ? "1px solid #fff" : "1px solid var(--color-1)"
            }}
            className={classes.SignButtons}
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>

        {/* Burger Icon - Visible only on mobile */}
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          className={classes.burger}
          size="sm"
          color="#000"
        />
      </div>

      {/* Drawer for mobile menu */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        // title="Navigation"
        padding="md"
        size="100%"
        className={classes.drawer}
        hiddenFrom="sm"
      >
        <ScrollArea style={{ height: "calc(100vh - 60px)" }}>
          <nav className={classes.drawerLinks}>


            <Button fullWidth onClick={() => navigate("/StartAccount")} mt="sm">
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
  );
}
