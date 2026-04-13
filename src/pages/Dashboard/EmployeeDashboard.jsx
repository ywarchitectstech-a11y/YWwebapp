// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   AreaChart,
//   Area,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { useEmployeeData } from "../../api/hooks/useEmployees";
// import { useMyProjects } from "../../api/hooks/useProject";
// import styles from "./EmployeeDashboard.module.scss";

// // ─── Design Tokens ────────────────────────────────────────────────────────────
// const COLOR_PRIMARY = "#7c5e0b";
// const COLOR_SUCCESS = "#10b981";
// const COLOR_WARNING = "#f59e0b";
// const COLOR_DANGER = "#ef4444";
// const COLOR_INFO = "#3b82f6";
// const COLOR_GRAY_300 = "#d1d5db";

// const STATUS_COLORS = {
//   PLANNING: "#3b82f6",
//   IN_PROGRESS: "#f59e0b",
//   ON_HOLD: "#ef4444",
//   COMPLETED: "#10b981",
//   CANCELLED: "#6b7280",
//   NOT_STARTED: "#d1d5db",
//   ACTIVE: "#7c3aed",
// };

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmt = (dt) =>
//   dt
//     ? new Date(dt).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// const monthKey = (dt) => {
//   if (!dt) return null;
//   const d = new Date(dt);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
// };

// const monthLabel = (key) => {
//   const [y, m] = key.split("-");
//   return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-IN", {
//     month: "short",
//     year: "2-digit",
//   });
// };

// // ─── Stat Card ────────────────────────────────────────────────────────────────
// const StatCard = ({ icon, value, label, sub, accent }) => (
//   <div className={styles.statCard}>
//     <div
//       className={styles.statIconWrap}
//       style={{ background: `${accent}18`, color: accent }}
//     >
//       {icon}
//     </div>
//     <div className={styles.statContent}>
//       <div className={styles.statValue}>{value ?? "—"}</div>
//       <div className={styles.statLabel}>{label}</div>
//       {sub && <div className={styles.statSub}>{sub}</div>}
//     </div>
//   </div>
// );

// // ─── Section Card ─────────────────────────────────────────────────────────────
// const SectionCard = ({ title, action, onAction, children, className = "" }) => (
//   <div className={`${styles.sectionCard} ${className}`}>
//     <div className={styles.sectionHead}>
//       <span className={styles.sectionTitle}>{title}</span>
//       {action && (
//         <button className={styles.sectionAction} onClick={onAction}>
//           {action}
//         </button>
//       )}
//     </div>
//     {children}
//   </div>
// );

// // ─── Custom Tooltip ───────────────────────────────────────────────────────────
// const ChartTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className={styles.tooltip}>
//       {label && <div className={styles.tooltipLabel}>{label}</div>}
//       {payload.map((p, i) => (
//         <div key={i} className={styles.tooltipRow}>
//           <span className={styles.tooltipDot} style={{ background: p.color }} />
//           <span>
//             {p.name}: <strong>{p.value}</strong>
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// const Pulse = ({ h = 20, w = "100%", r = 8 }) => (
//   <div
//     className={styles.pulse}
//     style={{ height: h, width: w, borderRadius: r }}
//   />
// );

// // ─── Icons (inline SVG) ───────────────────────────────────────────────────────
// const IconProjects = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <rect x="2" y="3" width="20" height="14" rx="2" />
//     <path d="M8 21h8M12 17v4" />
//   </svg>
// );

// const IconCheckmark = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="20 6 9 17 4 12" />
//   </svg>
// );

// const IconClock = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <circle cx="12" cy="12" r="10" />
//     <polyline points="12 6 12 12 16 14" />
//   </svg>
// );

// const IconTrendingUp = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
//     <polyline points="17 6 23 6 23 12" />
//   </svg>
// );

// const IconAlert = () => (
//   <svg
//     width="22"
//     height="22"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
//     <line x1="12" y1="9" x2="12" y2="13" />
//     <line x1="12" y1="17" x2="12.01" y2="17" />
//   </svg>
// );

// // ─── Main Employee Dashboard ──────────────────────────────────────────────────
// export default function EmployeeDashboard() {
//   const navigate = useNavigate();
//   const [timeRange, setTimeRange] = useState("all");

//   const { data: me, isLoading: loadingMe } = useEmployeeData();
//   const { data: myProjects, isLoading: loadingProjects } = useMyProjects();

//   const isLoading = loadingMe || loadingProjects;

//   // ── Derived data ─────────────────────────────────────────────────────────
//   const projects = Array.isArray(myProjects)
//     ? myProjects
//     : myProjects?.content || myProjects?.data || [];

//   const stats = useMemo(() => {
//     const completed = projects.filter(
//       (p) => p.projectStatus === "COMPLETED",
//     ).length;
//     const inProgress = projects.filter(
//       (p) => p.projectStatus === "IN_PROGRESS",
//     ).length;
//     const onHold = projects.filter((p) => p.projectStatus === "ON_HOLD").length;
//     const planning = projects.filter(
//       (p) => p.projectStatus === "PLANNING",
//     ).length;

//     return {
//       totalProjects: projects.length,
//       completedProjects: completed,
//       inProgressProjects: inProgress,
//       onHoldProjects: onHold,
//       planningProjects: planning,
//       completionRate:
//         projects.length > 0
//           ? Math.round((completed / projects.length) * 100)
//           : 0,
//     };
//   }, [projects]);

//   // ── Project status distribution ──────────────────────────────────────────
//   const statusPieData = useMemo(() => {
//     if (!projects.length) return [];
//     const counts = {};
//     projects.forEach((p) => {
//       const s = p.projectStatus || "UNKNOWN";
//       counts[s] = (counts[s] || 0) + 1;
//     });
//     return Object.entries(counts).map(([name, value]) => ({
//       name: name.replace(/_/g, " "),
//       value,
//       color: STATUS_COLORS[name] ?? COLOR_GRAY_300,
//     }));
//   }, [projects]);

//   // ── Projects created per month (last 8 months) ────────────────────────────
//   const projectsByMonth = useMemo(() => {
//     if (!projects.length) return [];
//     const map = {};
//     projects.forEach((p) => {
//       const k = monthKey(p.projectCreatedDateTime);
//       if (!k) return;
//       map[k] = (map[k] || 0) + 1;
//     });
//     return Object.entries(map)
//       .sort(([a], [b]) => a.localeCompare(b))
//       .slice(-8)
//       .map(([k, count]) => ({ month: monthLabel(k), count }));
//   }, [projects]);

//   // ── Project timeline (assigned date) ──────────────────────────────────────
//   const projectTimeline = useMemo(() => {
//     if (!projects.length) return [];
//     const timeline = projects
//       .map((p) => ({
//         name: p.projectName || `Project #${p.projectId}`,
//         status: p.projectStatus,
//         created: new Date(p.projectCreatedDateTime || new Date()),
//       }))
//       .sort((a, b) => a.created - b.created)
//       .slice(-6);

//     return timeline;
//   }, [projects]);

//   // ── Upcoming milestones (projects in progress) ────────────────────────────
//   const activeProjects = useMemo(() => {
//     return projects
//       .filter((p) => ["IN_PROGRESS", "PLANNING"].includes(p.projectStatus))
//       .sort(
//         (a, b) =>
//           new Date(b.projectCreatedDateTime) -
//           new Date(a.projectCreatedDateTime),
//       )
//       .slice(0, 6);
//   }, [projects]);

//   const greeting = useMemo(() => {
//     const h = new Date().getHours();
//     if (h < 12) return "Good morning";
//     if (h < 17) return "Good afternoon";
//     return "Good evening";
//   }, []);

//   const name = me?.firstName
//     ? `${me.firstName} ${me.lastName ?? ""}`.trim()
//     : "there";

//   const role = me?.role
//     ? me.role
//         .replace(/_/g, " ")
//         .toLowerCase()
//         .replace(/\b\w/g, (c) => c.toUpperCase())
//     : "Employee";

//   // ─── Render ─────────────────────────────────────────────────────────────
//   return (
//     <div className={styles.dashboard}>
//       {/* ── Welcome ── */}
//       <div className={styles.welcomeCard}>
//         <div className={styles.welcomeLeft}>
//           <div className={styles.welcomeGreeting}>{greeting},</div>
//           <div className={styles.welcomeText}>
//             {loadingMe ? <Pulse h={32} w={200} /> : `${name} 👋`}
//           </div>
//           <div className={styles.welcomeSub}>
//             {loadingMe ? (
//               <Pulse h={16} w={280} />
//             ) : (
//               <>
//                 <span className={styles.roleBadge}>{role}</span>
//                 <span className={styles.divider}>•</span>
//                 {stats.totalProjects} project
//                 {stats.totalProjects !== 1 ? "s" : ""} assigned
//               </>
//             )}
//           </div>
//         </div>
//         <div className={styles.welcomeRight}>
//           <div className={styles.welcomeDate}>
//             {new Date().toLocaleDateString("en-IN", {
//               weekday: "long",
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             })}
//           </div>
//         </div>
//       </div>

//       {/* ── Stat Cards ── */}
//       <div className={styles.statCards}>
//         <StatCard
//           icon={<IconProjects />}
//           value={isLoading ? <Pulse h={28} w={60} /> : stats.inProgressProjects}
//           label="In Progress"
//           sub={
//             isLoading
//               ? null
//               : `${stats.completedProjects} of ${stats.totalProjects} done`
//           }
//           accent={COLOR_WARNING}
//         />
//         <StatCard
//           icon={<IconCheckmark />}
//           value={
//             isLoading ? <Pulse h={28} w={40} /> : `${stats.completionRate}%`
//           }
//           label="Completion Rate"
//           sub={isLoading ? null : `${stats.completedProjects} completed`}
//           accent={COLOR_SUCCESS}
//         />
//         <StatCard
//           icon={<IconClock />}
//           value={isLoading ? <Pulse h={28} w={40} /> : stats.onHoldProjects}
//           label="On Hold"
//           accent={COLOR_DANGER}
//         />
//         <StatCard
//           icon={<IconTrendingUp />}
//           value={isLoading ? <Pulse h={28} w={40} /> : stats.planningProjects}
//           label="In Planning"
//           accent={COLOR_INFO}
//         />
//       </div>

//       {/* ── Charts Row 1: Projects Timeline + Status Donut ── */}
//       <div className={styles.chartsRow}>
//         <SectionCard
//           title="Your Projects — by Month"
//           className={styles.chartWide}
//         >
//           {isLoading ? (
//             <Pulse h={220} />
//           ) : projectsByMonth.length === 0 ? (
//             <div className={styles.emptyChart}>
//               No projects yet. Get started by requesting assignment.
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height={220}>
//               <AreaChart
//                 data={projectsByMonth}
//                 margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
//               >
//                 <defs>
//                   <linearGradient id="gradProj" x1="0" y1="0" x2="0" y2="1">
//                     <stop
//                       offset="5%"
//                       stopColor={COLOR_PRIMARY}
//                       stopOpacity={0.25}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor={COLOR_PRIMARY}
//                       stopOpacity={0.02}
//                     />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke="#f0f0f0"
//                   vertical={false}
//                 />
//                 <XAxis
//                   dataKey="month"
//                   tick={{ fontSize: 11, fill: "#9ca3af" }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <YAxis
//                   tick={{ fontSize: 11, fill: "#9ca3af" }}
//                   axisLine={false}
//                   tickLine={false}
//                   allowDecimals={false}
//                 />
//                 <Tooltip content={<ChartTooltip />} />
//                 <Area
//                   type="monotone"
//                   dataKey="count"
//                   name="Projects"
//                   stroke={COLOR_PRIMARY}
//                   strokeWidth={2.5}
//                   fill="url(#gradProj)"
//                   dot={{ fill: COLOR_PRIMARY, r: 3 }}
//                   activeDot={{ r: 5 }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
//         </SectionCard>

//         <SectionCard
//           title="Project Status Breakdown"
//           className={styles.chartNarrow}
//         >
//           {isLoading ? (
//             <Pulse h={220} />
//           ) : statusPieData.length === 0 ? (
//             <div className={styles.emptyChart}>No data</div>
//           ) : (
//             <div className={styles.donutWrap}>
//               <ResponsiveContainer width="100%" height={180}>
//                 <PieChart>
//                   <Pie
//                     data={statusPieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={50}
//                     outerRadius={75}
//                     paddingAngle={3}
//                     dataKey="value"
//                   >
//                     {statusPieData.map((entry, i) => (
//                       <Cell key={i} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<ChartTooltip />} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className={styles.pieLegend}>
//                 {statusPieData.map((d, i) => (
//                   <div key={i} className={styles.pieLegendItem}>
//                     <span
//                       className={styles.pieDot}
//                       style={{ background: d.color }}
//                     />
//                     <span className={styles.pieName}>{d.name}</span>
//                     <span className={styles.pieCount}>{d.value}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </SectionCard>
//       </div>

//       {/* ── Active Projects Section ── */}
//       <SectionCard
//         title="Active Projects"
//         action={activeProjects.length > 0 ? "View All" : undefined}
//         onAction={() => navigate("/my-projects")}
//       >
//         {isLoading ? (
//           <div className={styles.projectListSkeleton}>
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div key={i} className={styles.projectListRow}>
//                 <Pulse h={14} w={150} />
//                 <Pulse h={14} w={100} />
//                 <Pulse h={14} w={80} />
//                 <Pulse h={14} w={60} />
//               </div>
//             ))}
//           </div>
//         ) : activeProjects.length === 0 ? (
//           <div className={styles.emptyState}>
//             <div className={styles.emptyIcon}>
//               <IconAlert />
//             </div>
//             <p>No active projects right now.</p>
//             <small>Projects you're assigned to will appear here.</small>
//           </div>
//         ) : (
//           <div className={styles.projectList}>
//             {activeProjects.map((project) => {
//               const statusColor =
//                 STATUS_COLORS[project.projectStatus] ?? COLOR_GRAY_300;
//               return (
//                 <div key={project.projectId} className={styles.projectListItem}>
//                   <div className={styles.projectInfo}>
//                     <div className={styles.projectTitle}>
//                       {project.projectName || `Project #${project.projectId}`}
//                     </div>
//                     <div className={styles.projectMeta}>
//                       <span className={styles.projectCode}>
//                         {project.projectCode || "—"}
//                       </span>
//                       <span className={styles.projectCity}>
//                         {project.city || "—"}
//                       </span>
//                     </div>
//                   </div>
//                   <div className={styles.projectStatus}>
//                     <span
//                       className={styles.statusPill}
//                       style={{
//                         background: `${statusColor}18`,
//                         color: statusColor,
//                       }}
//                     >
//                       <span
//                         className={styles.statusDot}
//                         style={{ background: statusColor }}
//                       />
//                       {project.projectStatus?.replace(/_/g, " ") || "Unknown"}
//                     </span>
//                   </div>
//                   <div className={styles.projectDate}>
//                     {fmt(project.projectCreatedDateTime)}
//                   </div>
//                   <button
//                     className={styles.projectAction}
//                     onClick={() => navigate(`/projects/${project.projectId}`)}
//                   >
//                     View
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </SectionCard>

//       {/* ── Performance Summary ── */}
//       <div className={styles.performanceGrid}>
//         <SectionCard title="Performance Summary">
//           <div className={styles.performanceContent}>
//             <div className={styles.perfItem}>
//               <div className={styles.perfLabel}>Total Assigned</div>
//               <div className={styles.perfValue}>
//                 {isLoading ? <Pulse h={28} w={60} /> : stats.totalProjects}
//               </div>
//             </div>
//             <div className={styles.perfItem}>
//               <div className={styles.perfLabel}>Completion Rate</div>
//               <div
//                 className={styles.perfValue}
//                 style={{ color: COLOR_SUCCESS }}
//               >
//                 {isLoading ? (
//                   <Pulse h={28} w={60} />
//                 ) : (
//                   `${stats.completionRate}%`
//                 )}
//               </div>
//             </div>
//             <div className={styles.perfItem}>
//               <div className={styles.perfLabel}>Average Status</div>
//               <div className={styles.perfValue} style={{ color: COLOR_INFO }}>
//                 {isLoading ? (
//                   <Pulse h={28} w={60} />
//                 ) : stats.inProgressProjects > 0 ? (
//                   "On Track"
//                 ) : (
//                   "—"
//                 )}
//               </div>
//             </div>
//           </div>
//         </SectionCard>
//       </div>
//     </div>
//   );
// }
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEmployeeData } from "../../api/hooks/useEmployees";
import { useProjectList } from "../../api/hooks/useProject";
import {
  useMyMonthlyAttendance,
  useMyCheckIn,
  useMyCheckOut,
} from "../../api/hooks/useAttendance";
import styles from "./EmployeeDashboard.module.scss";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const COLOR_PRIMARY = "#7c5e0b";
const COLOR_SUCCESS = "#10b981";
const COLOR_WARNING = "#f59e0b";
const COLOR_DANGER = "#ef4444";
const COLOR_INFO = "#3b82f6";
const COLOR_PURPLE = "#7c3aed";
const COLOR_TEAL = "#06b6d4";
const COLOR_ROSE = "#f43f5e";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dt) =>
  dt
    ? new Date(dt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

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

// Today as "YYYY-MM-DD"
const todayISO = () => new Date().toISOString().split("T")[0];

// Current time as "HH:mm:ss" for backend LocalTime
const nowTime = () => {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}:00`;
};

// "09:30:00" → "09:30 AM"
const fmtTime = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

// Duration between two "HH:mm:ss" strings → "Xh Ym"
const calcDuration = (inT, outT) => {
  if (!inT || !outT) return null;
  const [ih, im] = inT.split(":").map(Number);
  const [oh, om] = outT.split(":").map(Number);
  const mins = oh * 60 + om - (ih * 60 + im);
  if (mins <= 0) return null;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
};

// Total working hours from array of AttendanceDTO
const totalWorkingHours = (records) => {
  let totalMins = 0;
  (records || []).forEach((r) => {
    if (!r.checkIn || !r.checkOut) return;
    const [ih, im] = r.checkIn.split(":").map(Number);
    const [oh, om] = r.checkOut.split(":").map(Number);
    const diff = oh * 60 + om - (ih * 60 + im);
    if (diff > 0) totalMins += diff;
  });
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h === 0 && m === 0) return "0h";
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, sub, accent, isLoading }) => (
  <div className={styles.statCard} style={{ "--accent": accent }}>
    <div
      className={styles.statIconWrap}
      style={{ background: `${accent}18`, color: accent }}
    >
      {icon}
    </div>
    <div className={styles.statContent}>
      <div className={styles.statValue}>
        {isLoading ? <Pulse h={26} w={60} /> : (value ?? "—")}
      </div>
      <div className={styles.statLabel}>{label}</div>
      {sub && !isLoading && <div className={styles.statSub}>{sub}</div>}
    </div>
  </div>
);

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

const Pulse = ({ h = 20, w = "100%", r = 8 }) => (
  <div
    className={styles.pulse}
    style={{ height: h, width: w, borderRadius: r }}
  />
);

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconProjects = () => (
  <svg
    width="20"
    height="20"
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
const IconCheckmark = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconClock = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconTrending = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IconCalendar = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconHourglass = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 2h14M5 22h14M5 2a7 7 0 0 1 14 0M5 22a7 7 0 0 0 14 0M5 2l7 10 7-10M5 22l7-10 7 10" />
  </svg>
);
const IconLeaf = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);
const IconAlert = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IconPresent = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const navigate = useNavigate();

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { data: me, isLoading: loadingMe } = useEmployeeData();
  const { data: myProjects, isLoading: loadingProjects } = useProjectList();

  // Attendance for current month → drives 4 stat cards + check-in/out
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: monthlyAttendance, isLoading: loadingAttendance } =
    useMyMonthlyAttendance(month, year);

  const { mutate: checkIn, isPending: checkingIn } = useMyCheckIn();
  const { mutate: checkOut, isPending: checkingOut } = useMyCheckOut();

  const isLoading = loadingMe || loadingProjects;

  // ── Attendance-derived stats ──────────────────────────────────────────────
  // AttendanceDTO: { id, attendanceDate, status, checkIn, checkOut, remarks, user }
  const attendanceStats = useMemo(() => {
    const records = monthlyAttendance || [];

    const presentDays = records.filter((r) => r.status === "PRESENT").length;
    const lateDays = records.filter((r) => r.status === "LATE").length;
    const halfDays = records.filter((r) => r.status === "HALF_DAY").length;
    const leaveDays = records.filter((r) => r.status === "ON_LEAVE").length;
    const absentDays = records.filter((r) => r.status === "ABSENT").length;
    const wfhDays = records.filter((r) => r.status === "WORK_FROM_HOME").length;

    // Working days = all days that are not ABSENT or HOLIDAY
    const workingDays = records.filter(
      (r) => !["ABSENT", "HOLIDAY"].includes(r.status),
    ).length;

    // Working hours = sum of (checkOut - checkIn) for all records with both times
    const workHours = totalWorkingHours(records);

    return {
      presentDays,
      lateDays,
      halfDays,
      leaveDays,
      absentDays,
      wfhDays,
      workingDays,
      workHours,
    };
  }, [monthlyAttendance]);

  // ── Today's record for check-in/out ──────────────────────────────────────
  const todayRecord = useMemo(() => {
    if (!monthlyAttendance) return null;
    return (
      monthlyAttendance.find((r) => r.attendanceDate === todayISO()) || null
    );
  }, [monthlyAttendance]);

  const hasCheckedIn = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;
  const todayDuration = calcDuration(
    todayRecord?.checkIn,
    todayRecord?.checkOut,
  );

  const handleCheckIn = () => checkIn({ date: todayISO(), time: nowTime() });

  const handleCheckOut = () =>
    checkOut({
      date: todayISO(),
      time: nowTime(),
      attendanceStatus: todayRecord?.status || "PRESENT",
    });

  // ── Project stats ─────────────────────────────────────────────────────────
  const projects = Array.isArray(myProjects)
    ? myProjects
    : myProjects?.content || myProjects?.data || [];

  const stats = useMemo(() => {
    const completed = projects.filter(
      (p) => p.projectStatus === "COMPLETED",
    ).length;
    const inProgress = projects.filter(
      (p) => p.projectStatus === "IN_PROGRESS",
    ).length;
    const onHold = projects.filter((p) => p.projectStatus === "ON_HOLD").length;
    const planning = projects.filter(
      (p) => p.projectStatus === "PLANNING",
    ).length;
    return {
      totalProjects: projects.length,
      completedProjects: completed,
      inProgressProjects: inProgress,
      onHoldProjects: onHold,
      planningProjects: planning,
      completionRate:
        projects.length > 0
          ? Math.round((completed / projects.length) * 100)
          : 0,
    };
  }, [projects]);

  // ── Chart data ────────────────────────────────────────────────────────────
  const statusPieData = useMemo(() => {
    if (!projects.length) return [];
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

  const projectsByMonth = useMemo(() => {
    if (!projects.length) return [];
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

  const activeProjects = useMemo(
    () =>
      projects
        .filter((p) => ["IN_PROGRESS", "PLANNING"].includes(p.projectStatus))
        .sort(
          (a, b) =>
            new Date(b.projectCreatedDateTime) -
            new Date(a.projectCreatedDateTime),
        )
        .slice(0, 6),
    [projects],
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

  const role = me?.role
    ? me.role
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Employee";

  // ── 8 stat cards definition ──────────────────────────────────────────────
  // Derived from myProjects + useMyMonthlyAttendance
  const statCards = [
    {
      icon: <IconProjects />,
      value: stats.inProgressProjects,
      label: "My Sites",
      sub: `${stats.totalProjects} total assigned`,
      accent: COLOR_WARNING,
      loading: isLoading,
    },
    {
      icon: <IconCheckmark />,
      value: `${stats.completionRate}%`,
      label: "Completion Rate",
      sub: `${stats.completedProjects} completed`,
      accent: COLOR_SUCCESS,
      loading: isLoading,
    },
    {
      icon: <IconCalendar />,
      value: attendanceStats.workingDays,
      label: "Working Days",
      sub: `This month (${now.toLocaleString("en-IN", { month: "short" })})`,
      accent: COLOR_INFO,
      loading: loadingAttendance,
    },
    {
      icon: <IconLeaf />,
      value: attendanceStats.leaveDays,
      label: "My Leaves",
      sub: `${attendanceStats.absentDays} absent this month`,
      accent: COLOR_PURPLE,
      loading: loadingAttendance,
    },
    {
      icon: <IconHourglass />,
      value: attendanceStats.workHours,
      label: "Working Hours",
      sub: "Total this month",
      accent: COLOR_TEAL,
      loading: loadingAttendance,
    },
    {
      icon: <IconPresent />,
      value: attendanceStats.presentDays,
      label: "Present Days",
      sub: `${attendanceStats.lateDays} late · ${attendanceStats.halfDays} half-day`,
      accent: COLOR_SUCCESS,
      loading: loadingAttendance,
    },
    {
      icon: <IconClock />,
      value: stats.onHoldProjects,
      label: "On Hold",
      sub: "Sites currently paused",
      accent: COLOR_DANGER,
      loading: isLoading,
    },
    {
      icon: <IconTrending />,
      value: stats.planningProjects,
      label: "In Planning",
      sub: `${attendanceStats.wfhDays} WFH this month`,
      accent: COLOR_ROSE,
      loading: isLoading || loadingAttendance,
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.dashboard}>
      {/* ── Welcome Card ── */}
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeLeft}>
          <div className={styles.welcomeGreeting}>{greeting},</div>
          <div className={styles.welcomeText}>
            {loadingMe ? <Pulse h={32} w={200} /> : `${name} 👋`}
          </div>
          <div className={styles.welcomeSub}>
            {loadingMe ? (
              <Pulse h={16} w={280} />
            ) : (
              <>
                <span className={styles.roleBadge}>{role}</span>
                <span className={styles.divider}>•</span>
                {stats.totalProjects} project
                {stats.totalProjects !== 1 ? "s" : ""} assigned
              </>
            )}
          </div>
        </div>

        <div className={styles.welcomeRight}>
          {/* Date */}
          <div className={styles.welcomeDate}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          {/* ── Check-In / Check-Out ── */}
          <div className={styles.checkActions}>
            {/* Today status badge */}
            {todayRecord?.status && (
              <div className={styles.todayStatus}>
                {hasCheckedIn && (
                  <span className={styles.timeTag} style={{ color: "#16a34a" }}>
                    ↑ {fmtTime(todayRecord.checkIn)}
                  </span>
                )}
                {hasCheckedOut && (
                  <span className={styles.timeTag} style={{ color: "#dc2626" }}>
                    ↓ {fmtTime(todayRecord.checkOut)}
                  </span>
                )}
                {todayDuration && (
                  <span className={styles.timeTag} style={{ color: "#7c3aed" }}>
                    ⏱ {todayDuration}
                  </span>
                )}
              </div>
            )}

            <div className={styles.checkBtns}>
              {/* Check-In */}
              <button
                className={`${styles.checkBtn} ${styles.checkBtnIn} ${hasCheckedIn ? styles.checkBtnDone : ""}`}
                onClick={handleCheckIn}
                disabled={hasCheckedIn || checkingIn || loadingAttendance}
                title={
                  hasCheckedIn
                    ? `Checked in at ${fmtTime(todayRecord.checkIn)}`
                    : "Record check-in"
                }
              >
                {checkingIn ? (
                  <>
                    <span className={styles.btnSpinner} /> In…
                  </>
                ) : hasCheckedIn ? (
                  <>
                    <span className={styles.checkIcon}>✓</span>{" "}
                    {fmtTime(todayRecord.checkIn)}
                  </>
                ) : (
                  <>
                    <span className={styles.checkIcon}>⏱</span> Check In
                  </>
                )}
              </button>

              {/* Check-Out */}
              <button
                className={`${styles.checkBtn} ${styles.checkBtnOut} ${hasCheckedOut ? styles.checkBtnDone : ""}`}
                onClick={handleCheckOut}
                disabled={
                  !hasCheckedIn ||
                  hasCheckedOut ||
                  checkingOut ||
                  loadingAttendance
                }
                title={
                  !hasCheckedIn
                    ? "Check in first"
                    : hasCheckedOut
                      ? `Checked out at ${fmtTime(todayRecord.checkOut)}`
                      : "Record check-out"
                }
              >
                {checkingOut ? (
                  <>
                    <span className={styles.btnSpinner} /> Out…
                  </>
                ) : hasCheckedOut ? (
                  <>
                    <span className={styles.checkIcon}>✓</span>{" "}
                    {fmtTime(todayRecord.checkOut)}
                  </>
                ) : (
                  <>
                    <span className={styles.checkIcon}>🏁</span> Check Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8 Stat Cards ── */}
      <div className={styles.statCards}>
        {statCards.map((card, i) => (
          <StatCard
            key={i}
            icon={card.icon}
            value={card.value}
            label={card.label}
            sub={card.sub}
            accent={card.accent}
            isLoading={card.loading}
          />
        ))}
      </div>

      {/* ── Charts Row: Area + Pie ── */}
      <div className={styles.chartsRow}>
        <SectionCard
          title="Your Projects — by Month"
          className={styles.chartWide}
        >
          {isLoading ? (
            <Pulse h={220} />
          ) : projectsByMonth.length === 0 ? (
            <div className={styles.emptyChart}>No projects yet.</div>
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

        <SectionCard
          title="Project Status Breakdown"
          className={styles.chartNarrow}
        >
          {isLoading ? (
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

      {/* ── Active Projects ── */}
      <SectionCard
        title="Active Projects"
        action={activeProjects.length > 0 ? "View All" : undefined}
        onAction={() => navigate("/my-projects")}
      >
        {isLoading ? (
          <div className={styles.projectListSkeleton}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.projectListRow}>
                <Pulse h={14} w={150} />
                <Pulse h={14} w={100} />
                <Pulse h={14} w={80} />
                <Pulse h={14} w={60} />
              </div>
            ))}
          </div>
        ) : activeProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <IconAlert />
            </div>
            <p>No active projects right now.</p>
            <small>Projects you're assigned to will appear here.</small>
          </div>
        ) : (
          <div className={styles.projectList}>
            {activeProjects.map((project) => {
              const statusColor =
                STATUS_COLORS[project.projectStatus] ?? COLOR_GRAY_300;
              return (
                <div key={project.projectId} className={styles.projectListItem}>
                  <div className={styles.projectInfo}>
                    <div className={styles.projectTitle}>
                      {project.projectName || `Project #${project.projectId}`}
                    </div>
                    <div className={styles.projectMeta}>
                      <span className={styles.projectCode}>
                        {project.projectCode || "—"}
                      </span>
                      <span className={styles.projectCity}>
                        {project.city || "—"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.projectStatus}>
                    <span
                      className={styles.statusPill}
                      style={{
                        background: `${statusColor}18`,
                        color: statusColor,
                      }}
                    >
                      <span
                        className={styles.statusDot}
                        style={{ background: statusColor }}
                      />
                      {project.projectStatus?.replace(/_/g, " ") || "Unknown"}
                    </span>
                  </div>
                  <div className={styles.projectDate}>
                    {fmt(project.projectCreatedDateTime)}
                  </div>
                  <button
                    className={styles.projectAction}
                    onClick={() => navigate(`/projects/${project.projectId}`)}
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* ── Performance Summary ── */}
      <div className={styles.performanceGrid}>
        <SectionCard title="Performance Summary">
          <div className={styles.performanceContent}>
            <div className={styles.perfItem}>
              <div className={styles.perfLabel}>Total Assigned</div>
              <div className={styles.perfValue}>
                {isLoading ? <Pulse h={28} w={60} /> : stats.totalProjects}
              </div>
            </div>
            <div className={styles.perfItem}>
              <div className={styles.perfLabel}>Completion Rate</div>
              <div
                className={styles.perfValue}
                style={{ color: COLOR_SUCCESS }}
              >
                {isLoading ? (
                  <Pulse h={28} w={60} />
                ) : (
                  `${stats.completionRate}%`
                )}
              </div>
            </div>
            <div className={styles.perfItem}>
              <div className={styles.perfLabel}>Average Status</div>
              <div className={styles.perfValue} style={{ color: COLOR_INFO }}>
                {isLoading ? (
                  <Pulse h={28} w={60} />
                ) : stats.inProgressProjects > 0 ? (
                  "On Track"
                ) : (
                  "—"
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
