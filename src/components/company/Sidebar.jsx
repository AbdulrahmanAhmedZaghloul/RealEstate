//Dependency imports
import { Group, Avatar, Burger, useMantineColorScheme } from "@mantine/core";
import classes from "../../styles/sidebar.module.css";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

//Local imports
import { useAuth } from "../../context/authContext";
import axiosInstance from "../../api/config";
import Analytics from "../../assets/dashboard/analytics.svg";
import AnalyticsActive from "../../assets/dashboard/analyticsActive.svg";
import AnalyticsActiveDark from "../../assets/dashboard/AnalyticsActiveDark.svg";
import Properties from "../../assets/dashboard/properties.svg";
import PropertiesActive from "../../assets/dashboard/propertyActive.svg";
import PropertiesActiveDark from "../../assets/dashboard/PropertiesActiveDark.svg";
import Contracts from "../../assets/dashboard/contracts.svg";
import ContractsActive from "../../assets/dashboard/contractsActive.svg";
import ContractsActiveDark from "../../assets/dashboard/ContractsActiveDark.svg";
import Transactions from "../../assets/dashboard/transactions.svg";
import TransactionsActive from "../../assets/dashboard/transactionsActive.svg";
import TransactionsActiveDark from "../../assets/dashboard/TransactionsActiveDark.svg";
import Staff from "../../assets/dashboard/employees.svg";
import StaffActive from "../../assets/dashboard/empActive.svg";
import StaffActiveDark from "../../assets/dashboard/EmployeesActiveDark.svg";
import Profile from "../../assets/dashboard/profile.svg";
import ProfileActive from "../../assets/dashboard/profileActive.svg";
import ProfileActiveDark from "../../assets/dashboard/ProfileActiveDark.svg";

import Logout from "../../assets/dashboard/logout.svg";
import { useTranslation } from "../../context/LanguageContext";

export default function Sidebar() {
  const location = useLocation();
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // const [opened, setOpened] = useState(false); // Add state for burger menu
  const { t, lang } = useTranslation();
  const { colorScheme } = useMantineColorScheme();
  console.log(colorScheme);
  useEffect(() => {
    const fetchUserData = async () => {
      await axiosInstance
        .get("company/profile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setProfile({
            name: response.data.data.user.name,
            email: response.data.data.user.email,
            image: response.data.data.user.company.picture_url,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
    fetchUserData();
  }, []);

  const [active, setActive] = useState();

  useEffect(() => {
    setActive(
      location.pathname.split("/")[2] === "employee" ||
        location.pathname.split("/")[2] === "supervisor"
        ? "Staff"
        : location.pathname.split("/")[2] === undefined
          ? "Profile"
          : location.pathname.split("/")[2]
    );
  }, [location.pathname.split("/")[2]]);

  const navlist = [
    {
      link: "/dashboard/Analytics",
      label: t["Analytics"],
      icon: (
        <img
          src={
            active === "Analytics" && colorScheme === "light"
              ? AnalyticsActive
              : active === "Analytics" && colorScheme === "dark"
                ? AnalyticsActiveDark
                : Analytics
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },
    {
      link: "/dashboard/Properties",
      label: t["Properties"],
      // label: "Properties",
      icon: (
        <img
          src={
            active === "Properties" && colorScheme === "light"
              ? PropertiesActive
              : active === "Properties" && colorScheme === "dark"
                ? PropertiesActiveDark
                : Properties
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },
    {
      link: "/dashboard/Transactions",
      label: t["Transactions"],
      // label: "Transactions",
      icon: (
        <img
          src={
            active === "Transactions" && colorScheme === "light"
              ? TransactionsActive
              : active === "Transactions" && colorScheme === "dark"
                ? TransactionsActiveDark
                : Transactions
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },

    {
      link: "/dashboard/Team",
      label: t["Team"],
      // label: "Team",
      icon: (
        <img
          src={
            active === "Team" && colorScheme === "light"
              ? StaffActive
              : active === "Team" && colorScheme === "dark"
                ? StaffActiveDark
                : Staff
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },



    {
      link: "/dashboard/Chat",
      label: t["Chat"],
      // label: "Profile",
      icon: (
        <img
          src={
            active === "Chat" && colorScheme === "light"
              ? ProfileActive
              : active === "Chat" && colorScheme === "dark"
                ? ProfileActiveDark
                : Profile
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },




    
    {
      link: "/dashboard/ClientRequests",
      label: t["ClientRequests"],
      // label: "Profile",
      icon: (
        <img
          src={
            active === "ClientRequests" && colorScheme === "light"
              ? ProfileActive
              : active === "ClientRequests" && colorScheme === "dark"
                ? ProfileActiveDark
                : Profile
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },



    {
      link: "/dashboard/Contracts",
      label: t["Contracts"],
      // label: "Contracts",
      icon: (
        <img
          src={
            active === "Contracts" && colorScheme === "light"
              ? ContractsActive
              : active === "Contracts" && colorScheme === "dark"
                ? ContractsActiveDark
                : Contracts
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },

    {
      link: "/dashboard",
      label: t["Profile"],
      // label: "Profile",
      icon: (
        <img
          src={
            active === "Profile" && colorScheme === "light"
              ? ProfileActive
              : active === "Profile" && colorScheme === "dark"
                ? ProfileActiveDark
                : Profile
          }
          className={classes.linkIcon}
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
        />
      ),
    },



  ];

  const links = navlist.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
      style={{
        transition: "background-color 0.2s ease",
      }}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  ));
  return (
    <nav className={classes.navbar}>
      <div>
        <Group className={classes.profile}>
          <Avatar
            className={classes.avatar}
            src={profile.image}
            radius="xl"
            bg="var(--color-3)"
            color="white"
            onClick={() => navigate("/dashboard")}
          >
            {profile.name?.slice(0, 2)}
          </Avatar>

          <div
            className={classes.profileContainer}
            onClick={() => navigate("/dashboard")}
          >
            <span  className={classes.profileName}>
              {profile.name}
            </span>
          
          </div>
        </Group>

        <div   className={classes.linksContainer}>
          {links}
        </div>
      </div>

      <div className={classes.footer}>
        <Link
          to="/"
          className={classes.link}
          onClick={() => {
            logout();
          }}
        >
          <img
            style={{
              [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
            }}
            className={classes.linkIcon}
            src={Logout}
          />
          <span>{t.Logout}</span>
        </Link>
      </div>
    </nav>
  );
}
