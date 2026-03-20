import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAllEmployeesAttendance } from "../../api/hooks/useAttendance";
import styles from "./AttendanceCalendar.module.scss";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// "09:30:00" → "09:30"  |  null → "--"
const fmtTime = (t) => (t ? t.slice(0, 5) : "--");

// UserDTO: firstName + secondName? + lastName
const fullName = (user) => {
  if (!user) return "—";
  // AttendanceDTO.user is UserLiteDTO { id, fullName, profileImage }
  if (user.fullName) return user.fullName;
  return [user.firstName, user.secondName, user.lastName]
    .filter(Boolean)
    .join(" ");
};

const initials = (name) =>
  (name || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// Pad single digit → "2026-03-05"
const toISODate = (year, month, day) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

// ─── Config ───────────────────────────────────────────────────────────────────
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
    label: "WFH",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#4ade80",
    icon: "🏠",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return <span className={styles.statusUnknown}>—</span>;
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

const Avatar = ({ user }) => {
  const name = fullName(user);
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  if (user?.profileImage) {
    return (
      <img src={user.profileImage} alt={name} className={styles.avatarImg} />
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

// ─── Day Cell Indicator ───────────────────────────────────────────────────────
// Shows density dots: green = present, red = absent, yellow = other
const DayIndicator = ({ records }) => {
  if (!records || records.length === 0) return null;
  const present = records.filter((r) => r.status === "PRESENT").length;
  const absent = records.filter((r) => r.status === "ABSENT").length;
  const other = records.length - present - absent;
  return (
    <div className={styles.dayIndicator}>
      {present > 0 && (
        <span
          className={styles.dot}
          style={{ background: "#22c55e" }}
          title={`${present} present`}
        />
      )}
      {absent > 0 && (
        <span
          className={styles.dot}
          style={{ background: "#ef4444" }}
          title={`${absent} absent`}
        />
      )}
      {other > 0 && (
        <span
          className={styles.dot}
          style={{ background: "#f59e0b" }}
          title={`${other} other`}
        />
      )}
      <span className={styles.dayCount}>{records.length}</span>
    </div>
  );
};

// ─── Popup ────────────────────────────────────────────────────────────────────
const AttendancePopup = ({ date, records, onClose }) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!records) return [];
    if (!search) return records;
    const q = search.toLowerCase();
    return records.filter(
      (r) =>
        fullName(r.user).toLowerCase().includes(q) ||
        (r.status || "").toLowerCase().includes(q),
    );
  }, [records, search]);

  // Summary counts for this day
  const summary = useMemo(() => {
    if (!records) return {};
    return records.reduce((acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});
  }, [records]);

  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        {/* Popup Header */}
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderLeft}>
            <div className={styles.popupIconWrap}>📅</div>
            <div>
              <h2 className={styles.popupTitle}>{dateLabel}</h2>
              <p className={styles.popupSub}>
                {records?.length || 0} employee record
                {records?.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button className={styles.popupClose} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Day Summary Chips */}
        {records?.length > 0 && (
          <div className={styles.popupSummaryRow}>
            {Object.entries(summary).map(([status, count]) => {
              const cfg = STATUS_CONFIG[status];
              if (!cfg) return null;
              return (
                <span
                  key={status}
                  className={styles.summaryChip}
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.icon} {cfg.label}: <strong>{count}</strong>
                </span>
              );
            })}
          </div>
        )}

        {/* Search */}
        {records?.length > 0 && (
          <div className={styles.popupSearchWrap}>
            <span className={styles.popupSearchIcon}>🔍</span>
            <input
              className={styles.popupSearch}
              type="text"
              placeholder="Search employee…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                className={styles.popupSearchClear}
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className={styles.popupTableWrap}>
          {!records || records.length === 0 ? (
            <div className={styles.popupEmpty}>
              <span>📭</span>
              <p>No attendance records for this day.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.popupEmpty}>
              <span>🔍</span>
              <p>No employees match your search.</p>
            </div>
          ) : (
            <table className={styles.popupTable}>
              <thead>
                <tr>
                  <th className={styles.popupTh}>#</th>
                  <th className={styles.popupTh}>Employee</th>
                  <th className={styles.popupTh}>Status</th>
                  <th className={styles.popupTh}>Check-In</th>
                  <th className={styles.popupTh}>Check-Out</th>
                  <th className={styles.popupTh}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec, idx) => {
                  const cfg = STATUS_CONFIG[rec.status];
                  return (
                    <tr
                      key={rec.id || idx}
                      className={styles.popupTr}
                      style={cfg ? { borderLeft: `3px solid ${cfg.dot}` } : {}}
                    >
                      <td className={styles.popupTd}>
                        <span className={styles.rowNum}>{idx + 1}</span>
                      </td>
                      <td className={styles.popupTd}>
                        <div className={styles.empCell}>
                          <Avatar user={rec.user} />
                          <div className={styles.empInfo}>
                            <span className={styles.empName}>
                              {fullName(rec.user)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.popupTd}>
                        <StatusBadge status={rec.status} />
                      </td>
                      <td className={styles.popupTd}>
                        <span className={styles.timeVal}>
                          {fmtTime(rec.checkIn)}
                        </span>
                      </td>
                      <td className={styles.popupTd}>
                        <span className={styles.timeVal}>
                          {fmtTime(rec.checkOut)}
                        </span>
                      </td>
                      <td className={styles.popupTd}>
                        <span className={styles.remarksVal}>
                          {rec.remarks || "--"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Popup Footer */}
        <div className={styles.popupFooter}>
          <button className={styles.popupCloseBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AttendanceCalendar() {
  const navigate = useNavigate();

  // Current month/year state — drives the API call
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // "YYYY-MM-DD" or null

  const month = currentDate.getMonth() + 1; // 1-based for API
  const year = currentDate.getFullYear();

  // ── Data: GET /api/attendance/all?month=&year= ────────────────────────────
  // → ResponseStructure<List<AttendanceDTO>>
  // AttendanceDTO: { id, attendanceDate, status, checkIn, checkOut, remarks,
  //                  user: UserLiteDTO { id, fullName, profileImage } }
  const {
    data: monthlyData,
    isLoading,
    isError,
    refetch,
  } = useAllEmployeesAttendance(month, year);

  // ── Group flat list → { "2026-03-05": [AttendanceDTO, ...] } ─────────────
  // One API call per month, reused for every date click — no per-day fetching
  const groupedByDate = useMemo(() => {
    if (!monthlyData) return {};
    return monthlyData.reduce((acc, rec) => {
      // attendanceDate comes as "YYYY-MM-DD" from Java LocalDate
      const key = rec.attendanceDate;
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(rec);
      return acc;
    }, {});
  }, [monthlyData]);

  // ── Calendar grid calculation ─────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    // getDay() → 0=Sun..6=Sat. We want Mon=0, so shift:
    // Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6
    const firstDow = new Date(year, month - 1, 1).getDay();
    const offset = firstDow === 0 ? 6 : firstDow - 1; // Mon-based offset

    const cells = [];
    // Leading empty cells
    for (let i = 0; i < offset; i++) cells.push(null);
    // Actual days
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [year, month]);

  // Today for highlighting
  const todayISO = new Date().toISOString().split("T")[0];

  // ── Month navigation ──────────────────────────────────────────────────────
  const prevMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));

  const nextMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // ── Day click ─────────────────────────────────────────────────────────────
  const handleDayClick = (day) => {
    if (!day) return;
    const dow = new Date(year, month - 1, day).getDay(); // 0=Sun
    if (dow === 0) return; // Sundays disabled
    setSelectedDate(toISODate(year, month, day));
  };

  // ── Month-level summary for the stats strip ───────────────────────────────
  const monthSummary = useMemo(() => {
    if (!monthlyData)
      return { total: 0, present: 0, absent: 0, leave: 0, wfh: 0 };
    return {
      total: monthlyData.length,
      present: monthlyData.filter((r) => r.status === "PRESENT").length,
      absent: monthlyData.filter((r) => r.status === "ABSENT").length,
      leave: monthlyData.filter((r) => r.status === "ON_LEAVE").length,
      wfh: monthlyData.filter((r) => r.status === "WORK_FROM_HOME").length,
    };
  }, [monthlyData]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb */}

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroIcon}>🗓</div>
          <div className={styles.heroMeta}>
            <h1 className={styles.heroTitle}>Attendance Calendar</h1>
            <div className={styles.heroChips}>
              <span className={styles.chip}>
                {MONTH_NAMES[month - 1]} {year}
              </span>
              {!isLoading && monthlyData && (
                <span className={styles.chip}>
                  {monthlyData.length} records this month
                </span>
              )}
            </div>
            <p className={styles.heroDetails}>
              Click any working day to view all employee attendance details.
              Sundays are disabled. Navigate months using the arrows.
            </p>
          </div>
        </div>

        {/* Month-level summary strip */}
        <div className={styles.heroRight}>
          {[
            {
              label: "Total",
              value: monthSummary.total,
              bg: "#ede9fe",
              color: "#4c1d95",
            },
            {
              label: "Present",
              value: monthSummary.present,
              bg: "#dcfce7",
              color: "#14532d",
            },
            {
              label: "Absent",
              value: monthSummary.absent,
              bg: "#fee2e2",
              color: "#991b1b",
            },
            {
              label: "Leave",
              value: monthSummary.leave,
              bg: "#ede9fe",
              color: "#4c1d95",
            },
            {
              label: "WFH",
              value: monthSummary.wfh,
              bg: "#f0fdf4",
              color: "#166534",
            },
          ].map(({ label, value, bg, color }) => (
            <div
              key={label}
              className={styles.heroStat}
              style={{ background: bg, color }}
            >
              <span className={styles.heroStatVal}>{value}</span>
              <span className={styles.heroStatLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Calendar Card ── */}
      <div className={styles.calendarCard}>
        {/* Calendar Nav */}
        <div className={styles.calNav}>
          <button className={styles.navBtn} onClick={prevMonth}>
            ‹
          </button>
          <div className={styles.calNavCenter}>
            <h2 className={styles.calMonth}>{MONTH_NAMES[month - 1]}</h2>
            <span className={styles.calYear}>{year}</span>
          </div>
          <button className={styles.navBtn} onClick={nextMonth}>
            ›
          </button>
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <div className={styles.calLoading}>
            <div className={styles.calLoadingGrid}>
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className={styles.skeletonCell} />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <div className={styles.calError}>
            <span>⚠️</span>
            <p>Failed to load attendance data.</p>
            <button onClick={refetch} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {/* Day-of-week header */}
            <div className={styles.calDowRow}>
              {DAY_LABELS.map((d) => (
                <div
                  key={d}
                  className={`${styles.calDow} ${d === "Sun" ? styles.calDowSun : ""}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className={styles.calGrid}>
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return (
                    <div key={`empty-${idx}`} className={styles.calCellEmpty} />
                  );
                }

                const iso = toISODate(year, month, day);
                const dow = new Date(year, month - 1, day).getDay(); // 0=Sun
                const isSun = dow === 0;
                const isToday = iso === todayISO;
                const recs = groupedByDate[iso];
                const hasData = recs && recs.length > 0;

                // Determine dominant status color for cell tint
                let cellTint = "";
                if (hasData && !isSun) {
                  const presentPct =
                    recs.filter((r) => r.status === "PRESENT").length /
                    recs.length;
                  const absentPct =
                    recs.filter((r) => r.status === "ABSENT").length /
                    recs.length;
                  if (presentPct >= 0.7) cellTint = styles.cellTintGreen;
                  else if (absentPct >= 0.4) cellTint = styles.cellTintRed;
                  else cellTint = styles.cellTintYellow;
                }

                return (
                  <div
                    key={iso}
                    className={[
                      styles.calCell,
                      isSun ? styles.calCellSun : "",
                      isToday ? styles.calCellToday : "",
                      hasData && !isSun ? styles.calCellHasData : "",
                      cellTint,
                      selectedDate === iso ? styles.calCellSelected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleDayClick(day)}
                    title={isSun ? "Sunday — no attendance" : iso}
                  >
                    <span className={styles.calDayNum}>{day}</span>

                    {/* Density indicator dots */}
                    {!isSun && <DayIndicator records={recs} />}

                    {/* Sunday label */}
                    {isSun && <span className={styles.sunLabel}>Off</span>}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className={styles.calLegend}>
              {[
                { color: "#22c55e", label: "Mostly Present" },
                { color: "#ef4444", label: "High Absences" },
                { color: "#f59e0b", label: "Mixed" },
                { color: "transparent", label: "No data", border: "#e5e7eb" },
              ].map(({ color, label, border }) => (
                <div key={label} className={styles.legendItem}>
                  <span
                    className={styles.legendDot}
                    style={{
                      background: color,
                      border: border ? `1.5px solid ${border}` : "none",
                    }}
                  />
                  <span>{label}</span>
                </div>
              ))}
              <div className={styles.legendItem}>
                <span className={styles.legendToday} />
                <span>Today</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Attendance Popup ── */}
      {selectedDate && (
        <AttendancePopup
          date={selectedDate}
          records={groupedByDate[selectedDate] || []}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
