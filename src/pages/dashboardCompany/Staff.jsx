


import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Group,
  Table,
  Text,
  Collapse,
  Box,
  Center,
  Loader,
  Card,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState, useMemo } from "react"; // 🔵 NEW useMemo
import { notifications } from "@mantine/notifications";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";
import classes from "../../styles/realEstates.module.css";
import Notifications from "../../components/Notifications/Notifications";
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
import InvalidateQuery from "../../InvalidateQuery/InvalidateQuery";
import DeleteIcon from "../../components/icons/DeleteIcon";
import { useQueryClient } from "@tanstack/react-query";
import Compressor from "compressorjs";

const jobColors = {
  supervisor: "orange",
  employee: "cyan",
};

// 🟡 FIX: Utility تحوِّل شكل بيانات KPI إلى Array آمنة
function normalizeKpiData(raw) {
  if (!raw) return [];
  // في حالة React Query بيرجع {status:'success', data:[...]}:
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw.data)) return raw.data;
  // fallback آخر
  return [];
}

// 🔵 NEW: حساب عدد العقود
function getContractCountFromKpi(kpiRecord) {
  if (!kpiRecord?.performance_metrics) return 0;
  const pm = kpiRecord.performance_metrics;
  if (typeof pm.total_contracts === "number" && !isNaN(pm.total_contracts)) {
    return pm.total_contracts;
  }
  const salesCount = pm?.sales?.count ?? 0;
  const rentalsCount = pm?.rentals?.count ?? 0;
  return salesCount + rentalsCount;
}

// 🔵 NEW: متريكس افتراضية لو مفيش KPI
const EMPTY_METRICS = {
  total_contracts: 0,
  sales: { count: 0, total_amount: 0, average_price: 0 },
  rentals: { count: 0, total_amount: 0, average_price: 0 },
  commissions: 0,
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
    data: rankingData, // React Query result
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
  const [filter, setFilter] = useState(""); // 👈 هنستخدمها كـ sortOrder ("Most seller" | "Least seller" | null)

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
    image: null,
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
  const [kpiData, setKpiData] = useState([]); // 🟡 FIX: خليها Array بدل Object
  const { t } = useTranslation(); // الحصول على الكلمات المترجمة والسياق

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchEmployees = async () => {
    try {
      const list = employeesData?.data?.employees || [];
      setEmployees(list);
      setSearchedEmployees(list);
    } catch (error) {
      console.error("Error fetching employees:", error);
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to fetch employees",
        color: "red",
      });
    }
  };

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const list = supervisorsData?.data?.supervisors || [];
      setSupervisors(list);
      setSearchedSupervisors(list);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      notifications.show({
        title: "Error",
        message: error?.response?.data?.message || "Failed to fetch supervisors",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDataKPIs = async () => {
    try {
      // 🟡 FIX: normalize بدل الوصول غير الصحيح
      const normalized = normalizeKpiData(rankingData?.data ?? rankingData);
      setKpiData(normalized);
    } catch (error) {
      console.error("Error fetching KPI data:", error);
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  // 🔵 NEW: Map سريع من employeeId -> kpiRecord
  const kpiMap = useMemo(() => {
    const map = new Map();
    kpiData.forEach((kpi) => {
      const id = kpi?.employee?.id;
      if (id != null) map.set(Number(id), kpi);
    });
    return map;
  }, [kpiData]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // لو عامل Sort (filter) إحنا في Mode "flat list" بالفعل، فهنفلتر في searchedEmployees اللي اتبنت من الكيبى
    if (filter === "Most seller" || filter === "Least seller") {
      setSearchedSupervisors([]); // مخبية
      setSearchedEmployees((prev) => {
        const base = prev.length ? prev : employees; // fallback
        return query.trim() === ""
          ? base
          : base.filter(
              (emp) =>
                emp.name?.toLowerCase().includes(query.toLowerCase()) ||
                emp.position?.toLowerCase().includes(query.toLowerCase())
            );
      });
      return;
    }

    // الوضع العادي (بدون Sort)
    setSearchedSupervisors(
      query.trim() === ""
        ? supervisors
        : supervisors.filter(
            (supervisor) =>
              supervisor.name?.toLowerCase().includes(query.toLowerCase()) ||
              supervisor.position?.toLowerCase().includes(query.toLowerCase())
          )
    );
    setSearchedEmployees(
      query.trim() === ""
        ? employees
        : employees.filter(
            (employee) =>
              employee.name?.toLowerCase().includes(query.toLowerCase()) ||
              employee.position?.toLowerCase().includes(query.toLowerCase())
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
  const [previewImage, setPreviewImage] = useState(null);

  // Add a new function to confirm and delete the user
  const confirmDeleteUser = () => {
    if (!employeeToDelete) return;

    // تنفيذ الحذف باستخدام useRemoveUser hook
    mutationRemoveUser.mutate(
      { employeeToDelete },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["listingsRealEstate"]);
          queryClient.invalidateQueries(["listings"]);
          closeDeleteModal();
          setEmployeeToDelete(null);
        },
      }
    );
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

  // 🔵 NEW: الترتيب حسب العقود (Most / Least seller)
  const handleFilterChange = (value) => {
    setFilter(value);

    // نبني قائمة الموظفين فقط (مش المشرفين)
    const employeesOnly = employees.filter(
      (emp) => emp.position === "employee"
    );

    // نضيف متريكس لكل موظف
    const employeesWithMetrics = employeesOnly.map((emp) => {
      const empId =
        emp.employee_id != null
          ? Number(emp.employee_id)
          : emp.id != null
          ? Number(emp.id)
          : null;

      const kpi = empId != null ? kpiMap.get(empId) : null;
      const metrics = kpi?.performance_metrics || EMPTY_METRICS;

      // لإظهار عدد العقود (هنضيفه على الكائن نفسه)
      return {
        ...emp,
        performance_metrics: metrics,
        __contracts: getContractCountFromKpi(kpi || { performance_metrics: metrics }),
      };
    });

    let sortedEmployees = employeesWithMetrics;

    if (value === "Most seller") {
      sortedEmployees = [...employeesWithMetrics].sort(
        (a, b) => b.__contracts - a.__contracts
      );
    } else if (value === "Least seller") {
      sortedEmployees = [...employeesWithMetrics].sort(
        (a, b) => a.__contracts - b.__contracts
      );
    }

    // عرض كـ بحث/فلتر Mode:
    setSearchedEmployees(sortedEmployees);
    setSearchedSupervisors([]); // نخفي المشرفين في وضع الترتيب
  };

  // إعادة تعيين الصورة لما المودال يتقفل
  useEffect(() => {
    if (!addModalOpened) {
      setPreviewImage(null);
    }
  }, [addModalOpened]);

  // جلب البيانات لما تتغير الـ Queries
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
      <AddStaffModal
        opened={addModalOpened}
        onClose={closeAddModal}
        onAdd={handleAddUser}
        loading={isAddUserLoading}
        supervisors={supervisors}
        newUser={newUser}
        setNewUser={setNewUser}
        errors={errors}
        setErrors={setErrors}
        handleFileChange={handleFileChange}
        setPreviewImage={setPreviewImage}
        previewImage={previewImage}
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

      <Card
        radius="lg"
        style={{
          backgroundColor: "var(--color-5)",
        }}
      >
        <div>
          <BurgerButton />
          <span style={{}} className={classes.title}>
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
            {/* 🔵 NEW: Sort Select مفعّل */}
            <Select
              placeholder={t.Sortby}
              value={filter}
              mr={10}
              onChange={handleFilterChange} // Call the sorting function here
              rightSection={<Dropdown />}
              data={[
                { value: "", label: t.All }, // Mantine بيحتاج string؛ لو بتحصل مشكلة, خلي value:"" وتعامل معها
                { value: "Most seller", label: t.MostSeller },
                { value: "Least seller", label: t.LeastSeller },
              ]}
              // Mantine بترجع string دايمًا؛ نزبط الـ null:
              // NOTE: already handled in handleFilterChange
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
              <span style={{ marginRight: "13px" }}>
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

            {searchQuery === "" && (filter === null || filter === "" || filter === undefined) ? (
              // 👇 الوضع العادي (إظهار المشرفين + الموظفين تحتهم)
              <Table.Tbody
                style={{
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                }}
              >
                {supervisors.map((supervisor) => (
                  <React.Fragment key={supervisor.supervisor_id}>
                    <Table.Tr key={supervisor.supervisor_id}>
                      <Table.Td className={classes.tablebody} w="20%">
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
                          }}
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
                        {supervisor.position}
                      </Table.Td>

                      <Table.Td fz="sm" className={classes.tablebody} w="15%">
                        {supervisor.phone_number}
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
                          </ActionIcon>
                          {/* <ActionIcon ... حذف */ }
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
                                        }}
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
                                      {employee.position}
                                    </Table.Td>

                                    <Table.Td
                                      fz="sm"
                                      className={classes.tablebody}
                                      w="15%"
                                    >
                                      {employee.phone_number}
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
                                        {/* <ActionIcon ... حذف */ }
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
                  <Table.Tr key={employee.employee_id}>
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
                        }}
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
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            ) : (
              // 👇 وضع البحث / الترتيب (flat list)
              <Table.Tbody
                style={{
                  borderRadius: "20px",
                  border: "1px solid transparent",
                }}
              >
                {searchedEmployees?.map((employee) => {
                  const contracts =
                    employee.__contracts ??
                    employee?.performance_metrics?.total_contracts ??
                    0;
                  return (
                    <Table.Tr
                      style={{
                        borderRadius: "20px",
                        border: "1px solid transparent",
                      }}
                      key={employee.employee_id ?? employee.id}
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
                            {employee.name}{" "}
                            {/* 👇 (اختياري) عرض عدد العقود */}
                            <Text
                              component="span"
                              fz="xs"
                              c="dimmed"
                            >{`(${contracts})`}</Text>
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
                          }}
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
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}

                {/* لو عامل Search بدون Sort، ممكن برضه نعرض المشرفين المتطابقين */}
                {filter === null &&
                  searchedSupervisors?.map((supervisor) => (
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
                          }}
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
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            )}
          </Table>
        </Table.ScrollContainer>
      </Card>
    </>
  );
}

export default Staff; 

