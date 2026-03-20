import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEmployeeList } from "../../api/hooks/useEmployees";
import { useBulkAttendance } from "../../api/hooks/useAttendance";
import styles from "./DailyAttendance.module.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayISO = () => new Date().toISOString().split("T")[0]; // "2026-03-20"

const todayLabel = () =>
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

// Backend expects LocalTime as "HH:mm:ss" — inputs collect "HH:mm"
const toLocalTime = (hhmm) => (hhmm ? `${hhmm}:00` : null); // "09:30" → "09:30:00"
const fromLocalTime = (hhmmss) => (hhmmss ? hhmmss.slice(0, 5) : ""); // inverse (for pre-fill)

// UserDTO: firstName, secondName (optional), lastName
const fullName = (emp) =>
  [emp.firstName, emp.secondName, emp.lastName].filter(Boolean).join(" ");

const initials = (name) =>
  (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// ─── Config ───────────────────────────────────────────────────────────────────
// Exactly matches AttendanceStatus enum in backend
const STATUS_OPTIONS = [
  "PRESENT",
  "ABSENT",
  "HALF_DAY",
  "LATE",
  "ON_LEAVE",
  "HOLIDAY",
  "WORK_FROM_HOME",
];

const STATUS_CONFIG = {
  PRESENT: {
    label: "Present",
    bg: "#dcfce7",
    color: "#14532d",
    dot: "#22c55e",
    icon: "✓",
  },
  ABSENT: {
    label: "Absent",
    bg: "#fee2e2",
    color: "#991b1b",
    dot: "#ef4444",
    icon: "✕",
  },
  HALF_DAY: {
    label: "Half Day",
    bg: "#fef3c7",
    color: "#92400e",
    dot: "#f59e0b",
    icon: "½",
  },
  LATE: {
    label: "Late",
    bg: "#fff7ed",
    color: "#9a3412",
    dot: "#f97316",
    icon: "⏰",
  },
  ON_LEAVE: {
    label: "On Leave",
    bg: "#ede9fe",
    color: "#4c1d95",
    dot: "#7c3aed",
    icon: "⏸",
  },
  HOLIDAY: {
    label: "Holiday",
    bg: "#dbeafe",
    color: "#1e40af",
    dot: "#3b82f6",
    icon: "🎉",
  },
  WORK_FROM_HOME: {
    label: "Work From Home",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#4ade80",
    icon: "🏠",
  },
};

// Statuses where check-in / check-out are meaningless
const NO_TIME_STATUSES = new Set(["ABSENT", "HOLIDAY", "ON_LEAVE"]);

const SUMMARY_DEFS = [
  { key: "total", label: "Total", icon: "👥", bg: "#ede9fe", color: "#4c1d95" },
  {
    key: "PRESENT",
    label: "Present",
    icon: "✓",
    bg: "#dcfce7",
    color: "#14532d",
  },
  {
    key: "ABSENT",
    label: "Absent",
    icon: "✕",
    bg: "#fee2e2",
    color: "#991b1b",
  },
  {
    key: "ON_LEAVE",
    label: "On Leave",
    icon: "⏸",
    bg: "#ede9fe",
    color: "#4c1d95",
  },
  {
    key: "HALF_DAY",
    label: "Half Day",
    icon: "½",
    bg: "#fef3c7",
    color: "#92400e",
  },
  { key: "LATE", label: "Late", icon: "⏰", bg: "#fff7ed", color: "#9a3412" },
  {
    key: "WORK_FROM_HOME",
    label: "WFH",
    icon: "🏠",
    bg: "#f0fdf4",
    color: "#166534",
  },
  {
    key: "unmarked",
    label: "Unmarked",
    icon: "?",
    bg: "#f3f4f6",
    color: "#374151",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span
      className={styles.statusBadge}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className={styles.statusDot} style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

const SummaryCard = ({ icon, label, value, bg, color }) => (
  <div className={styles.summaryCard} style={{ background: bg, color }}>
    <span className={styles.summaryIcon}>{icon}</span>
    <span className={styles.summaryVal}>{value}</span>
    <span className={styles.summaryLabel}>{label}</span>
  </div>
);

// Avatar: shows profileImage (UserDTO.profileImage) or colored initials
const Avatar = ({ emp }) => {
  const name = fullName(emp);
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  if (emp.profileImage) {
    return (
      <img src={emp.profileImage} alt={name} className={styles.avatarImg} />
    );
  }
  return (
    <div
      className={styles.avatar}
      style={{ background: `hsl(${hue},52%,55%)` }}
    >
      {initials(name)}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DailyAttendance() {
  const navigate = useNavigate();

  // GET /api/employees/getallemployees → ResponseStructure<List<UserDTO>>
  const { data: employeesData, isLoading, isError } = useEmployeeList();

  // POST /api/attendance/bulk?date=YYYY-MM-DD
  // body: List<BulkAttendanceRequest> { userId, status, checkIn, checkOut, remarks }
  const { mutate: bulkMarkAttendance, isPending: isSaving } =
    useBulkAttendance();

  // Only ACTIVE employees (UserDTO.status === "ACTIVE")
  const allEmployees = useMemo(
    () => (employeesData || []).filter((e) => e.status === "ACTIVE"),
    [employeesData],
  );

  // ── Local State ───────────────────────────────────────────────────────────
  // Keyed by UserDTO.id (Long)
  // { [userId]: { status: "PRESENT", checkIn: "09:30", checkOut: "18:00", remarks: "" } }
  const [records, setRecords] = useState({});
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // ── Record helpers ────────────────────────────────────────────────────────
  const getRecord = (userId) =>
    records[userId] || { status: "", checkIn: "", checkOut: "", remarks: "" };

  const updateRecord = (userId, field, value) => {
    setRecords((prev) => {
      const cur = getRecord(userId);
      const next = { ...cur, [field]: value };
      if (field === "status" && NO_TIME_STATUSES.has(value)) {
        next.checkIn = "";
        next.checkOut = "";
      }
      return { ...prev, [userId]: next };
    });
  };

  const markAll = (status) => {
    const patch = {};
    allEmployees.forEach((emp) => {
      patch[emp.id] = {
        ...getRecord(emp.id),
        status,
        ...(NO_TIME_STATUSES.has(status) ? { checkIn: "", checkOut: "" } : {}),
      };
    });
    setRecords((prev) => ({ ...prev, ...patch }));
  };

  // ── Summary ───────────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const counts = { total: allEmployees.length, unmarked: 0 };
    STATUS_OPTIONS.forEach((s) => {
      counts[s] = 0;
    });
    allEmployees.forEach((emp) => {
      const s = records[emp.id]?.status;
      if (s) counts[s] = (counts[s] || 0) + 1;
      else counts.unmarked++;
    });
    return counts;
  }, [records, allEmployees]);

  // ── Filtered employees ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allEmployees.filter((emp) => {
      const name = fullName(emp).toLowerCase();
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        name.includes(q) ||
        (emp.email || "").toLowerCase().includes(q) ||
        (emp.role || "").toLowerCase().includes(q);

      const recStatus = records[emp.id]?.status || "";
      const matchFilter =
        filterStatus === "All"
          ? true
          : filterStatus === "Unmarked"
            ? !recStatus
            : recStatus === filterStatus;

      return matchSearch && matchFilter;
    });
  }, [allEmployees, search, filterStatus, records]);

  // ── Save ──────────────────────────────────────────────────────────────────
  // Calls POST /api/attendance/bulk?date=YYYY-MM-DD
  // with body: List<BulkAttendanceRequest>
  //   { userId: Long, status: AttendanceStatus, checkIn: LocalTime, checkOut: LocalTime, remarks: String }
  const handleSave = () => {
    setSaveError("");

    const date = todayISO(); // query param: ?date=2026-03-20

    const payload = allEmployees.map((emp) => {
      const rec = getRecord(emp.id);
      return {
        userId: emp.id, // Long → UserDTO.id
        status: rec.status || "ABSENT", // AttendanceStatus enum
        checkIn: rec.checkIn ? toLocalTime(rec.checkIn) : null, // LocalTime "HH:mm:ss"
        checkOut: rec.checkOut ? toLocalTime(rec.checkOut) : null,
        remarks: rec.remarks || null,
      };
    });

    bulkMarkAttendance(
      { date, data: payload }, // matches useBulkAttendance: ({ date, data }) => markBulkAttendance(date, data)
      {
        onSuccess: () => {
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 3500);
        },
        onError: (err) => {
          setSaveError(err?.message || "Failed to save. Please try again.");
        },
      },
    );
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.skeletonWrap}>
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonSummary} />
          <div className={styles.skeletonTable} />
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.errorState}>
          <span>⚠️</span>
          <h3>Failed to load employees</h3>
          <p>Unable to fetch employee list. Please try again.</p>
          <button onClick={() => navigate(-1)} className={styles.errBtn}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb */}

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroIcon}>📋</div>
          <div className={styles.heroMeta}>
            <h1 className={styles.heroTitle}>Daily Attendance</h1>
            <div className={styles.heroChips}>
              <span className={styles.chip}>📅 {todayLabel()}</span>
              <span className={styles.chip}>
                👥 {allEmployees.length} Active Employees
              </span>
            </div>
            <p className={styles.heroDetails}>
              Mark attendance for all active employees. Check-in / check-out
              times are optional for applicable statuses.
            </p>
          </div>
        </div>

        <div className={styles.heroRight}>
          {savedSuccess && (
            <span className={styles.successPill}>
              ✓ Attendance saved successfully
            </span>
          )}
          {saveError && <span className={styles.errorPill}>⚠ {saveError}</span>}
          <div className={styles.quickMark}>
            <span className={styles.quickLabel}>Mark all:</span>
            {["PRESENT", "ABSENT", "ON_LEAVE", "HOLIDAY"].map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  className={styles.quickBtn}
                  style={{ background: cfg.bg, color: cfg.color }}
                  onClick={() => markAll(s)}
                >
                  {cfg.icon} {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className={styles.summaryRow}>
        {SUMMARY_DEFS.map(({ key, label, icon, bg, color }) => (
          <SummaryCard
            key={key}
            icon={icon}
            label={label}
            value={summary[key] ?? 0}
            bg={bg}
            color={color}
          />
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name, email, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className={styles.filterTabs}>
          {["All", ...STATUS_OPTIONS, "Unmarked"].map((f) => {
            const cfg = STATUS_CONFIG[f];
            const count =
              f === "All"
                ? allEmployees.length
                : f === "Unmarked"
                  ? summary.unmarked
                  : (summary[f] ?? 0);
            const isActive = filterStatus === f;
            return (
              <button
                key={f}
                className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""}`}
                style={
                  isActive && cfg
                    ? {
                        background: cfg.bg,
                        color: cfg.color,
                        borderColor: cfg.dot,
                      }
                    : {}
                }
                onClick={() => setFilterStatus(f)}
              >
                {cfg ? cfg.label : f}
                <span className={styles.filterCount}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Attendance Table ── */}
      <div className={styles.tableCard}>
        {/* ── Desktop table (hidden on sm) ── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>#</th>
                <th className={styles.th}>Employee</th>
                <th className={styles.th}>Role</th>
                <th className={styles.th}>Status</th>
                <th className={styles.th}>Check-In</th>
                <th className={styles.th}>Check-Out</th>
                <th className={styles.th}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>
                    🔍 No employees match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((emp, idx) => {
                  // UserDTO fields used: id, firstName, secondName, lastName,
                  //   profileImage, email, role, status
                  const rec = getRecord(emp.id);
                  const cfg = STATUS_CONFIG[rec.status];
                  const noTime = NO_TIME_STATUSES.has(rec.status);

                  return (
                    <tr
                      key={emp.id}
                      className={`${styles.tr} ${rec.status ? styles[`row_${rec.status}`] : ""}`}
                    >
                      <td className={styles.td}>
                        <span className={styles.rowNum}>{idx + 1}</span>
                      </td>

                      {/* Employee — id + name + email + profileImage */}
                      <td className={styles.td}>
                        <div className={styles.empCell}>
                          <Avatar emp={emp} />
                          <div className={styles.empInfo}>
                            <span className={styles.empName}>
                              {fullName(emp)}
                            </span>
                            <span className={styles.empSub}>
                              {emp.email || "—"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* UserDTO.role */}
                      <td className={styles.td}>
                        <span className={styles.roleBadge}>
                          {emp.role || "—"}
                        </span>
                      </td>

                      {/* AttendanceStatus enum */}
                      <td className={styles.td}>
                        <select
                          className={styles.statusSelect}
                          value={rec.status}
                          onChange={(e) =>
                            updateRecord(emp.id, "status", e.target.value)
                          }
                          style={
                            cfg
                              ? {
                                  background: cfg.bg,
                                  color: cfg.color,
                                  borderColor: cfg.dot,
                                }
                              : {}
                          }
                        >
                          <option value="">— Select —</option>
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* LocalTime checkIn */}
                      <td className={styles.td}>
                        <input
                          type="time"
                          className={styles.timeInput}
                          value={rec.checkIn}
                          disabled={noTime || !rec.status}
                          onChange={(e) =>
                            updateRecord(emp.id, "checkIn", e.target.value)
                          }
                        />
                      </td>

                      {/* LocalTime checkOut */}
                      <td className={styles.td}>
                        <input
                          type="time"
                          className={styles.timeInput}
                          value={rec.checkOut}
                          disabled={noTime || !rec.status}
                          onChange={(e) =>
                            updateRecord(emp.id, "checkOut", e.target.value)
                          }
                        />
                      </td>

                      {/* remarks — optional HR note */}
                      <td className={styles.td}>
                        <input
                          type="text"
                          className={styles.remarksInput}
                          placeholder="Note…"
                          value={rec.remarks}
                          maxLength={120}
                          onChange={(e) =>
                            updateRecord(emp.id, "remarks", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards (shown only on sm) ── */}
        <div className={styles.mobileList}>
          {filtered.map((emp) => {
            const rec = getRecord(emp.id);
            const cfg = STATUS_CONFIG[rec.status];
            const noTime = NO_TIME_STATUSES.has(rec.status);

            return (
              <div key={emp.id} className={styles.mobileCard}>
                <div className={styles.mobileCardHead}>
                  <div className={styles.empCell}>
                    <Avatar emp={emp} />
                    <div className={styles.empInfo}>
                      <span className={styles.empName}>{fullName(emp)}</span>
                      <span className={styles.empSub}>
                        {emp.role || emp.email || "—"}
                      </span>
                    </div>
                  </div>
                  {rec.status && <StatusBadge status={rec.status} />}
                </div>

                <div className={styles.mobileCardBody}>
                  <div className={styles.mobileField}>
                    <label className={styles.mobileLabel}>Status</label>
                    <select
                      className={styles.statusSelect}
                      value={rec.status}
                      onChange={(e) =>
                        updateRecord(emp.id, "status", e.target.value)
                      }
                      style={
                        cfg
                          ? {
                              background: cfg.bg,
                              color: cfg.color,
                              borderColor: cfg.dot,
                            }
                          : {}
                      }
                    >
                      <option value="">— Select —</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.mobileTimeRow}>
                    <div className={styles.mobileField}>
                      <label className={styles.mobileLabel}>Check-In</label>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={rec.checkIn}
                        disabled={noTime || !rec.status}
                        onChange={(e) =>
                          updateRecord(emp.id, "checkIn", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.mobileField}>
                      <label className={styles.mobileLabel}>Check-Out</label>
                      <input
                        type="time"
                        className={styles.timeInput}
                        value={rec.checkOut}
                        disabled={noTime || !rec.status}
                        onChange={(e) =>
                          updateRecord(emp.id, "checkOut", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.mobileField}>
                    <label className={styles.mobileLabel}>Remarks</label>
                    <input
                      type="text"
                      className={styles.remarksInput}
                      placeholder="Optional HR note…"
                      value={rec.remarks}
                      maxLength={120}
                      onChange={(e) =>
                        updateRecord(emp.id, "remarks", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Sticky Save Footer ── */}
      <div className={styles.saveFooter}>
        <div className={styles.saveFooterInner}>
          <div className={styles.saveInfo}>
            <span className={styles.saveInfoText}>
              {summary.unmarked > 0
                ? `⚠️ ${summary.unmarked} employee${summary.unmarked !== 1 ? "s" : ""} not yet marked`
                : "✓ All employees have been marked"}
            </span>
            <span className={styles.saveDate}>Saving for: {todayLabel()}</span>
          </div>

          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className={styles.spinner} /> Saving…
              </>
            ) : (
              <>💾 Save Attendance</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
