//Dependency imports
import { Group, Avatar, useMantineColorScheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

//Local imports
import { useAuth } from "../../context/authContext";
import axiosInstance, { apiUrl } from "../../api/config";
import classes from "../../styles/sidebar.module.css";
import Properties from "../../assets/dashboard/properties.svg";
import PropertiesActive from "../../assets/dashboard/propertyActive.svg";
import Transactions from "../../assets/dashboard/transactions.svg";
import TransactionsActive from "../../assets/dashboard/transactionsActive.svg";
import Staff from "../../assets/dashboard/employees.svg";
import StaffActive from "../../assets/dashboard/empActive.svg";
import Contracts from "../../assets/dashboard/contracts.svg";
import ContractsActive from "../../assets/dashboard/contractsActive.svg";
import Profile from "../../assets/dashboard/profile.svg";
import ProfileActive from "../../assets/dashboard/profileActive.svg";
import Logout from "../../assets/dashboard/logout.svg";
import { useTranslation } from "../../context/LanguageContext";

export default function SidebarSupervisor() {
  const location = useLocation();
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, lang } = useTranslation();
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    const fetchUserData = async () => {
      await axiosInstance
        .get("api/v1/supervisors", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((response) => {
          setProfile(response.data.data.supervisor);
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
      link: "/dashboard-supervisor/Properties",
      label: t["Properties"],
      icon: (
        <img style={{
          [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
        }}
          src={active === "Properties" ? PropertiesActive : Properties}
          className={classes.linkIcon}
        />
      ),
    },
    {
      link: "/dashboard-supervisor/Requests",
      label: t["Requests"],
      icon: (
        <img
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
          src={active === "Requests" ? TransactionsActive : Transactions}
          className={classes.linkIcon}
        />
      ),
    },
    {
      link: "/dashboard-supervisor/Team",
      label: t["Team"],
      icon: (
        <img
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
          src={active === "Team" ? StaffActive : Staff}
          className={classes.linkIcon}
        />
      ),
    },
    {
      link: "/dashboard-supervisor/Contracts",
      label: t["Contracts"],
      icon: (
        <img
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
          src={active === "Contracts" ? ContractsActive : Contracts}
          className={classes.linkIcon}
        />
      ),
    },

    {
      link: "/dashboard-supervisor",
      label: t["Profile"],
      icon: (
        <img
          style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }}
          src={active === "Profile" ? ProfileActive : Profile}
          className={classes.linkIcon}
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
    <nav style={{

      backgroundColor: "var(--color-5)",

    }} className={classes.navbar}>
      <div>
        <Group className={classes.profile}>
          <Avatar
            className={classes.avatar}
            src={`${profile.picture_url}`}
            radius="xl"
            bg="var(--color-3)"
            color="white"
            onClick={() => navigate("/dashboard-supervisor")}
          >
            {profile.name?.slice(0, 2)}
          </Avatar>
          <div
            className={classes.profileContainer}
            onClick={() => navigate("/dashboard-supervisor")}
          >
            <span style={{
            }} className={classes.profileName}>{profile.name}</span>
            <span style={{
            }} className={classes.profileEmail}>{profile.email}</span>
          </div>
        </Group>

        <div className={classes.linksContainer}>{links}</div>
      </div>

      <div className={classes.footer}>
        <Link
          to="/"
          className={classes.link}
          onClick={() => {
            logout();
          }}
        >
          <img style={{
            [lang === "en" ? "marginRight" : "marginLeft"]: "12px", // ✅ شرط اللغة
          }} className={classes.linkIcon} src={Logout} />
          <span
          >{t.Logout}</span>
        </Link>
      </div>
    </nav>
  );
}
