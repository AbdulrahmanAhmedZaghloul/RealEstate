
// App.jsx
// Local dependencies imports
import "@mantine/core/styles.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import { SidebarProvider } from "./context/sidebarContext.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import About from "./pages/About.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/dashboardCompany/Profile.jsx";
import Staff from "./pages/dashboardCompany/Staff.jsx";
import Contracts from "./pages/dashboardCompany/Contracts.jsx";
import Transactions from "./pages/dashboardCompany/Transactions.jsx";
import Analytics from "./pages/dashboardCompany/Analytics.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import VerifyOTPForgotPassword from "./pages/VerifyOTPForgotPassword.jsx";
import VerifyOTPCreateAccount from "./pages/VerifyOTPCreateAccount.jsx";
import PropertyDetails from "./components/company/PropertyDetails.jsx";
import ContractDetails from "./components/company/ContractDetails.jsx";
import Properties from "./pages/dashboardCompany/Properties.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";
import DashboardLayout from "./pages/dashboardCompany/DashboardLayout.jsx";
import EmployeeDetails from "./components/company/EmployeeDetails.jsx";
import SupervisorDetails from "./components/company/SupervisorDetails.jsx";
import Categories from "./pages/dashboardCompany/Categories.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Home from "./pages/Home.jsx";
import StartAccount from "./pages/StartAccount.jsx";
import ChoosePlan from "./pages/ChoosePlan.jsx";
import MakePayment from "./pages/MakePayment.jsx";
import DashboardSupervisorLayout from "./pages/dashboardSupervisor/DashboardLayoutSupervisor.jsx";
import ProfileSupervisor from "./pages/dashboardSupervisor/ProfileSupervisor.jsx";
import ContractsSupervisor from "./pages/dashboardSupervisor/ContractsSupervisor.jsx";
import StaffSupervisor from "./pages/dashboardSupervisor/StaffSupervisor.jsx";
import RequestsSupervisor from "./pages/dashboardSupervisor/RequestsSupervisor.jsx";
import PropertiesSupervisor from "./pages/dashboardSupervisor/PropertiesSupervisor.jsx";
import EmployeeDetailsSupervisor from "./components/supervisor/EmployeeDetailsSupervisor.jsx";
import PropertyDetailsSupervisor from "./components/supervisor/PropertyDetailsSupervisor.jsx";
import ContractDetailsSupervisor from "./components/supervisor/ContractDetailsSupervisor.jsx";
import DashboardEmployeeLayout from "./pages/dashboardEmployee/DashboardLayoutEmployee.jsx";
import ProfileEmployee from "./pages/dashboardEmployee/ProfileEmployee.jsx";
import PropertiesEmployee from "./pages/dashboardEmployee/PropertiesEmployee.jsx";
import RequestsEmployee from "./pages/dashboardEmployee/RequestsEmployee.jsx";
import PropertyDetailsEmployee from "./components/employee/PropertyDetailsEmployee.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import DashboardLayoutMarketer from "./pages/dashboardMarketer/DashboardLayoutMarketer.jsx";
import PropertyDetailsMarketer from "./components/Marketer/PropertyDetailsMarketer.jsx";
import ContractsMarketer from "./pages/dashboardMarketer/ContractsMarketer.jsx";
import CategoriesMarketer from "./pages/dashboardMarketer/CategoriesMarketer.jsx";
import PropertiesMarketer from "./pages/dashboardMarketer/PropertiesMarketer.jsx";
import ContractDetailsMarketer from "./components/Marketer/ContractDetailsMarketer.jsx";
import AnalyticsMarketer from "./pages/dashboardMarketer/AnalyticsMarketer.jsx";
import ProfileMarketer from "./pages/dashboardMarketer/ProfileMarketer.jsx";
import PublicContractView from "./pages/PublicContractView.jsx";

function App() {
  return (
    <LanguageProvider>



      <AuthProvider>
        <SidebarProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/MakePayment" element={<MakePayment />} />
            {/* <Route path="/MatterOrCompany" element={<MatterOrCompany />} /> */}
            <Route path="/choosePlan" element={<ChoosePlan />} />
            <Route path="/StartAccount" element={<StartAccount />} />

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/Terms" element={<Terms />} />
            <Route path="/Privacy" element={<Privacy />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/ShareContracts/:path" element={<PublicContractView />} />
            <Route
              path="/forgot-password"
              element={
                // <ProtectedRoute allowedRoles={[]}>
                <ForgotPassword />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/verify-otp-create-account"
              element={
                // <ProtectedRoute allowedRoles={[]}>
                <VerifyOTPCreateAccount />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/verify-otp-forgot-password"
              element={
                // <ProtectedRoute allowedRoles={[]}>
                <VerifyOTPForgotPassword />
                // </ProtectedRoute>
              }
            />
            <Route
              path="/ResetPassword"
              element={
                <ResetPassword />
              }
            />
            {/* <Route path="*" element={<NotFound />} /> */}
            <Route path="/subscription-plans" element={<SubscriptionPlans />} />

            {/* Company Manager Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["company"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Profile />} />
              <Route path="Team" element={<Staff />} />
              <Route path="Contracts" element={<Contracts />} />
              <Route path="Analytics" element={<Analytics />} />
              <Route path="Categories" element={<Categories />} />
              <Route path="Transactions" element={<Transactions />} />
              <Route path="employee/:id" element={<EmployeeDetails />} />
              <Route path="supervisor/:id" element={<SupervisorDetails />} />
              <Route path="Properties/:id" element={<PropertyDetails />} />
              <Route path="Properties" element={<Properties />} />
              <Route path="Contracts/:id" element={<ContractDetails />} />
            </Route>

            {/* Marketer Manager Routes */}
            <Route
              path="/dashboard-Marketer"
              element={
                <ProtectedRoute allowedRoles={["marketer"]}>
                  <DashboardLayoutMarketer />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileMarketer />} />
              <Route path="ContractsMarketer" element={<ContractsMarketer />} />
              <Route path="AnalyticsMarketer" element={<AnalyticsMarketer />} />
              <Route path="CategoriesMarketer" element={<CategoriesMarketer />} />
              <Route path="PropertyDetailsMarketer/:id" element={<PropertyDetailsMarketer />} />
              <Route path="PropertiesMarketer" element={<PropertiesMarketer />} />
              <Route path="ContractDetailsMarketer/:id" element={<ContractDetailsMarketer />} />
            </Route>

            {/* Supervisor Routes */}
            <Route
              path="/dashboard-supervisor"
              element={
                <ProtectedRoute allowedRoles={["supervisor"]}>
                  <DashboardSupervisorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileSupervisor />} />
              <Route path="Properties" element={<PropertiesSupervisor />} />
              <Route path="Requests" element={<RequestsSupervisor />} />
              <Route path="Team" element={<StaffSupervisor />} />
              <Route
                path="Contracts"
                element={<ContractsSupervisor role="supervisor" />}
              />
              <Route path="Team/:id" element={<EmployeeDetailsSupervisor />} />
              <Route
                path="Contracts/:id"
                element={<ContractDetailsSupervisor />}
              />
              <Route
                path="Properties/:id"
                element={<PropertyDetailsSupervisor />}
              />
            </Route>

            {/* Employee Routes */}
            <Route
              path="/dashboard-employee"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <DashboardEmployeeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProfileEmployee />} />
              <Route path="Properties" element={<PropertiesEmployee />} />
              <Route path="Requests" element={<RequestsEmployee />} />
              <Route
                path="Properties/:id"
                element={<PropertyDetailsEmployee />}
              />
            </Route>
          </Routes>
        </SidebarProvider>
      </AuthProvider>
    </LanguageProvider>

    //
  )
}

export default App;
