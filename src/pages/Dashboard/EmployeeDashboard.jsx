// import { useMemo } from "react";
// import {
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { useEmployeeData } from "../../api/hooks/useEmployees";
// import { useMyProjects } from "../../api/hooks/useProject";
// import styles from "./EmployeeDashboard.module.scss";

// // Colors
// const COLOR_PRIMARY = "#7c5e0b";
// const COLOR_GRAY_300 = "#d1d5db";

// const STATUS_COLORS = {
//   PLANNING: "#3b82f6",
//   IN_PROGRESS: "#f59e0b",
//   ON_HOLD: "#ef4444",
//   COMPLETED: "#10b981",
//   CANCELLED: "#6b7280",
// };

// // Helpers
// const getProjects = (data) => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   return data.content || data.data || [];
// };

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

// const fmt = (dt) =>
//   dt
//     ? new Date(dt).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// // Components
// const StatCard = ({ value, label }) => (
//   <div className={styles.statCard}>
//     <div className={styles.statContent}>
//       <div className={styles.statValue}>{value}</div>
//       <div className={styles.statLabel}>{label}</div>
//     </div>
//   </div>
// );

// const SectionCard = ({ title, children }) => (
//   <div className={styles.sectionCard}>
//     <div className={styles.sectionHead}>
//       <span className={styles.sectionTitle}>{title}</span>
//     </div>
//     {children}
//   </div>
// );

// export default function EmployeeDashboard() {
//   const { data: me } = useEmployeeData();
//   const { data, isLoading } = useMyProjects();

//   const myProjects = getProjects(data);

//   // Stats
//   const stats = useMemo(() => {
//     const active = myProjects.filter(
//       (p) => !["COMPLETED", "CANCELLED"].includes(p.projectStatus),
//     );

//     return {
//       total: myProjects.length,
//       active: active.length,
//       completed: myProjects.filter((p) => p.projectStatus === "COMPLETED")
//         .length,
//     };
//   }, [myProjects]);

//   // Chart - Month
//   const projectsByMonth = useMemo(() => {
//     const map = {};
//     myProjects.forEach((p) => {
//       const k = monthKey(p.projectCreatedDateTime);
//       if (!k) return;
//       map[k] = (map[k] || 0) + 1;
//     });

//     return Object.entries(map)
//       .sort(([a], [b]) => a.localeCompare(b))
//       .slice(-6)
//       .map(([k, count]) => ({
//         month: monthLabel(k),
//         count,
//       }));
//   }, [myProjects]);

//   // Pie
//   const statusData = useMemo(() => {
//     const counts = {};
//     myProjects.forEach((p) => {
//       const s = p.projectStatus || "UNKNOWN";
//       counts[s] = (counts[s] || 0) + 1;
//     });

//     return Object.entries(counts).map(([name, value]) => ({
//       name: name.replace(/_/g, " "),
//       value,
//       color: STATUS_COLORS[name] || COLOR_GRAY_300,
//     }));
//   }, [myProjects]);

//   const name = me?.firstName || "Employee";

//   return (
//     <div className={styles.dashboard}>
//       {/* Welcome */}
//       <div className={styles.welcomeCard}>
//         <div>
//           <div className={styles.welcomeText}>Welcome, {name} 👋</div>
//           <div className={styles.welcomeSub}>
//             Here are your assigned projects
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className={styles.statCards}>
//         <StatCard value={stats.total} label="My Sites" />
//         <StatCard value={stats.active} label="My Site Visits" />
//         <StatCard value={stats.completed} label="Upcoming Tasks" />
//       </div>
//       <div className={styles.statCards}>
//         <StatCard value={stats.completed} label="Working Days" />
//         <StatCard value={stats.total} label="My Leaves" />
//         <StatCard value={stats.completed} label="--" />
//       </div>

//       {/* Charts */}
//       <div className={styles.chartsRow}>
//         <SectionCard title="Projects by Month">
//           {isLoading ? (
//             <div className={styles.emptyState}>Loading...</div>
//           ) : projectsByMonth.length === 0 ? (
//             <div className={styles.emptyState}>No data</div>
//           ) : (
//             <ResponsiveContainer width="100%" height={220}>
//               <AreaChart data={projectsByMonth}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="month" />
//                 <YAxis allowDecimals={false} />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="count"
//                   stroke={COLOR_PRIMARY}
//                   fill={COLOR_PRIMARY}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           )}
//         </SectionCard>

//         <SectionCard title="Project Status">
//           {statusData.length === 0 ? (
//             <div className={styles.emptyState}>No data</div>
//           ) : (
//             <ResponsiveContainer width="100%" height={220}>
//               <PieChart>
//                 <Pie data={statusData} dataKey="value">
//                   {statusData.map((entry, i) => (
//                     <Cell key={i} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </SectionCard>
//       </div>

//       {/* Table */}
//       <div className={styles.recentSection}>
//         <div className={styles.sectionHead}>
//           <span className={styles.sectionTitle}>
//             {" "}
//             <br />
//             My Recent Projects
//           </span>
//         </div>

//         <div className={styles.recentTable}>
//           <div className={`${styles.tableRow} ${styles.tableHead}`}>
//             <span>Project</span>
//             <span>Status</span>
//             <span>Created</span>
//           </div>

//           {myProjects.length === 0 ? (
//             <div className={styles.emptyState}>No projects assigned</div>
//           ) : (
//             myProjects.slice(0, 5).map((p) => (
//               <div key={p.projectId} className={styles.tableRow}>
//                 <span className={styles.projectName}>
//                   {p.projectName || `#${p.projectId}`}
//                 </span>

//                 <span className={styles.statusPill}>{p.projectStatus}</span>

//                 <span>{fmt(p.projectCreatedDateTime)}</span>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

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
import { useEmployeeData } from "../../api/hooks/useEmployees";
import { useMyProjects } from "../../api/hooks/useProject";
import styles from "./EmployeeDashboard.module.scss";

// ─── Design Tokens ────────────────────────────────────────────────────────────
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

const IconCheckmark = () => (
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
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const IconClock = () => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconTrendingUp = () => (
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
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconAlert = () => (
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
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ─── Main Employee Dashboard ──────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("all");

  const { data: me, isLoading: loadingMe } = useEmployeeData();
  const { data: myProjects, isLoading: loadingProjects } = useMyProjects();

  const isLoading = loadingMe || loadingProjects;

  // ── Derived data ─────────────────────────────────────────────────────────
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

  // ── Project status distribution ──────────────────────────────────────────
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

  // ── Projects created per month (last 8 months) ────────────────────────────
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

  // ── Project timeline (assigned date) ──────────────────────────────────────
  const projectTimeline = useMemo(() => {
    if (!projects.length) return [];
    const timeline = projects
      .map((p) => ({
        name: p.projectName || `Project #${p.projectId}`,
        status: p.projectStatus,
        created: new Date(p.projectCreatedDateTime || new Date()),
      }))
      .sort((a, b) => a.created - b.created)
      .slice(-6);

    return timeline;
  }, [projects]);

  // ── Upcoming milestones (projects in progress) ────────────────────────────
  const activeProjects = useMemo(() => {
    return projects
      .filter((p) => ["IN_PROGRESS", "PLANNING"].includes(p.projectStatus))
      .sort(
        (a, b) =>
          new Date(b.projectCreatedDateTime) -
          new Date(a.projectCreatedDateTime),
      )
      .slice(0, 6);
  }, [projects]);

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
          value={isLoading ? <Pulse h={28} w={60} /> : stats.inProgressProjects}
          label="In Progress"
          sub={
            isLoading
              ? null
              : `${stats.completedProjects} of ${stats.totalProjects} done`
          }
          accent={COLOR_WARNING}
        />
        <StatCard
          icon={<IconCheckmark />}
          value={
            isLoading ? <Pulse h={28} w={40} /> : `${stats.completionRate}%`
          }
          label="Completion Rate"
          sub={isLoading ? null : `${stats.completedProjects} completed`}
          accent={COLOR_SUCCESS}
        />
        <StatCard
          icon={<IconClock />}
          value={isLoading ? <Pulse h={28} w={40} /> : stats.onHoldProjects}
          label="On Hold"
          accent={COLOR_DANGER}
        />
        <StatCard
          icon={<IconTrendingUp />}
          value={isLoading ? <Pulse h={28} w={40} /> : stats.planningProjects}
          label="In Planning"
          accent={COLOR_INFO}
        />
      </div>

      {/* ── Charts Row 1: Projects Timeline + Status Donut ── */}
      <div className={styles.chartsRow}>
        <SectionCard
          title="Your Projects — by Month"
          className={styles.chartWide}
        >
          {isLoading ? (
            <Pulse h={220} />
          ) : projectsByMonth.length === 0 ? (
            <div className={styles.emptyChart}>
              No projects yet. Get started by requesting assignment.
            </div>
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

      {/* ── Active Projects Section ── */}
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
