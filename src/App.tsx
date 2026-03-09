import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/Auth/Login";
import AdminLoginPage from "./pages/Auth/AdminLogin.jsx";

import Dashboard from "./pages/Dashboard/Dashboard";
import ManageProjects from "./pages/Projects/ManageProjects";
import ViewProject from "./pages/Projects/ViewProject";
import ProjectsAvailability from "./pages/Projects/ProjectsAvailability";
import AddProject from "./pages/Projects/AddProject";
import EditProject from "./pages/Projects/Editproject";
import Structure from "./pages/Projects/Structure";
import Documents from "./pages/Projects/Documents";

import Postsale from "./pages/postsale/addnew.jsx";
import AllPostSales from "./pages/postsale/AllPostSales.jsx";
import ViewPostSale from "./pages/postsale/ViewPostSale.jsx";

import AddPresale from "./pages/presale/AddPresale.jsx";
import AllPreSales from "./pages/presale/AllPresale.jsx";
import EditPreSales from "./pages/presale/EditPreSales.jsx";

import AddClient from "./pages/client/AddCleint.jsx";
import UpdateClient from "./pages/client/EditClient.jsx";
import AllClient from "./pages/client/AllClients.jsx";

import AddEmployee from "./pages/Employee/AddEmployee.jsx";
import AllEmployees from "./pages/Employee/AllEmployees.jsx";
import EditEmployee from "./pages/Employee/EditEmployee.jsx";
import AllActiveEmployee from "./pages/Employee/AllActiveEmployee.jsx";

import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./components/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/adminlogin" element={<AdminLoginPage />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />

            {/* Projects */}
            <Route path="projects/manage" element={<ManageProjects />} />
            <Route
              path="projects/availability"
              element={<ProjectsAvailability />}
            />
            <Route path="projects/add" element={<AddProject />} />
            <Route path="projects/view/:projectId" element={<ViewProject />} />
            <Route path="projects/edit/:projectId" element={<EditProject />} />
            <Route
              path="projects/:projectId/structure"
              element={<Structure />}
            />
            <Route path="projects/docs" element={<Documents />} />

            {/* Pre Sales */}
            <Route path="presales/new" element={<AddPresale />} />
            <Route path="presales/allpresales" element={<AllPreSales />} />
            <Route path="presales/edit/:srNumber" element={<EditPreSales />} />

            {/* Post Sales */}
            <Route path="postsales/*" element={<Postsale />} />
            <Route path="postsales/all" element={<AllPostSales />} />
            <Route path="postsales/view/:id" element={<ViewPostSale />} />

            {/* Clients */}
            <Route path="clients/add" element={<AddClient />} />
            <Route path="clients/update/:id" element={<UpdateClient />} />
            <Route path="clients/allclients" element={<AllClient />} />

            {/* Employees */}
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/all" element={<AllEmployees />} />
            <Route path="employees/active" element={<AllActiveEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />

            {/* Other */}
            <Route path="reports/*" element={<PlaceholderPage />} />
            <Route path="accounts/*" element={<PlaceholderPage />} />
            <Route path="bms-billing/*" element={<PlaceholderPage />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
