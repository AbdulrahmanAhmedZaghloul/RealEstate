import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Group,
  Table,
  Text,
  Center,
  Loader,
  Card,
  Select,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import axiosInstance from "../../api/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import classes from "../../styles/realEstates.module.css";
import AddStaffModal from "../../components/modals/addStaffModal";
import UpdataStaffModal from "./../../components/modals/editStaffModal_Supervisor";
import { BurgerButton } from "../../components/buttons/burgerButton";
import Notifications from "../../components/company/Notifications";
import { useTranslation } from "../../context/LanguageContext";
import Search from "../../components/icons/search";
import Dropdown from "../../components/icons/dropdown";
import AddIcon from "../../components/icons/addIcon";
import DeleteIcon from "../../components/icons/DeleteIcon";
import EditIcon from "../../components/icons/edit";
import { useQueryClient } from "@tanstack/react-query";

const jobColors = {
  supervisor: "orange",
  employee: "cyan",
};

function StaffSupervisor() {
  const { user } = useAuth();
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    position: "employee",
    phone_number: "",
    address: "",
    picture: null,
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

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchedEmployees, setSearchedEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [kpiData, setKpiData] = useState({});

  const [editingEmployee, setEditingEmployee] = useState(null);

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [filter, setFilter] = useState("");

  const navigate = useNavigate();

  const { colorScheme } = useMantineColorScheme();

  const { t } = useTranslation(); // 👈 استدعاء اللغة

  const queryClient = useQueryClient();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("employees", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log(response.data.data.employees);

      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEmployees(response.data.data.employees);
      setSearchedEmployees(response.data.data.employees);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to fetch employees",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataKPIs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`kpi/employee-performance`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

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

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    setSearchedEmployees(
      query.trim() === ""
        ? employees
        : employees.filter((employee) =>
            `${employee.name} ${employee.phone_number} ${employee.email}`
              .toLowerCase()
              .includes(query)
          )
    );
  };

  const [previewImage, setPreviewImage] = useState(null);

  const handleAddUser = async (isSupervisor) => {
    if (!validateForm(newUser)) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newUser.name);
      formData.append("email", newUser.email);
      formData.append("password", newUser.password);
      formData.append("position", newUser.position);
      formData.append("phone_number", newUser.phone_number);
      formData.append("address", newUser.address);
      formData.append("supervisor_id", newUser.supervisor_id);

      if (newUser.picture) formData.append("picture", newUser.picture);

      const endpoint = isSupervisor ? "supervisors" : "employees";
      const response = await axiosInstance.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      console.log(newUser);

      queryClient.invalidateQueries({ queryKey: ["supervisors"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      fetchEmployees();

      closeAddModal();

      setNewUser({
        name: "",
        email: "",
        password: "",
        position: "employee",
        phone_number: "",
        address: "",
        picture: null,
        supervisor_id: null,
      });

      notifications.show({
        title: "Success",
        message: `User added successfully!`,
        color: "green",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to add user",
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Edit Button Click
  const handleEditClick = (employee) => {
    console.log(employee);

    setEditingEmployee(employee);
    openEditModal();
  };

  // Handle Update Success
  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["supervisors"] });
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    fetchEmployees(); // Refresh the employee list
  };

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

        queryClient.invalidateQueries({ queryKey: ["supervisors"] });
        queryClient.invalidateQueries({ queryKey: ["employees"] });

        // بعد الحذف نحدث قائمة الموظفين
        fetchEmployees();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to delete employee",
        color: "red",
      });
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);

    // Merge employee data with their KPI metrics
    const employeesWithMetrics = employees.map((employee) => {
      // Find matching KPI data for this employee
      const employeeKpi = kpiData.find(
        (kpi) =>
          kpi.employee.id === employee.employee_id ||
          kpi.employee.id === employee.supervisor_id
      );

      return {
        ...employee,
        performance_metrics: employeeKpi?.performance_metrics || {
          total_contracts: 0,
          sales: { count: 0, total_amount: 0, average_price: 0 },
          rentals: { count: 0, total_amount: 0, average_price: 0 },
          commissions: 0,
        },
      };
    });

    // Filter only employees (not supervisors)
    const filteredEmployees = employeesWithMetrics.filter(
      (emp) => emp.position === "employee"
    );

    // Sort based on total_contracts
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
      const aContracts = a.performance_metrics.total_contracts;
      const bContracts = b.performance_metrics.total_contracts;

      if (value === "Most seller") {
        return bContracts - aContracts; // Descending (most first)
      } else if (value === "Least seller") {
        return aContracts - bContracts; // Ascending (least first)
      }
      return 0;
    });

    console.log(
      "Sorted employees with metrics:",
      sortedEmployees.map((e) => ({
        name: e.name,
        contracts: e.performance_metrics.total_contracts,
      }))
    );

    setSearchedEmployees(sortedEmployees);
  };

  // const isSmallScreen = useMediaQuery("(min-width: 1025px)");

  useEffect(() => {
    if (!addModalOpened) {
      setPreviewImage(null); // إعادة تعيين الصورة عند إغلاق المودال
    }
    if (!editModalOpened) {
      setPreviewImage(null); // إعادة تعيين الصورة عند إغلاق المودال
    }
  }, [addModalOpened ,editModalOpened]);
  useEffect(() => {
    fetchEmployees();
    fetchDataKPIs();
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

  return (
    <>
      <Card
        style={{
          backgroundColor: "#ffff",
          display: "flex",
          justifyContent: "center",
        }}
        radius="lg"
      >
        <div>
          <BurgerButton />
          <span
            style={{
              fontWeight: "500",
            }}
            className={classes.title}
          >
            {t.Staff}
          </span>
          <Notifications />
        </div>
        <div className={classes.controls}>
          <div className={classes.divSearch}>
            <input
              className={classes.search}
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                border: "1.5px solid var(--color-border)",
              }}
              maxLength={30}
            />
            <Search />
          </div>

          <div className={classes.addAndSort}>
            <Select
              placeholder={t.Sortby}
              value={filter}
              mr={10}
              onChange={handleFilterChange}
              rightSection={<Dropdown />}
              data={[
                { value: "Most seller", label: "Most seller" },
                { value: "Least seller", label: "Least seller" },
              ]}
              styles={{
                // Match your original styles
                input: {
                  width: "132px",
                  height: "48px",
                  backgroundColor: "white",
                  borderRadius: "15px",
                  border: "1.5px solid var(--color-border)",
                  padding: "14px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "var(--color-4)",
                },

                dropdown: {
                  borderRadius: "15px", // Curved dropdown menu
                  border: "1.5px solid var(--color-border)",
                },
                wrapper: {
                  width: "132px",
                },
                item: {
                  color: "var(--color-4)", // Dropdown option text color
                  "&[data-selected]": {
                    color: "white", // Selected option text color
                  },
                },
              }}
            />
            <button
              style={{
                cursor: "pointer",
                border: "1.5px solid var(--color-border)",
              }}
              className={classes.add}
              onClick={openAddModal}
            >
              <AddIcon />
              <span style={{ marginLeft: "13px" }}>{t.Add}</span>
            </button>
          </div>
        </div>
        <Table.ScrollContainer shadow="xs" mt={20}>
          <Table verticalSpacing="sm">
            <Table.Thead
              style={{
                border: "1px solid var(--color-grey)",
                borderBottom: "none",
                borderBottomRightRadius: "none",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <Table.Tr
                style={{
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Table.Th>{t.Name}</Table.Th>
                <Table.Th>{t.Position}</Table.Th>
                <Table.Th>{t.Email}</Table.Th>
                <Table.Th>{t.Phone}</Table.Th>
                <Table.Th>{t.Supervisor}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            {searchedEmployees?.map((employee) => (
              <Table.Tr
                style={{
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                }}
                key={employee.employee_id}
              >
                <Table.Td>
                  <Group
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate(
                        `/dashboard-supervisor/Team/${employee.employee_id}`
                      )
                    }
                    gap="sm"
                  >
                    <Avatar
                      size={30}
                      src={employee.picture_url}
                      color={jobColors[employee.position]}
                      radius={30}
                    />
                    <Text style={{}} fw={500}>
                      {employee.name}
                    </Text>
                  </Group>
                </Table.Td>

                <Table.Td>
                  <Badge color={jobColors[employee.position]} variant="light">
                    {employee.position}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Anchor component="button" size="sm">
                    {employee.email}
                  </Anchor>
                </Table.Td>

                <Table.Td>
                  <Text style={{}}>{employee.phone_number}</Text>
                </Table.Td>

                <Table.Td>
                  <Text style={{}}>{employee.supervisor?.name || "N/A"}</Text>
                </Table.Td>

                <Table.Td>
                  <Group gap={0} justify="flex-end">
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => {
                        handleEditClick(employee);
                        setEditingEmployee(employee); // تخزين بيانات الموظف المحدد
                        openEditModal(); // فتح نافذة التعديل
                      }}
                      mr={24}
                    >
                      <EditIcon />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteEmployee(employee.employee_id)}
                    >
                      <DeleteIcon />
                    </ActionIcon>
                  </Group>
                  {/* <Group
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >

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
                      onClick={() => handleDeleteEmployee(employee.employee_id)}
                      variant="subtle"
                      color="red"
                    >
                      <img src={trash} alt="Delete" />
                    </ActionIcon>
                  </Group> */}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table>
        </Table.ScrollContainer>
      </Card>

      <AddStaffModal
        opened={addModalOpened}
        onClose={closeAddModal}
        onAdd={handleAddUser}
        loading={loading}
        supervisors={supervisors}
        newUser={newUser}
        setNewUser={setNewUser}
        setErrors={setErrors}
        setPreviewImage={setPreviewImage}
        errors={errors}
      />

      <UpdataStaffModal
        opened={editModalOpened}
        onClose={closeEditModal}
        employee={editingEmployee}
        onUpdateSuccess={handleUpdateSuccess}
        setPreviewImage={setPreviewImage}
      />
    </>
  );
}

export default StaffSupervisor;
