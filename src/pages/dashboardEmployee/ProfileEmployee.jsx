import React, { useState, useEffect, useContext } from "react";
import classes from "../../styles/EmployeeDetails.module.css";
import axiosInstance, { apiUrl } from "../../api/config";
import { useAuth } from "../../context/authContext";
import {
  Center,
  Grid,
  Loader,
  Overlay,
  useMantineColorScheme,
} from "@mantine/core";
import { Menu } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EditEmployeeProfile from "../../components/modals/editEmployeeProfile";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { BurgerButton } from "../../components/buttons/burgerButton";
import Notifications from "../../components/Notifications/Notifications";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "../../context/LanguageContext";
import { ThemeToggle } from "../../Settings/ThemeToggle";
import { EmployeeContext } from "../../context/EmployeeContext";
import EmployeeAnalytics from "../../components/company/Kpi/EmployeeAnalytics";
import YearlyPerformance from "../../components/company/Kpi/YearlyPerformance";
import AnalyticsEmployeeDetails from "../../components/company/Kpi/AnalyticsEmployeeDetails";

function ProfileEmployee() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [kpiData, setKpiData] = useState({});
  const { user } = useAuth();
  const { colorScheme } = useMantineColorScheme();

  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const { t } = useTranslation(); // 👈 استدعاء اللغة
  const { employeeId, setEmployeeId } = useContext(EmployeeContext);
  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`employees`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      // console.log(response.data.data.employee.employee_id)
      setEmployee(response.data.data.employee);
      setEmployeeId(response?.data?.data?.employee?.employee_id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataKPIs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `kpi/employee/${employee.employee_id}/performance`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const apiData = response.data.data;

      // Map API data to state
      setKpiData(apiData);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEmployee();
  }, []);
  useEffect(() => {
    employee && fetchDataKPIs();
  }, [employee]);

  const performanceData = [
    {
      label: "Total Rental",
      value: kpiData?.performance_metrics?.rentals?.total_amount,
    },
    {
      label: "Avg Rental",
      value:
        kpiData?.performance_metrics?.rentals?.total_amount /
        kpiData?.performance_metrics?.rentals?.count,
    },
    {
      label: "Total Selling",
      value: kpiData?.performance_metrics?.sales?.total_amount,
    },
    {
      label: "Avg Selling",
      value:
        kpiData?.performance_metrics?.sales?.total_amount /
        kpiData?.performance_metrics?.sales?.count,
    },
    {
      label: "Total Contract",
      value:
        kpiData?.performance_metrics?.rentals?.total_amount +
        kpiData?.performance_metrics?.sales?.total_amount,
    },
    {
      label: "Avg Contract",
      value:
        (kpiData?.performance_metrics?.rentals?.total_amount +
          kpiData?.performance_metrics?.sales?.total_amount) /
        2,
    },
    {
      label: "Total Commissions",
      value: kpiData?.performance_metrics?.commissions,
    },
    {
      label: "Avg Commissions",
      value:
        kpiData?.performance_metrics?.commissions /
        kpiData?.performance_metrics?.contracts.length,
    },
  ];

  if (loading) {
    return (
      <>
        <Center
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <Loader size="xl" />
        </Center>
      </>
    );
  }

  if (!employee) {
    return (
      <Center>
        <span>Employee does not exist.</span>
      </Center>
    );
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
        <span className={classes.title}>
          {t.profile}
        </span>

        <div className={classes.ThemeToggle}>
          <ThemeToggle></ThemeToggle>

          <Notifications />
        </div>
      </div>
      <div className={classes.profile}>
        <div className={classes.profileImage}>
          <img src={`${employee.picture_url}`} alt="Profile" />
          <div className={classes.profileInfo}>
            <h2>{employee.name}</h2>
            <p>{employee.email}</p>
          </div>
        </div>
      </div>

      <div className={classes.personalInfo}>
        <div>
          <h3 >{t.PersonalInfo}</h3>
        </div>
        <Grid>
          {console.log(employee)}
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.FullName}</h2>
            {/* <br /> */}
            <h3 >{employee.name}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Position}</h2>
            <h3 >{employee.position}</h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Supervisor}</h2>
            <h3 >{employee.supervisor.name}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Phone}</h2>
            <h3 >{employee.phone_number}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.CreatedAt}</h2>
            <h3 >
              {new Date(employee.created_at).toLocaleDateString("en-GB")}
            </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.address}</h2>
            <h3 >{employee.address}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 >{t.Status}</h2>
            <h3 className={classes.active}>
              {" "}
              {employee.status}{" "}
            </h3>
          </Grid.Col>
        </Grid>
      </div>

      <AnalyticsEmployeeDetails employee_id={employee.employee_id} />


      <YearlyPerformance employee_id={employee?.employee_id} />
 
    </div>
  );
}

export default ProfileEmployee;
