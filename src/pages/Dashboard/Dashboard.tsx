// import React, { useState } from 'react';
// import { Card, CardContent } from '../../components/Card/Card';
// import { Tabs, Tab } from '../../components/Tabs/Tabs';
// import { Select } from '../../components/Select/Select';
// import { Table, Pagination, StatusBadge } from '../../components/Table/Table';
// import { LineChart } from '../../components/Charts/LineChart';
// import { DonutChart } from '../../components/Charts/DonutChart';
// import { HomeIcon, CalendarIcon, ClockIcon, ArrowUpIcon, ProjectsIcon, ClientsIcon } from '../../components/Icons/Icons';
// import styles from './Dashboard.module.scss';

// const tabs: Tab[] = [
//   { id: 'total', label: 'Total Open', icon: <HomeIcon size={18} />, iconType: 'total' },
//   { id: 'today', label: 'Today', icon: <CalendarIcon size={18} />, iconType: 'today' },
//   { id: 'pending', label: 'Pending', icon: <ClockIcon size={18} />, iconType: 'pending' },
//   { id: 'upcoming', label: 'Upcoming', icon: <ArrowUpIcon size={18} />, iconType: 'upcoming' },
// ];

// const projectOptions = [
//   { value: 'all', label: 'All Projects' },
//   { value: 'residential', label: 'Residential' },
//   { value: 'commercial', label: 'Commercial' },
//   { value: 'mixed', label: 'Mixed Use' },
// ];

// const monthOptions = [
//   { value: 'jan', label: 'January 2024' },
//   { value: 'feb', label: 'February 2024' },
//   { value: 'mar', label: 'March 2024' },
//   { value: 'apr', label: 'April 2024' },
// ];

// const chartData = {
//   today: [
//     { x: 0, y: 25 },
//     { x: 25, y: 40 },
//     { x: 50, y: 60 },
//     { x: 100, y: 120 },
//     { x: 150, y: 160 },
//     { x: 200, y: 200 },
//   ],
//   pending: [
//     { x: 0, y: 20 },
//     { x: 25, y: 15 },
//     { x: 50, y: 25 },
//     { x: 100, y: 55 },
//     { x: 150, y: 70 },
//     { x: 200, y: 65 },
//   ],
//   upcoming: [
//     { x: 0, y: 30 },
//     { x: 25, y: 50 },
//     { x: 50, y: 80 },
//     { x: 100, y: 100 },
//     { x: 150, y: 90 },
//     { x: 200, y: 140 },
//   ],
// };

// const donutData = [
//   { value: 170, color: '#EF4444', label: 'Hot', type: 'hot' as const },
//   { value: 40, color: '#F59E0B', label: 'Warm', type: 'warm' as const },
//   { value: 20, color: '#9CA3AF', label: 'Cold', type: 'cold' as const },
//   { value: 15, color: '#3B82F6', label: 'New', type: 'new' as const },
// ];

// interface CustomerData {
//   id: number;
//   customerDetails: string;
//   enquiryDetails: string;
//   history: string;
// }

// const customerData: CustomerData[] = [
//   { id: 1, customerDetails: 'Rahul Sharma - Vision Developers', enquiryDetails: 'Residential complex, 2 acres', history: '3 previous projects' },
//   { id: 2, customerDetails: 'Priya Patel - Navya Group', enquiryDetails: 'Commercial tower, Sector 21', history: 'New client' },
//   { id: 3, customerDetails: 'Amit Kumar - Royal Builders', enquiryDetails: 'Township planning, 50 acres', history: '1 previous project' },
//   { id: 4, customerDetails: 'Sunita Reddy - Green Homes', enquiryDetails: 'Eco-friendly apartments', history: '2 previous projects' },
//   { id: 5, customerDetails: 'Vikram Singh - Urban Estates', enquiryDetails: 'Mixed-use development', history: 'New client' },
// ];

// const columns = [
//   { key: 'id', header: 'Sr', width: '60px' },
//   { key: 'customerDetails', header: 'Customer Details' },
//   { key: 'enquiryDetails', header: 'Enquiry Details' },
//   { key: 'history', header: 'History' },
//   {
//     key: 'actions',
//     header: 'Next',
//     render: () => (
//       <button className={styles.viewAllButton} style={{ padding: '6px 12px', fontSize: '12px' }}>
//         Follow Up
//       </button>
//     )
//   },
// ];

// const statCards = [
//   { icon: <ProjectsIcon size={24} />, value: '38', label: 'Active Projects', change: '+12%', positive: true, type: 'projects' },
//   { icon: <ClientsIcon size={24} />, value: '124', label: 'Total Clients', change: '+8%', positive: true, type: 'clients' },
//   { icon: <ClockIcon size={24} />, value: '15', label: 'Pending Approvals', change: '-5%', positive: false, type: 'pending' },
//   { icon: <HomeIcon size={24} />, value: '₹2.4Cr', label: 'Revenue (MTD)', change: '+18%', positive: true, type: 'revenue' },
// ];

// export const Dashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('total');
//   const [selectedProject, setSelectedProject] = useState('all');
//   const [selectedMonth, setSelectedMonth] = useState('jan');
//   const [currentPage, setCurrentPage] = useState(1);

//   return (
//     <div className={styles.dashboard}>
//       {/* Welcome Section */}
//       <div className={styles.welcomeCard}>
//         <h1 className={styles.welcomeText}>Welcome Mr. Prajwal JT !</h1>
//       </div>

//       {/* Controls Row */}
//       <div className={styles.controlsRow}>
//         <button className={styles.dashboardButton}>
//           <HomeIcon size={18} />
//           My Dashboard
//         </button>

//         <div className={styles.filters}>
//           <Select
//             options={projectOptions}
//             value={selectedProject}
//             onChange={setSelectedProject}
//             placeholder="Select Project"
//           />
//           <Select
//             options={monthOptions}
//             value={selectedMonth}
//             onChange={setSelectedMonth}
//             placeholder="Select Month"
//           />
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className={styles.statCards}>
//         {statCards.map((stat, index) => (
//           <div key={index} className={styles.statCard}>
//             <div className={`${styles.statIcon} ${styles[stat.type]}`}>
//               {stat.icon}
//             </div>
//             <div className={styles.statContent}>
//               <div className={styles.statValue}>{stat.value}</div>
//               <div className={styles.statLabel}>{stat.label}</div>
//               <div className={`${styles.statChange} ${stat.positive ? styles.positive : styles.negative}`}>
//                 {stat.change} from last month
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

//       {/* Charts Row */}
//       <div className={styles.chartsRow}>
//         <div className={styles.chartCard}>
//           <LineChart data={chartData} />
//         </div>
//         <div className={styles.chartCard}>
//           <DonutChart data={donutData} centerLabel="Leads" />
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className={styles.tableSection}>
//         <div className={styles.tableHeader}>
//           <h2 className={styles.tableTitle}>Recent Enquiries</h2>
//           <button className={styles.viewAllButton}>View All</button>
//         </div>
//         <Table
//           columns={columns}
//           data={customerData}
//           keyExtractor={(item) => item.id}
//         />
//         <Pagination
//           currentPage={currentPage}
//           totalPages={5}
//           totalItems={25}
//           itemsPerPage={5}
//           onPageChange={setCurrentPage}
//         />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useProjectList } from "../../api/hooks/useProject";
import { useEmployeeList } from "../../api/hooks/useEmployees";
import { useClientList } from "../../api/hooks/useClient";
import { usePreSalesList } from "../../api/hooks/usePreSales";
import { usePostSalesList } from "../../api/hooks/usePostSales";
import { useEmployeeData } from "../../api/hooks/useEmployees";
import styles from "./Dashboard.module.scss";

// ─── Design Tokens (mirroring variables.scss in JS for recharts) ──────────────
const COLOR_PRIMARY = "#7c5e0b";
const COLOR_SUCCESS = "#10b981";
const COLOR_WARNING = "#f59e0b";
const COLOR_DANGER = "#ef4444";
const COLOR_INFO = "#3b82f6";
const COLOR_GRAY_300 = "#d1d5db";

const STATUS_COLORS = {
  PLANNING: "#3b82f6",
  IN_PROGRESS: "#f59e0b",
  ON_HOLD: "#ef4444",
  COMPLETED: "#10b981",
  CANCELLED: "#6b7280",
  NOT_STARTED: "#d1d5db",
  ACTIVE: "#7c3aed",
};

const ROLE_COLORS = [
  COLOR_PRIMARY,
  COLOR_INFO,
  COLOR_SUCCESS,
  COLOR_WARNING,
  COLOR_DANGER,
  "#7c3aed",
  "#ec4899",
  "#14b8a6",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatRole = (r) =>
  r
    ?.replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "—";

const monthKey = (dt) => {
  if (!dt) return null;
  const d = new Date(dt);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = (key) => {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "2-digit",
  });
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, sub, accent }) => (
  <div className={styles.statCard}>
    <div
      className={styles.statIconWrap}
      style={{ background: `${accent}18`, color: accent }}
    >
      {icon}
    </div>
    <div className={styles.statContent}>
      <div className={styles.statValue}>{value ?? "—"}</div>
      <div className={styles.statLabel}>{label}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </div>
  </div>
);

// ─── Section Card ─────────────────────────────────────────────────────────────
const SectionCard = ({ title, action, onAction, children, className = "" }) => (
  <div className={`${styles.sectionCard} ${className}`}>
    <div className={styles.sectionHead}>
      <span className={styles.sectionTitle}>{title}</span>
      {action && (
        <button className={styles.sectionAction} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
    {children}
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      {label && <div className={styles.tooltipLabel}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: p.color }} />
          <span>
            {p.name}: <strong>{p.value}</strong>
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Pulse = ({ h = 20, w = "100%", r = 8 }) => (
  <div
    className={styles.pulse}
    style={{ height: h, width: w, borderRadius: r }}
  />
);

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const IconProjects = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const IconClients = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconEmployees = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IconSales = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [recentTab, setRecentTab] = useState("projects");

  const { data: me, isLoading: loadingMe } = useEmployeeData();
  const { data: projects, isLoading: loadingProj } = useProjectList();
  const { data: employees, isLoading: loadingEmp } = useEmployeeList();
  const { data: clients, isLoading: loadingCli } = useClientList();
  const { data: preSales, isLoading: loadingPre } = usePreSalesList();
  const { data: postSales, isLoading: loadingPost } = usePostSalesList(0, 100);

  const isLoading = loadingProj || loadingEmp || loadingCli || loadingPre;

  // ── Derived data ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const proj = projects ?? [];
    const emps = employees ?? [];
    const cli = clients ?? [];
    const activeProj = proj.filter(
      (p) => !["COMPLETED", "CANCELLED"].includes(p.projectStatus),
    );
    const activeEmps = emps.filter((e) => e.status === "ACTIVE");

    return {
      totalProjects: proj.length,
      activeProjects: activeProj.length,
      totalClients: cli.length,
      totalEmployees: emps.length,
      activeEmployees: activeEmps.length,
      preSalesCount: (preSales ?? []).length,
      postSalesCount: (postSales?.content ?? postSales ?? []).length,
    };
  }, [projects, employees, clients, preSales, postSales]);

  // ── Project status donut ─────────────────────────────────────────────────
  const statusPieData = useMemo(() => {
    if (!projects?.length) return [];
    const counts = {};
    projects.forEach((p) => {
      const s = p.projectStatus || "UNKNOWN";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
      color: STATUS_COLORS[name] ?? COLOR_GRAY_300,
    }));
  }, [projects]);

  // ── Projects created per month (last 8 months) ────────────────────────────
  const projectsByMonth = useMemo(() => {
    if (!projects?.length) return [];
    const map = {};
    projects.forEach((p) => {
      const k = monthKey(p.projectCreatedDateTime);
      if (!k) return;
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([k, count]) => ({ month: monthLabel(k), count }));
  }, [projects]);

  // ── Employee roles breakdown ──────────────────────────────────────────────
  const roleData = useMemo(() => {
    if (!employees?.length) return [];
    const counts = {};
    employees.forEach((e) => {
      const r = e.role || "UNKNOWN";
      counts[r] = (counts[r] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([role, count]) => ({ role: formatRole(role), count }))
      .sort((a, b) => b.count - a.count);
  }, [employees]);

  // ── Pre-sales status breakdown ────────────────────────────────────────────
  const preSalesStatus = useMemo(() => {
    if (!preSales?.length) return [];
    const counts = {};
    preSales.forEach((ps) => {
      const s = ps.status || "UNKNOWN";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
      color: STATUS_COLORS[name] ?? COLOR_GRAY_300,
    }));
  }, [preSales]);

  // ── Recent 5 projects ─────────────────────────────────────────────────────
  const recentProjects = useMemo(
    () =>
      [...(projects ?? [])]
        .sort(
          (a, b) =>
            new Date(b.projectCreatedDateTime) -
            new Date(a.projectCreatedDateTime),
        )
        .slice(0, 6),
    [projects],
  );

  // ── Recent clients ────────────────────────────────────────────────────────
  const recentClients = useMemo(
    () => [...(clients ?? [])].slice(-6).reverse(),
    [clients],
  );

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const name = me?.firstName
    ? `${me.firstName} ${me.lastName ?? ""}`.trim()
    : "there";

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className={styles.dashboard}>
      {/* ── Welcome ── */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeLeft}>
          <div className={styles.welcomeGreeting}>{greeting},</div>
          <div className={styles.welcomeText}>
            {loadingMe ? <Pulse h={32} w={200} /> : `${name} 👋`}
          </div>
          <div className={styles.welcomeSub}>
            Here's what's happening across your projects today.
          </div>
        </div>
        <div className={styles.welcomeRight}>
          <div className={styles.welcomeDate}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className={styles.statCards}>
        <StatCard
          icon={<IconProjects />}
          value={isLoading ? <Pulse h={28} w={60} /> : stats.activeProjects}
          label="Active Projects"
          sub={isLoading ? null : `${stats.totalProjects} total`}
          accent={COLOR_PRIMARY}
        />
        <StatCard
          icon={<IconClients />}
          value={isLoading ? <Pulse h={28} w={60} /> : stats.totalClients}
          label="Total Clients"
          accent={COLOR_SUCCESS}
        />
        <StatCard
          icon={<IconEmployees />}
          value={isLoading ? <Pulse h={28} w={60} /> : stats.activeEmployees}
          label="Active Employees"
          sub={isLoading ? null : `${stats.totalEmployees} total`}
          accent={COLOR_INFO}
        />
        <StatCard
          icon={<IconSales />}
          value={isLoading ? <Pulse h={28} w={60} /> : stats.preSalesCount}
          label="Pre-Sales Leads"
          sub={isLoading ? null : `${stats.postSalesCount} converted`}
          accent={COLOR_WARNING}
        />
      </div>

      {/* ── Charts Row 1: Projects by Month + Status Donut ── */}
      <div className={styles.chartsRow}>
        <SectionCard
          title="Projects Created — by Month"
          className={styles.chartWide}
        >
          {loadingProj ? (
            <Pulse h={220} />
          ) : projectsByMonth.length === 0 ? (
            <div className={styles.emptyChart}>No project data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={projectsByMonth}
                margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLOR_PRIMARY}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLOR_PRIMARY}
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Projects"
                  stroke={COLOR_PRIMARY}
                  strokeWidth={2.5}
                  fill="url(#gradProj)"
                  dot={{ fill: COLOR_PRIMARY, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title="Project Status" className={styles.chartNarrow}>
          {loadingProj ? (
            <Pulse h={220} />
          ) : statusPieData.length === 0 ? (
            <div className={styles.emptyChart}>No data</div>
          ) : (
            <div className={styles.donutWrap}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.pieLegend}>
                {statusPieData.map((d, i) => (
                  <div key={i} className={styles.pieLegendItem}>
                    <span
                      className={styles.pieDot}
                      style={{ background: d.color }}
                    />
                    <span className={styles.pieName}>{d.name}</span>
                    <span className={styles.pieCount}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Charts Row 2: Employee Roles + Pre-Sales Status ── */}
      <div className={styles.chartsRow}>
        <SectionCard title="Team — by Role" className={styles.chartWide}>
          {loadingEmp ? (
            <div className={styles.roleSkeletons}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.roleSkelRow}>
                  <Pulse h={12} w={110} />
                  <Pulse h={12} w="100%" />
                  <Pulse h={12} w={20} />
                </div>
              ))}
            </div>
          ) : roleData.length === 0 ? (
            <div className={styles.emptyChart}>No employee data</div>
          ) : (
            <div className={styles.roleChart}>
              {/* Summary row */}
              <div className={styles.roleSummary}>
                <div className={styles.roleSummaryItem}>
                  <span className={styles.roleSummaryValue}>
                    {employees?.length ?? 0}
                  </span>
                  <span className={styles.roleSummaryLabel}>Total</span>
                </div>
                <div className={styles.roleSummaryItem}>
                  <span
                    className={styles.roleSummaryValue}
                    style={{ color: "#10b981" }}
                  >
                    {employees?.filter((e) => e.status === "ACTIVE").length ??
                      0}
                  </span>
                  <span className={styles.roleSummaryLabel}>Active</span>
                </div>
                <div className={styles.roleSummaryItem}>
                  <span
                    className={styles.roleSummaryValue}
                    style={{ color: "#ef4444" }}
                  >
                    {employees?.filter((e) => e.status !== "ACTIVE").length ??
                      0}
                  </span>
                  <span className={styles.roleSummaryLabel}>Inactive</span>
                </div>
              </div>

              {/* Horizontal bar rows */}
              <div className={styles.roleBars}>
                {roleData.map((item, i) => {
                  const max = Math.max(...roleData.map((r) => r.count));
                  const pct = max > 0 ? (item.count / max) * 100 : 0;
                  const color = ROLE_COLORS[i % ROLE_COLORS.length];
                  return (
                    <div key={item.role} className={styles.roleRow}>
                      <div className={styles.roleLabel}>{item.role}</div>
                      <div className={styles.roleBarTrack}>
                        <div
                          className={styles.roleBarFill}
                          style={{
                            width: `${pct}%`,
                            background: color,
                            animationDelay: `${i * 60}ms`,
                          }}
                        />
                      </div>
                      <div className={styles.roleCount} style={{ color }}>
                        {item.count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Pre-Sales Leads" className={styles.chartNarrow}>
          {loadingPre ? (
            <Pulse h={200} />
          ) : preSalesStatus.length === 0 ? (
            <div className={styles.emptyChart}>No pre-sales data</div>
          ) : (
            <div className={styles.donutWrap}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={preSalesStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {preSalesStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.pieLegend}>
                {preSalesStatus.map((d, i) => (
                  <div key={i} className={styles.pieLegendItem}>
                    <span
                      className={styles.pieDot}
                      style={{ background: d.color }}
                    />
                    <span className={styles.pieName}>{d.name}</span>
                    <span className={styles.pieCount}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Recent Activity ── */}
      <div className={styles.recentSection}>
        <div className={styles.recentTabs}>
          {["projects", "clients"].map((t) => (
            <button
              key={t}
              className={`${styles.recentTab} ${recentTab === t ? styles.recentTabActive : ""}`}
              onClick={() => setRecentTab(t)}
            >
              {t === "projects" ? "Recent Projects" : "Recent Clients"}
            </button>
          ))}
          <button
            className={styles.viewAllBtn}
            onClick={() =>
              navigate(recentTab === "projects" ? "/projects" : "/clients")
            }
          >
            View All →
          </button>
        </div>

        {recentTab === "projects" && (
          <div className={styles.recentTable}>
            <div className={`${styles.tableRow} ${styles.tableHead}`}>
              <span>Project</span>
              <span>Code</span>
              <span>City</span>
              <span>Status</span>
              <span>Created</span>
              <span></span>
            </div>
            {loadingProj ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.tableRow}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Pulse key={j} h={14} />
                  ))}
                </div>
              ))
            ) : recentProjects.length === 0 ? (
              <div className={styles.emptyState}>No projects yet.</div>
            ) : (
              recentProjects.map((p) => {
                const sc = p.projectStatus;
                const cfg = STATUS_COLORS[sc] ?? COLOR_GRAY_300;
                return (
                  <div key={p.projectId} className={styles.tableRow}>
                    <span className={styles.projectName}>
                      {p.projectName || `#${p.projectId}`}
                    </span>
                    <span className={styles.codeChip}>
                      {p.projectCode || "—"}
                    </span>
                    <span className={styles.cityCell}>{p.city || "—"}</span>
                    <span>
                      <span
                        className={styles.statusPill}
                        style={{ background: `${cfg}18`, color: cfg }}
                      >
                        <span
                          className={styles.statusDot}
                          style={{ background: cfg }}
                        />
                        {(sc || "—").replace(/_/g, " ")}
                      </span>
                    </span>
                    <span className={styles.dateCell}>
                      {fmt(p.projectCreatedDateTime)}
                    </span>
                    <span>
                      <button
                        className={styles.rowAction}
                        onClick={() => navigate(`/projects/${p.projectId}`)}
                      >
                        View
                      </button>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        )}

        {recentTab === "clients" && (
          <div className={styles.recentTable}>
            <div className={`${styles.tableRow} ${styles.tableHead}`}>
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>City</span>
              <span></span>
            </div>
            {loadingCli ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={styles.tableRow}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Pulse key={j} h={14} />
                  ))}
                </div>
              ))
            ) : recentClients.length === 0 ? (
              <div className={styles.emptyState}>No clients yet.</div>
            ) : (
              recentClients.map((c) => (
                <div key={c.id} className={styles.tableRow}>
                  <span className={styles.projectName}>
                    {c.clientName || c.name || "—"}
                  </span>
                  <span className={styles.emailCell}>{c.email || "—"}</span>
                  <span>{c.phone || c.mobileNumber || "—"}</span>
                  <span className={styles.cityCell}>{c.city || "—"}</span>
                  <span>
                    <button
                      className={styles.rowAction}
                      onClick={() => navigate(`/clients/${c.id}`)}
                    >
                      View
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
