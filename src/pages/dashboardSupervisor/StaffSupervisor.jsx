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
import { useDisclosure } from "@mantine/hooks";
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
import AddIcon from "../../components/icons/addIcon";
import EditIcon from "../../components/icons/edit";
import { useQueryClient } from "@tanstack/react-query";

const jobColors = {
  supervisor: "orange",
  employee: "cyan",
};

// ================ KPI Utilities ================
function normalizeTeamKpisResponse(raw) {
  // نتوقع الشكل: raw.data.data.team_members
  if (!raw || !raw.data || !raw.data.data) return [];
  const teamMembers = raw.data.data.team_members || [];
  return teamMembers.map((tm) => ({
    employee_id: tm.employee?.id,
    name: tm.employee?.name,
    email: tm.employee?.email,
    metrics: tm.metrics || {
      total_contracts: 0,
      sales: { count: 0, total_amount: 0, average_price: 0 },
      rentals: { count: 0, total_amount: 0, average_price: 0 },
      commissions: 0,
    },
  }));
}

const EMPTY_METRICS = {
  total_contracts: 0,
  sales: { count: 0, total_amount: 0, average_price: 0 },
  rentals: { count: 0, total_amount: 0, average_price: 0 },
  commissions: 0,
};

// اختيار المعيار الأساسي للترتيب (يمكن تغييره إلى total_amount لو حبيت)
const getSalesPrimaryValue = (metrics) => metrics?.sales?.count || 0;
const getRentalsSecondaryValue = (metrics) => metrics?.rentals?.count || 0;
const getTotalContractsTertiaryValue = (metrics) => metrics?.total_contracts || 0;

/**
 * دالة مقارنة للـ Most seller (ترتيب تنازلي)
 */
function compareMostSeller(aMetrics, bMetrics) {
  const aSales = getSalesPrimaryValue(aMetrics);
  const bSales = getSalesPrimaryValue(bMetrics);
  if (bSales !== aSales) return bSales - aSales;

  const aRentals = getRentalsSecondaryValue(aMetrics);
  const bRentals = getRentalsSecondaryValue(bMetrics);
  if (bRentals !== aRentals) return bRentals - aRentals;

  const aTotal = getTotalContractsTertiaryValue(aMetrics);
  const bTotal = getTotalContractsTertiaryValue(bMetrics);
  if (bTotal !== aTotal) return bTotal - aTotal;

  return 0;
}

/**
 * دالة مقارنة للـ Least seller (ترتيب تصاعدي)
 */
function compareLeastSeller(aMetrics, bMetrics) {
  const aSales = getSalesPrimaryValue(aMetrics);
  const bSales = getSalesPrimaryValue(bMetrics);
  if (aSales !== bSales) return aSales - bSales;

  const aRentals = getRentalsSecondaryValue(aMetrics);
  const bRentals = getRentalsSecondaryValue(bMetrics);
  if (aRentals !== bRentals) return aRentals - bRentals;

  const aTotal = getTotalContractsTertiaryValue(aMetrics);
  const bTotal = getTotalContractsTertiaryValue(bMetrics);
  if (aTotal !== bTotal) return aTotal - bTotal;

  return 0;
}

function StaffSupervisor() {
  const { user } = useAuth();
  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("none"); // none | most_seller | least_seller

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [kpiMembers, setKpiMembers] = useState([]); // raw KPI data for team members
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [supervisors, setSupervisors] = useState([]);

  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // ===== Fetch Employees =====
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("employees", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const emps = response.data.data.employees || [];
      setEmployees(emps);
      // لو عندك endpoint للمشرفين تقدر تجيبه هنا
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

  // ===== Fetch KPI (team) =====
  const fetchTeamKpis = async () => {
    try {
      const response = await axiosInstance.get("kpi/supervisorTeamKpis", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const normalized = normalizeTeamKpisResponse(response);
      setKpiMembers(normalized);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to fetch KPI data",
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchEmployees();
      fetchTeamKpis();
    }
  }, [user?.token]);

  // ===== Map للـ KPI للوصول السريع بالـ employee_id =====
  const kpiMap = useMemo(() => {
    const map = new Map();
    kpiMembers.forEach((k) => {
      if (k.employee_id != null) map.set(Number(k.employee_id), k.metrics);
    });
    return map;
  }, [kpiMembers]);

  // ===== دوال مساعدة للوصول لقيَم موظف واحد =====
  const getMetrics = (emp) =>
    kpiMap.get(Number(emp.employee_id)) || EMPTY_METRICS;
  const getSalesCount = (emp) => getMetrics(emp).sales?.count || 0;
  const getRentalsCount = (emp) => getMetrics(emp).rentals?.count || 0;
  const getTotalContracts = (emp) => getMetrics(emp).total_contracts || 0;

  // ===== معالجة (بحث + ترتيب) داخل useMemo =====
  const processedEmployees = useMemo(() => {
    let base = [...employees];

    // 🔍 تطبيق البحث أولاً
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      base = base.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(q) ||
          emp.email?.toLowerCase().includes(q) ||
          emp.phone_number?.toLowerCase().includes(q)
      );
    }

    // 🔄 تطبيق الترتيب حسب الفلتر
    if (filter === "most_seller") {
      base.sort((a, b) =>
        compareMostSeller(getMetrics(a), getMetrics(b))
      );
    } else if (filter === "least_seller") {
      base.sort((a, b) =>
        compareLeastSeller(getMetrics(a), getMetrics(b))
      );
    }

    return base;
  }, [employees, searchQuery, filter, kpiMap]);

  // ===== أعلى و أقل Seller (لاستخدامها في تمييز الصف) =====
  const topEmployeeId = useMemo(() => {
    if (!processedEmployees.length) return null;
    if (filter !== "most_seller") return null;
    return processedEmployees[0]?.employee_id;
  }, [processedEmployees, filter]);

  const bottomEmployeeId = useMemo(() => {
    if (!processedEmployees.length) return null;
    if (filter !== "least_seller") return null;
    return processedEmployees[0]?.employee_id;
  }, [processedEmployees, filter]);

  // ===== Handlers =====
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const validateForm = (userObj, isEdit = false) => {
    const newErrors = {};
    if (!userObj.name) newErrors.name = "Name is required";
    if (!userObj.email) newErrors.email = "Email is required";
    if (!userObj.password && !isEdit) newErrors.password = "Password is required";
    if (!userObj.phone_number) newErrors.phone_number = "Phone number is required";
    if (!userObj.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUser = async () => {
    if (!validateForm(newUser)) return;
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(newUser).forEach(([k, v]) => {
        if (v !== null && v !== undefined) formData.append(k, v);
      });

      await axiosInstance.post("employees", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      notifications.show({
        title: "Success",
        message: "User added successfully!",
        color: "green",
      });

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

      fetchEmployees();
      fetchTeamKpis();
      closeAddModal();
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
    fetchTeamKpis();
  };

  // (لو احتجت حذف موظف)
  // const handleDeleteEmployee = async (id) => { ... }

  if (loading && !employees.length) {
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
          {/* Search */}
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

          <div className={classes.addAndSort} style={{ gap: 12, display: 'flex' }}>
            {/* Filter Select */}
            <Select
              value={filter}
              onChange={setFilter}
              data={[
                { value: "none", label: t.All || "All" },
                { value: "most_seller", label: t.MostSeller || "Most seller" },
                { value: "least_seller", label: t.LeastSeller || "Least seller" },
              ]}
              placeholder={t.Sort || "Sort"}
              size="xs"
              style={{ width: 160 }}
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
                <Table.Th>{t.Total}</Table.Th> 

                <Table.Th>{t.Position}</Table.Th>
                <Table.Th>{t.Email}</Table.Th>
                <Table.Th>{t.Phone}</Table.Th>
                <Table.Th>{t.Supervisor}</Table.Th>
                {/* أعمدة KPI إضافية */}
                {/* <Table.Th>Sales</Table.Th>
                <Table.Th>Rentals</Table.Th>
                <Table.Th>Total</Table.Th> */}
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {processedEmployees.map((employee) => {
                const metrics = getMetrics(employee);
                const isTop = employee.employee_id === topEmployeeId;
                const isBottom = employee.employee_id === bottomEmployeeId;
                return (
                  <Table.Tr
                    key={employee.employee_id}
                    style={{
                      borderRadius: "20px",
                      border: "1px solid var(--color-border)",
                      background:
                        isTop
                          ? "rgba(0,200,120,0.08)"
                          : isBottom
                          ? "rgba(255,100,80,0.08)"
                          : "transparent",
                      position: "relative",
                    }}
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
                          {isTop && (
                            <Badge color="teal" size="xs" ml={4}>
                              {t.Top || "Top"}
                            </Badge>
                          )}
                          {isBottom && (
                            <Badge color="red" size="xs" ml={4}>
                              {t.Lowest || "Lowest"}
                            </Badge>
                          )}
                        </Text>
                      </Group>
                    </Table.Td>
       <Table.Td>
                      <Text size="sm" style={{
                        textAlign:"center"
                      }} fw={500}>
                        {metrics.total_contracts || 0}
                      </Text>
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

                    {/* KPI Columns */}
                    {/* <Table.Td>
                      <Text size="sm" fw={500}>
                        {metrics.sales?.count || 0}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {metrics.rentals?.count || 0}
                      </Text>
                    </Table.Td> */}
                    {/* <Table.Td>
                      <Text size="sm" fw={500}>
                        {metrics.total_contracts || 0}
                      </Text>
                    </Table.Td> */}

                    <Table.Td>
                      <Group gap={0} justify="flex-end">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => handleEditClick(employee)}
                          mr={24}
                        >
                          <EditIcon />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
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

// import {
//   ActionIcon,
//   Anchor,
//   Avatar,
//   Badge,
//   Group,
//   Table,
//   Text,
//   Center,
//   Loader,
//   Card,
//   Select,
//   useMantineColorScheme,
// } from "@mantine/core";
// import { useDisclosure, useMediaQuery } from "@mantine/hooks";
// import React, { useEffect, useState, useMemo } from "react";
// import { notifications } from "@mantine/notifications";
// import axiosInstance from "../../api/config";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/authContext";
// import classes from "../../styles/realEstates.module.css";
// import AddStaffModal from "../../components/modals/addStaffModal";
// import UpdataStaffModal from "./../../components/modals/editStaffModal_Supervisor";
// import { BurgerButton } from "../../components/buttons/burgerButton";
// import Notifications from "../../components/company/Notifications";
// import { useTranslation } from "../../context/LanguageContext";
// import Search from "../../components/icons/search";
// import Dropdown from "../../components/icons/dropdown";
// import AddIcon from "../../components/icons/addIcon";
// import DeleteIcon from "../../components/icons/DeleteIcon";
// import EditIcon from "../../components/icons/edit";
// import { useQueryClient } from "@tanstack/react-query";

// const jobColors = {
//   supervisor: "orange",
//   employee: "cyan",
// };

// // 🔵 NEW: Utility function to normalize KPI data
// function normalizeKpiData(raw) {
//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw;
//   if (raw && raw.data && Array.isArray(raw.data)) return raw.data;
//   return [];
// }

// // 🔵 NEW: Utility function to get contract count safely
// function getContractCountFromKpi(kpiRecord) {
//   if (!kpiRecord?.performance_metrics) return 0;
//   const pm = kpiRecord.performance_metrics;
//   const salesCount = pm?.sales?.count ?? 0;
//   const rentalsCount = pm?.rentals?.count ?? 0;
//   return salesCount + rentalsCount;
// }

// // 🔵 NEW: Default metrics if no KPI found
// const EMPTY_METRICS = {
//   total_contracts: 0,
//   sales: { count: 0, total_amount: 0, average_price: 0 },
//   rentals: { count: 0, total_amount: 0, average_price: 0 },
//   commissions: 0,
// };

// function StaffSupervisor() {
//   const { user } = useAuth();
//   const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
//     useDisclosure(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [newUser, setNewUser] = useState({
//     name: "",
//     email: "",
//     password: "",
//     position: "employee",
//     phone_number: "",
//     address: "",
//     picture: null,
//     supervisor_id: null,
//   });
//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     password: "",
//     position: "",
//     phone_number: "",
//     address: "",
//     image: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [searchedEmployees, setSearchedEmployees] = useState([]);
//   const [supervisors, setSupervisors] = useState([]);
//   const [kpiData, setKpiData] = useState([]);
//   const [editingEmployee, setEditingEmployee] = useState(null);
//   const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
//     useDisclosure(false);
//   const [filter, setFilter] = useState("");
//   const navigate = useNavigate();
//   const { colorScheme } = useMantineColorScheme();
//   const { t } = useTranslation();
//   const queryClient = useQueryClient();

//   // 🔵 NEW: kpiMap for fast access
//   const kpiMap = useMemo(() => {
//     const map = new Map();
//     kpiData.forEach((kpi) => {
//       const id = kpi.employee?.id;
//       if (id != null) map.set(Number(id), kpi);
//     });
//     return map;
//   }, [kpiData]);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get("employees", {
//         headers: { Authorization: `Bearer ${user.token}` },
//       });
//       setEmployees(response.data.data.employees);
//       setSearchedEmployees(response.data.data.employees);
//     } catch (error) {
//       notifications.show({
//         title: "Error",
//         message: error.response?.data?.message || "Failed to fetch employees",
//         color: "red",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // const fetchDataKPIs = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await axiosInstance.get(`kpi/supervisorTeamKpis`, {
//   //       headers: { Authorization: `Bearer ${user.token}` },
//   //     });
      
//   //     const normalized = normalizeKpiData(response.data);
//   //     setKpiData(normalized);
//   //   } catch (error) {
//   //     notifications.show({
//   //       title: "Error",
//   //       message: "Failed to fetch KPI data",
//   //       color: "red",
//   //     });
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSearchChange = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);

//     if (filter === "Most seller" || filter === "Least seller") {
//       setSearchedEmployees((prev) => {
//         const base = prev.length ? prev : employees;
//         return query.trim() === ""
//           ? base
//           : base.filter(
//               (emp) =>
//                 emp.name?.toLowerCase().includes(query) ||
//                 emp.email?.toLowerCase().includes(query) ||
//                 emp.phone_number?.includes(query)
//             );
//       });
//       return;
//     }

//     setSearchedEmployees(
//       query.trim() === ""
//         ? employees
//         : employees.filter(
//             (employee) =>
//               employee.name?.toLowerCase().includes(query) ||
//               employee.email?.toLowerCase().includes(query) ||
//               employee.phone_number?.includes(query)
//           )
//     );
//   };

//   const validateForm = (user, isEdit = false) => {
//     const newErrors = {};
//     if (!user.name) newErrors.name = "Name is required";
//     if (!user.email) newErrors.email = "Email is required";
//     if (!user.password && !isEdit) newErrors.password = "Password is required";
//     if (!user.phone_number) newErrors.phone_number = "Phone number is required";
//     if (!user.address) newErrors.address = "Address is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleAddUser = async (isSupervisor) => {
//     if (!validateForm(newUser)) return;
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", newUser.name);
//       formData.append("email", newUser.email);
//       formData.append("password", newUser.password);
//       formData.append("position", newUser.position);
//       formData.append("phone_number", newUser.phone_number);
//       formData.append("address", newUser.address);
//       formData.append("supervisor_id", newUser.supervisor_id);
//       if (newUser.picture) formData.append("picture", newUser.picture);
//       const endpoint = isSupervisor ? "supervisors" : "employees";
//       await axiosInstance.post(endpoint, formData, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       fetchEmployees();
//       closeAddModal();
//       setNewUser({
//         name: "",
//         email: "",
//         password: "",
//         position: "employee",
//         phone_number: "",
//         address: "",
//         picture: null,
//         supervisor_id: null,
//       });
//       notifications.show({
//         title: "Success",
//         message: `User added successfully!`,
//         color: "green",
//       });
//     } catch (error) {
//       notifications.show({
//         title: "Error",
//         message: error.response?.data?.message || "Failed to add user",
//         color: "red",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = (employee) => {
//     setEditingEmployee(employee);
//     openEditModal();
//   };

//   const handleUpdateSuccess = () => {
//     fetchEmployees();
//   };

//   const handleDeleteEmployee = async (id) => {
//     try {
//       const response = await axiosInstance.delete(`employees/${id}`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });
//       if (response.data.status === "success") {
//         notifications.show({
//           title: "Deleted",
//           message: response.data.message || "Employee deleted successfully",
//           color: "green",
//         });
//         fetchEmployees();
//       }
//     } catch (error) {
//       notifications.show({
//         title: "Error",
//         message: error.response?.data?.message || "Failed to delete employee",
//         color: "red",
//       });
//     }
//   };

 
//   useEffect(() => {
//     fetchEmployees();
//     // fetchDataKPIs();
//   }, []);

//   if (loading) {
//     return (
//       <Center
//         style={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           zIndex: 2,
//         }}
//       >
//         <Loader size="xl" />
//       </Center>
//     );
//   }

//   return (
//     <>
//       <Card style={{ backgroundColor: "var(--color-5)" }} radius="lg">
//         <div>
//           <BurgerButton />
//           <span className={classes.title}>{t.Staff}</span>
//           <Notifications />
//         </div>
//         <div className={classes.controls}>
//           <div className={classes.divSearch}>
//             <input
//               className={classes.search}
//               placeholder={t.Search}
//               value={searchQuery}
//               onChange={handleSearchChange}
//               style={{ border: "1.5px solid var(--color-border)" }}
//             />
//             <Search />
//           </div>
//           <div className={classes.addAndSort}>
      
//             <button
//               className={classes.add}
//               onClick={openAddModal}
//               style={{ cursor: "pointer", border: "1.5px solid var(--color-border)" }}
//             >
//               <AddIcon />
//               <span style={{ marginLeft: "13px" }}>{t.Add}</span>
//             </button>
//           </div>
//         </div>
//         <Table.ScrollContainer shadow="xs" mt={20}>
//           <Table verticalSpacing="sm">
//             <Table.Thead>
//               <Table.Tr style={{ borderRadius: "20px", border: "1px solid var(--color-border)" }}>
//                 <Table.Th>{t.Name}</Table.Th>
//                 <Table.Th>{t.Position}</Table.Th>
//                 <Table.Th>{t.Email}</Table.Th>
//                 <Table.Th>{t.Phone}</Table.Th>
//                 <Table.Th>{t.Supervisor}</Table.Th>
//                 <Table.Th />
//               </Table.Tr>
//             </Table.Thead>
//             <Table.Tbody>
//               {searchedEmployees?.map((employee) => (
//                 <Table.Tr
//                   key={employee.employee_id}
//                   style={{ borderRadius: "20px", border: "1px solid var(--color-border)" }}
//                 >
//                   <Table.Td>
//                     <Group
//                       style={{ cursor: "pointer" }}
//                       onClick={() =>
//                         navigate(`/dashboard-supervisor/Team/${employee.employee_id}`)
//                       }
//                       gap="sm"
//                     >
//                       <Avatar
//                         size={30}
//                         src={employee.picture_url}
//                         color={jobColors[employee.position]}
//                         radius={30}
//                       />
//                       <Text fw={500}>
//                         {employee.name}{" "} 
//                       </Text>
//                     </Group>
//                   </Table.Td>
//                   <Table.Td>
//                     <Badge color={jobColors[employee.position]} variant="light">
//                       {employee.position}
//                     </Badge>
//                   </Table.Td>
//                   <Table.Td>
//                     <Anchor component="button" size="sm">
//                       {employee.email}
//                     </Anchor>
//                   </Table.Td>
//                   <Table.Td>
//                     <Text>{employee.phone_number}</Text>
//                   </Table.Td>
//                   <Table.Td>
//                     <Text>{employee.supervisor?.name || "N/A"}</Text>
//                   </Table.Td>
//                   <Table.Td>
//                     <Group gap={0} justify="flex-end">
//                       <ActionIcon
//                         variant="subtle"
//                         color="gray"
//                         onClick={() => {
//                           handleEditClick(employee);
//                           setEditingEmployee(employee);
//                           openEditModal();
//                         }}
//                         mr={24}
//                       >
//                         <EditIcon />
//                       </ActionIcon>
//                     </Group>
//                   </Table.Td>
//                 </Table.Tr>
//               ))}
//             </Table.Tbody>
//           </Table>
//         </Table.ScrollContainer>
//       </Card>

//       <AddStaffModal
//         opened={addModalOpened}
//         onClose={closeAddModal}
//         onAdd={handleAddUser}
//         loading={loading}
//         supervisors={supervisors}
//         newUser={newUser}
//         setNewUser={setNewUser}
//         setErrors={setErrors}
//         errors={errors}
//       />
//       <UpdataStaffModal
//         opened={editModalOpened}
//         onClose={closeEditModal}
//         employee={editingEmployee}
//         onUpdateSuccess={handleUpdateSuccess}
//       />
//     </>
//   );
// }

// export default StaffSupervisor; 