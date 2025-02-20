import { Routes, Route } from "react-router-dom";
import CompanyHomePage from "../pages/CompanyHomePage";
import EmployeeHomePage from "../pages/EmployeeHomePage";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import JobDetailsPage from "../pages/JobDetailsPage";
import RegistrationPage from "../pages/RegistrationPage";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/*" element={<Login />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/company" element={<CompanyHomePage />} />
        <Route path="/employee" element={<EmployeeHomePage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/job/:jobId" element={<JobDetailsPage />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
