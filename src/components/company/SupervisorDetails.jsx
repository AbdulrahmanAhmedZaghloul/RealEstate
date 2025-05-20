

//Dependency imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Center, Grid, Loader, Modal, TextInput, useMantineColorScheme } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

//Local imports
import EditStaffModal from "../modals/editStaffModal";
import DeleteEmployeeModal from "../modals/deleteEmployeeModal";
import axiosInstance from "../../api/config";
import classes from "../../styles/SupervisorDetails.module.css";
import { useAuth } from "../../context/authContext";
import { BurgerButton } from "../buttons/burgerButton";
import Notifications from "./Notifications";
import { useTranslation } from "../../context/LanguageContext";
import { IconEye, IconEyeOff } from "@tabler/icons-react"; // أو أي مكتبة أيقونات مستخدمة
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/edit";
function SupervisorDetails() {
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const { colorScheme } = useMantineColorScheme();

  const [passwordErrors, setPasswordErrors] = useState({});
  //delete modal data
  const [showPassword, setShowPassword] = useState(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteSupervisor = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/api/supervisors/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      notifications.show({
        title: "Success",
        message: "Supervisor deleted successfully!",
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
  //delete modal data

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
  const isMobile = useMediaQuery(`(max-width: ${"991px"})`);
  const [changePasswordModal, { open: openChangePasswordModal, close: closeChangePasswordModal }] = useDisclosure(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    supervisor_id: id,
  });
  // const [passwordErrors, setPasswordErrors] = useState({});
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
      const endpoint = `/api/supervisors/${id}`;
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
      fetchSupervisor();
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

  const handleEditUser = (user) => {
    setEditUser({
      id: user.employee_id,
      name: user.name,
      email: user.email,
      position: user.position,
      phone_number: user.phone_number,
      address: user.address,
      supervisor_id: user.supervisor_id,
    });
    openEditModal();
  };

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/supervisors", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(response.data.data.supervisors);

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
  // edit modal data

  const fetchSupervisor = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    try {
      const response = await axiosInstance.get(`/api/supervisors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupervisor(response.data.data.supervisor);
    } catch (error) {
      console.error(error);
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
      await axiosInstance.put(`/api/supervisors/change-password/${id}`,
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
  useEffect(() => {
    fetchSupervisor();
    fetchSupervisors();
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

  if (!supervisor) {
    return (
      <Center>
        <span>Supervisor does not exist.</span>
      </Center>
    );
  }

  return (
    <div

      className={classes.container}
    >
      <div className={classes.header}>
        <BurgerButton />
        <span
          style={{
          }}
          className={classes.employePosition}
        >
          {t.Supervisor}
        </span>
        <Notifications />
      </div>
      <div className={classes.profile}>
        <div className={classes.profileImage}>
          <img src={supervisor.picture_url} alt="Profile" />
          <div className={classes.profileInfo}>
            <h2
              style={{
              }}
            >
              {supervisor.name}
            </h2>
            <p
              style={{
              }}
            >
              {supervisor.email}
            </p>
          </div>
        </div>
        <span
          style={{
            cursor: "pointer",
          }}
     
          onClick={openDeleteModal}
          className={classes.deleteIcon}
          >
          <DeleteIcon />
        </span>
        {/* <svg
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
        </svg> */}
      </div>

      <div className={classes.personalInfo}>
        <div>
          <h3
            style={{
            }}
          >
            {t.PersonalInfo}
          </h3>
          <span style={{
            cursor: "pointer",
          }}
            onClick={handleEditUser.bind(this, supervisor)}
          >
            <EditIcon />

          </span>

          {/* <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            cursor={"pointer"}
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
          </svg> */}
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
              {supervisor.name}
            </h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 10 : 3} className={classes.gridCol}>
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
              {supervisor.position}
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
              {supervisor.phone_number}
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

              {supervisor.address}
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
              {new Date(supervisor.created_at).toLocaleDateString("en-GB")}{" "}
            </h3>
          </Grid.Col>

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

              {supervisor?.employees?.length}
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
              {console.log(supervisor)
              }
              {supervisor.status}
            </h3>
          </Grid.Col>
        </Grid>
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
        onDelete={handleDeleteSupervisor}
        loading={deleting}
      />
    </div>
  );
}

export default SupervisorDetails;
