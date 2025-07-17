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
import React, { useEffect, useState, useMemo } from "react";
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

// 🔵 NEW: Utility function to normalize KPI data
function normalizeKpiData(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw && raw.data && Array.isArray(raw.data)) return raw.data;
  return [];
}

// 🔵 NEW: Utility function to get contract count safely
function getContractCountFromKpi(kpiRecord) {
  if (!kpiRecord?.performance_metrics) return 0;
  const pm = kpiRecord.performance_metrics;
  const salesCount = pm?.sales?.count ?? 0;
  const rentalsCount = pm?.rentals?.count ?? 0;
  return salesCount + rentalsCount;
}

// 🔵 NEW: Default metrics if no KPI found
const EMPTY_METRICS = {
  total_contracts: 0,
  sales: { count: 0, total_amount: 0, average_price: 0 },
  rentals: { count: 0, total_amount: 0, average_price: 0 },
  commissions: 0,
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
  const [kpiData, setKpiData] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // 🔵 NEW: kpiMap for fast access
  const kpiMap = useMemo(() => {
    const map = new Map();
    kpiData.forEach((kpi) => {
      const id = kpi.employee?.id;
      if (id != null) map.set(Number(id), kpi);
    });
    return map;
  }, [kpiData]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("employees", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
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
      const response = await axiosInstance.get(`kpi/supervisorTeamKpis`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      
      const normalized = normalizeKpiData(response.data);
      setKpiData(normalized);
    } catch (error) {
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

    if (filter === "Most seller" || filter === "Least seller") {
      setSearchedEmployees((prev) => {
        const base = prev.length ? prev : employees;
        return query.trim() === ""
          ? base
          : base.filter(
              (emp) =>
                emp.name?.toLowerCase().includes(query) ||
                emp.email?.toLowerCase().includes(query) ||
                emp.phone_number?.includes(query)
            );
      });
      return;
    }

    setSearchedEmployees(
      query.trim() === ""
        ? employees
        : employees.filter(
            (employee) =>
              employee.name?.toLowerCase().includes(query) ||
              employee.email?.toLowerCase().includes(query) ||
              employee.phone_number?.includes(query)
          )
    );
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
      await axiosInstance.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
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
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to add user",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    openEditModal();
  };

  const handleUpdateSuccess = () => {
    fetchEmployees();
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

    const employeesOnly = employees.filter((emp) => emp.position === "employee");

    const employeesWithMetrics = employeesOnly.map((emp) => {
      const empId = Number(emp.employee_id);
      const kpi = kpiMap.get(empId) || {};
      const metrics = kpi.performance_metrics || EMPTY_METRICS;
      const totalContracts = getContractCountFromKpi(kpi);

      return {
        ...emp,
        performance_metrics: metrics,
        __contracts: totalContracts,
      };
    });

    let sortedEmployees = [...employeesWithMetrics];

    if (value === "Most seller") {
      sortedEmployees.sort((a, b) => b.__contracts - a.__contracts);
    } else if (value === "Least seller") {
      sortedEmployees.sort((a, b) => a.__contracts - b.__contracts);
    }

    setSearchedEmployees(sortedEmployees);
  };

  useEffect(() => {
    fetchEmployees();
    fetchDataKPIs();
  }, []);

  if (loading) {
    return (
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
    );
  }

  return (
    <>
      <Card style={{ backgroundColor: "var(--color-5)" }} radius="lg">
        <div>
          <BurgerButton />
          <span className={classes.title}>{t.Staff}</span>
          <Notifications />
        </div>
        <div className={classes.controls}>
          <div className={classes.divSearch}>
            <input
              className={classes.search}
              placeholder={t.Search}
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ border: "1.5px solid var(--color-border)" }}
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
                { value: "", label: t.All },
                { value: "Most seller", label: t.MostSeller },
                { value: "Least seller", label: t.LeastSeller },
              ]}
              styles={{
                input: {
                  width: "132px",
                  height: "48px",
                  backgroundColor: "var(--color-7)",
                  borderRadius: "15px",
                  border: "1.5px solid var(--color-border)",
                  padding: "14px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "var(--color-4)",
                },
                dropdown: {
                  borderRadius: "15px",
                  border: "1.5px solid var(--color-border)",
                },
                wrapper: { width: "132px" },
                item: {
                  color: "var(--color-4)",
                  "&[data-selected]": { color: "white" },
                },
              }}
            />
            <button
              className={classes.add}
              onClick={openAddModal}
              style={{ cursor: "pointer", border: "1.5px solid var(--color-border)" }}
            >
              <AddIcon />
              <span style={{ marginLeft: "13px" }}>{t.Add}</span>
            </button>
          </div>
        </div>
        <Table.ScrollContainer shadow="xs" mt={20}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr style={{ borderRadius: "20px", border: "1px solid var(--color-border)" }}>
                <Table.Th>{t.Name}</Table.Th>
                <Table.Th>{t.Position}</Table.Th>
                <Table.Th>{t.Email}</Table.Th>
                <Table.Th>{t.Phone}</Table.Th>
                <Table.Th>{t.Supervisor}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {searchedEmployees?.map((employee) => (
                <Table.Tr
                  key={employee.employee_id}
                  style={{ borderRadius: "20px", border: "1px solid var(--color-border)" }}
                >
                  <Table.Td>
                    <Group
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/dashboard-supervisor/Team/${employee.employee_id}`)
                      }
                      gap="sm"
                    >
                      <Avatar
                        size={30}
                        src={employee.picture_url}
                        color={jobColors[employee.position]}
                        radius={30}
                      />
                      <Text fw={500}>
                        {employee.name}{" "}
                        <Text component="span" fz="xs" c="dimmed">
                          ({employee.__contracts ?? 0})
                        </Text>
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
                    <Text>{employee.phone_number}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text>{employee.supervisor?.name || "N/A"}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={0} justify="flex-end">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => {
                          handleEditClick(employee);
                          setEditingEmployee(employee);
                          openEditModal();
                        }}
                        mr={24}
                      >
                        <EditIcon />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
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
        errors={errors}
      />
      <UpdataStaffModal
        opened={editModalOpened}
        onClose={closeEditModal}
        employee={editingEmployee}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
}

export default StaffSupervisor; 