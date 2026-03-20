import { useState, useMemo, useEffect } from "react";
import {
  useMyMonthlyAttendance,
  useMyCheckIn,
  useMyCheckOut,
} from "../../api/hooks/useAttendance";
import styles from "./MyAttendance.module.scss";

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
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

// "09:30:00" → "09:30 AM"
const fmtTime = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${suffix}`;
};

// Current date as "YYYY-MM-DD"
const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
// Current time as "HH:mm:ss" (Java LocalTime format)
const nowTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
};

// "YYYY-MM-DD" pad helper
const toISO = (year, month, day) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

// Duration between two "HH:mm:ss" strings → "Xh Ym"
const calcDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return null;
  const [ih, im] = inTime.split(":").map(Number);
  const [oh, om] = outTime.split(":").map(Number);
  const totalMin = oh * 60 + om - (ih * 60 + im);
  if (totalMin <= 0) return null;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  PRESENT: {
    label: "Present",
    bg: "#dcfce7",
    color: "#14532d",
    dot: "#22c55e",
    calBg: "rgba(34,197,94,0.18)",
    calBorder: "#22c55e",
  },
  ABSENT: {
    label: "Absent",
    bg: "#fee2e2",
    color: "#991b1b",
    dot: "#ef4444",
    calBg: "rgba(239,68,68,0.15)",
    calBorder: "#ef4444",
  },
  HALF_DAY: {
    label: "Half Day",
    bg: "#fef3c7",
    color: "#92400e",
    dot: "#f59e0b",
    calBg: "rgba(245,158,11,0.18)",
    calBorder: "#f59e0b",
  },
  LATE: {
    label: "Late",
    bg: "#fff7ed",
    color: "#9a3412",
    dot: "#f97316",
    calBg: "rgba(249,115,22,0.15)",
    calBorder: "#f97316",
  },
  ON_LEAVE: {
    label: "On Leave",
    bg: "#ede9fe",
    color: "#4c1d95",
    dot: "#7c3aed",
    calBg: "rgba(124,58,237,0.12)",
    calBorder: "#7c3aed",
  },
  HOLIDAY: {
    label: "Holiday",
    bg: "#dbeafe",
    color: "#1e40af",
    dot: "#3b82f6",
    calBg: "rgba(59,130,246,0.15)",
    calBorder: "#3b82f6",
  },
  WORK_FROM_HOME: {
    label: "WFH",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#4ade80",
    calBg: "rgba(74,222,128,0.15)",
    calBorder: "#4ade80",
  },
};

// ─── Small live clock ─────────────────────────────────────────────────────────
const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={styles.liveClock}>
      {time.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MyAttendance() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  // ── Hooks ─────────────────────────────────────────────────────────────────
  // GET /api/attendance/getmymonthlyattendance?month=&year=
  const { data: monthlyData, isLoading } = useMyMonthlyAttendance(month, year);

  // PATCH /api/attendance/recordmycheckIn?date=&time=
  const { mutate: checkIn, isPending: checkingIn } = useMyCheckIn();

  // PATCH /api/attendance/recordmycheckout?date=&time=&attendanceStatus=
  const { mutate: checkOut, isPending: checkingOut } = useMyCheckOut();

  // ── Today's record ────────────────────────────────────────────────────────
  // AttendanceDTO: { id, attendanceDate, status, checkIn, checkOut, remarks,
  //                  user: UserLiteDTO { id, fullName, profileImage } }
  const todayRecord = useMemo(() => {
    if (!monthlyData) return null;
    return monthlyData.find((r) => r.attendanceDate === todayISO()) || null;
  }, [monthlyData]);

  const hasCheckedIn = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;
  const duration = calcDuration(todayRecord?.checkIn, todayRecord?.checkOut);

  // ── Map monthly data by date → { "YYYY-MM-DD": AttendanceDTO } ───────────
  const attendanceMap = useMemo(() => {
    if (!monthlyData) return {};
    return monthlyData.reduce((acc, rec) => {
      if (rec.attendanceDate) acc[rec.attendanceDate] = rec;
      return acc;
    }, {});
  }, [monthlyData]);

  // ── Monthly stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!monthlyData)
      return { present: 0, absent: 0, leave: 0, late: 0, wfh: 0 };
    return {
      present: monthlyData.filter((r) => r.status === "PRESENT").length,
      absent: monthlyData.filter((r) => r.status === "ABSENT").length,
      leave: monthlyData.filter((r) => r.status === "ON_LEAVE").length,
      late: monthlyData.filter((r) => r.status === "LATE").length,
      wfh: monthlyData.filter((r) => r.status === "WORK_FROM_HOME").length,
    };
  }, [monthlyData]);

  // ── Calendar grid ─────────────────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDow = new Date(year, month - 1, 1).getDay();
    const offset = firstDow === 0 ? 6 : firstDow - 1; // Mon-based
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [year, month]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleCheckIn = () => {
    checkIn({
      date: todayISO(), // "YYYY-MM-DD"
      time: nowTime(), // "HH:mm:ss"
    });
  };

  const handleCheckOut = () => {
    // attendanceStatus sent as query param — derive from context
    // Default to PRESENT unless already set
    const status = todayRecord?.status || "PRESENT";
    checkOut({
      date: todayISO(),
      time: nowTime(),
      attendanceStatus: status,
    });
  };

  // ── Month nav ─────────────────────────────────────────────────────────────
  const prevMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const today = new Date();
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.pageWrapper}>
      {/* ── Today Panel ── */}
      <div className={styles.todayPanel}>
        {/* Left — date + clock */}
        <div className={styles.todayLeft}>
          <div className={styles.todayDateBlock}>
            <span className={styles.todayDayNum}>
              {today.toLocaleDateString("en-IN", { day: "2-digit" })}
            </span>
            <div className={styles.todayDateMeta}>
              <span className={styles.todayMonthYear}>
                {today.toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className={styles.todayWeekday}>
                {today.toLocaleDateString("en-IN", { weekday: "long" })}
              </span>
            </div>
          </div>
          <LiveClock />
        </div>

        {/* Center — status + times */}
        <div className={styles.todayCenter}>
          {/* Status badge */}
          {todayRecord?.status ? (
            <span
              className={styles.todayStatusBadge}
              style={{
                background: STATUS_CONFIG[todayRecord.status]?.bg,
                color: STATUS_CONFIG[todayRecord.status]?.color,
              }}
            >
              <span
                className={styles.todayStatusDot}
                style={{ background: STATUS_CONFIG[todayRecord.status]?.dot }}
              />
              {STATUS_CONFIG[todayRecord.status]?.label}
            </span>
          ) : (
            <span
              className={styles.todayStatusBadge}
              style={{ background: "#f3f4f6", color: "#6b7280" }}
            >
              <span
                className={styles.todayStatusDot}
                style={{ background: "#d1d5db" }}
              />
              Not Marked
            </span>
          )}

          {/* Check-in / Check-out time display */}
          <div className={styles.timesRow}>
            <div className={styles.timeBlock}>
              <span className={styles.timeBlockLabel}>Check-In</span>
              <span
                className={`${styles.timeBlockVal} ${hasCheckedIn ? styles.timeBlockValGreen : ""}`}
              >
                {hasCheckedIn ? fmtTime(todayRecord.checkIn) : "--:--"}
              </span>
            </div>
            <div className={styles.timeSep}>→</div>
            <div className={styles.timeBlock}>
              <span className={styles.timeBlockLabel}>Check-Out</span>
              <span
                className={`${styles.timeBlockVal} ${hasCheckedOut ? styles.timeBlockValRed : ""}`}
              >
                {hasCheckedOut ? fmtTime(todayRecord.checkOut) : "--:--"}
              </span>
            </div>
            {duration && (
              <>
                <div className={styles.timeSep}>·</div>
                <div className={styles.timeBlock}>
                  <span className={styles.timeBlockLabel}>Duration</span>
                  <span
                    className={styles.timeBlockVal}
                    style={{ color: "#4c1d95" }}
                  >
                    {duration}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right — action buttons */}
        <div className={styles.todayRight}>
          {/* Check-In button */}
          <button
            className={`${styles.actionBtn} ${styles.checkInBtn}`}
            onClick={handleCheckIn}
            disabled={hasCheckedIn || checkingIn || !isCurrentMonth}
            title={
              hasCheckedIn
                ? `Checked in at ${fmtTime(todayRecord.checkIn)}`
                : "Record your check-in"
            }
          >
            {checkingIn ? (
              <>
                <span className={styles.btnSpinner} /> Checking in…
              </>
            ) : hasCheckedIn ? (
              <>
                <span className={styles.btnIcon}>✓</span>{" "}
                {fmtTime(todayRecord.checkIn)}
              </>
            ) : (
              <>
                <span className={styles.btnIcon}>⏱</span> Check In
              </>
            )}
          </button>

          {/* Check-Out button */}
          <button
            className={`${styles.actionBtn} ${styles.checkOutBtn}`}
            onClick={handleCheckOut}
            disabled={
              !hasCheckedIn || hasCheckedOut || checkingOut || !isCurrentMonth
            }
            title={
              !hasCheckedIn
                ? "Check in first"
                : hasCheckedOut
                  ? `Checked out at ${fmtTime(todayRecord.checkOut)}`
                  : "Record your check-out"
            }
          >
            {checkingOut ? (
              <>
                <span className={styles.btnSpinner} /> Checking out…
              </>
            ) : hasCheckedOut ? (
              <>
                <span className={styles.btnIcon}>✓</span>{" "}
                {fmtTime(todayRecord.checkOut)}
              </>
            ) : (
              <>
                <span className={styles.btnIcon}>🏁</span> Check Out
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Bottom layout: Stats + Calendar ── */}
      <div className={styles.bottomLayout}>
        {/* ── Monthly Stats ── */}
        <div className={styles.statsCol}>
          <div className={styles.sectionHead}>
            <h3 className={styles.sectionTitle}>This Month</h3>
            <span className={styles.sectionSub}>
              {MONTH_NAMES[month - 1]} {year}
            </span>
          </div>

          <div className={styles.statsList}>
            {[
              {
                key: "present",
                label: "Present",
                icon: "✓",
                bg: "#dcfce7",
                color: "#14532d",
                dot: "#22c55e",
              },
              {
                key: "absent",
                label: "Absent",
                icon: "✕",
                bg: "#fee2e2",
                color: "#991b1b",
                dot: "#ef4444",
              },
              {
                key: "late",
                label: "Late",
                icon: "⏰",
                bg: "#fff7ed",
                color: "#9a3412",
                dot: "#f97316",
              },
              {
                key: "leave",
                label: "On Leave",
                icon: "⏸",
                bg: "#ede9fe",
                color: "#4c1d95",
                dot: "#7c3aed",
              },
              {
                key: "wfh",
                label: "WFH",
                icon: "🏠",
                bg: "#f0fdf4",
                color: "#166534",
                dot: "#4ade80",
              },
            ].map(({ key, label, icon, bg, color, dot }) => (
              <div
                key={key}
                className={styles.statRow}
                style={{ borderLeftColor: dot }}
              >
                <div className={styles.statLeft}>
                  <span
                    className={styles.statIcon}
                    style={{ background: bg, color }}
                  >
                    {icon}
                  </span>
                  <span className={styles.statLabel}>{label}</span>
                </div>
                <span className={styles.statVal} style={{ color }}>
                  {isLoading ? "—" : stats[key]}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className={styles.calLegend}>
            <div className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#22c55e" }}
              />
              Present
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#ef4444" }}
              />
              Absent
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#f97316" }}
              />
              Late
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: "#7c3aed" }}
              />
              Leave
            </div>
          </div>
        </div>

        {/* ── Calendar ── */}
        <div className={styles.calendarCol}>
          {/* Cal nav */}
          <div className={styles.calNav}>
            <button className={styles.navBtn} onClick={prevMonth}>
              ‹
            </button>
            <span className={styles.calTitle}>
              {MONTH_NAMES[month - 1]}{" "}
              <span className={styles.calYear}>{year}</span>
            </span>
            <button className={styles.navBtn} onClick={nextMonth}>
              ›
            </button>
          </div>

          {/* Day labels */}
          <div className={styles.calDowRow}>
            {DAY_LABELS.map((d, i) => (
              <div
                key={i}
                className={`${styles.calDow} ${i === 6 ? styles.calDowSun : ""}`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className={styles.calGrid}>
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className={styles.skeletonCell} />
              ))}
            </div>
          ) : (
            <div className={styles.calGrid}>
              {calendarDays.map((day, idx) => {
                if (!day) {
                  return <div key={`e-${idx}`} className={styles.calEmpty} />;
                }

                const iso = toISO(year, month, day);
                const rec = attendanceMap[iso];
                const cfg = rec ? STATUS_CONFIG[rec.status] : null;
                const dow = new Date(year, month - 1, day).getDay(); // 0=Sun
                const isSun = dow === 0;
                const isToday = iso === todayISO();

                return (
                  <div
                    key={iso}
                    className={[
                      styles.calCell,
                      isSun ? styles.calSun : "",
                      isToday ? styles.calToday : "",
                      cfg ? styles.calHasData : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={
                      cfg && !isSun
                        ? { background: cfg.calBg, borderColor: cfg.calBorder }
                        : {}
                    }
                    title={
                      cfg
                        ? `${cfg.label}${rec.checkIn ? ` · In: ${fmtTime(rec.checkIn)}` : ""}${rec.checkOut ? ` · Out: ${fmtTime(rec.checkOut)}` : ""}`
                        : iso
                    }
                  >
                    <span className={styles.calDay}>{day}</span>
                    {cfg && !isSun && (
                      <span
                        className={styles.calDot}
                        style={{ background: cfg.dot }}
                      />
                    )}
                    {isSun && <span className={styles.calSunDash}>—</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
