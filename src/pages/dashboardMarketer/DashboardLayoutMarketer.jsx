import { AppShell, Burger, useMantineColorScheme } from "@mantine/core";
import SidebarMarketer from "../../components/Marketer/SidebarMarketer";
import { Outlet } from "react-router-dom";
import classes from "../../styles/dashboardLayout.module.css";
import { useSidebar } from "../../context/sidebarContext";
import { useTranslation } from "../../context/LanguageContext";


export default function DashboardLayoutMarketer() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { colorScheme } = useMantineColorScheme();

  const { lang } = useTranslation(); // 👈 استدعاء اللغة

  return (
    <AppShell
      layout="alt" // optional, makes the sidebar sticky
      padding="20px"

    >
      {!sidebarOpen ? (
        <AppShell.Navbar visibleFrom="md" >
          <SidebarMarketer />
        </AppShell.Navbar>
      ) : (
        <AppShell.Navbar>
          <SidebarMarketer />
        </AppShell.Navbar>
      )}

      <AppShell.Main
        className={classes.mainContent}
        onClick={() => setSidebarOpen(false)}
        style={{
          [lang === "ar" ? "marginRight" : "marginLeft"]: "290px", // ✅ شرط اللغة
          boxShadow: sidebarOpen
            ? "0px 4px 15px rgba(0, 0, 0, 0.2)" // Shadow effect when sidebar is open
            : "none", // No shadow when sidebar is closed
          transition: "box-shadow 0.3s ease-in-out", // Smooth transition for shadow
          backgroundColor: "var(--color-6)",
        }}
      >
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
