import React, { useState, useEffect, useContext } from "react";
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
import { EmployeeContext } from "../../context/EmployeeContext";

function ProfileSupervisor() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  // const { id } = useParams();
  const { user } = useAuth();
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);

  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(); // 👈 استدعاء اللغة
  const { employeeId, setEmployeeId } = useContext(EmployeeContext);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`supervisors`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(response?.data?.data?.supervisor.supervisor_id);
      setEmployeeId(response?.data?.data?.supervisor?.supervisor_id);
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
        backgroundColor: "var(--color-5)",
      }}
      className={classes.container}
    >
      <div className={classes.mainThemeToggle}>
        <BurgerButton />
        <span  className={classes.title}>
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
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
          </div>
        </div>
      </div>

      <div className={classes.personalInfo}>
        <div>
          <h3>{t.PersonalInfo}</h3>
        </div>
        <Grid>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.FullName}</h2>
      
            <h3 >{profile.name}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Position}</h2>
            <h3 >{profile.position}</h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Phone}</h2>
            <h3 >{profile.phone_number}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.address}</h2>
            <h3 >{profile.address}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.CreatedAt}</h2>
            <h3 >
              {new Date(profile.created_at).toLocaleDateString("en-GB")}
            </h3>
          </Grid.Col>
          {console.log(profile)}
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Noofemployees}</h2>
            <h3 >{profile?.employees?.length}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Status}</h2>
            <h3  className={classes.active}>
              
              {profile.status} 
            </h3>
          </Grid.Col>
        </Grid>
      </div>
      <ContractsSupervisor />
    </div>
  );
}

export default ProfileSupervisor;
