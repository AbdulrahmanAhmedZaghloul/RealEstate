



//Dependency imports
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ActionIcon, Button, Center, Grid, Group, Loader, Modal, Text, TextInput, useMantineColorScheme } from "@mantine/core";
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
import edit from "../../assets/edit.svg";
import trash from "../../assets/trash.svg";

import { useDisclosure } from "@mantine/hooks";

//Local imports
import classes from "../../styles/EmployeeDetails.module.css";
import axiosInstance, { apiUrl } from "../../api/config";
import { useAuth } from "../../context/authContext";
import EmployeeProperties from "../company/EmployeeProperties";
import { BurgerButton } from "../buttons/burgerButton";
import Notifications from "../company/Notifications";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslation } from "../../context/LanguageContext";
import UpdataStaffModal from "../../components/modals/editStaffModal_Supervisor";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { validateField } from "../../hooks/Validation/validation";
import EditIcon from "../icons/edit";
import EmployeeAnalytics from "../company/Kpi/EmployeeAnalytics";
import YearlyPerformance from "../company/Kpi/YearlyPerformance";

function EmployeeDetailsSupervisor() {
  const [employee, setEmployee] = useState(null);
  const [employeeListings, setEmployeeListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kpiData, setKpiData] = useState({});
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  const { id } = useParams();
  const { user } = useAuth();
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();

  const [changePasswordModal, { open: openChangePasswordModal, close: closeChangePasswordModal }] = useDisclosure(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    password: "",
    employee_id: id,
  });
  console.log(id);

  const [showPassword, setShowPassword] = useState(false);


  const { t ,lang} = useTranslation(); // 👈 استدعاء اللغة


  const handleDeleteEmployee = async (id) => {
    try {
      const response = await axiosInstance.delete(`employees/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.data.status === "success") {
        notifications.show({
          title: "Deleted",
          message: response.data.message || "Employee deleted successfully",
          color: "green",
        });
        fetchEmployee()
        navigate("/dashboard-supervisor/Team"); // ✅ الانتقال بعد الحذف
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to delete employee",
        color: "red",
      });
    }
  };
  // Handle Edit Button Click
  const handleEditClick = (employee) => {
    console.log(employee);

    setEditingEmployee(employee);
    openEditModal();
  };

  // Handle Update Success
  const handleUpdateSuccess = () => {
    fetchEmployee(); // Refresh the employee list
  };

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`employees/${id}`, {
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
      const response = await axiosInstance.get(`listings/cursor`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log(response);

      const filteredListings = response.data.data.listings.filter(
        (listing) => listing.employee_id === parseInt(id)
      );
      setEmployeeListings(filteredListings);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // const isSmallScreen = useMediaQuery("(min-width: 1025px)");

  const fetchDataKPIs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `kpi/employee/${id}/performance`,
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


  const handleOpenChangePassword = () => {
    closeEditModal();
    openChangePasswordModal();
  };

  // let supervisor_id = ;
  console.log(employee);


  const handleChangePassword = async () => {
    closeEditModal
    const errors = {};
    if (!passwordData.password) errors.password = "Password is required";
    if (!passwordData.employee_id) errors.employee_id = "Invalid supervisor";

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post(`employees/change-password/${id}?_method=PUT`,
        passwordData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(res);

      console.log(passwordData);

      notifications.show({
        title: t.Success,
        message: t.Success,
        color: "green",
      });

      closeChangePasswordModal();
    } catch (error) {
      console.error("Error changing password:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to change password",
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
        backgroundColor: "",
      }}
      className={classes.container}
    >
      <div className={classes.header}>
        <BurgerButton />

        <span
          
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
              {employee.name}
            </h2>
            <p
            >
              {employee.email}
            </p>
          </div>
        </div>
      </div>
      {/* 
      <ActionIcon
        variant="subtle"
        color="gray"
        onClick={() => {
          handleEditClick(employee);
          setEditingEmployee(employee); // تخزين بيانات الموظف المحدد
          openEditModal(); // فتح نافذة التعديل
        }}
      >
        <img src={edit} alt="Edit" />
      </ActionIcon>

      <ActionIcon
        onClick={() => setDeleteModalOpened(true)}
        variant="subtle"
        color="red"
      >
        <img src={trash} alt="Delete" />
      </ActionIcon> */}

      <div className={classes.personalInfo}>
        <div >
          <h3 style={{
          }}>{t.PersonalInfo}</h3>
          <span style={{
            cursor: "pointer",
          }} onClick={() => {
            handleEditClick(employee);
            setEditingEmployee(employee); // تخزين بيانات الموظف المحدد
            openEditModal(); // فتح نافذة التعديل
          }}>
            <EditIcon />

          </span>

        </div>
        <Grid>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
              style={{
              }}
            >
              {t.FullName}
            </h2>
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
            >
              {t.Supervisor}
            </h2>
            <h3
            >
              {employee.supervisor.name}
            </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
            >
              {t.Phone}
            </h2>
            <h3
            >
              {employee.phone_number}
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
            >
              {t.address}
            </h2>
            <h3
            >
              {employee.address}
            </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2
            >
              {t.Status}
            </h2>
            <h3 className={classes.active}> {employee.status} </h3>
          </Grid.Col>
        </Grid>
      </div>


      <EmployeeAnalytics />


      <YearlyPerformance />
      {/* <div className={classes.summary}>
        <div className={classes.card}>
          <div
            className={classes.cardTitle}
          >
            {t.Selling}
          </div>
          <div
            className={classes.cardCount}
          >
            {kpiData?.performance_metrics?.sales?.count}
          </div>
          <div
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
       */}
      <div className={classes.properties}>
        <div className={classes.propertyList}>
          <EmployeeProperties id={id} />
        </div>
      </div>


      <Modal opened={changePasswordModal} onClose={closeChangePasswordModal} title="Change Password">
        <TextInput
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={passwordData.password}
          maxLength={50}
          onChange={(e) => {
            const newPassword = e.target.value;
            setPasswordData({ ...passwordData, password: newPassword });

            const error = validateField("password", newPassword);
            setPasswordErrors((prev) => ({ ...prev, password: error }));
          }}
          rightSection={
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IconEyeOff size={16} /> : <IconEye size={16} />}
            </button>
          }
          error={passwordErrors.password}
        />

        {passwordErrors.password && (
          <Text size="sm" color="red" mt={5}>
            {passwordErrors.password}
          </Text>
        )}

        <Button loading={loading} onClick={handleChangePassword} mt="md" fullWidth>
          Change Password
        </Button>
      </Modal>


      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Confirm Deletion"
        centered
        size="sm"
        radius="lg"
        styles={{
          title: {
            fontSize: 20,
            fontWeight: 600,
            color: "var(--color-3)",
          },
        }}
      >
        <Text size="sm" mb="md">
          Are you sure you want to delete this employee? This action cannot be undone.
        </Text>
        <Group position="apart">
          <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => handleDeleteEmployee(employee.employee_id)}
            loading={loading}
          >
            Delete
          </Button>
        </Group>
      </Modal>

      <UpdataStaffModal
        opened={editModalOpened}
        onClose={closeEditModal}
        employee={editingEmployee}
        onUpdateSuccess={handleUpdateSuccess}
        handleOpenChangePassword={handleOpenChangePassword}

      />

    </div>
  );
}

export default EmployeeDetailsSupervisor;
