import React, { useState, useEffect } from "react";
import classes from "../../styles/EmployeeDetails.module.css";
import axiosInstance, { apiUrl } from "../../api/config";
// import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useMediaQuery } from "@mantine/hooks";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { Grid, useMantineColorScheme } from "@mantine/core";
import { ThemeToggle } from "../../Settings/ThemeToggle";
import { useTranslation } from "../../context/LanguageContext";
import ContractsSupervisor from "./ContractsSupervisor";

function ProfileSupervisor() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  // const { id } = useParams();
  const { user } = useAuth();
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);

  const { colorScheme } = useMantineColorScheme();
  const { t, } = useTranslation(); // 👈 استدعاء اللغة


  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/v1/supervisors`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setProfile(response.data.data.supervisor);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        backgroundColor: "#FFF",

      }}
      className={classes.container}
    >
      <div className={classes.mainThemeToggle}>
        <BurgerButton />
        <span
          style={{

          }}
          className={classes.title}
        >
              {profile.position}
        </span>

        <div className={classes.ThemeToggle}>
          <ThemeToggle></ThemeToggle>

          <Notifications />
        </div>
      </div>

      <div className={classes.profile}>
        <div className={classes.profileImage}>
          <img src={`${profile.picture_url}`} alt="Profile" />
          <div className={classes.profileInfo}>
            <h2
              style={{
              }}
            >
              {profile.name}
            </h2>
            <p
              style={{
              }}
            >
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      <div className={classes.personalInfo}>
        <div>
          <h3
            style={{
            }}
          >
            {t.PersonalInfo}
          </h3>
        </div>
        <Grid>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.FullName}
            </h2>
            {/* <br /> */}
            <h3
              style={{
              }}
            >

              {profile.name}
            </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.Position}
            </h2>
            <h3
              style={{
              }}
            >
              {profile.position}
            </h3>
          </Grid.Col>
 

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.Phone}
            </h2>
            <h3
              style={{
              }}
            >

              {profile.phone_number}
            </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.address}
            </h2>
            <h3
              style={{
              }}
            >
              {profile.address}
            </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.CreatedAt}
            </h2>
            <h3
              style={{
              }}
            >
              {new Date(profile.created_at).toLocaleDateString("en-GB")}
            </h3>
          </Grid.Col>
          {console.log(profile)}
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.Noofemployees}
            </h2>
            <h3
              style={{
              }}
            >
               {profile?.employees?.length} 
            </h3> 
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.Status}
            </h2>
            <h3
              style={{
              }}
              className={classes.active}
            >
              {" "}
              {profile.status}{" "}
            </h3>
          </Grid.Col>
        </Grid>
      </div>
      <ContractsSupervisor/>
    </div>
  );
}

export default ProfileSupervisor;
