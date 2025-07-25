
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Button, Center, Grid, Loader, Modal, TextInput, useMantineColorScheme, Text } from "@mantine/core";

import classes from "../../styles/EmployeeDetails.module.css";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";
import EmployeeProperties from "./EmployeeProperties";
import EditStaffModal from "../modals/editStaffModal";
import DeleteEmployeeModal from "../modals/deleteEmployeeModal";
import { BurgerButton } from "../buttons/burgerButton";
import Notifications from "../Notifications/Notifications";
import { useTranslation } from "../../context/LanguageContext";
import { IconEye, IconEyeOff } from "@tabler/icons-react"; // أو أي مكتبة أيقونات مستخدمة
import EditIcon from "../icons/edit";
import { useQueryClient } from "@tanstack/react-query";
import { validateField } from "../../hooks/Validation/validation";
import DeleteIcon from "../icons/DeleteIcon";
// import EmployeeAnalytics from "./EmployeeAnalytics";
import TimeFilter from "../TimeFilter";
import EmployeeAnalytics from "./Kpi/EmployeeAnalytics";
import YearlyPerformance from "./Kpi/YearlyPerformance";
import AnalyticsEmployeeDetails from "./Kpi/AnalyticsEmployeeDetails";

function EmployeeDetails() {
  const [employee, setEmployee] = useState(null);
  const [employeeListings, setEmployeeListings] = useState([]);
  const queryClient = useQueryClient();


  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const [changePasswordModal, { open: openChangePasswordModal, close: closeChangePasswordModal }] = useDisclosure(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    password: "",
    employee_id: id,
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
      await axiosInstance.delete(`employees/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      notifications.show({
        title: "Success",
        message: "Employee deleted successfully!",
        color: "green",
      });
      queryClient.invalidateQueries(['employees']);

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

  const handleOpenEditModal = () => {
    if (employee) {
      setEditUser({
        id: employee.id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        phone_number: employee.phone_number,
        address: employee.address,
        supervisor_id: employee.supervisor_id,
      });
    }
    openEditModal();
  };


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
      const endpoint = `employees/${id}`;
      await axiosInstance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      queryClient.invalidateQueries(['employees']);

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
      const response = await axiosInstance.get("supervisors", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(response);

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
      const response = await axiosInstance.get(`employees/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // console.log(response.employee);

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
      const response = await axiosInstance.get(`listings`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const filteredListings = response.data.data.listings.filter(
        (listing) => listing.employee_id === parseInt(id)
      );
      console.log(filteredListings);

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

  // const fetchDataKPIs = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axiosInstance.get(
  //       `kpi/employee/${id}/performance`,
  //       {
  //         headers: { Authorization: `Bearer ${user.token}` },
  //       }
  //     );

  //     const apiData = response.data.data;

  //     // Map API data to state
  //     console.log(apiData);
  //     setKpiData(apiData);

  //   } catch (error) {
  //     console.error("Error fetching KPI data:", error);
  //     notifications.show({
  //       title: "Error",
  //       message: "Failed to fetch KPI data",
  //       color: "red",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    if (editModalOpened && employee) {
      setEditUser({
        id: employee.id,
        name: employee.name || "",
        email: employee.email || "",
        position: employee.position || "",
        phone_number: employee.phone_number || "",
        address: employee.address || "",
        supervisor_id: employee.supervisor_id || null,
      });
    }
  }, [editModalOpened, employee]);

  const handleOpenChangePassword = () => {
    closeEditModal();
    openChangePasswordModal();
  };


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
    fetchSupervisors();
    fetchEmployeeListings();
  }, []);


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

      </div>

      <div className={classes.personalInfo}>
        <div >
          <h3 style={{
          }}>{t.PersonalInfo}</h3>
          <span style={{
            cursor: "pointer",
          }} onClick={openEditModal}>
            <EditIcon />

          </span>

        </div>
        <Grid>
          {console.log(employee)}
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
            }}>{t.Supervisor}</h2>
            <h3 style={{
            }}>{employee.supervisor.name}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.Phone}</h2>
            <h3 style={{
            }}> {employee.phone_number} </h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 3} className={classes.gridCol}>
            <h2 style={{
            }}>{t.CreatedAt}</h2>
            <h3 style={{
            }}>{new Date(employee.created_at).toLocaleDateString("en-GB")}</h3>
          </Grid.Col>
          <Grid.Col span={isMobile ? 12 : 3} className={classes.gridCol}>
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

      {console.log(employee)}

      <AnalyticsEmployeeDetails employee_id={employee.employee_id} />


      <YearlyPerformance employee_id={employee.employee_id} />

      <div className={classes.properties}>
        <div className={classes.propertyList}>
          <EmployeeProperties id={id} />
        </div>
      </div>

      <Modal opened={changePasswordModal} onClose={closeChangePasswordModal} title={t.ChangePassword}>
        <TextInput
          label={t.NewPassword}
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
          {t.ChangePassword}
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
