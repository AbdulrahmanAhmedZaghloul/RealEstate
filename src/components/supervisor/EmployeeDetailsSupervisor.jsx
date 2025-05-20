//Dependency imports
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Center, Grid, Loader, useMantineColorScheme } from "@mantine/core";
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

//Local imports
import classes from "../../styles/EmployeeDetails.module.css";
import axiosInstance, { apiUrl } from "../../api/config";
import { useAuth } from "../../context/authContext";
import EmployeeProperties from "../company/EmployeeProperties";
import { BurgerButton } from "../buttons/burgerButton";
import Notifications from "../company/Notifications";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "../../context/LanguageContext";

function EmployeeDetailsSupervisor() {
  const [employee, setEmployee] = useState(null);
  const [employeeListings, setEmployeeListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpiData, setKpiData] = useState({});

  const { id } = useParams();
  const { user } = useAuth();
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const { colorScheme } = useMantineColorScheme();


  const { t } = useTranslation(); // 👈 استدعاء اللغة

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setEmployee(response.data.data.employee);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeListings = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/listings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const filteredListings = response.data.data.listings.filter(
        (listing) => listing.employee_id === parseInt(id)
      );
      setEmployeeListings(filteredListings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // const isSmallScreen = useMediaQuery("(min-width: 1025px)");

  const fetchDataKPIs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/kpi/employee/${id}/performance`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const apiData = response.data.data;

      // Map API data to state
      console.log(apiData);
      setKpiData(apiData);
      // setData({
      //   timeFrame: apiData.time_frame,
      //   period: apiData.period,
      //   employeeStats: apiData.employee_stats,
      //   rankings: apiData.rankings,
      //   periodTotals: apiData.period_totals,
      //   trends: apiData.trends,
      // });
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
    fetchEmployeeListings();
    fetchDataKPIs();
  }, []);

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
        backgroundColor: "#fff",

      }}
      className={classes.container}
    >
      <div className={classes.header}>
        <BurgerButton />
        <span
          style={{
            // fontSize: isSmallScreen ? "24px" : "16px",
          }}
          className={classes.employePosition}
        >
          {t.Employee}
        </span>
        <Notifications />
      </div>

      <div className={classes.profile}>
        <div className={classes.profileImage}>
          <img src={`${employee.picture_url}`} alt="Profile" />
          <div className={classes.profileInfo}>
            <h2 
            >
              {employee.name}{" "}
            </h2>
            <p
              style={{
                // fontSize: isSmallScreen ? "20px" : "16px",
              }}
            >
              {employee.email}
            </p>
          </div>
        </div>
      </div>

      <div className={classes.personalInfo}>
        <div>
          <h3
            style={{
              // fontSize: isSmallScreen ? "20px" : "16px",
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
              
              {employee.name}
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
              {employee.position}
            </h3>
          </Grid.Col>
        
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.Supervisor}
            </h2>
            <h3
              style={{
              }}
            >
              {employee.supervisor.name}
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
              {" "}
              {employee.phone_number}{" "}
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
              {new Date(employee.created_at).toLocaleDateString("en-GB")}
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
              {employee.address}
            </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.Status}
            </h2>
            <h3 className={classes.active}> {employee.status} </h3>
          </Grid.Col>
        </Grid>
      </div>

      <div className={classes.summary}>
        <div className={classes.card}>
          <div
            style={{
            }}
            className={classes.cardTitle}
          >
            {t.Selling}
          </div>
          <div
            style={{
            }}
            className={classes.cardCount}
          >
            {kpiData?.performance_metrics?.sales?.count}
          </div>
          <div
            style={{
            }}
            className={classes.cardRevenue}
          >
            <span className="icon-saudi_riyal">&#xea; </span>
            {kpiData?.performance_metrics?.sales?.total_amount.toLocaleString(
              "en-GB"
            )}
          </div>
        </div>
        <div className={classes.card}>
          <div
            style={{
            }}
            className={classes.cardTitle}
          >
            {t.Renting}
          </div>
          <div
            style={{
            }}
            className={classes.cardCount}
          >
            {kpiData?.performance_metrics?.rentals?.count}
          </div>
          <div
            style={{
            }}
            className={classes.cardRevenue}
          >
            <span className="icon-saudi_riyal">&#xea; </span>
            {kpiData?.performance_metrics?.rentals?.total_amount.toLocaleString(
              "en-GB"
            )}
          </div>
        </div>
        <div className={classes.card}>
          <div
            style={{
            }}
            className={classes.cardTitle}
          >
            {t.Contracts}
          </div>
          <div
            style={{
            }}
            className={classes.cardCount}
          >
            {kpiData?.performance_metrics?.contracts.length}
          </div>
          <div
            style={{
            }}
            className={classes.cardRevenue}
          >
            <span className="icon-saudi_riyal">&#xea; </span>
            {kpiData?.performance_metrics?.contracts
              .reduce(
                (total, contract) => total + parseFloat(contract.price),
                0
              )
              .toLocaleString("en-GB")}
          </div>
        </div>
      </div>

      <div className={classes.chart}>
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>
          {t.YearlyPerformance} <br />
        </span>
        <span style={{ fontSize: 14, color: "#666" }}>
          {kpiData?.period?.start_date} – {kpiData?.period?.end_date} <br />
          <br />
        </span>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              interval={0} // force show all ticks
              tick={({ x, y, payload }) => {
                const [line1, line2] = payload.value.split(" ");
                return (
                  <g transform={`translate(${x},${y + 10})`}>
                    <text textAnchor="middle" fontSize={12} fill="#666">
                      <tspan x={0} dy="0">
                        {line1}
                      </tspan>
                      <tspan x={0} dy="16">
                        {line2}
                      </tspan>
                    </text>
                  </g>
                );
              }}
            />
            <YAxis width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      
    </div>
  );
}

export default EmployeeDetailsSupervisor;
