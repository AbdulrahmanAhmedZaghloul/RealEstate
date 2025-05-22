import {
  ActionIcon, Anchor, Avatar, Badge, Group, Table, Text, Collapse, Box, Center, Loader, Card, Select,
  Modal,
  TextInput,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";
import classes from "../../styles/realEstates.module.css";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useTranslation } from "../../context/LanguageContext";

// model 
import DeleteEmployeeModal from "../../components/modals/deleteEmployeeModal";
import AddStaffModal from "../../components/modals/addStaffModal";
import EditStaffModal from "../../components/modals/editStaffModal";

// hooks  queries & mutations
import { useEmployees } from "../../hooks/queries/useEmployees";
import { useSupervisors } from "../../hooks/queries/useSupervisors";
import { useEmployeePerformance } from "../../hooks/queries/useEmployeePerformance";
import { useAddUser } from "../../hooks/mutations/useAddUser";
import { useRemoveUser } from "../../hooks/mutations/useRemoveUser";
import { useEditUser } from "../../hooks/mutations/useEditUser";


// IconSvg
import Dropdown from "../../components/icons/dropdown";
import FilterIcon from "../../components/icons/filterIcon";
import AddIcon from "../../components/icons/addIcon";
import Search from "../../components/icons/search";
import EditIcon from "../../components/icons/edit";
 import RightDown from "../../components/icons/RightDown";
import DownStaff from "../../components/icons/DownStaff";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const jobColors = {
  supervisor: "orange",
  employee: "cyan",
};

function Staff() {
  const location = useLocation();

  const {
    data: employeesData,
    isLoading: employeesLoading,
    isError: isEmployeesError,
    error: employeesError,
  } = useEmployees();

  const {
    data: supervisorsData,
    isLoading: supervisorsLoading,
    isError: isSupervisorsError,
    error: supervisorsError,
  } = useSupervisors();

  const {
    data: rankingData,
    isLoading: rankingLoading,
    isError: isRankingError,
    error: rankingError,
  } = useEmployeePerformance();

  const isLoading = employeesLoading || supervisorsLoading || rankingLoading;
  const isError = isEmployeesError || isSupervisorsError || isRankingError;
  const error = employeesError || supervisorsError || rankingError;

  const { user } = useAuth();
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(null);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    position: "employee",
    phone_number: "",
    address: "",
    image: null,
    supervisor_id: null,
  });

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


  //delete modal data
  // console.log(supervisor_id);


  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [searchedEmployees, setSearchedEmployees] = useState([]);
  const [searchedSupervisors, setSearchedSupervisors] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [expandedSupervisors, setExpandedSupervisors] = useState({});
  const [kpiData, setKpiData] = useState({});
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(supervisors.length / itemsPerPage);
  const paginatedSupervisors = supervisors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [changePasswordModal, { open: openChangePasswordModal, close: closeChangePasswordModal }] = useDisclosure(false);

  // Reset currentPage to 1 when the search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchEmployees = async () => {
    try {
      console.log(employeesData?.data?.employees);

      setEmployees(employeesData?.data?.employees || []);
      setSearchedEmployees(employeesData?.data?.employees || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
      notifications.show({
        title: "Error",
        message: error.response.data.message || "Failed to fetch employees",
        color: "red",
      });
    }
  };

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      setSupervisors(supervisorsData?.data?.supervisors || []);
      setSearchedSupervisors(supervisorsData?.data?.supervisors || []);
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

  const fetchDataKPIs = async () => {
    try {
      setKpiData(rankingData?.data?.data || []);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearchedSupervisors(
      query.trim() === ""
        ? supervisors
        : supervisors.filter(
          (supervisor) =>
            supervisor.name.toLowerCase().includes(query.toLowerCase()) ||
            supervisor.position.toLowerCase().includes(query.toLowerCase())
        )
    );
    setSearchedEmployees(
      query.trim() === ""
        ? employees
        : employees.filter(
          (employee) =>
            employee.name.toLowerCase().includes(query.toLowerCase()) ||
            employee.position.toLowerCase().includes(query.toLowerCase())
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
    if (user.position === "supervisor" && !user.image && !isEdit)
      newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const mutationAddUser = useAddUser(user.token, closeAddModal, setNewUser);
  const isAddUserLoading = mutationAddUser.isPending;

  const handleAddUser = async (isSupervisor) => {
    if (!validateForm(newUser)) return;

    mutationAddUser.mutate({ newUser, isSupervisor });
  };

  // Update handleRemoveUser to open the modal instead of directly deleting
  const handleRemoveUser = (userId, isSupervisor) => {
    setEmployeeToDelete({ userId, isSupervisor });
    openDeleteModal();
  };

  const mutationRemoveUser = useRemoveUser(user.token, closeDeleteModal);
  const isRemoveUserLoading = mutationRemoveUser.isPending;

  // Add a new function to confirm and delete the user

  const confirmDeleteUser = () => {
    if (!employeeToDelete) return;

    // تنفيذ الحذف باستخدام useRemoveUser hook
    mutationRemoveUser.mutate({ employeeToDelete }, {
      onSuccess: () => {
        closeDeleteModal();
        setEmployeeToDelete(null);
      },
    });
  };

  const mutationEditUser = useEditUser(user.token, closeEditModal);
  const isEditUserLoading = mutationEditUser.isPending;

  const handleEditUser = (user) => {
    console.log(user);
    setEditUser({
      id: user.employee_id,
      name: user.name,
      email: user.email,
      position: user.position,
      phone_number: user.phone_number,
      address: user.address,
      supervisor_id: user.supervisor_id,

      image: null, // ستتم ملؤها لاحقًا من المودال
      picture_url: user.picture_url || null, // للعرض فقط
    });
    openEditModal();
  };

  const handleUpdateUser = async () => {
    if (!validateForm(editUser, true)) return;

    mutationEditUser.mutate({ editUser });
  };

  const handleFileChange = (file) => {
    setNewUser((prev) => ({ ...prev, image: file }));
  };

  // Group employees by supervisor_id
  const groupEmployeesBySupervisor = () => {
    const grouped = {};
    employees.forEach((user) => {
      if (user.position === "employee") {
        const supervisor = user.supervisor || "unassigned";
        if (!grouped[supervisor.supervisor_id]) {
          grouped[supervisor.supervisor_id] = [];
        }
        grouped[supervisor.supervisor_id].push(user);
      }
    });
    return grouped;
  };

  const groupedEmployees = groupEmployeesBySupervisor();

  const toggleSupervisorExpansion = (supervisorId) => {
    setExpandedSupervisors((prev) => ({
      ...prev,
      [supervisorId]: !prev[supervisorId],
    }));
  };

  const handleFilterChange = (value) => {
    setFilter(value);

    // Merge employee data with their KPI metrics
    const employeesWithMetrics = employees.map((employee) => {
      // Find matching KPI data for this employee
      const employeeKpi = kpiData?.find(
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

    setSearchedEmployees(sortedEmployees);
    setSearchedSupervisors([]); // Clear supervisors from search results
  };



  useEffect(() => {
    fetchEmployees();
    fetchSupervisors();
    fetchDataKPIs();
  }, [employeesData, supervisorsData, rankingData]);

  if (isLoading) {
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

        className={classes.mainContainer}
        radius="lg"
      >
        <div>
          <BurgerButton />
          <span
            style={{
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
              placeholder={t.Search}
              value={searchQuery}
              radius="md"
              onChange={handleSearchChange}
              style={{
                border: "1px solid var(--color-border)",
              }}
            />
            <Search />

          </div>

          <div className={classes.addAndSort}>
            <Select
              placeholder={t.Sortby}
              value={filter}
              mr={10}
              onChange={handleFilterChange} // Call the sorting function here
              rightSection={
                <Dropdown />
              }
              data={[
                { value: "Most seller", label: "Most seller" },
                { value: "Least seller", label: "Least seller" },
              ]}
              styles={{
                input: {
                  width: "132px",
                  height: "48px",
                  borderRadius: "15px",
                  border: "1px solid var(--color-border)",
                  padding: "14px 24px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor: "var(--color-7)",
                },
                dropdown: {
                  borderRadius: "15px", // Curved dropdown menu
                  border: "1.5px solid var(--color-border)",
                  backgroundColor: "var(--color-7)",
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
              className={classes.add}
              onClick={openAddModal}
              style={{
                cursor: "pointer",
                border: "1px solid var(--color-border)",
              }}
            >
              <span style={{ marginRight: "13px" }} >
                <AddIcon />
              </span>
              {t.Add}
            </button>
          </div>
        </div>

        <Table.ScrollContainer>
          <Table
            style={{
              border: "1px solid var(--color-white)",
            }}
            verticalSpacing="xs"
            className={classes.tablecontainer}
          >
            <Table.Thead
              style={{
                borderRadius: "20px",
                border: "1px solid var(--color-border)",
              }}
            >
              <Table.Tr
                style={{
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                }}
              >
                <Table.Th className={classes.tableth}>{t.Users}</Table.Th>
                <Table.Th className={classes.tableth}>{t.Status}</Table.Th>
                <Table.Th className={classes.tableth}>{t.Email}</Table.Th>
                <Table.Th className={classes.tableth}>{t.Position}</Table.Th>
                <Table.Th className={classes.tableth}>{t.Phone}</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            {searchQuery === "" && filter === null ? (
              <Table.Tbody
                style={{
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                }}
              >
                {paginatedSupervisors.map((supervisor) => (
                  <React.Fragment key={supervisor.supervisor_id}>
                    <Table.Tr
                      key={supervisor.supervisor_id}
                    >
                      <Table.Td

                        className={classes.tablebody}
                        w="20%"
                      >
                        <Group gap="md">
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() =>
                              toggleSupervisorExpansion(
                                supervisor.supervisor_id
                              )
                            }
                          >
                            {expandedSupervisors[supervisor.supervisor_id] ? (
                              <DownStaff />
                            ) : (
                              <RightDown />
                            )}
                          </ActionIcon>
                          <Avatar
                            src={`${supervisor.picture_url}`}
                            size={30}
                            color={jobColors[supervisor.position]}
                            radius={30}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              navigate(
                                `/dashboard/supervisor/${supervisor.supervisor_id}`
                              );
                            }}
                          />
                          <Text
                            fz="sm"
                            fw={500}
                            style={{ cursor: "pointer", maxWidth: "150%" }}
                            truncate="end"
                            onClick={() => {
                              navigate(
                                `/dashboard/supervisor/${supervisor.supervisor_id}`
                              );
                            }}
                          >
                            {supervisor.name}
                          </Text>
                        </Group>
                      </Table.Td>

                      <Table.Td className={classes.tablebody} w="15%">
                        <Badge
                          color={jobColors[supervisor.status]}
                          variant={
                            supervisor.status === "active"
                              ? "gradient"
                              : "gradient"
                          }
                          gradient={{
                            from:
                              supervisor.status === "active"
                                ? "#E9FFEF"
                                : "red",
                            to:
                              supervisor.status === "active"
                                ? "#E9FFEF"
                                : "red",
                            // deg: 90,
                          }}
                        // truncate="end"
                        >
                          <span className={classes.spanStatus}>
                            <span className={classes.Statusrom}></span>

                            {supervisor.status}
                          </span>
                        </Badge>
                      </Table.Td>

                      <Table.Td className={classes.tablebody} w="15%">
                        <Anchor
                          component="button"
                          size="sm"
                          truncate="end"
                          maw={200}
                        >
                          {supervisor.email}
                        </Anchor>
                      </Table.Td>

                      <Table.Td className={classes.tablebody} w="15%">
                        {/* <Text fz="sm" truncate="end" maw={200}> */}
                        {supervisor.position}
                        {/* </Text> */}
                      </Table.Td>

                      <Table.Td fz="sm" className={classes.tablebody} w="15%">
                        {/* <Text fz="sm" truncate="end" maw={100}> */}
                        {supervisor.phone_number}
                        {/* </Text> */}
                      </Table.Td>

                      <Table.Td className={classes.tablebody} w="10%">
                        <Group gap={0} justify="flex-end">
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => handleEditUser(supervisor)}
                            mr={24}
                          >
                            <EditIcon />
                            {/* <img src={edit} /> */}
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() =>
                              handleRemoveUser(supervisor.supervisor_id, true)
                            }
                          >
                            {/* <DeleteIcon /> */}
                            {/* <img src={trash} /> */}
                          </ActionIcon>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Td colSpan={6} style={{ padding: 0 }}>
                        <Collapse
                          in={expandedSupervisors[supervisor.supervisor_id]}
                        >
                          <Box>
                            <Table>
                              <Table.Tbody>
                                {groupedEmployees[
                                  supervisor.supervisor_id
                                ]?.map((employee) => (
                                  <Table.Tr key={employee.employee_id}>
                                    <Table.Td
                                      className={classes.tablebody}
                                      w="20%"
                                    >
                                      <Group gap="md" ml={40}>
                                        <Avatar
                                          size={30}
                                          // src={`${apiUrl}storage/${employee.picture}`}
                                          src={`${employee.picture_url}`}
                                          color={jobColors[employee.position]}
                                          radius={30}
                                          onClick={() => {
                                            navigate(
                                              `/dashboard/employee/${employee.employee_id}`
                                            );
                                          }}
                                        />
                                        <Text
                                          fz="sm"
                                          fw={500}
                                          style={{ cursor: "pointer" }}
                                          truncate="end"
                                          maw={100}
                                          onClick={() => {
                                            navigate(
                                              `/dashboard/employee/${employee.employee_id}`
                                            );
                                          }}
                                        >
                                          {employee.name}
                                        </Text>
                                      </Group>
                                    </Table.Td>

                                    <Table.Td
                                      className={classes.tablebody}
                                      w="15%"
                                    >
                                      <Badge
                                        color={jobColors[employee.status]}
                                        variant={
                                          employee.status === "active"
                                            ? "gradient"
                                            : "gradient"
                                        }
                                        gradient={{
                                          from:
                                            employee.status === "active"
                                              ? "#E9FFEF"
                                              : "red",
                                          to:
                                            employee.status === "active"
                                              ? "#E9FFEF"
                                              : "red",
                                          // deg: 90,
                                        }}
                                      // truncate="end"
                                      >
                                        <span className={classes.spanStatus}>
                                          <span
                                            className={classes.Statusrom}
                                          ></span>

                                          {employee.status}
                                        </span>
                                      </Badge>
                                    </Table.Td>

                                    <Table.Td
                                      className={classes.tablebody}
                                      w="15%"
                                    >
                                      <Anchor
                                        component="button"
                                        size="sm"
                                        truncate="end"
                                        maw={200}
                                      >
                                        {employee.email}
                                      </Anchor>
                                    </Table.Td>

                                    <Table.Td
                                      fz="sm"
                                      className={classes.tablebody}
                                      w="15%"
                                    >
                                      {/* <Text fz="sm"  > */}
                                      {employee.position}
                                      {/* </Text> */}
                                    </Table.Td>

                                    <Table.Td
                                      fz="sm"
                                      className={classes.tablebody}
                                      w="15%"
                                    >
                                      {/* <Text fz="sm"> */}
                                      {employee.phone_number}
                                      {/* </Text> */}
                                    </Table.Td>

                                    <Table.Td w="10%">
                                      <Group gap={0} justify="flex-end">
                                        <ActionIcon
                                          variant="subtle"
                                          color="gray"
                                          onClick={() =>
                                            handleEditUser(employee)
                                          }
                                          mr={24}
                                        >
                                          <EditIcon />

                                        </ActionIcon>
                                        <ActionIcon
                                          variant="subtle"
                                          color="red"
                                          onClick={() =>
                                            handleRemoveUser(
                                              employee.employee_id,
                                              false
                                            )
                                          }
                                        >
                                          {/* <DeleteIcon /> */}
                                        </ActionIcon>
                                      </Group>
                                    </Table.Td>
                                  </Table.Tr>
                                ))}
                              </Table.Tbody>
                            </Table>
                          </Box>
                        </Collapse>
                      </Table.Td>
                    </Table.Tr>
                  </React.Fragment>
                ))}
                {groupedEmployees["unassigned"]?.map((employee) => (
                  <Table.Tr

                    key={employee.employee_id}
                  >
                    <Table.Td className={classes.tablebody} w="20%">
                      <Group
                        gap="sm"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(
                            `/dashboard/employee/${employee.employee_id}`
                          );
                        }}
                      >
                        <Avatar
                          size={30}
                          src={`${employee.picture_url}`}
                          color={jobColors[employee.position]}
                          radius={30}
                        />
                        <Text fz="sm" fw={500} truncate="end" maw={100}>
                          {employee.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={jobColors[employee.status]}
                        variant={
                          employee.status === "active" ? "gradient" : "gradient"
                        }
                        gradient={{
                          from:
                            employee.status === "active" ? "#E9FFEF" : "red",
                          to: employee.status === "active" ? "#E9FFEF" : "red",
                          // deg: 90,
                        }}
                      // truncate="end"
                      >
                        <span className={classes.spanStatus}>
                          <span className={classes.Statusrom}></span>

                          {employee.status}
                        </span>
                      </Badge>
                      {/* <Badge
                        color={jobColors[employee.position]}
                        variant="light"
                      >
                        <span className={classes.spanStatus}>
                          <span className={classes.Statusrom}></span>

                          {employee.status}
                        </span>
                      </Badge> */}
                    </Table.Td>
                    <Table.Td>
                      <Anchor component="button" size="sm">
                        {employee.email}
                      </Anchor>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{employee.phone_number}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={0} justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => handleEditUser(employee, false)}
                          mr={24}
                        >
                          <EditIcon />

                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            handleRemoveUser(employee.employee_id, false)
                          }
                        >
                          {/* <DeleteIcon /> */}

                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            ) : (
              <Table.Tbody
                style={{
                  borderRadius: "20px",
                  border: "1px solid transparent",
                }}
              >
                {searchedEmployees?.map((employee) => (
                  <Table.Tr
                    style={{
                      borderRadius: "20px",
                      border: "1px solid transparent",
                    }}
                    key={employee.id}
                  >
                    <Table.Td>
                      <Group
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(
                            `/dashboard/employee/${employee.employee_id}`
                          );
                        }}
                        gap="sm"
                      >
                        <Avatar
                          size={30}
                          src={`${employee.picture_url}`}
                          color={jobColors[employee.position]}
                          radius={30}
                        />
                        <Text fz="sm" fw={500}>
                          {employee.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={jobColors[employee.status]}
                        variant={
                          employee.status === "active" ? "gradient" : "gradient"
                        }
                        gradient={{
                          from:
                            employee.status === "active" ? "#E9FFEF" : "red",
                          to: employee.status === "active" ? "#E9FFEF" : "red",
                          // deg: 90,
                        }}
                      // truncate="end"
                      >
                        <span className={classes.spanStatus}>
                          <span className={classes.Statusrom}></span>

                          {employee.status}
                        </span>
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Anchor component="button" size="sm">
                        {employee.email}
                      </Anchor>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{employee.position}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{employee.phone_number}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={0} justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => handleEditUser(employee, false)}
                          mr={24}
                        >
                          <EditIcon />

                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            handleRemoveUser(employee.employee_id, false)
                          }
                        >
                          {/* <DeleteIcon /> */}

                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}

                {searchedSupervisors?.map((supervisor) => (
                  <Table.Tr key={supervisor.id}>
                    <Table.Td>
                      <Group
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(
                            `/dashboard/supervisor/${supervisor.supervisor_id}`
                          );
                        }}
                        gap="sm"
                      >
                        <Avatar
                          size={30}
                          src={`${supervisor.picture_url}`}
                          color={jobColors[supervisor.position]}
                          radius={30}
                        />
                        <Text fz="sm" fw={500}>
                          {supervisor.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={jobColors[supervisor.status]}
                        variant={
                          supervisor.status === "active"
                            ? "gradient"
                            : "gradient"
                        }
                        gradient={{
                          from:
                            supervisor.status === "active" ? "#E9FFEF" : "red",
                          to:
                            supervisor.status === "active" ? "#E9FFEF" : "red",
                          // deg: 90,
                        }}
                      // truncate="end"
                      >
                        <span className={classes.spanStatus}>
                          <span className={classes.Statusrom}></span>

                          {supervisor.status}
                        </span>
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Anchor component="button" size="sm">
                        {supervisor.email}
                      </Anchor>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{supervisor.position}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fz="sm">{supervisor.phone_number}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={0} justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => handleEditUser(supervisor, false)}
                          mr={24}
                        >
                          <EditIcon />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            handleRemoveUser(supervisor.supervisor_id, false)
                          }
                        >
                          {/* <DeleteIcon /> */}
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            )}
          </Table>

          {/*pagination */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "18px",
              marginTop: "20px",
            }}
          >
            {currentPage > 1 && (
              <button
                className={classes.currentPage}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                {currentPage - 1}
              </button>
            )}

            <button
              style={{
                backgroundColor: "var(--color-5)",
              }}
              className={classes.currentPagenow}
            >
              {currentPage}
            </button>

            {currentPage < totalPages && (
              <button
                className={classes.currentPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                {currentPage + 1}
              </button>
            )}
          </div>
        </Table.ScrollContainer>
      </Card>
      {/* <Modal opened={changePasswordModal} onClose={closeChangePasswordModal} title="Change Password">
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
      </Modal> */}
      <AddStaffModal
        opened={addModalOpened}
        onClose={closeAddModal}
        onAdd={handleAddUser}
        loading={isAddUserLoading}
        supervisors={supervisors}
        newUser={newUser}
        setNewUser={setNewUser}
        errors={errors}
        handleFileChange={handleFileChange}
      />

      <EditStaffModal
        opened={editModalOpened}
        onClose={closeEditModal}
        onEdit={handleUpdateUser}
        loading={isEditUserLoading}
        supervisors={supervisors}
        editUser={editUser}
        setEditUser={setEditUser}
        errors={errors}
        handleFileChange={handleFileChange}
        // handleOpenChangePassword={handleOpenChangePassword}
        currentPath={location.pathname} // 👈 هنا بنبعت المسار للكومبوننت

      />

      <DeleteEmployeeModal
        opened={deleteModalOpened}
        onClose={() => {
          closeDeleteModal();
          setEmployeeToDelete(null); // Clear the selected employee if modal is closed
        }}
        onDelete={confirmDeleteUser} // Call the new confirmDeleteUser function
        loading={isRemoveUserLoading}
      />


    </>
  );
}

export default Staff;
