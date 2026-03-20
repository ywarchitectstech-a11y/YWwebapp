import { useState } from "react";
import {
  useMeetingsByProject,
  useCreateMeeting,
  useDeleteMeeting,
} from "../../api/hooks/useMeetings";
import { useEmployeeData } from "../../api/hooks/useEmployees";
import styles from "./MeetingsTab.module.scss";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";
import { use } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const MEETING_TYPES = [
  { value: "CALL", label: "📞 Call" },
  { value: "ZOOM", label: "💻 Zoom" },
  { value: "GOOGLE_MEET", label: "🎥 Google Meet" },
  { value: "FACE_TO_FACE", label: "🤝 Face to Face" },
  { value: "TEAMS", label: "💼 Teams" },
];

const MEETING_STATUSES = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_CFG = {
  SCHEDULED: { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
  ONGOING: { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  COMPLETED: { bg: "#dcfce7", color: "#14532d", dot: "#22c55e" },
  CANCELLED: { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
};

const TYPE_CFG = {
  CALL: { icon: "📞", bg: "#f0fdf4", color: "#166534" },
  ZOOM: { icon: "💻", bg: "#eff6ff", color: "#1d4ed8" },
  GOOGLE_MEET: { icon: "🎥", bg: "#fdf4ff", color: "#7e22ce" },
  FACE_TO_FACE: { icon: "🤝", bg: "#fff7ed", color: "#c2410c" },
  TEAMS: { icon: "💼", bg: "#f0f9ff", color: "#0369a1" },
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtDateTime = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ── MOM Templates ──────────────────────────────────────────────────────────────
const getMOMTemplates = (form, project) => {
  const projectName = project?.projectName || "[Project Name]";
  const clientName = project?.client?.name || "[Client Name]";
  const title = form.title || "[Meeting Title]";
  const agenda = form.agenda || "[Agenda]";
  const type = form.meetingType || "[Meeting Type]";
  const date = form.scheduledAt
    ? fmtDateTime(form.scheduledAt)
    : "[Date & Time]";
  const link = form.meetingLink ? `Meeting Link: ${form.meetingLink}` : "";

  return [
    {
      label: "📋 Standard MOM",
      icon: "📋",
      description: "Basic minutes with agenda & decisions",
      generate: () =>
        `MINUTES OF MEETING
==================
Project      : ${projectName}
Client       : ${clientName}
Meeting      : ${title}
Type         : ${type}
Scheduled    : ${date}
${link}

AGENDA
------
${agenda}

DISCUSSION POINTS
-----------------
1. 
2. 
3. 

DECISIONS TAKEN
---------------
1. 
2. 

ACTION ITEMS
------------
Task                  | Assigned To   | Due Date
----------------------|---------------|----------
                      |               |

NEXT MEETING
------------
Date   : 
Agenda : 

Prepared by : _______________
Date        : ${fmtDate(new Date())}`,
    },
    {
      label: "🏗 Site Review MOM",
      icon: "🏗",
      description: "For on-site progress review meetings",
      generate: () =>
        `SITE REVIEW — MINUTES OF MEETING
==================================
Project      : ${projectName}
Client       : ${clientName}
Review Type  : ${type}
Date & Time  : ${date}
${link}

AGENDA
------
${agenda}

SITE OBSERVATIONS
-----------------
1. 
2. 
3. 

WORK IN PROGRESS
----------------
Completed since last visit : 
Currently ongoing           : 
Pending / Blocked           : 

ISSUES & CONCERNS
-----------------
Issue      : 
Action     : 
Responsible: 

APPROVALS / SIGN-OFFS
---------------------
- 

NEXT SITE VISIT
---------------
Date              : 
Inspection Points : 

Prepared by : _______________
Date        : ${fmtDate(new Date())}`,
    },
    {
      label: "📞 Client Call Summary",
      icon: "📞",
      description: "Quick summary for client calls",
      generate: () =>
        `CLIENT CALL SUMMARY
====================
Project      : ${projectName}
Client       : ${clientName}
Call Type    : ${type}
Date & Time  : ${date}
${link}

PARTICIPANTS
------------
Client side : 
Our team    : 

AGENDA DISCUSSED
----------------
${agenda}

KEY POINTS RAISED BY CLIENT
----------------------------
1. 
2. 

OUR COMMITMENTS
---------------
1. 
2. 

FOLLOW-UP ITEMS
---------------
1. Task:          Due:          Owner:
2. Task:          Due:          Owner:

Notes: 

Prepared by : _______________
Date        : ${fmtDate(new Date())}`,
    },
    {
      label: "📐 Design Review MOM",
      icon: "📐",
      description: "For design presentation & feedback sessions",
      generate: () =>
        `DESIGN REVIEW — MINUTES OF MEETING
=====================================
Project      : ${projectName}
Client       : ${clientName}
Review Type  : ${type}
Date & Time  : ${date}
${link}

AGENDA
------
${agenda}

DESIGNS PRESENTED
-----------------
1. 
2. 

CLIENT FEEDBACK
---------------
✅ Approved          : 
🔄 Revision Required : 
❌ Rejected          : 

REVISION INSTRUCTIONS
---------------------
1. 
2. 

TIMELINE AGREED
---------------
Revision Deadline  : 
Next Presentation  : 

REMARKS
-------


Prepared by : _______________
Date        : ${fmtDate(new Date())}`,
    },
  ];
};

// ── Init Form ──────────────────────────────────────────────────────────────────
const initForm = {
  title: "",
  agenda: "",
  meetingType: "FACE_TO_FACE",
  status: "SCHEDULED",
  scheduledAt: "",
  startedAt: "",
  endedAt: "",
  meetingLink: "",
  mom: "",
};

// ── Add Meeting Popup ──────────────────────────────────────────────────────────
function AddMeetingPopup({ projectId, createdBy, project, onClose }) {
  const [form, setForm] = useState(initForm);
  const [showTemplates, setShowTemplates] = useState(false);
  const { mutate: createMeeting, isPending } = useCreateMeeting();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyTemplate = (template) => {
    setForm((prev) => ({ ...prev, mom: template.generate() }));
    setShowTemplates(false);
  };

  const handleSubmit = () => {
    if (!form.title) {
      showError("Title  are required");
      return;
    }
    console.log(createdBy);

    const loadingToast = showLoading("Creating meeting...");
    createMeeting(
      {
        projectId,
        createdBy,
        meetingData: {
          ...form,
          scheduledAt: form.scheduledAt
            ? new Date(form.scheduledAt).toISOString()
            : null,
          startedAt: form.startedAt
            ? new Date(form.startedAt).toISOString()
            : null,
          endedAt: form.endedAt ? new Date(form.endedAt).toISOString() : null,
        },
      },
      {
        onSuccess: () => {
          dismissToast(loadingToast);
          showSuccess("Meeting created successfully");
          onClose();
        },
        onError: (err) => {
          dismissToast(loadingToast);
          showError(err?.response?.data?.message || "Failed to create meeting");
        },
      },
    );
  };

  const templates = getMOMTemplates(form, project);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderLeft}>
            <span className={styles.popupHeaderIcon}>🤝</span>
            <div>
              <h3 className={styles.popupTitle}>Schedule New Meeting</h3>
              <p className={styles.popupSub}>
                {project?.projectName || "Project Meeting"}
              </p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.popupBody}>
          {/* Section: Basic Info */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>📋 Basic Info</div>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>
                  Title <span className={styles.req}>*</span>
                </label>
                <input
                  className={styles.input}
                  name="title"
                  placeholder="e.g. Site Progress Review Q2"
                  value={form.title}
                  onChange={onChange}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Agenda</label>
                <textarea
                  className={styles.textarea}
                  name="agenda"
                  placeholder="What will be discussed..."
                  value={form.agenda}
                  onChange={onChange}
                  rows={2}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Meeting Type</label>
                <select
                  className={styles.select}
                  name="meetingType"
                  value={form.meetingType}
                  onChange={onChange}
                >
                  {MEETING_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.select}
                  name="status"
                  value={form.status}
                  onChange={onChange}
                >
                  {MEETING_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Schedule */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>📅 Schedule & Link</div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Scheduled At <span className={styles.req}>*</span>
                </label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  name="scheduledAt"
                  value={form.scheduledAt}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Meeting Link</label>
                <input
                  className={styles.input}
                  name="meetingLink"
                  placeholder="https://meet.google.com/..."
                  value={form.meetingLink}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Started At</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  name="startedAt"
                  value={form.startedAt}
                  onChange={onChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ended At</label>
                <input
                  className={styles.input}
                  type="datetime-local"
                  name="endedAt"
                  value={form.endedAt}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>

          {/* Section: MOM */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitleRow}>
              <div className={styles.formSectionTitle}>
                📝 Minutes of Meeting (MOM)
              </div>
              <button
                className={styles.templateToggleBtn}
                onClick={() => setShowTemplates(!showTemplates)}
              >
                {showTemplates ? "✕ Close" : "⚡ Use Template"}
              </button>
            </div>

            {showTemplates && (
              <div className={styles.templatesGrid}>
                {templates.map((t) => (
                  <button
                    key={t.label}
                    className={styles.templateCard}
                    onClick={() => applyTemplate(t)}
                  >
                    <span className={styles.templateCardIcon}>{t.icon}</span>
                    <div className={styles.templateCardInfo}>
                      <span className={styles.templateCardLabel}>
                        {t.label}
                      </span>
                      <span className={styles.templateCardDesc}>
                        {t.description}
                      </span>
                    </div>
                    <span className={styles.templateArrow}>→</span>
                  </button>
                ))}
              </div>
            )}

            <textarea
              className={styles.momTextarea}
              name="mom"
              placeholder="Type minutes of meeting here, or click '⚡ Use Template' above to auto-fill a structured format..."
              value={form.mom}
              onChange={onChange}
              rows={16}
            />
            {form.mom && (
              <div className={styles.momMeta}>
                {form.mom.split("\n").length} lines · {form.mom.length}{" "}
                characters
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.popupFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className={styles.btnSpinner} /> Saving...
              </>
            ) : (
              "✓ Save Meeting"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Meeting Detail Popup ───────────────────────────────────────────────────────
function MeetingDetailPopup({ meeting, onClose }) {
  const statusCfg = STATUS_CFG[meeting.status] || STATUS_CFG.SCHEDULED;
  const typeCfg = TYPE_CFG[meeting.meetingType] || TYPE_CFG.FACE_TO_FACE;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.popup} ${styles.detailPopup}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderLeft}>
            <span className={styles.popupHeaderIcon}>{typeCfg.icon}</span>
            <div>
              <h3 className={styles.popupTitle}>{meeting.title}</h3>
              <div className={styles.detailHeaderBadges}>
                <span
                  className={styles.statusBadge}
                  style={{ background: statusCfg.bg, color: statusCfg.color }}
                >
                  <span
                    className={styles.statusDot}
                    style={{ background: statusCfg.dot }}
                  />
                  {meeting.status}
                </span>
                <span
                  className={styles.typeBadge}
                  style={{ background: typeCfg.bg, color: typeCfg.color }}
                >
                  {typeCfg.icon} {meeting.meetingType?.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.popupBody}>
          <div className={styles.detailMetaGrid}>
            <div className={styles.detailMetaItem}>
              <span className={styles.detailMetaLabel}>Scheduled</span>
              <span className={styles.detailMetaValue}>
                {fmtDateTime(meeting.scheduledAt)}
              </span>
            </div>
            {meeting.startedAt && (
              <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Started</span>
                <span className={styles.detailMetaValue}>
                  {fmtDateTime(meeting.startedAt)}
                </span>
              </div>
            )}
            {meeting.endedAt && (
              <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Ended</span>
                <span className={styles.detailMetaValue}>
                  {fmtDateTime(meeting.endedAt)}
                </span>
              </div>
            )}
            {meeting.meetingLink && (
              <div className={styles.detailMetaItem}>
                <span className={styles.detailMetaLabel}>Link</span>
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.meetingLink}
                >
                  Open Meeting ↗
                </a>
              </div>
            )}
          </div>

          {meeting.agenda && (
            <div className={styles.detailSection}>
              <div className={styles.detailSectionLabel}>📋 Agenda</div>
              <p className={styles.detailSectionText}>{meeting.agenda}</p>
            </div>
          )}

          {meeting.mom && (
            <div className={styles.detailSection}>
              <div className={styles.detailSectionLabel}>
                📝 Minutes of Meeting
              </div>
              <pre className={styles.momPre}>{meeting.mom}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main MeetingsTab Export ────────────────────────────────────────────────────
export default function MeetingsTab({ projectId, project }) {
  const { data: meetings = [], isLoading } = useMeetingsByProject(projectId);
  const { mutate: deleteMeeting } = useDeleteMeeting();
  const { data: user } = useEmployeeData();
  console.log("user dataaaa " + user);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [viewMeeting, setViewMeeting] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  const handleDelete = (meetingId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const loadingToast = showLoading("Deleting...");
    deleteMeeting(meetingId, {
      onSuccess: () => {
        dismissToast(loadingToast);
        showSuccess("Meeting deleted");
      },
      onError: (err) => {
        dismissToast(loadingToast);
        showError(err?.response?.data?.message || "Failed");
      },
    });
  };

  const filtered = meetings.filter((m) => {
    if (filterStatus !== "ALL" && m.status !== filterStatus) return false;
    if (filterType !== "ALL" && m.meetingType !== filterType) return false;
    return true;
  });

  const stats = {
    total: meetings.length,
    scheduled: meetings.filter((m) => m.status === "SCHEDULED").length,
    ongoing: meetings.filter((m) => m.status === "ONGOING").length,
    completed: meetings.filter((m) => m.status === "COMPLETED").length,
    cancelled: meetings.filter((m) => m.status === "CANCELLED").length,
  };

  if (isLoading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>Loading meetings...</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h3 className={styles.sectionTitle}>Meetings</h3>
          {meetings.length > 0 && (
            <span className={styles.countChip}>{meetings.length}</span>
          )}
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddPopup(true)}>
          + Schedule Meeting
        </button>
      </div>

      {/* Stats */}
      {meetings.length > 0 && (
        <div className={styles.statsRow}>
          {[
            { label: "Total", val: stats.total, color: "#6366f1" },
            { label: "Scheduled", val: stats.scheduled, color: "#3b82f6" },
            { label: "Ongoing", val: stats.ongoing, color: "#f59e0b" },
            { label: "Completed", val: stats.completed, color: "#10b981" },
            { label: "Cancelled", val: stats.cancelled, color: "#ef4444" },
          ].map((s) => (
            <div key={s.label} className={styles.statCard}>
              <span className={styles.statVal} style={{ color: s.color }}>
                {s.val}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      {meetings.length > 0 && (
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Status:</span>
            <div className={styles.filterChips}>
              {["ALL", "SCHEDULED", "ONGOING", "COMPLETED", "CANCELLED"].map(
                (s) => (
                  <button
                    key={s}
                    className={`${styles.filterChip} ${filterStatus === s ? styles.filterChipActive : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === "ALL"
                      ? "All"
                      : s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Type:</span>
            <div className={styles.filterChips}>
              {["ALL", ...MEETING_TYPES.map((t) => t.value)].map((t) => (
                <button
                  key={t}
                  className={`${styles.filterChip} ${filterType === t ? styles.filterChipActive : ""}`}
                  onClick={() => setFilterType(t)}
                >
                  {t === "ALL"
                    ? "All"
                    : `${TYPE_CFG[t]?.icon} ${t.replace(/_/g, " ")}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List / Empty */}
      {meetings.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🤝</span>
          <p className={styles.emptyTitle}>No meetings yet</p>
          <p className={styles.emptyHint}>
            Schedule your first meeting for this project
          </p>
          <button
            className={styles.addBtn}
            style={{ marginTop: "12px" }}
            onClick={() => setShowAddPopup(true)}
          >
            + Schedule Meeting
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🔍</span>
          <p className={styles.emptyTitle}>No meetings match your filters</p>
          <button
            className={styles.filterResetBtn}
            onClick={() => {
              setFilterStatus("ALL");
              setFilterType("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={styles.meetingsList}>
          {filtered.map((m) => {
            const statusCfg = STATUS_CFG[m.status] || STATUS_CFG.SCHEDULED;
            const typeCfg = TYPE_CFG[m.meetingType] || TYPE_CFG.FACE_TO_FACE;
            return (
              <div key={m.id} className={styles.meetingCard}>
                <div
                  className={styles.cardAccent}
                  style={{ background: statusCfg.dot }}
                />
                <div
                  className={styles.cardTypeIcon}
                  style={{ background: typeCfg.bg, color: typeCfg.color }}
                >
                  {typeCfg.icon}
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.cardTitleRow}>
                    <span className={styles.cardTitle}>{m.title}</span>
                    <div className={styles.cardBadges}>
                      <span
                        className={styles.statusBadge}
                        style={{
                          background: statusCfg.bg,
                          color: statusCfg.color,
                        }}
                      >
                        <span
                          className={styles.statusDot}
                          style={{ background: statusCfg.dot }}
                        />
                        {m.status}
                      </span>
                      <span
                        className={styles.typeBadge}
                        style={{ background: typeCfg.bg, color: typeCfg.color }}
                      >
                        {typeCfg.icon} {m.meetingType?.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                  {m.agenda && <p className={styles.cardAgenda}>{m.agenda}</p>}
                  <div className={styles.cardMeta}>
                    <span className={styles.cardMetaItem}>
                      🗓 {fmtDateTime(m.scheduledAt)}
                    </span>
                    {m.startedAt && (
                      <span className={styles.cardMetaItem}>
                        ▶ {fmtDateTime(m.startedAt)}
                      </span>
                    )}
                    {m.endedAt && (
                      <span className={styles.cardMetaItem}>
                        ⏹ {fmtDateTime(m.endedAt)}
                      </span>
                    )}
                    {m.meetingLink && (
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cardLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        🔗 Join
                      </a>
                    )}
                    {m.mom && <span className={styles.momChip}>📝 MOM</span>}
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button
                    className={styles.viewBtn}
                    onClick={() => setViewMeeting(m)}
                  >
                    View
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(m.id, m.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddPopup && (
        <AddMeetingPopup
          projectId={projectId}
          createdBy={user?.id}
          project={project}
          onClose={() => setShowAddPopup(false)}
        />
      )}
      {viewMeeting && (
        <MeetingDetailPopup
          meeting={viewMeeting}
          onClose={() => setViewMeeting(null)}
        />
      )}
    </div>
  );
}
