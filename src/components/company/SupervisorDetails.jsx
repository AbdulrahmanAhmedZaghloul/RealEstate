//Dependency imports
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Center,
  Grid,
  Loader,
  Modal,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
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
// import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/edit";
import { useQueryClient } from "@tanstack/react-query";
import Contracts from "../../pages/dashboardCompany/Contracts";
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
  const queryClient = useQueryClient();

  const handleDeleteSupervisor = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`supervisors/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      notifications.show({
        title: "Success",
        message: "Supervisor deleted successfully!",
        color: "green",
      });
      queryClient.invalidateQueries(["supervisors"]);

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
    image: null, // ستتم ملؤها لاحقًا من المودال
    picture_url: user.picture_url || null, // للعرض فقط
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
  const [
    changePasswordModal,
    { open: openChangePasswordModal, close: closeChangePasswordModal },
  ] = useDisclosure(false);
  const [passwordData, setPasswordData] = useState({
    password: "",
    supervisor_id: id,
  });

  // const [passwordErrors, setPasswordErrors] = useState({});
  const handleFileChange = (file) => {
    // setNewUser((prev) => ({ ...prev, image: file }));
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

    if (file.size > MAX_FILE_SIZE) {
      notifications.show({
        title: "Error",
        message: "Image size should not exceed 2 MB.",
        color: "red",
      });
      return;
    }

    new Compressor(file, {
      quality: 0.6, // نسبة الضغط (0.1 إلى 1)
      success: (compressedResult) => {
        const compressedFile = new File([compressedResult], file.name, {
          type: compressedResult.type,
          lastModified: Date.now(),
        });

        setNewUser((prev) => ({ ...prev, image: compressedFile }));
      },
      error: (err) => {
        console.error("Compression failed:", err);
        setNewUser((prev) => ({ ...prev, image: file })); // استخدام الصورة الأصلية
      },
    });
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
      const endpoint = `supervisors/${id}`;
      await axiosInstance.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });
      queryClient.invalidateQueries(["supervisors"]);

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
        image: null, // ستتم ملؤها لاحقًا من المودال
      picture_url: user.picture_url || null, // للعرض فقط

      supervisor_id: user.supervisor_id,
    });
    openEditModal();
  };

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("supervisors", {
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
      const response = await axiosInstance.get(`supervisors/${id}`, {
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
  const validatePassword = (password) => {
    if (!password.trim()) return "Password is required";
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    if (!/[a-z]/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password))
      return "Password must contain at least one number";
    if (/\s/.test(password)) return "Password cannot contain spaces";
    return "";
  };
  const handleChangePassword = async () => {
    const newPassword = passwordData.password;
    const passwordError = validatePassword(newPassword);

    const errors = {};
    if (passwordError) {
      errors.password = passwordError;
    }

    if (!passwordData.supervisor_id) {
      errors.supervisor_id = "Invalid supervisor";
    }

    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await axiosInstance.put(
        `supervisors/change-password/${id}`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
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
    <div className={classes.container}>
      <div className={classes.header}>
        <BurgerButton />
        <span style={{}} className={classes.employePosition}>
          {t.Supervisor}
        </span>
        <Notifications />
      </div>
      <div className={classes.profile}>
        <div className={classes.profileImage}>
          <img src={supervisor.picture_url} alt="Profile" />
          <div className={classes.profileInfo}>
            <h2 style={{}}>{supervisor.name}</h2>
            <p style={{}}>{supervisor.email}</p>
          </div>
        </div>
        <span
          style={{
            cursor: "pointer",
          }}
          onClick={openDeleteModal}
          className={classes.deleteIcon}
        >
          {/* <DeleteIcon /> */}
        </span>
      </div>

      <div className={classes.personalInfo}>
        <div>
          <h3 style={{}}>{t.PersonalInfo}</h3>
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={handleEditUser.bind(this, supervisor)}
          >
            <EditIcon />
          </span>
        </div>
        <Grid>
          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{}}>{t.FullName}</h2>
            {/* <br /> */}
            <h3 style={{}}>{supervisor.name}</h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 10 : 3} className={classes.gridCol}>
            <h2 style={{}}>{t.Position}</h2>
            <h3 style={{}}>{supervisor.position}</h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{}}>{t.Phone}</h2>
            <h3 style={{}}>{supervisor.phone_number}</h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{}}>{t.address}</h2>
            <h3 style={{}}>{supervisor.address}</h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{}}>{t.CreatedAt}</h2>
            <h3 style={{}}>
              {new Date(supervisor.created_at).toLocaleDateString("en-GB")}{" "}
            </h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{}}>{t.Noofemployees}</h2>
            <h3 style={{}}>{supervisor?.employees?.length}</h3>
          </Grid.Col>

          <Grid.Col span={isMobile ? 6 : 3} className={classes.gridCol}>
            <h2 style={{}}>{t.Status}</h2>
            <h3 style={{}} className={classes.active}>
              {console.log(supervisor)}
              {supervisor.status}
            </h3>
          </Grid.Col>
        </Grid>
      </div>
      <Contracts />
      <Modal
        opened={changePasswordModal}
        onClose={closeChangePasswordModal}
        title="Change Password"
      >
        <TextInput
          label="New Password"
          type={showPassword ? "text" : "password"}
          value={passwordData.password}
          maxLength={50}
          onChange={(e) => {
            const newPassword = e.target.value;
            setPasswordData({ ...passwordData, password: newPassword });
            const error = validatePassword(newPassword);
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
        
        <Button
          loading={loading}
          onClick={handleChangePassword}
          mt="md"
          fullWidth
        >
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

      {/* <EditStaffModal
              opened={editModalOpened}
              onClose={closeEditModal}
              onEdit={handleUpdateUser}
              loading={isEditUserLoading}
              supervisors={supervisors}
              editUser={editUser}
              setEditUser={setEditUser}
              errors={errors}
              handleFileChange={handleFileChange}
              currentPath={location.pathname} // 👈 هنا بنبعت المسار للكومبوننت
            />
             */}
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
