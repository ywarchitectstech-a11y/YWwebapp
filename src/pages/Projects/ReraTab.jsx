// import { useState } from "react";
// import styles from "./ReraTab.module.scss";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmtDate = (d) => {
//   if (!d) return "—";
//   return new Date(d).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const fmtDateTime = (dt) => {
//   if (!dt) return "—";
//   return new Date(dt).toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// // ─── Small shared pieces ──────────────────────────────────────────────────────
// const InfoField = ({ label, value, mono }) => (
//   <div className={styles.infoField}>
//     <span className={styles.fieldLabel}>{label}</span>
//     <span className={`${styles.fieldValue} ${mono ? styles.mono : ""}`}>
//       {value || "—"}
//     </span>
//   </div>
// );

// const ActiveBadge = ({ active }) =>
//   active ? (
//     <span className={`${styles.badge} ${styles.badgeActive}`}>
//       <span className={styles.badgeDot} /> Active
//     </span>
//   ) : (
//     <span className={`${styles.badge} ${styles.badgeInactive}`}>
//       <span className={styles.badgeDot} /> Inactive
//     </span>
//   );

// const SectionTitle = ({ icon, title, count }) => (
//   <div className={styles.sectionTitle}>
//     <span className={styles.sectionIcon}>{icon}</span>
//     <span>{title}</span>
//     {count != null && count > 0 && (
//       <span className={styles.countPill}>{count}</span>
//     )}
//   </div>
// );

// // ─── Certificate Card ─────────────────────────────────────────────────────────
// const CertCard = ({ cert, index }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className={`${styles.certCard} ${open ? styles.certCardOpen : ""}`}>
//       {/* collapsed header — always visible */}
//       <div className={styles.certCardHeader} onClick={() => setOpen((v) => !v)}>
//         <div className={styles.certCardLeft}>
//           <span className={styles.certIndex}>#{index + 1}</span>
//           <span className={styles.certDate}>
//             {fmtDate(cert.certificateDate)}
//           </span>
//           {cert.certificateFileUrl && (
//             <span className={styles.fileChip}>📄 File attached</span>
//           )}
//         </div>
//         <div className={styles.certCardRight}>
//           <span className={styles.chevron}>{open ? "▲" : "▼"}</span>
//         </div>
//       </div>

//       {/* expanded body */}
//       {open && (
//         <div className={styles.certCardBody}>
//           <div className={styles.infoGrid}>
//             <InfoField
//               label="Certificate Date"
//               value={fmtDate(cert.certificateDate)}
//             />
//             <InfoField
//               label="Certified By (ID)"
//               value={cert.certifiedBy ?? "—"}
//               mono
//             />
//             <InfoField label="Added On" value={fmtDateTime(cert.createdAt)} />
//           </div>

//           {cert.remarks && (
//             <div className={styles.remarksBlock}>
//               <span className={styles.fieldLabel}>Remarks</span>
//               <p className={styles.remarksText}>{cert.remarks}</p>
//             </div>
//           )}

//           {cert.certificateFileUrl && (
//             <a
//               href={cert.certificateFileUrl}
//               target="_blank"
//               rel="noreferrer"
//               className={styles.fileLink}
//             >
//               📄 View Certificate File
//             </a>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Quarter Update Card ──────────────────────────────────────────────────────
// const QuarterCard = ({ q, index }) => (
//   <div className={styles.quarterCard}>
//     <div className={styles.quarterHeader}>
//       <span className={styles.quarterLabel}>Q{index + 1}</span>
//       <span className={styles.quarterDate}>{fmtDate(q.quarterDate)}</span>
//     </div>
//     <div className={styles.quarterBody}>
//       {q.constructionStatus && (
//         <div className={styles.quarterRow}>
//           <span className={styles.fieldLabel}>Construction</span>
//           <span className={styles.quarterValue}>{q.constructionStatus}</span>
//         </div>
//       )}
//       {q.salesStatus && (
//         <div className={styles.quarterRow}>
//           <span className={styles.fieldLabel}>Sales</span>
//           <span className={styles.quarterValue}>{q.salesStatus}</span>
//         </div>
//       )}
//     </div>
//   </div>
// );

// // ─── Empty State ──────────────────────────────────────────────────────────────
// const EmptyBlock = ({ icon, text }) => (
//   <div className={styles.emptyBlock}>
//     <span className={styles.emptyIcon}>{icon}</span>
//     <p>{text}</p>
//   </div>
// );

// // ─── Main ReraTab ─────────────────────────────────────────────────────────────
// /**
//  * Props:
//  *   rera       — ReraProjectDTO | null
//  *   isLoading  — boolean
//  *   onAddRera  — () => void   (opens AddReraPopup)
//  */
// const ReraTab = ({ rera, isLoading, onAddRera }) => {
//   // ── Loading skeleton ────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div className={styles.wrapper}>
//         <div className={styles.skeletonCard} />
//         <div className={styles.skeletonCard} style={{ height: 120 }} />
//       </div>
//     );
//   }

//   // ── Empty state ─────────────────────────────────────────────────────────────
//   if (!rera) {
//     return (
//       <div className={styles.wrapper}>
//         <div className={styles.sectionHeader}>
//           <h3>RERA Details</h3>
//           <button className={styles.primaryBtn} onClick={onAddRera}>
//             + Add RERA
//           </button>
//         </div>
//         <div className={styles.emptyState}>
//           <span className={styles.emptyStateIcon}>🏛️</span>
//           <p>No RERA information added yet.</p>
//           <button className={styles.addReraBtn} onClick={onAddRera}>
//             + Add RERA Registration
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const certs = rera.certificates ?? [];
//   const updates = rera.quarterUpdates ?? [];

//   // ── Populated display ───────────────────────────────────────────────────────
//   return (
//     <div className={styles.wrapper}>
//       {/* ── Section header ── */}
//       <div className={styles.sectionHeader}>
//         <h3>RERA Details</h3>
//         {/* already registered — no add button */}
//       </div>

//       {/* ══════════ Card 1: Core Info ══════════ */}
//       <div className={styles.card}>
//         <div className={styles.cardHeader}>
//           <SectionTitle icon="◈" title="Registration Info" />
//           <ActiveBadge active={rera.active} />
//         </div>

//         <div className={styles.infoGrid}>
//           <InfoField label="RERA Number" value={rera.reraNumber} mono />
//           <InfoField
//             label="Registration Date"
//             value={fmtDate(rera.registrationDate)}
//           />
//           <InfoField
//             label="Expected Completion"
//             value={fmtDate(rera.expectedCompletionDate)}
//           />
//           <InfoField
//             label="RERA Record ID"
//             value={rera.id ? `#${rera.id}` : "—"}
//             mono
//           />
//           <InfoField label="Created At" value={fmtDateTime(rera.createdAt)} />
//           <InfoField label="Last Updated" value={fmtDateTime(rera.updatedAt)} />
//         </div>
//       </div>

//       {/* ══════════ Card 2: Certificates ══════════ */}
//       <div className={styles.card}>
//         <div className={styles.cardHeader}>
//           <SectionTitle icon="📋" title="Certificates" count={certs.length} />
//         </div>

//         {certs.length === 0 ? (
//           <EmptyBlock icon="📋" text="No certificates attached to this RERA." />
//         ) : (
//           <div className={styles.certList}>
//             {certs.map((cert, i) => (
//               <CertCard key={cert.id ?? i} cert={cert} index={i} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ══════════ Card 3: Quarter Updates ══════════ */}
//       <div className={styles.card}>
//         <div className={styles.cardHeader}>
//           <SectionTitle
//             icon="📅"
//             title="Quarter Updates"
//             count={updates.length}
//           />
//         </div>

//         {updates.length === 0 ? (
//           <EmptyBlock icon="📅" text="No quarterly updates recorded yet." />
//         ) : (
//           <div className={styles.quarterGrid}>
//             {updates.map((q, i) => (
//               <QuarterCard key={q.id ?? i} q={q} index={i} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReraTab;
import { useState } from "react";
import styles from "./ReraTab.module.scss";
import {
  useCreateReraProject,
  useDeleteReraProject,
} from "../../api/hooks/useRera";
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from "../../components/Notification/toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtDateTime = (dt) => {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ─── Shared small components ──────────────────────────────────────────────────
const InfoField = ({ label, value, mono }) => (
  <div className={styles.infoField}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={`${styles.fieldValue} ${mono ? styles.mono : ""}`}>
      {value || "—"}
    </span>
  </div>
);

const ActiveBadge = ({ active }) =>
  active ? (
    <span className={`${styles.badge} ${styles.badgeActive}`}>
      <span className={styles.badgeDot} /> Active
    </span>
  ) : (
    <span className={`${styles.badge} ${styles.badgeInactive}`}>
      <span className={styles.badgeDot} /> Inactive
    </span>
  );

// ─── Add RERA Popup ───────────────────────────────────────────────────────────
const AddReraPopup = ({ projectId, onClose }) => {
  const { mutate: createRera, isPending } = useCreateReraProject();

  const [form, setForm] = useState({
    reraNumber: "",
    registrationDate: "",
    expectedCompletionDate: "",
    active: true,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = () => {
    if (!form.reraNumber.trim()) {
      showError("RERA Number is required");
      return;
    }
    const t = showLoading("Adding RERA project...");
    createRera(
      {
        projectId,
        data: {
          reraNumber: form.reraNumber.trim(),
          registrationDate: form.registrationDate || null,
          expectedCompletionDate: form.expectedCompletionDate || null,
          active: form.active,
        },
      },
      {
        onSuccess: () => {
          dismissToast(t);
          showSuccess("RERA project added");
          onClose();
        },
        onError: (err) => {
          dismissToast(t);
          showError(err?.response?.data?.message || "Failed to add RERA");
        },
      },
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.popupHeader}>
          <div className={styles.popupHeaderLeft}>
            <span className={styles.popupHeaderIcon}>🏛️</span>
            <div>
              <h3 className={styles.popupTitle}>Add RERA Registration</h3>
              <p className={styles.popupSub}>Register a new RERA project</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.popupBody}>
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>
              📋 Registration Details
            </div>
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>
                  RERA Number <span className={styles.req}>*</span>
                </label>
                <input
                  className={styles.input}
                  name="reraNumber"
                  placeholder="e.g. P52100012345"
                  value={form.reraNumber}
                  onChange={onChange}
                  style={{ textTransform: "uppercase" }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Registration Date</label>
                <input
                  className={styles.input}
                  type="date"
                  name="registrationDate"
                  value={form.registrationDate}
                  onChange={onChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Expected Completion Date</label>
                <input
                  className={styles.input}
                  type="date"
                  name="expectedCompletionDate"
                  value={form.expectedCompletionDate}
                  onChange={onChange}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.toggleLabel}>
                  <span className={styles.label}>Status</span>
                  <div className={styles.toggleWrap}>
                    <input
                      type="checkbox"
                      name="active"
                      id="reraActive"
                      checked={form.active}
                      onChange={onChange}
                      className={styles.toggleInput}
                    />
                    <label
                      htmlFor="reraActive"
                      className={`${styles.toggleTrack} ${form.active ? styles.toggleOn : ""}`}
                    >
                      <span className={styles.toggleThumb} />
                    </label>
                    <span className={styles.toggleText}>
                      {form.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </label>
              </div>
            </div>
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
            disabled={isPending || !form.reraNumber.trim()}
          >
            {isPending ? (
              <>
                <span className={styles.btnSpinner} /> Adding...
              </>
            ) : (
              "🏛️ Add RERA"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Certificate Card (expandable) ───────────────────────────────────────────
const CertCard = ({ cert, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`${styles.certCard} ${open ? styles.certCardOpen : ""}`}>
      <div className={styles.certCardHeader} onClick={() => setOpen((v) => !v)}>
        <div className={styles.certCardLeft}>
          <span className={styles.certIndex}>#{index + 1}</span>
          <span className={styles.certDate}>
            {fmtDate(cert.certificateDate)}
          </span>
          {cert.certificateFileUrl && (
            <span className={styles.fileChip}>📄 File attached</span>
          )}
        </div>
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
          ›
        </span>
      </div>

      {open && (
        <div className={styles.certCardBody}>
          <div className={styles.infoGrid}>
            <InfoField
              label="Certificate Date"
              value={fmtDate(cert.certificateDate)}
            />
            <InfoField
              label="Certified By"
              value={cert.certifiedBy ?? "—"}
              mono
            />
            <InfoField label="Added On" value={fmtDateTime(cert.createdAt)} />
          </div>
          {cert.remarks && (
            <div className={styles.remarksBlock}>
              <span className={styles.fieldLabel}>Remarks</span>
              <p className={styles.remarksText}>{cert.remarks}</p>
            </div>
          )}
          {cert.certificateFileUrl && (
            <a
              href={cert.certificateFileUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.fileLink}
            >
              📄 View Certificate File
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Quarter Update Card ──────────────────────────────────────────────────────
const QuarterCard = ({ q, index }) => (
  <div className={styles.quarterCard}>
    <div className={styles.quarterHeader}>
      <span className={styles.quarterLabel}>Q{index + 1}</span>
      <span className={styles.quarterDate}>{fmtDate(q.quarterDate)}</span>
    </div>
    <div className={styles.quarterBody}>
      {q.constructionStatus && (
        <div className={styles.quarterRow}>
          <span className={styles.fieldLabel}>Construction</span>
          <span className={styles.quarterValue}>{q.constructionStatus}</span>
        </div>
      )}
      {q.salesStatus && (
        <div className={styles.quarterRow}>
          <span className={styles.fieldLabel}>Sales</span>
          <span className={styles.quarterValue}>{q.salesStatus}</span>
        </div>
      )}
    </div>
  </div>
);

// ─── Single RERA Project Card (collapsible) ───────────────────────────────────
const ReraProjectCard = ({ rera, index, projectId, onDeleted }) => {
  const [expanded, setExpanded] = useState(index === 0); // first one open by default
  const [deleting, setDeleting] = useState(false);
  const { mutate: deleteRera } = useDeleteReraProject();

  const certs = rera.certificates ?? [];
  const updates = rera.quarterUpdates ?? [];

  const handleDelete = (e) => {
    e.stopPropagation();
    if (
      !window.confirm(`Delete RERA ${rera.reraNumber}? This cannot be undone.`)
    )
      return;
    setDeleting(true);
    const t = showLoading("Deleting RERA project...");
    deleteRera(rera.id, {
      onSuccess: () => {
        dismissToast(t);
        showSuccess("RERA project deleted");
        setDeleting(false);
        onDeleted?.();
      },
      onError: (err) => {
        dismissToast(t);
        showError(err?.response?.data?.message || "Failed to delete RERA");
        setDeleting(false);
      },
    });
  };

  return (
    <div
      className={`${styles.reraCard} ${expanded ? styles.reraCardExpanded : ""} ${rera.active ? "" : styles.reraCardInactive}`}
    >
      {/* ── Card accent strip ── */}
      <div
        className={styles.reraCardAccent}
        style={{ background: rera.active ? "#22c55e" : "#9ca3af" }}
      />

      <div className={styles.reraCardInner}>
        {/* ── Collapsed header — always visible ── */}
        <div
          className={styles.reraCardHeader}
          onClick={() => setExpanded((v) => !v)}
        >
          <div className={styles.reraCardHeaderLeft}>
            <span className={styles.reraIndex}>#{index + 1}</span>
            <div className={styles.reraHeaderInfo}>
              <span className={styles.reraNumber}>{rera.reraNumber}</span>
              <div className={styles.reraHeaderMeta}>
                {rera.registrationDate && (
                  <span className={styles.reraMetaChip}>
                    🗓 Reg: {fmtDate(rera.registrationDate)}
                  </span>
                )}
                {rera.expectedCompletionDate && (
                  <span className={styles.reraMetaChip}>
                    ⏳ Completion: {fmtDate(rera.expectedCompletionDate)}
                  </span>
                )}
                {certs.length > 0 && (
                  <span className={styles.reraMetaChip}>
                    📋 {certs.length} cert{certs.length > 1 ? "s" : ""}
                  </span>
                )}
                {updates.length > 0 && (
                  <span className={styles.reraMetaChip}>
                    📅 {updates.length} update{updates.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            className={styles.reraCardHeaderRight}
            onClick={(e) => e.stopPropagation()}
          >
            <ActiveBadge active={rera.active} />
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={deleting}
              title="Delete this RERA registration"
            >
              {deleting ? <span className={styles.btnSpinnerSm} /> : "🗑"}
            </button>
            <span
              className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((v) => !v);
              }}
            >
              ›
            </span>
          </div>
        </div>

        {/* ── Expanded body ── */}
        {expanded && (
          <div className={styles.reraCardBody}>
            {/* Registration info */}
            <div className={styles.reraSection}>
              <div className={styles.reraSectionTitle}>
                <span>◈</span> Registration Info
              </div>
              <div className={styles.infoGrid}>
                <InfoField label="RERA Number" value={rera.reraNumber} mono />
                <InfoField
                  label="Registration Date"
                  value={fmtDate(rera.registrationDate)}
                />
                <InfoField
                  label="Expected Completion"
                  value={fmtDate(rera.expectedCompletionDate)}
                />
                <InfoField
                  label="RERA Record ID"
                  value={rera.id ? `#${rera.id}` : "—"}
                  mono
                />
                <InfoField
                  label="Created At"
                  value={fmtDateTime(rera.createdAt)}
                />
                <InfoField
                  label="Last Updated"
                  value={fmtDateTime(rera.updatedAt)}
                />
              </div>
            </div>

            {/* Certificates */}
            <div className={styles.reraSection}>
              <div className={styles.reraSectionTitle}>
                <span>📋</span> Certificates
                {certs.length > 0 && (
                  <span className={styles.countPill}>{certs.length}</span>
                )}
              </div>
              {certs.length === 0 ? (
                <div className={styles.emptyBlock}>
                  <span className={styles.emptyIcon}>📋</span>
                  <p>No certificates attached.</p>
                </div>
              ) : (
                <div className={styles.certList}>
                  {certs.map((cert, i) => (
                    <CertCard key={cert.id ?? i} cert={cert} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Quarter Updates */}
            <div className={styles.reraSection}>
              <div className={styles.reraSectionTitle}>
                <span>📅</span> Quarter Updates
                {updates.length > 0 && (
                  <span className={styles.countPill}>{updates.length}</span>
                )}
              </div>
              {updates.length === 0 ? (
                <div className={styles.emptyBlock}>
                  <span className={styles.emptyIcon}>📅</span>
                  <p>No quarterly updates recorded.</p>
                </div>
              ) : (
                <div className={styles.quarterGrid}>
                  {updates.map((q, i) => (
                    <QuarterCard key={q.id ?? i} q={q} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main ReraTab ─────────────────────────────────────────────────────────────
/**
 * Props:
 *   reraList   — ReraProjectDTO[]  (array — can have multiple)
 *   projectId  — number | string   (needed for create)
 *   isLoading  — boolean
 *   onRefetch  — () => void
 */
const ReraTab = ({ reraList = [], projectId, isLoading, onRefetch }) => {
  const [showAddPopup, setShowAddPopup] = useState(false);

  const activeCount = reraList.filter((r) => r.active).length;
  const inactiveCount = reraList.length - activeCount;

  const handleCloseAdd = () => {
    setShowAddPopup(false);
    onRefetch?.();
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} style={{ height: 120 }} />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h3 className={styles.sectionTitle}>RERA Projects</h3>
          {reraList.length > 0 && (
            <span className={styles.countPill}>{reraList.length}</span>
          )}
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddPopup(true)}>
          + Add RERA
        </button>
      </div>

      {/* ── Stats (only if has data) ── */}
      {reraList.length > 0 && (
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statVal}>{reraList.length}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
          <div className={`${styles.statCard} ${styles.statGreen}`}>
            <span className={styles.statVal}>{activeCount}</span>
            <span className={styles.statLabel}>Active</span>
          </div>
          {inactiveCount > 0 && (
            <div className={`${styles.statCard} ${styles.statAmber}`}>
              <span className={styles.statVal}>{inactiveCount}</span>
              <span className={styles.statLabel}>Inactive</span>
            </div>
          )}
          <div className={`${styles.statCard} ${styles.statBlue}`}>
            <span className={styles.statVal}>
              {reraList.reduce((s, r) => s + (r.certificates?.length || 0), 0)}
            </span>
            <span className={styles.statLabel}>Certificates</span>
          </div>
          <div className={`${styles.statCard} ${styles.statBlue}`}>
            <span className={styles.statVal}>
              {reraList.reduce(
                (s, r) => s + (r.quarterUpdates?.length || 0),
                0,
              )}
            </span>
            <span className={styles.statLabel}>Quarter Updates</span>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {reraList.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyStateIcon}>🏛️</span>
          <p className={styles.emptyTitle}>No RERA registrations yet</p>
          <p className={styles.emptyHint}>
            Add a RERA registration to track compliance and certificates
          </p>
          <button
            className={styles.addReraBtn}
            onClick={() => setShowAddPopup(true)}
          >
            + Add RERA Registration
          </button>
        </div>
      ) : (
        /* ── RERA project cards list ── */
        <div className={styles.reraList}>
          {reraList.map((rera, i) => (
            <ReraProjectCard
              key={rera.id ?? i}
              rera={rera}
              index={i}
              projectId={projectId}
              onDeleted={onRefetch}
            />
          ))}
        </div>
      )}

      {/* ── Add popup ── */}
      {showAddPopup && (
        <AddReraPopup projectId={projectId} onClose={handleCloseAdd} />
      )}
    </div>
  );
};

export default ReraTab;
