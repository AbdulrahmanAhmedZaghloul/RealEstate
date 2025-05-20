//Dependency Imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Button, Center, Grid, Loader, Modal, TextInput, useMantineColorScheme } from "@mantine/core";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

//Local Imports
import classes from "../../styles/EmployeeDetails.module.css";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import EmployeeProperties from "./EmployeeProperties";
import EditStaffModal from "../modals/editStaffModal";
import DeleteEmployeeModal from "../modals/deleteEmployeeModal";
import { BurgerButton } from "../buttons/burgerButton";
import Notifications from "./Notifications";
import { useTranslation } from "../../context/LanguageContext";
import { IconEye, IconEyeOff } from "@tabler/icons-react"; // أو أي مكتبة أيقونات مستخدمة

function EmployeeDetails() {
  const [employee, setEmployee] = useState(null);
  const [employeeListings, setEmployeeListings] = useState([]);

  const [kpiData, setKpiData] = useState({});

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const [changePasswordModal, { open: openChangePasswordModal, close: closeChangePasswordModal }] = useDisclosure(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    password: "",
    supervisor_id: id,
  });
  const [showPassword, setShowPassword] = useState(false);

  //delete modal data
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteEmployee = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      notifications.show({
        title: "Success",
        message: "Employee deleted successfully!",
        color: "green",
      });
      closeDeleteModal();
      // Redirect or refresh the page after deletion
      navigate("/dashboard/Team");
    } catch (error) {
      console.error("Error deleting employee:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to delete employee",
        color: "red",
      });
    } finally {
      setDeleting(false);
    }
  };

  //edit modal data
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [supervisors, setSupervisors] = useState([]);
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    position: "",
    phone_number: "",
    address: "",
    supervisor_id: null,
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    position: "",
    phone_number: "",
    address: "",
    image: "",
  });
  const [newUser, setNewUser] = useState({});
  const { colorScheme } = useMantineColorScheme();


  const handleFileChange = (file) => {
    setNewUser((prev) => ({ ...prev, image: file }));
  };
  const handleUpdateUser = async () => {
    if (!validateForm(editUser, true)) return;
    const formData = new FormData();
    formData.append("name", editUser.name);
    formData.append("email", editUser.email);
    formData.append("password", editUser.password);
    formData.append("position", editUser.position);
    formData.append("phone_number", editUser.phone_number);
    formData.append("address", editUser.address);
    formData.append("supervisor_id", editUser.supervisor_id);
    formData.append("_method", "put");
    if (editUser.image) formData.append("picture", editUser.image);
    setLoading(true);
    try {
      const endpoint = `/api/employees/${id}`;
      await axiosInstance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      closeEditModal();
      notifications.show({
        title: "Success",
        message: "User updated successfully!",
        color: "green",
      });
      fetchEmployee();
    } catch (error) {
      console.error("Error updating user:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to update user",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/supervisors", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSupervisors(response.data.data.supervisors);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to fetch supervisors",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };
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

  const validateForm = (user, isEdit = false) => {
    const newErrors = {};
    if (!user.name) newErrors.name = "Name is required";
    if (!user.email) newErrors.email = "Email is required";
    if (!user.password && !isEdit) newErrors.password = "Password is required";
    if (!user.phone_number) newErrors.phone_number = "Phone number is required";
    if (!user.address) newErrors.address = "Address is required";
    if (user.position === "supervisor" && !user.image && !isEdit)
      newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleChangePassword = async () => {
    closeEditModal
    const errors = {};
    if (!passwordData.password) errors.password = "Password is required";
    if (!passwordData.supervisor_id) errors.supervisor_id = "Invalid supervisor";

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await axiosInstance.put(`/api/employees/change-password/${id}`,
        passwordData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      notifications.show({
        title: t.Success,
        message: "Password changed successfully!",
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
  const { t } = useTranslation();

  useEffect(() => {
    fetchEmployee();
    fetchSupervisors();
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
        borderRadius: "20px",
        border: "1px solid transparent",
      }}
      className={classes.container}
    >
      <div className={classes.header}>
        <BurgerButton />
        <span style={{
        }} className={classes.employePosition}>{t.Employee}</span>
        <Notifications />
      </div>

      <div className={classes.profile}>
        <div className={classes.profileImage}>
          <img src={`${employee.picture_url}`} alt="Profile" />
          <div className={classes.profileInfo}>
            <h2 style={{
            }} >{employee.name}</h2>
            <p style={{
            }}>{employee.email}</p>
          </div>
        </div>
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          cursor={"pointer"}
          onClick={openDeleteModal}
          className={classes.deleteIcon}
        >
          <rect
            x="0.75"
            y="0.75"
            width="46.5"
            height="46.5"
            rx="15.25"
            stroke="var(--color-border)"
            strokeWidth="1.5"
          />
          <path
            d="M19 33C18.45 33 17.9793 32.8043 17.588 32.413C17.1967 32.0217 17.0007 31.5507 17 31V18H16V16H21V15H27V16H32V18H31V31C31 31.55 30.8043 32.021 30.413 32.413C30.0217 32.805 29.5507 33.0007 29 33H19ZM29 18H19V31H29V18ZM21 29H23V20H21V29ZM25 29H27V20H25V29Z"
            fill="#666666"
          />
        </svg>
      </div>

      <div   className={classes.personalInfo}>
        <div >
          <h3 style={{
          }}>{t.PersonalInfo}</h3>
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            cursor={"pointer"}
            onClick={openEditModal}
          >
            <rect
              x="0.75"
              y="0.75"
              width="46.5"
              height="46.5"
              rx="15.25"
              stroke="var(--color-border)"
              strokeWidth="1.5"
            />
            <path
              d="M18.414 27.89L28.556 17.748L27.142 16.334L17 26.476V27.89H18.414ZM19.243 29.89H15V25.647L26.435 14.212C26.6225 14.0245 26.8768 13.9192 27.142 13.9192C27.4072 13.9192 27.6615 14.0245 27.849 14.212L30.678 17.041C30.8655 17.2285 30.9708 17.4828 30.9708 17.748C30.9708 18.0132 30.8655 18.2675 30.678 18.455L19.243 29.89ZM15 31.89H33V33.89H15V31.89Z"
              fill="#666666"
            />
          </svg>
        </div>
        <Grid>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.FullName}</h2>
            {/* <br /> */}
            <h3 style={{
            }}> {employee.name} </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.Position}</h2>
            <h3 style={{
            }}>{employee.position}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.EmployeeID}</h2>
            <h3 style={{
            }}>{employee.employee_id}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.Supervisor}</h2>
            <h3 style={{
            }}>{employee.supervisor.name}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.Phone}</h2>
            <h3 style={{
            }}> {employee.phone_number} </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.CreatedAt}</h2>
            <h3 style={{
            }}>{new Date(employee.created_at).toLocaleDateString("en-GB")}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.address}</h2>
            <h3 style={{
            }}>{employee.address}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.Status}</h2>
            <h3 className={classes.active}> {employee.status} </h3>
          </Grid.Col>
        </Grid>
      </div>

      <div className={classes.summary}>
        <div style={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }} 
        className={classes.card}>
          <div style={{
          }}
            className={classes.cardTitle}>{t.Selling}</div>
          <div style={{
          }} className={classes.cardCount}>
            {kpiData?.performance_metrics?.sales?.count}
          </div>
          <div style={{
          }} className={classes.cardRevenue}>
            <span style={{
            }} className="icon-saudi_riyal">&#xea; </span>
            {kpiData?.performance_metrics?.sales?.total_amount.toLocaleString(
              "en-GB"
            )}
          </div>
        </div>
        <div style={{


          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }} className={classes.card}>

          <div style={{
          }} className={classes.cardTitle}>{t.Renting}</div>
          <div style={{
          }} className={classes.cardCount}>
            {kpiData?.performance_metrics?.rentals?.count}
          </div>
          <div style={{
          }} className={classes.cardRevenue}>
            <span style={{
            }} className="icon-saudi_riyal">&#xea; </span>
            {kpiData?.performance_metrics?.rentals?.total_amount.toLocaleString(
              "en-GB"
            )}
          </div>
        </div>
        <div style={{


          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }} className={classes.card}>

          <div style={{
          }} className={classes.cardTitle}>{t.Contracts}</div>
          <div style={{
          }} className={classes.cardCount}>
            {kpiData?.performance_metrics?.contracts.length}
          </div>
          <div style={{
          }} className={classes.cardRevenue}>
            <span style={{
            }} className="icon-saudi_riyal">&#xea; </span>
            {kpiData?.performance_metrics?.contracts
              .reduce(
                (total, contract) => total + parseFloat(contract.price),
                0
              )
              .toLocaleString("en-GB")}
          </div>
        </div>
      </div>

      <div style={{
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
       className={classes.chart}>
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
            <YAxis
              width={80}
              tickFormatter={(value) =>
                `${parseFloat(value).toLocaleString("en-GB")}`
              }
            />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#8884d8"
              radius={[10, 10, 0, 0]}
              formatter={(value) => [
                <span className="icon-saudi_riyal">
                  &#xea; {parseFloat(value).toLocaleString("en-GB")}
                </span>,
                "Revenue",
              ]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
          onChange={(e) =>
            setPasswordData({ ...passwordData, password: e.target.value })
          }
          rightSection={
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <IconEyeOff size={16} />
              ) : (
                <IconEye size={16} />
              )}
            </button>
          }
          error={passwordErrors.password}
        />
        <Button loading={loading} onClick={handleChangePassword} mt="md" fullWidth>
          Change Password
        </Button>
      </Modal>
      <EditStaffModal
        opened={editModalOpened}
        onClose={closeEditModal}
        onEdit={handleUpdateUser}
        loading={loading}
        supervisors={supervisors}
        editUser={editUser}
        setEditUser={setEditUser}
        errors={errors}
        handleFileChange={handleFileChange}
        handleOpenChangePassword={handleOpenChangePassword}

      />
      <DeleteEmployeeModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        onDelete={handleDeleteEmployee}
        loading={deleting}
      />
    </div>
  );
}

export default EmployeeDetails;
