// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import Layout from "./components/Layout/Layout";
// import ProtectedRoute from "./components/ProtectedRoute";
// import ClientLoginPage from "./pages/Auth/ClientLogin";
// import LoginPage from "./pages/Auth/Login";
// import AdminLoginPage from "./pages/Auth/AdminLogin.jsx";
// import { canManage } from "./hooks/roleCheck";
// import Dashboard from "./pages/Dashboard/Dashboard";
// import ClientDashboard from "./pages/Dashboard/ClientDashbaoard.jsx";
// import EmployeeDashboard from "./pages/Dashboard/EmployeeDashboard";
// import ManageProjects from "./pages/Projects/ManageProjects";
// import ViewProject from "./pages/Projects/ViewProject";
// import ProjectsAvailability from "./pages/Projects/ProjectsAvailability";
// import AddProject from "./pages/Projects/AddProject";
// import EditProject from "./pages/Projects/Editproject";
// import Structure from "./pages/Projects/Structure";
// import ViewStructure from "./pages/Projects/ViewStructure";
// import Documents from "./pages/Projects/Documents";

// import Postsale from "./pages/postsale/Createpostsales.jsx";
// import AllPostSales from "./pages/postsale/AllPostsales.jsx";
// import ViewPostSale from "./pages/postsale/ViewPostSale.jsx";

// import AddPresale from "./pages/presale/AddPresale.jsx";
// import AllPreSales from "./pages/presale/AllPresale.jsx";
// import EditPreSales from "./pages/presale/EditPreSales.jsx";
// import QuotationDetailPage from "./pages/presale/Quotationdetailpage.jsx";

// import AddClient from "./pages/client/AddCleint.jsx";
// import UpdateClient from "./pages/client/EditClient.jsx";
// import AllClient from "./pages/client/AllClients.jsx";
// import InvoicePage from "./pages/postsale/Invoice.jsx";
// import AddEmployee from "./pages/Employee/AddEmployee.jsx";
// import ProfilePage from "./pages/Employee/ProfilePage.jsx";
// import AllEmployees from "./pages/Employee/AllEmployees.jsx";
// import EditEmployee from "./pages/Employee/EditEmployee.jsx";
// import AllActiveEmployee from "./pages/Employee/AllActiveEmployee.jsx";
// import DailyAttendance from "./pages/Employee/DailyAttendance.jsx";
// import AttendanceCalender from "./pages/Employee/AttendanceCalendar.jsx";
// import MyAttendance from "./pages/Employee/MyAttendance.jsx";

// import PlaceholderPage from "./pages/PlaceholderPage";
// import NotFound from "./pages/NotFound";

// import { AuthProvider } from "./components/AuthContext";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* PUBLIC ROUTE */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/adminlogin" element={<AdminLoginPage />} />
//           <Route path="/clientlogin" element={<ClientLoginPage />} />
//           {/* <Route path="/client" element={<ClientDashboard />} /> */}

//           {/* PROTECTED ROUTES */}
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Layout />
//               </ProtectedRoute>
//             }
//           >
//             {/* <Route index element={<Dashboard />} /> */}
//             <Route
//               index
//               element={
//                 canManage() ? (
//                   <Dashboard />
//                 ) : JSON.parse(localStorage.getItem("user"))?.role ===
//                   "CLIENT" ? (
//                   <ClientDashboard />
//                 ) : (
//                   <EmployeeDashboard />
//                 )
//               }
//             />
//             {/* Projects */}
//             <Route path="projects/manage" element={<ManageProjects />} />
//             <Route
//               path="projects/availability"
//               element={<ProjectsAvailability />}
//             />
//             <Route path="projects/add" element={<AddProject />} />
//             <Route path="projects/view/:projectId" element={<ViewProject />} />
//             <Route path="projects/edit/:projectId" element={<EditProject />} />
//             <Route
//               path="projects/:projectId/structure"
//               element={<Structure />}
//             />

//             <Route
//               path="/projects/:projectId/structure/:structureId"
//               element={<ViewStructure />}
//             />
//             <Route path="projects/docs" element={<Documents />} />

//             {/* Pre Sales */}
//             <Route path="presales/new" element={<AddPresale />} />
//             <Route path="presales/allpresales" element={<AllPreSales />} />
//             <Route path="presales/edit/:srNumber" element={<EditPreSales />} />
//             <Route path="/quotations/:id" element={<QuotationDetailPage />} />
//             {/* Post Sales */}
//             <Route path="postsales/*" element={<Postsale />} />
//             <Route path="postsales/all" element={<AllPostSales />} />
//             <Route path="postsales/view/:id" element={<ViewPostSale />} />

//             <Route
//               path="/postsales/:postSalesId/invoice/:invoiseId/:type"
//               element={<InvoicePage />}
//             />
//             {/* Clients */}
//             <Route path="clients/add" element={<AddClient />} />
//             <Route path="clients/update/:id" element={<UpdateClient />} />
//             <Route path="clients/allclients" element={<AllClient />} />

//             {/* Employees */}
//             <Route path="employees/add" element={<AddEmployee />} />
//             <Route path="employees/attendance" element={<DailyAttendance />} />
//             <Route path="employees/myattendance" element={<MyAttendance />} />
//             <Route path="employees/calender" element={<AttendanceCalender />} />
//             <Route path="employees/all" element={<AllEmployees />} />
//             <Route path="employees/active" element={<AllActiveEmployee />} />
//             <Route path="employees/edit/:id" element={<EditEmployee />} />

//             <Route path="/profile" element={<ProfilePage />} />

//             {/* Other */}
//             <Route path="reports/*" element={<PlaceholderPage />} />
//             <Route path="accounts/*" element={<PlaceholderPage />} />
//             <Route path="bms-billing/*" element={<PlaceholderPage />} />

//             <Route path="*" element={<NotFound />} />
//           </Route>
//         </Routes>
//         {/* ← ADD HERE — outside <Routes>, inside <BrowserRouter> */}
//       </BrowserRouter>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientLoginPage from "./pages/Auth/ClientLogin";
import LoginPage from "./pages/Auth/Login";
import AdminLoginPage from "./pages/Auth/AdminLogin.jsx";
import Dashboard from "./pages/Dashboard/Dashboard";
import ClientDashboard from "./pages/Dashboard/ClientDashbaoard.jsx";
import EmployeeDashboard from "./pages/Dashboard/EmployeeDashboard";
import ManageProjects from "./pages/Projects/ManageProjects";
import ViewProject from "./pages/Projects/ViewProject";
import ProjectsAvailability from "./pages/Projects/ProjectsAvailability";
import AddProject from "./pages/Projects/AddProject";
import EditProject from "./pages/Projects/Editproject";
import Structure from "./pages/Projects/Structure";
import ViewStructure from "./pages/Projects/ViewStructure";
import Documents from "./pages/Projects/Documents";
import AddWebProject from "./pages/Website/AddWebProject";
import Manageprojects from "./pages/Website/Manageprojects ";
import EditWebproject from "./pages/Website/Editproject";
import Viewproject from "./pages/Website/Viewproject";

import Postsale from "./pages/postsale/Createpostsales.jsx";
import AllPostSales from "./pages/postsale/AllPostsales.jsx";
import ViewPostSale from "./pages/postsale/ViewPostSale.jsx";

import AddPresale from "./pages/presale/AddPresale.jsx";
import AllPreSales from "./pages/presale/AllPresale.jsx";
import EditPreSales from "./pages/presale/EditPreSales.jsx";
import QuotationDetailPage from "./pages/presale/Quotationdetailpage.jsx";

import AddClient from "./pages/client/AddCleint.jsx";
import UpdateClient from "./pages/client/EditClient.jsx";
import AllClient from "./pages/client/AllClients.jsx";
import InvoicePage from "./pages/postsale/Invoice.jsx";
import AddEmployee from "./pages/Employee/AddEmployee.jsx";
import ProfilePage from "./pages/Employee/ProfilePage.jsx";
import AllEmployees from "./pages/Employee/AllEmployees.jsx";
import EditEmployee from "./pages/Employee/EditEmployee.jsx";
import AllActiveEmployee from "./pages/Employee/AllActiveEmployee.jsx";
import DailyAttendance from "./pages/Employee/DailyAttendance.jsx";
import AttendanceCalender from "./pages/Employee/AttendanceCalendar.jsx";
import MyAttendance from "./pages/Employee/MyAttendance.jsx";

import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

import { AuthProvider } from "./components/AuthContext";
import { useUserStore } from "./store/userStore";

const queryClient = new QueryClient();

// ─── RoleDashboard ────────────────────────────────────────────────────────────
// Reads role from Zustand store — reactive subscriber.
// Re-renders automatically when Login.jsx calls setUser() after login,
// so the correct dashboard shows immediately without a page refresh.
//
// userStore shape: { user: { userId, email, role, name?, avatar? }, isAuthenticated }
const RoleDashboard = () => {
  const user = useUserStore((s) => s.user);
  const role = user?.role;

  // HR management roles — matches canManage() in roleCheck.js
  if (role === "ADMIN" || role === "CO_FOUNDER" || role === "HR") {
    return <Dashboard />;
  }
  if (role === "CLIENT") {
    return <ClientDashboard />;
  }
  // All other employee roles: SR_ARCHITECT, JR_ARCHITECT, SR_ENGINEER,
  // DRAFTSMAN, LIAISON_MANAGER, LIAISON_OFFICER, LIAISON_ASSISTANT etc.
  return <EmployeeDashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/adminlogin" element={<AdminLoginPage />} />
          <Route path="/clientlogin" element={<ClientLoginPage />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* ✅ RoleDashboard reads from Zustand — no stale localStorage reads */}
            <Route index element={<RoleDashboard />} />

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
            <Route
              path="/projects/:projectId/structure/:structureId"
              element={<ViewStructure />}
            />
            <Route path="projects/docs" element={<Documents />} />

            {/* Pre Sales */}
            <Route path="presales/new" element={<AddPresale />} />
            <Route path="presales/allpresales" element={<AllPreSales />} />
            <Route path="presales/edit/:srNumber" element={<EditPreSales />} />
            <Route path="/quotations/:id" element={<QuotationDetailPage />} />

            {/* Post Sales */}
            <Route path="postsales/*" element={<Postsale />} />
            <Route path="postsales/all" element={<AllPostSales />} />
            <Route path="postsales/view/:id" element={<ViewPostSale />} />
            <Route
              path="/postsales/:postSalesId/invoice/:invoiseId/:type"
              element={<InvoicePage />}
            />

            {/* Clients */}
            <Route path="clients/add" element={<AddClient />} />
            <Route path="clients/update/:id" element={<UpdateClient />} />
            <Route path="clients/allclients" element={<AllClient />} />

            {/* Employees */}
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/attendance" element={<DailyAttendance />} />
            <Route path="employees/myattendance" element={<MyAttendance />} />
            <Route path="employees/calender" element={<AttendanceCalender />} />
            <Route path="employees/all" element={<AllEmployees />} />
            <Route path="employees/active" element={<AllActiveEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />

            <Route path="/profile" element={<ProfilePage />} />

            {/* website */}
            <Route path="website/projects/add" element={<AddWebProject />} />
            <Route path="website/projects" element={<Manageprojects />} />
            <Route path="website/projects/:id" element={<Viewproject />} />
            <Route
              path="/website/projects/edit/:id"
              element={<EditWebproject />}
            />
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
