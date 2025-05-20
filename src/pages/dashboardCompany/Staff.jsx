import {
  ActionIcon, Anchor, Avatar, Badge, Group, Table, Text, Collapse, Box, Center, Loader, Card, Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import axiosInstance, { apiUrl } from "../../api/config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import classes from "../../styles/realEstates.module.css";
import down from "../../assets/down.svg";
import right from "../../assets/right.svg";
import edit from "../../assets/edit.svg";
import trash from "../../assets/trash.svg";
import downArrow from "../../assets/downArrow.svg";
import addIcon from "../../assets/addIcon.svg";
import AddStaffModal from "../../components/modals/addStaffModal";
import EditStaffModal from "../../components/modals/editStaffModal";
import Notifications from "../../components/company/Notifications";
import { BurgerButton } from "../../components/buttons/burgerButton";
import { useMantineColorScheme } from "@mantine/core";
import DeleteEmployeeModal from "../../components/modals/deleteEmployeeModal";
import { useTranslation } from "../../context/LanguageContext";
import { useEmployees } from "../../hooks/queries/useEmployees";
import { useSupervisors } from "../../hooks/queries/useSupervisors";
import { useEmployeePerformance } from "../../hooks/queries/useEmployeePerformance";
import { useAddUser } from "../../hooks/mutations/useAddUser";
import { useRemoveUser } from "../../hooks/mutations/useRemoveUser";
import { useEditUser } from "../../hooks/mutations/useEditUser";
import Dropdown from "../../components/icons/dropdown";
import FilterIcon from "../../components/icons/filterIcon";
import AddIcon from "../../components/icons/addIcon";

const jobColors = {
  supervisor: "orange",
  employee: "cyan",
};

function Staff() {
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
  const { colorScheme } = useMantineColorScheme();

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
  const confirmDeleteUser = async () => {
    if (!employeeToDelete) return;

    const { userId, isSupervisor } = employeeToDelete;
    setLoading(true);

    try {
      const endpoint = isSupervisor
        ? `/api/supervisors/${userId}`
        : `/api/employees/${userId}`;
      await axiosInstance.delete(endpoint, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      isSupervisor
        ? setSupervisors((prev) => prev.filter((user) => user.id !== userId))
        : setEmployees((prev) => prev.filter((user) => user.id !== userId));

      isSupervisor
        ? setSearchedSupervisors((prev) =>
          prev.filter((user) => user.id !== userId)
        )
        : setSearchedEmployees((prev) =>
          prev.filter((user) => user.id !== userId)
        );

      fetchSupervisors();
      fetchEmployees();

      notifications.show({
        title: "Success",
        message: "User removed successfully!",
        color: "green",
      });
    } catch (error) {
      console.error("Error removing user:", error);
      notifications.show({
        title: "Error",
        message: error.response?.data?.message || "Failed to remove user",
        color: "red",
      });
    } finally {
      setLoading(false);
      closeDeleteModal();
      setEmployeeToDelete(null);
    }
    mutationRemoveUser.mutate({ employeeToDelete });
    setEmployeeToDelete(null);
  };

  const mutationEditUser = useEditUser(user.token, closeEditModal);
  const isEditUserLoading = mutationEditUser.isPending;

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

            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M16.893 16.92L19.973 20M19 11.5C19 13.4891 18.2098 15.3968 16.8033 16.8033C15.3968 18.2098 13.4891 19 11.5 19C9.51088 19 7.60322 18.2098 6.1967 16.8033C4.79018 15.3968 4 13.4891 4 11.5C4 9.51088 4.79018 7.60322 6.1967 6.1967C7.60322 4.79018 9.51088 4 11.5 4C13.4891 4 15.3968 4.79018 16.8033 6.1967C18.2098 7.60322 19 9.51088 19 11.5Z" stroke="#2B3674" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>

          <div className={classes.addAndSort}>
            <Select
              placeholder={t.Sortby}
              value={filter}
              mr={10}
              onChange={handleFilterChange} // Call the sorting function here
              rightSection={<svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.4198 0.452003L13.4798 1.513L7.70277 7.292C7.6102 7.38516 7.50012 7.45909 7.37887 7.50953C7.25762 7.55998 7.12759 7.58595 6.99627 7.58595C6.86494 7.58595 6.73491 7.55998 6.61366 7.50953C6.49241 7.45909 6.38233 7.38516 6.28977 7.292L0.509766 1.513L1.56977 0.453002L6.99477 5.877L12.4198 0.452003Z" fill="#7A739F" />
              </svg>}
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
              <svg style={{ marginRight: "13px" }} width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8H1C0.71667 8 0.479337 7.904 0.288004 7.712C0.0966702 7.52 0.000670115 7.28267 3.44827e-06 7C-0.000663218 6.71734 0.0953369 6.48 0.288004 6.288C0.48067 6.096 0.718003 6 1 6H6V1C6 0.71667 6.096 0.479337 6.288 0.288004C6.48 0.0966702 6.71734 0.000670115 7 3.44827e-06C7.28267 -0.000663218 7.52034 0.0953369 7.713 0.288004C7.90567 0.48067 8.00134 0.718003 8 1V6H13C13.2833 6 13.521 6.096 13.713 6.288C13.905 6.48 14.0007 6.71734 14 7C13.9993 7.28267 13.9033 7.52034 13.712 7.713C13.5207 7.90567 13.2833 8.00134 13 8H8V13C8 13.2833 7.904 13.521 7.712 13.713C7.52 13.905 7.28267 14.0007 7 14C6.71734 13.9993 6.48 13.9033 6.288 13.712C6.096 13.5207 6 13.2833 6 13V8Z" fill="#7A739F" />
              </svg>{t.Add}
            </button>
          </div>
        </div>
        <Table.ScrollContainer>
          <Table
            style={{
              backgroundColor: "",
              border: "1px solid var(--color-white)",
            }}
            verticalSpacing="xs"
            className={classes.tablecontainer}
          >
            <Table.Thead
              style={{
                backgroundColor: "",
                borderRadius: "20px",
                border: "1px solid var(--color-white)",
              }}
            >
              <Table.Tr
                style={{
                  backgroundColor: "",
                  borderRadius: "20px",
                  border: "1px solid var(--color-white)",
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
                  backgroundColor: "",
                  borderRadius: "20px",
                  border: "1px solid var(--color-white)",
                }}
              >
                {/* {supervisors.map((supervisor) => ( */}
                {paginatedSupervisors.map((supervisor) => (
                  <React.Fragment key={supervisor.supervisor_id}>
                    <Table.Tr
                      style={{
                        backgroundColor: "",
                      }}
                      key={supervisor.supervisor_id}
                    >
                      <Table.Td
                        style={
                          {
                            // backgroundColor:   "",
                            // borderRadius: "20px",
                          }
                        }
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
                              <img src={down} />
                            ) : (
                              <img src={right} />
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
                            <img src={edit} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() =>
                              handleRemoveUser(supervisor.supervisor_id, true)
                            }
                          >
                            <img src={trash} />
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
                                          <img src={edit} />
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
                                          <img src={trash} />
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
                    style={{
                      borderRadius: "20px",
                      border: "1px solid transparent",
                    }}
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
                      <Text fz="sm">Unassigned</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={0} justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => handleEditUser(employee, false)}
                          mr={24}
                        >
                          <img src={edit} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            handleRemoveUser(employee.employee_id, false)
                          }
                        >
                          <img src={trash} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            ) : (
              <Table.Tbody
                style={{
                  backgroundColor: "",
                  borderRadius: "20px",
                  border: "1px solid transparent",
                }}
              >
                {searchedEmployees?.map((employee) => (
                  <Table.Tr
                    style={{
                      backgroundColor: "",
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
                      {/* <Badge
                     color={jobColors[employee.status]}
                     variant="light"
                   >
                                   {employee.status}
                   </Badge> */}
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
                          <img src={edit} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            handleRemoveUser(employee.employee_id, false)
                          }
                        >
                          <img src={trash} />
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
                      {/* <Badge
                        color={jobColors[supervisor.status]}
                        variant="light"
                      >
                                      {supervisor.status}
                      </Badge> */}
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
                          <img src={edit} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={() =>
                            handleRemoveUser(supervisor.supervisor_id, false)
                          }
                        >
                          <img src={trash} />
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
