// import { useState, useMemo, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useProjectById } from "../../api/hooks/useProject";
// import { useReraByProject } from "../../api/hooks/useRera";
// import styles from "./ViewProject.module.scss";
// import AddDocumentPopup from "./AddDocumentPopup";
// import StructureViewerPopup from "../Structure/StructureViewerPopup";
// import AddSiteVisitPopup from "./AddSiteVisitPopup";
// import EditSiteVisitPopup from "./EditSiteVisitPopup";
// import AddEmployeeToProjectPopup from "./AddEmployeeToProjectPopup";
// import { useEmployeeList } from "../../api/hooks/useEmployees";
// import AddReraPopup from "./AddReraPopup";
// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const fmt = (dt) => {
//   if (!dt) return "—";
//   const d = new Date(dt);
//   return d.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// };

// const fmtTime = (dt) => {
//   if (!dt) return "—";
//   const d = new Date(dt);
//   return d.toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const fmtBytes = (bytes) => {
//   if (!bytes) return "—";
//   if (bytes < 1024) return bytes + " B";
//   if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
//   return (bytes / 1048576).toFixed(1) + " MB";
// };

// const stageLabel = (name) =>
//   name ? name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

// const STATUS_CONFIG = {
//   PLANNING: {
//     label: "Planning",
//     bg: "#dbeafe",
//     color: "#1e40af",
//     dot: "#3b82f6",
//   },
//   IN_PROGRESS: {
//     label: "In Progress",
//     bg: "#fef3c7",
//     color: "#92400e",
//     dot: "#f59e0b",
//   },
//   ON_HOLD: {
//     label: "On Hold",
//     bg: "#fee2e2",
//     color: "#991b1b",
//     dot: "#ef4444",
//   },
//   COMPLETED: {
//     label: "Completed",
//     bg: "#dcfce7",
//     color: "#14532d",
//     dot: "#22c55e",
//   },
//   CANCELLED: {
//     label: "Cancelled",
//     bg: "#f3f4f6",
//     color: "#374151",
//     dot: "#9ca3af",
//   },
//   NOT_STARTED: {
//     label: "Not Started",
//     bg: "#f3f4f6",
//     color: "#6b7280",
//     dot: "#d1d5db",
//   },
//   ACTIVE: { label: "Active", bg: "#ede9fe", color: "#4c1d95", dot: "#7c3aed" },
// };

// const PRIORITY_CONFIG = {
//   HIGH: { label: "High", bg: "#fee2e2", color: "#991b1b" },
//   MEDIUM: { label: "Medium", bg: "#fef9c3", color: "#713f12" },
//   LOW: { label: "Low", bg: "#dcfce7", color: "#14532d" },
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────
// const StatusBadge = ({ status }) => {
//   const cfg = STATUS_CONFIG[status] || {
//     label: status || "—",
//     bg: "#f3f4f6",
//     color: "#374151",
//     dot: "#9ca3af",
//   };
//   return (
//     <span
//       className={styles.statusBadge}
//       style={{ background: cfg.bg, color: cfg.color }}
//     >
//       <span className={styles.statusDot} style={{ background: cfg.dot }} />
//       {cfg.label}
//     </span>
//   );
// };

// const InfoField = ({ label, value, mono }) => (
//   <div className={styles.infoField}>
//     <span className={styles.infoLabel}>{label}</span>
//     <span
//       className={styles.infoValue}
//       style={mono ? { fontFamily: "monospace", fontSize: "0.8rem" } : {}}
//     >
//       {value || "—"}
//     </span>
//   </div>
// );

// const ProgressBar = ({ value = 0 }) => (
//   <div className={styles.progressBar}>
//     <div
//       className={styles.progressFill}
//       style={{ width: `${Math.min(100, value || 0)}%` }}
//     />
//     <span className={styles.progressLabel}>{value || 0}%</span>
//   </div>
// );

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// const Skeleton = () => (
//   <div className={styles.skeletonWrap}>
//     <div className={styles.skeletonHero} />
//     <div className={styles.skeletonTabs} />
//     <div className={styles.skeletonBody} />
//   </div>
// );
// const ImageViewer = ({ documents, activeIndex, onClose }) => {
//   const doc = documents[activeIndex];

//   if (!doc) return null;

//   return (
//     <div className={styles.viewerOverlay}>
//       <button className={styles.viewerClose} onClick={onClose}>
//         ✕
//       </button>

//       <img
//         src={doc.filePath}
//         alt={doc.fileName}
//         className={styles.viewerImage}
//       />
//     </div>
//   );
// };
// const DocumentGallery = ({ documents, onClose, onOpen }) => {
//   return (
//     <div className={styles.galleryOverlay}>
//       <button className={styles.galleryClose} onClick={onClose}>
//         ✕
//       </button>

//       <div className={styles.galleryGrid}>
//         {documents.map((doc, index) => (
//           <div
//             key={doc.id}
//             className={styles.galleryItem}
//             onClick={() => onOpen(index)}
//           >
//             <img src={doc.filePath} alt={doc.fileName} />
//             <h5>{doc.fileName}</h5>
//             <p>{doc.documentType}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// // ─── Document Popup ───────────────────────────────────────────────────────────
// const DocumentPopup = ({ doc, onClose }) => {
//   if (!doc) return null;
//   const isPDF = doc.mimeType?.includes("pdf") || doc.fileName?.endsWith(".pdf");
//   const isImg = doc.mimeType?.startsWith("image/");

//   return (
//     <div className={styles.popupOverlay} onClick={onClose}>
//       <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
//         <div className={styles.popupHeader}>
//           <div className={styles.popupTitle}>
//             <span className={styles.popupIcon}>📄</span>
//             <div>
//               <h3>{doc.fileName || "Document"}</h3>
//               <p>{doc.description || doc.documentType || "Stage Document"}</p>
//             </div>
//           </div>
//           <button className={styles.popupClose} onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         <div className={styles.popupMeta}>
//           {doc.mimeType && (
//             <span className={styles.popupTag}>{doc.mimeType}</span>
//           )}
//           {doc.fileSize && (
//             <span className={styles.popupTag}>{fmtBytes(doc.fileSize)}</span>
//           )}
//           {doc.version && (
//             <span className={styles.popupTag}>v{doc.version}</span>
//           )}
//           {doc.isApproved !== undefined && (
//             <span
//               className={styles.popupTag}
//               style={{
//                 background: doc.isApproved ? "#dcfce7" : "#fee2e2",
//                 color: doc.isApproved ? "#14532d" : "#991b1b",
//               }}
//             >
//               {doc.isApproved ? "✓ Approved" : "⏳ Pending"}
//             </span>
//           )}
//         </div>

//         <div className={styles.popupContent}>
//           {doc.filePath ? (
//             isPDF ? (
//               <iframe
//                 src={doc.filePath}
//                 title={doc.fileName}
//                 className={styles.docFrame}
//               />
//             ) : isImg ? (
//               <img
//                 src={doc.filePath}
//                 alt={doc.fileName}
//                 className={styles.docImg}
//               />
//             ) : (
//               <div className={styles.docNoPreview}>
//                 <span className={styles.docBigIcon}>📁</span>
//                 <p>Preview not available for this file type.</p>
//                 <a
//                   href={doc.filePath}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className={styles.docDownload}
//                 >
//                   Download File ↗
//                 </a>
//               </div>
//             )
//           ) : (
//             <div className={styles.docNoPreview}>
//               <span className={styles.docBigIcon}>📭</span>
//               <p>No document file has been uploaded yet.</p>
//               <span className={styles.docHint}>
//                 The document will appear here once it is uploaded to this stage.
//               </span>
//             </div>
//           )}
//         </div>

//         <div className={styles.popupFooter}>
//           {doc.uploadedByUser && (
//             <span className={styles.popupMeta2}>
//               Uploaded by:{" "}
//               <strong>
//                 {doc.uploadedByUser.name || doc.uploadedByUser.username}
//               </strong>
//               {doc.uploadedAt && <> on {fmt(doc.uploadedAt)}</>}
//             </span>
//           )}
//           {doc.approvedByUser && (
//             <span className={styles.popupMeta2}>
//               Approved by:{" "}
//               <strong>
//                 {doc.approvedByUser.name || doc.approvedByUser.username}
//               </strong>
//               {doc.approvedAt && <> on {fmt(doc.approvedAt)}</>}
//             </span>
//           )}
//           {doc.filePath && (
//             <a href={doc.filePath} download className={styles.downloadBtn}>
//               ⬇ Download
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Stage Tree Node ──────────────────────────────────────────────────────────
// const StageNode = ({ stage, depth = 0, onDocClick, onAddDoc }) => {
//   const [open, setOpen] = useState(false);
//   const hasChildren = stage.childStages?.length > 0;
//   const cfg = STATUS_CONFIG[stage.status] || STATUS_CONFIG.NOT_STARTED;
//   const allDocs = stage.documents || [];
//   const hasMedia = (stage.mediaFiles || []).length > 0;
//   const hasTasks = (stage.tasks || []).length > 0;

//   return (
//     <div className={styles.stageNode} style={{ "--depth": depth }}>
//       <div
//         className={`${styles.stageHeader} ${hasChildren ? styles.stageExpandable : ""}`}
//         onClick={() => hasChildren && setOpen(!open)}
//       >
//         <div className={styles.stageLeft}>
//           {hasChildren && (
//             <span
//               className={styles.stageChevron}
//               style={{ transform: open ? "rotate(90deg)" : "rotate(0)" }}
//             >
//               ›
//             </span>
//           )}
//           {!hasChildren && (
//             <span className={styles.stageDot} style={{ background: cfg.dot }} />
//           )}
//           <div className={styles.stageInfo}>
//             <span className={styles.stageName}>
//               {stage.customStageName || stageLabel(stage.stageName)}
//               {stage.isMandatory && <span className={styles.mandatory}>*</span>}
//             </span>
//             {stage.customStageName && (
//               <span className={styles.stageType}>
//                 {stageLabel(stage.stageName)}
//               </span>
//             )}
//           </div>
//         </div>
//         <div className={styles.stageRight}>
//           {stage.progressPercentage != null && depth > 0 && (
//             <div className={styles.stageProgress}>
//               <div
//                 className={styles.stageProgressFill}
//                 style={{ width: `${stage.progressPercentage}%` }}
//               />
//             </div>
//           )}
//           <StatusBadge status={stage.status} />
//           {allDocs.length > 0 && (
//             <button
//               className={styles.docsBadge}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDocClick(allDocs);
//               }}
//             >
//               📄 {allDocs.length}
//             </button>
//           )}

//           <button
//             className={styles.addDocBtn}
//             onClick={(e) => {
//               e.stopPropagation();
//               onAddDoc(stage);
//             }}
//           >
//             + Add Doc
//           </button>
//           {hasMedia && (
//             <span className={styles.mediaBadge}>
//               🖼 {stage.mediaFiles.length}
//             </span>
//           )}
//           {hasTasks && (
//             <span className={styles.tasksBadge}>✓ {stage.tasks.length}</span>
//           )}
//         </div>
//       </div>

//       {open && hasChildren && (
//         <div className={styles.stageChildren}>
//           {stage.childStages
//             .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
//             .map((child) => (
//               <StageNode
//                 key={child.id}
//                 stage={child}
//                 depth={depth + 1}
//                 onDocClick={onDocClick}
//                 onAddDoc={onAddDoc}
//               />
//             ))}
//         </div>
//       )}

//       {open && allDocs.length > 0 && depth > 0 && (
//         <div className={styles.stageDocsList}>
//           {allDocs.map((doc) => (
//             <div
//               key={doc.id}
//               className={styles.docRow}
//               onClick={() => onDocClick(doc)}
//             >
//               <span className={styles.docRowIcon}>
//                 {doc.filePath ? "📄" : "📭"}
//               </span>
//               <span className={styles.docRowName}>
//                 {doc.fileName || "Document"}
//               </span>
//               <span className={styles.docRowType}>
//                 {doc.documentType || ""}
//               </span>
//               <span
//                 className={styles.docRowStatus}
//                 style={{ color: doc.isApproved ? "#22c55e" : "#f59e0b" }}
//               >
//                 {doc.isApproved ? "Approved" : "Pending"}
//               </span>
//               <span className={styles.docRowOpen}>Open ↗</span>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Overview Tab ─────────────────────────────────────────────────────────────
// const OverviewTab = ({ p }) => {
//   const priorityCfg = PRIORITY_CONFIG[p.priority] || null;

//   return (
//     <div className={styles.overviewGrid}>
//       {/* Core Info Card */}
//       <div className={styles.overCard}>
//         <div className={styles.overCardHead}>🏗 Project Identity</div>
//         <InfoField label="Project ID" value={p.projectId} mono />
//         <InfoField label="Project Code" value={p.projectCode} mono />
//         <InfoField label="Permanent ID" value={p.permanentProjectId} mono />
//         <InfoField label="Project Name" value={p.projectName} />
//         {p.projectDetails && (
//           <InfoField label="Details" value={p.projectDetails} />
//         )}
//         <InfoField
//           label="Status"
//           value={<StatusBadge status={p.projectStatus} />}
//         />
//         {priorityCfg && (
//           <InfoField
//             label="Priority"
//             value={
//               <span
//                 style={{
//                   background: priorityCfg.bg,
//                   color: priorityCfg.color,
//                   padding: "2px 10px",
//                   borderRadius: 999,
//                   fontSize: "0.75rem",
//                   fontWeight: 600,
//                 }}
//               >
//                 {priorityCfg.label}
//               </span>
//             }
//           />
//         )}
//         {p.postSales?.id && (
//           <InfoField label="Post-Sales ID" value={`#${p.postSales.id}`} mono />
//         )}
//       </div>

//       {/* Timeline Card */}
//       <div className={styles.overCard}>
//         <div className={styles.overCardHead}>◷ Timeline</div>
//         <div className={styles.timelineList}>
//           {[
//             {
//               label: "Created",
//               val: p.projectCreatedDateTime,
//               color: "#94a3b8",
//             },
//             { label: "Started", val: p.projectStartDateTime, color: "#3b82f6" },
//             {
//               label: "Expected End",
//               val: p.projectExpectedEndDate,
//               color: "#f59e0b",
//             },
//             {
//               label: "Actual End",
//               val: p.projectEndDateTime,
//               color: "#22c55e",
//             },
//           ].map(({ label, val, color }) => (
//             <div key={label} className={styles.tlRow}>
//               <div className={styles.tlDot} style={{ background: color }} />
//               <div>
//                 <span className={styles.tlLabel}>{label}</span>
//                 <span className={styles.tlVal}>{fmt(val)}</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Location Card */}
//       <div className={styles.overCard}>
//         <div className={styles.overCardHead}>📍 Location & Area</div>
//         <InfoField label="Address" value={p.address} />
//         <InfoField label="City" value={p.city} />
//         {(p.latitude || p.longitude) && (
//           <InfoField
//             label="Coordinates"
//             value={`${p.latitude ?? "—"}, ${p.longitude ?? "—"}`}
//             mono
//           />
//         )}
//         {p.googlePlace && (
//           <InfoField
//             label="Maps"
//             value={
//               <a
//                 href={`https://maps.google.com/?q=${p.googlePlace}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 style={{ color: "#3b82f6", textDecoration: "none" }}
//               >
//                 Open in Google Maps ↗
//               </a>
//             }
//           />
//         )}
//         {p.plotArea != null && (
//           <InfoField label="Plot Area" value={`${p.plotArea} sq.ft`} />
//         )}
//         {p.totalBuiltUpArea != null && (
//           <InfoField
//             label="Built-Up Area"
//             value={`${p.totalBuiltUpArea} sq.ft`}
//           />
//         )}
//         {p.totalCarpetArea != null && (
//           <InfoField label="Carpet Area" value={`${p.totalCarpetArea} sq.ft`} />
//         )}
//       </div>

//       {/* Stats Card */}
//       <div className={styles.statsCard}>
//         <div className={styles.overCardHead}>📊 Summary</div>
//         <div className={styles.statsGrid}>
//           {[
//             {
//               label: "Total Stages",
//               val: p.stages?.filter((s) => !s.parentStageId).length || 0,
//               color: "#3b82f6",
//             },
//             {
//               label: "Employees",
//               val: p.workingEmployees?.length || 0,
//               color: "#8b5cf6",
//             },
//             {
//               label: "Site Visits",
//               val: p.siteVisits?.length || 0,
//               color: "#f59e0b",
//             },
//             {
//               label: "Structures",
//               val: p.structures?.length || 0,
//               color: "#10b981",
//             },
//           ].map(({ label, val, color }) => (
//             <div key={label} className={styles.statTile}>
//               <span className={styles.statVal} style={{ color }}>
//                 {val}
//               </span>
//               <span className={styles.statLabel}>{label}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Stages Tab ───────────────────────────────────────────────────────────────
// const StagesTab = ({ stages, onDocClick, onAddDoc }) => {
//   const roots = useMemo(
//     () =>
//       (stages || [])
//         .filter((s) => !s.parentStageId)
//         .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
//     [stages],
//   );

//   if (!roots.length) {
//     return (
//       <div className={styles.emptyState}>
//         <span>📋</span>
//         <p>No stages defined for this project yet.</p>
//       </div>
//     );
//   }

//   const totalStages = roots.length;
//   const completedStages = roots.filter((s) => s.status === "COMPLETED").length;
//   const overallProgress = Math.round((completedStages / totalStages) * 100);

//   return (
//     <div>
//       {/* Progress Summary */}
//       <div className={styles.stagesSummary}>
//         <div className={styles.stageSumItem}>
//           <span className={styles.stageSumVal}>{totalStages}</span>
//           <span className={styles.stageSumLabel}>Total Phases</span>
//         </div>
//         <div className={styles.stageSumItem}>
//           <span className={styles.stageSumVal} style={{ color: "#22c55e" }}>
//             {completedStages}
//           </span>
//           <span className={styles.stageSumLabel}>Completed</span>
//         </div>
//         <div className={styles.stageSumItem}>
//           <span className={styles.stageSumVal} style={{ color: "#f59e0b" }}>
//             {roots.filter((s) => s.status === "IN_PROGRESS").length}
//           </span>
//           <span className={styles.stageSumLabel}>In Progress</span>
//         </div>
//         <div className={styles.stageSumItem}>
//           <span className={styles.stageSumVal} style={{ color: "#6b7280" }}>
//             {roots.filter((s) => s.status === "NOT_STARTED").length}
//           </span>
//           <span className={styles.stageSumLabel}>Not Started</span>
//         </div>
//         <div className={styles.stageSumProgress}>
//           <span className={styles.stageSumProgressLabel}>
//             Overall: {overallProgress}%
//           </span>
//           <ProgressBar value={overallProgress} />
//         </div>
//       </div>

//       {/* Stage Tree */}
//       <div className={styles.stageTree}>
//         {roots.map((stage, idx) => (
//           <div key={stage.id} className={styles.stageGroup}>
//             <div className={styles.stageGroupNum}>{idx + 1}</div>
//             <div className={styles.stageGroupContent}>
//               <StageNode
//                 stage={stage}
//                 depth={0}
//                 onDocClick={onDocClick}
//                 onAddDoc={onAddDoc}
//               />
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ─── Employees Tab ────────────────────────────────────────────────────────────
// const EmployeesTab = ({ employees, projectId, allEmployees }) => {
//   const [showPopup, setShowPopup] = useState(false);
//   useEffect(() => {
//     console.log(employees);
//   }, [employees]);
//   return (
//     <div>
//       <div className={styles.sectionHeader}>
//         <h3>Employees</h3>

//         <button
//           className={styles.primaryBtn}
//           onClick={() => setShowPopup(true)}
//         >
//           + Add Employee
//         </button>
//       </div>

//       <div className={styles.empGrid}>
//         {employees?.map((emp) => (
//           <div key={emp.id} className={styles.empCard}>
//             <div className={styles.empAvatar}>{emp.name?.charAt(0)}</div>
//             {console.log(emp)};
//             <div>
//               <div>{emp.name}</div>
//               <div>{emp.email}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showPopup && (
//         <AddEmployeeToProjectPopup
//           projectId={projectId}
//           employees={allEmployees}
//           onClose={() => setShowPopup(false)}
//         />
//       )}
//     </div>
//   );
// };

// // ─── Site Visits Tab ──────────────────────────────────────────────────────────

// const SiteVisitsTab = ({ siteVisits, projectId, onOpenGallery }) => {
//   const [showPopup, setShowPopup] = useState(false);
//   // const [showPopup, setShowPopup] = useState(false);
//   const [showEditPopup, setEditPopup] = useState(false);
//   const [selectedVisit, setSelectedVisit] = useState(null);
//   if (!siteVisits?.length) {
//     return (
//       <div className={styles.emptyState}>
//         <span>🏠</span>
//         <p>No site visits recorded for this project yet.</p>
//         <button
//           className={styles.primaryBtn}
//           onClick={() => setShowPopup(true)}
//         >
//           + Add Site Visit
//         </button>
//         {showEditPopup && selectedVisit && (
//           <EditSiteVisitPopup
//             visit={selectedVisit}
//             onClose={() => setEditPopup(false)}
//           />
//         )}
//         {showPopup && (
//           <AddSiteVisitPopup
//             projectId={projectId}
//             onClose={() => setShowPopup(false)}
//           />
//         )}
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className={styles.sectionHeader}>
//         <h3>Site Visits</h3>
//         <button
//           className={styles.primaryBtn}
//           onClick={() => setShowPopup(true)}
//         >
//           + Add Site Visit
//         </button>
//       </div>

//       <div className={styles.svList}>
//         {siteVisits.map((sv, i) => {
//           // Normalise photos → same shape DocumentGallery expects
//           const photoDocs = (sv.photos || []).map((p) => ({
//             id: p.id,
//             filePath: p.imageUrl,
//             fileName: p.fileName || `Photo ${i + 1}`,
//             documentType: "Photo",
//           }));

//           // Normalise documents → same shape DocumentGallery expects
//           const docFiles = (sv.documents || []).map((d) => ({
//             id: d.id,
//             filePath: d.documentUrl,
//             fileName: d.documentName || d.fileName || "Document",
//             documentType: d.documentType || "Document",
//           }));

//           return (
//             <div key={sv.id || i} className={styles.svCard}>
//               {/* ── Card Header ── */}
//               <div className={styles.svHeader}>
//                 <div className={styles.svNum}>Visit #{i + 1}</div>

//                 <div className={styles.svActions}>
//                   <span className={styles.svDate}>
//                     {fmtTime(sv.visitDateTime)}
//                   </span>

//                   <button
//                     className={styles.editBtn}
//                     onClick={() => {
//                       setSelectedVisit(sv);
//                       setEditPopup(true);
//                     }}
//                   >
//                     ✏ Edit
//                   </button>
//                 </div>
//               </div>

//               {/* ── Info Fields ── */}
//               {sv.title && <InfoField label="Title" value={sv.title} />}
//               {sv.description && (
//                 <InfoField label="Description" value={sv.description} />
//               )}
//               {sv.locationNote && (
//                 <InfoField label="Location Note" value={sv.locationNote} />
//               )}

//               {/* ── Media Row ── */}
//               {(photoDocs.length > 0 || docFiles.length > 0) && (
//                 <div className={styles.svMediaRow}>
//                   {/* Photos button */}
//                   {photoDocs.length > 0 && (
//                     <button
//                       className={styles.svMediaBtn}
//                       onClick={() => onOpenGallery(photoDocs)}
//                     >
//                       <span className={styles.svMediaIcon}>🖼</span>
//                       <span>
//                         {photoDocs.length}{" "}
//                         {photoDocs.length === 1 ? "Photo" : "Photos"}
//                       </span>
//                     </button>
//                   )}

//                   {/* Documents button */}
//                   {docFiles.length > 0 && (
//                     <button
//                       className={styles.svDocBtn}
//                       onClick={() => onOpenGallery(docFiles)}
//                     >
//                       <span className={styles.svMediaIcon}>📄</span>
//                       <span>
//                         {docFiles.length}{" "}
//                         {docFiles.length === 1 ? "Document" : "Documents"}
//                       </span>
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       {showEditPopup && selectedVisit && (
//         <EditSiteVisitPopup
//           visit={selectedVisit}
//           onClose={() => setEditPopup(false)}
//         />
//       )}
//       {showPopup && (
//         <AddSiteVisitPopup
//           projectId={projectId}
//           onClose={() => setShowPopup(false)}
//         />
//       )}
//     </div>
//   );
// };

// // ─── Structures Tab ───────────────────────────────────────────────────────────
// const StructuresTab = ({ structures, navigate, projectId }) => {
//   const [viewerStructure, setViewerStructure] = useState(null);

//   if (!structures?.length) {
//     return (
//       <div className={styles.emptyState}>
//         {/* <span>🏢</span> */}
//         <button
//           className={styles.primaryBtn}
//           onClick={() => navigate(`/projects/${projectId}/structure`)}
//         >
//           Add Structure
//         </button>
//         <p>No structures defined for this project yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.structList}>
//       <button
//         className={styles.primaryBtn}
//         onClick={() => navigate(`/projects/${projectId}/structure`)}
//       >
//         Add Structure
//       </button>

//       {structures.map((s, i) => (
//         <div
//           key={s.id}
//           className={styles.structCard}
//           onClick={() => setViewerStructure(s)}
//         >
//           <div className={styles.structHeader}>
//             <span className={styles.structName}>
//               {s.structureName || `Structure ${i + 1}`}
//             </span>

//             {s.structureType && (
//               <span className={styles.structType}>{s.structureType}</span>
//             )}
//           </div>

//           <div className={styles.structBody}>
//             {s.totalFloors != null && (
//               <InfoField label="Floors" value={s.totalFloors} />
//             )}

//             {s.totalBasements != null && (
//               <InfoField label="Basements" value={s.totalBasements} />
//             )}

//             {s.builtUpArea != null && (
//               <InfoField
//                 label="Built-Up Area"
//                 value={`${s.builtUpArea} sq.ft`}
//               />
//             )}
//           </div>
//         </div>
//       ))}

//       {/* STRUCTURE POPUP */}
//       {viewerStructure && (
//         <StructureViewerPopup
//           structure={viewerStructure}
//           onClose={() => setViewerStructure(null)}
//         />
//       )}
//     </div>
//   );
// };

// // ─── Documents Tab (all docs across stages) ───────────────────────────────────
// const DocumentsTab = ({ stages, onDocClick }) => {
//   const allDocs = useMemo(() => {
//     const docs = [];
//     const collectDocs = (stageList) => {
//       for (const stage of stageList || []) {
//         for (const doc of stage.documents || []) {
//           docs.push({
//             ...doc,
//             stageName: stage.customStageName || stageLabel(stage.stageName),
//           });
//         }
//         collectDocs(stage.childStages);
//       }
//     };
//     collectDocs(stages);
//     return docs;
//   }, [stages]);

//   if (!allDocs.length) {
//     return (
//       <div className={styles.emptyState}>
//         <span>📁</span>
//         <p>No documents have been uploaded to any stage yet.</p>
//         <span className={styles.emptyHint}>
//           Documents will appear here once they are added to project stages.
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.docsTable}>
//       <div className={styles.docsTableHead}>
//         <span>Document</span>
//         <span>Stage</span>
//         <span>Type</span>
//         <span>Size</span>
//         <span>Status</span>
//         <span>Action</span>
//       </div>
//       {allDocs.map((doc, i) => (
//         <div key={doc.id || i} className={styles.docsTableRow}>
//           <span className={styles.docFileName}>
//             <span>{doc.filePath ? "📄" : "📭"}</span>
//             {doc.fileName || "Unnamed"}
//           </span>
//           <span className={styles.docStage}>{doc.stageName}</span>
//           <span className={styles.docType}>{doc.documentType || "—"}</span>
//           <span>{fmtBytes(doc.fileSize)}</span>
//           <span>
//             <span
//               style={{
//                 padding: "2px 8px",
//                 borderRadius: 999,
//                 fontSize: "0.7rem",
//                 fontWeight: 600,
//                 background: doc.isApproved ? "#dcfce7" : "#fef9c3",
//                 color: doc.isApproved ? "#14532d" : "#713f12",
//               }}
//             >
//               {doc.isApproved ? "✓ Approved" : "Pending"}
//             </span>
//           </span>
//           <span>
//             <button
//               className={styles.openDocBtn}
//               onClick={() => onDocClick(doc)}
//             >
//               Open
//             </button>
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// // ─── Main Page ────────────────────────────────────────────────────────────────
// const TABS = [
//   { key: "overview", label: "Overview", icon: "🏠" },
//   { key: "stages", label: "Stages", icon: "📋" },
//   { key: "documents", label: "Documents", icon: "📁" },
//   { key: "employees", label: "Team", icon: "👥" },
//   { key: "sitevisits", label: "Site Visits", icon: "📍" },
//   { key: "structures", label: "Structures", icon: "🏢" },
//   { key: "meetings", label: "Meetings", icon: "🤝" },
//   { id: "rera", label: "RERA" }, // NEW TAB
// ];

// export default function ViewProject() {
//   const [viewerIndex, setViewerIndex] = useState(null);
//   const [viewerDocs, setViewerDocs] = useState([]);
//   const [galleryDocs, setGalleryDocs] = useState([]);
//   const navigate = useNavigate();
//   const { projectId } = useParams();
//   const { data, isLoading, isError } = useProjectById(projectId);
//   console.log(data);

//   const [showReraPopup, setShowReraPopup] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");
//   // const [docPopup, setDocPopup] = useState(null);
//   const [addDocStage, setAddDocStage] = useState(null);
//   const { data: employeesData } = useEmployeeList();
//   const allEmployees = (employeesData || []).filter(
//     (e) => e.status === "ACTIVE",
//   );
//   const { data: rera } = useReraByProject(projectId);
//   const p = data?.data;

//   // Must be called unconditionally before any early returns
//   const docCount = useMemo(() => {
//     if (!p?.stages) return null;
//     let count = 0;
//     const countDocs = (list) => {
//       for (const s of list || []) {
//         count += (s.documents || []).length;
//         countDocs(s.childStages);
//       }
//     };
//     countDocs(p.stages);
//     return count || null;
//   }, [p?.stages]);

//   if (isLoading)
//     return (
//       <div className={styles.pageWrapper}>
//         <Skeleton />
//       </div>
//     );

//   if (isError || !p) {
//     return (
//       <div className={styles.pageWrapper}>
//         <div className={styles.errorState}>
//           <span>⚠️</span>
//           <h3>Failed to load project</h3>
//           <p>Unable to fetch project details. Please try again.</p>
//           <button onClick={() => navigate(-1)} className={styles.errBtn}>
//             ← Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const tabBadge = {
//     stages: (p.stages || []).filter((s) => !s.parentStageId).length || null,
//     employees: p.workingEmployees?.length || null,
//     sitevisits: p.siteVisits?.length || null,
//     structures: p.structures?.length || null,
//     documents: docCount,
//   };

//   const projectInitial = (p.projectName || "P")[0].toUpperCase();

//   return (
//     <div className={styles.pageWrapper}>
//       {/* Breadcrumb */}
//       <nav className={styles.breadcrumb}>
//         <span
//           className={styles.breadLink}
//           onClick={() => navigate("/projects")}
//         >
//           Projects
//         </span>
//         <span className={styles.sep}>›</span>
//         <span>{p.projectName || `Project #${p.projectId}`}</span>
//       </nav>
//       {/* ── Hero Header ── */}
//       <div className={styles.hero}>
//         <div className={styles.heroLeft}>
//           <div className={styles.heroLogo}>
//             {p.logoUrl ? (
//               <img src={p.logoUrl} alt="logo" />
//             ) : (
//               <span>{projectInitial}</span>
//             )}
//           </div>
//           <div className={styles.heroMeta}>
//             <h1 className={styles.heroTitle}>
//               {p.projectName || `Project #${p.projectId}`}
//             </h1>
//             <div className={styles.heroChips}>
//               {p.projectCode && (
//                 <code className={styles.chip}>{p.projectCode}</code>
//               )}
//               {p.permanentProjectId && (
//                 <code className={styles.chip}>{p.permanentProjectId}</code>
//               )}
//               {p.city && <span className={styles.chip}>📍 {p.city}</span>}
//               {p.priority && (
//                 <span
//                   className={styles.chip}
//                   style={{
//                     background: PRIORITY_CONFIG[p.priority]?.bg,
//                     color: PRIORITY_CONFIG[p.priority]?.color,
//                   }}
//                 >
//                   {p.priority} PRIORITY
//                 </span>
//               )}
//             </div>
//             {p.projectDetails && (
//               <p className={styles.heroDetails}>{p.projectDetails}</p>
//             )}
//           </div>
//         </div>
//         <div className={styles.heroRight}>
//           <StatusBadge status={p.projectStatus} />
//           <div className={styles.heroDate}>
//             <span>Created</span>
//             <strong>{fmt(p.projectCreatedDateTime)}</strong>
//           </div>
//           {p.projectStartDateTime && (
//             <div className={styles.heroDate}>
//               <span>Started</span>
//               <strong>{fmt(p.projectStartDateTime)}</strong>
//             </div>
//           )}
//           {p.projectExpectedEndDate && (
//             <div className={styles.heroDate}>
//               <span>Expected End</span>
//               <strong>{fmt(p.projectExpectedEndDate)}</strong>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* ── Tabs ── */}
//       <div className={styles.tabsWrap}>
//         <div className={styles.tabs}>
//           {TABS.map((tab) => (
//             <button
//               key={tab.key}
//               className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
//               onClick={() => setActiveTab(tab.key)}
//             >
//               <span className={styles.tabIcon}>{tab.icon}</span>
//               <span className={styles.tabLabel}>{tab.label}</span>
//               {tabBadge[tab.key] != null && (
//                 <span className={styles.tabBadge}>{tabBadge[tab.key]}</span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//       {addDocStage && (
//         <AddDocumentPopup
//           stage={addDocStage}
//           onClose={() => setAddDocStage(null)}
//         />
//       )}
//       {/* ── Tab Content ── */}
//       <div className={styles.tabContent}>
//         {activeTab === "overview" && <OverviewTab p={p} />}
//         {activeTab === "stages" && (
//           <StagesTab
//             stages={p.stages}
//             onDocClick={(docs) => {
//               setGalleryDocs(docs);
//             }}
//             onAddDoc={setAddDocStage}
//           />
//         )}
//         {activeTab === "documents" && (
//           <DocumentsTab
//             stages={p.stages}
//             onDocClick={(doc) => {
//               setViewerDocs([doc]);
//               setViewerIndex(0);
//             }}
//           />
//         )}
//         {activeTab === "employees" && (
//           <EmployeesTab
//             employees={p.workingEmployees}
//             projectId={p.projectId}
//             allEmployees={allEmployees}
//           />
//         )}
//         {activeTab === "sitevisits" && (
//           <SiteVisitsTab
//             siteVisits={p.siteVisits}
//             projectId={p.projectId}
//             onOpenGallery={(docs) => setGalleryDocs(docs)} // ← add this
//           />
//         )}
//         {activeTab === "structures" && (
//           <StructuresTab
//             structures={p.structures}
//             navigate={navigate}
//             projectId={p.projectId}
//           />
//         )}
//         {activeTab === "meetings" && (
//           <StructuresTab structures={p.structures} navigate={navigate} />
//         )}
//         {activeTab === "rera" && (
//           <div className={styles.reraSection}>
//             <div className={styles.sectionHeader}>
//               <h3>RERA Details</h3>

//               <button
//                 className={styles.primaryBtn}
//                 onClick={() => setShowReraPopup(true)}
//               >
//                 + Add RERA
//               </button>
//             </div>

//             {rera ? (
//               <div className={styles.reraCard}>
//                 <InfoField label="RERA Number" value={rera.reraNumber} />
//                 <InfoField label="Authority" value={rera.authorityName} />
//                 <InfoField label="Promoter" value={rera.promoterName} />
//                 <InfoField
//                   label="Registration Date"
//                   value={rera.registrationDate}
//                 />
//                 <InfoField label="Expiry Date" value={rera.expiryDate} />
//                 <InfoField label="Status" value={rera.status} />
//               </div>
//             ) : (
//               <div className={styles.emptyState}>
//                 No RERA information added yet
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//       {/* ── Document Popup ── */}{" "}
//       {/* {docPopup && (
//         <DocumentPopup doc={docPopup} onClose={() => setDocPopup(null)} />
//       )} */}{" "}
//       {galleryDocs.length > 0 && (
//         <DocumentGallery
//           documents={galleryDocs}
//           onClose={() => setGalleryDocs([])}
//           onOpen={(index) => {
//             setViewerDocs(galleryDocs);
//             setViewerIndex(index);
//           }}
//         />
//       )}{" "}
//       {viewerIndex !== null && (
//         <ImageViewer
//           documents={viewerDocs}
//           activeIndex={viewerIndex}
//           onClose={() => setViewerIndex(null)}
//         />
//       )}
//       {showReraPopup && (
//         <AddReraPopup
//           projectId={projectId}
//           onClose={() => setShowReraPopup(false)}
//         />
//       )}
//     </div>
//   );
// }

import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectById } from "../../api/hooks/useProject";
import { useReraByProject } from "../../api/hooks/useRera";
import styles from "./ViewProject.module.scss";
import AddDocumentPopup from "./AddDocumentPopup";
import StructureViewerPopup from "../Structure/StructureViewerPopup";
import AddSiteVisitPopup from "./AddSiteVisitPopup";
import EditSiteVisitPopup from "./EditSiteVisitPopup";
import AddEmployeeToProjectPopup from "./AddEmployeeToProjectPopup";
import { useEmployeeList } from "../../api/hooks/useEmployees";
import AddReraPopup from "./AddReraPopup";
import ReraTab from "./ReraTab";
// import { useReraByProject } from "../../api/hooks/useRera"; // your existing hook
// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dt) => {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fmtTime = (dt) => {
  if (!dt) return "—";
  const d = new Date(dt);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fmtBytes = (bytes) => {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

const stageLabel = (name) =>
  name ? name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

const STATUS_CONFIG = {
  PLANNING: {
    label: "Planning",
    bg: "#dbeafe",
    color: "#1e40af",
    dot: "#3b82f6",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "#fef3c7",
    color: "#92400e",
    dot: "#f59e0b",
  },
  ON_HOLD: {
    label: "On Hold",
    bg: "#fee2e2",
    color: "#991b1b",
    dot: "#ef4444",
  },
  COMPLETED: {
    label: "Completed",
    bg: "#dcfce7",
    color: "#14532d",
    dot: "#22c55e",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "#f3f4f6",
    color: "#374151",
    dot: "#9ca3af",
  },
  NOT_STARTED: {
    label: "Not Started",
    bg: "#f3f4f6",
    color: "#6b7280",
    dot: "#d1d5db",
  },
  ACTIVE: { label: "Active", bg: "#ede9fe", color: "#4c1d95", dot: "#7c3aed" },
};

const PRIORITY_CONFIG = {
  HIGH: { label: "High", bg: "#fee2e2", color: "#991b1b" },
  MEDIUM: { label: "Medium", bg: "#fef9c3", color: "#713f12" },
  LOW: { label: "Low", bg: "#dcfce7", color: "#14532d" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
    label: status || "—",
    bg: "#f3f4f6",
    color: "#374151",
    dot: "#9ca3af",
  };
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

const InfoField = ({ label, value, mono }) => (
  <div className={styles.infoField}>
    <span className={styles.infoLabel}>{label}</span>
    <span
      className={styles.infoValue}
      style={mono ? { fontFamily: "monospace", fontSize: "0.8rem" } : {}}
    >
      {value || "—"}
    </span>
  </div>
);

const ProgressBar = ({ value = 0 }) => (
  <div className={styles.progressBar}>
    <div
      className={styles.progressFill}
      style={{ width: `${Math.min(100, value || 0)}%` }}
    />
    <span className={styles.progressLabel}>{value || 0}%</span>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className={styles.skeletonWrap}>
    <div className={styles.skeletonHero} />
    <div className={styles.skeletonTabs} />
    <div className={styles.skeletonBody} />
  </div>
);
const ImageViewer = ({ documents, activeIndex, onClose }) => {
  const doc = documents[activeIndex];

  if (!doc) return null;

  return (
    <div className={styles.viewerOverlay}>
      <button className={styles.viewerClose} onClick={onClose}>
        ✕
      </button>

      <img
        src={doc.filePath}
        alt={doc.fileName}
        className={styles.viewerImage}
      />
    </div>
  );
};
const DocumentGallery = ({ documents, onClose, onOpen }) => {
  return (
    <div className={styles.galleryOverlay}>
      <button className={styles.galleryClose} onClick={onClose}>
        ✕
      </button>

      <div className={styles.galleryGrid}>
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            className={styles.galleryItem}
            onClick={() => onOpen(index)}
          >
            <img src={doc.filePath} alt={doc.fileName} />
            <h5>{doc.fileName}</h5>
            <p>{doc.documentType}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
// ─── Document Popup ───────────────────────────────────────────────────────────
const DocumentPopup = ({ doc, onClose }) => {
  if (!doc) return null;
  const isPDF = doc.mimeType?.includes("pdf") || doc.fileName?.endsWith(".pdf");
  const isImg = doc.mimeType?.startsWith("image/");

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupHeader}>
          <div className={styles.popupTitle}>
            <span className={styles.popupIcon}>📄</span>
            <div>
              <h3>{doc.fileName || "Document"}</h3>
              <p>{doc.description || doc.documentType || "Stage Document"}</p>
            </div>
          </div>
          <button className={styles.popupClose} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.popupMeta}>
          {doc.mimeType && (
            <span className={styles.popupTag}>{doc.mimeType}</span>
          )}
          {doc.fileSize && (
            <span className={styles.popupTag}>{fmtBytes(doc.fileSize)}</span>
          )}
          {doc.version && (
            <span className={styles.popupTag}>v{doc.version}</span>
          )}
          {doc.isApproved !== undefined && (
            <span
              className={styles.popupTag}
              style={{
                background: doc.isApproved ? "#dcfce7" : "#fee2e2",
                color: doc.isApproved ? "#14532d" : "#991b1b",
              }}
            >
              {doc.isApproved ? "✓ Approved" : "⏳ Pending"}
            </span>
          )}
        </div>

        <div className={styles.popupContent}>
          {doc.filePath ? (
            isPDF ? (
              <iframe
                src={doc.filePath}
                title={doc.fileName}
                className={styles.docFrame}
              />
            ) : isImg ? (
              <img
                src={doc.filePath}
                alt={doc.fileName}
                className={styles.docImg}
              />
            ) : (
              <div className={styles.docNoPreview}>
                <span className={styles.docBigIcon}>📁</span>
                <p>Preview not available for this file type.</p>
                <a
                  href={doc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.docDownload}
                >
                  Download File ↗
                </a>
              </div>
            )
          ) : (
            <div className={styles.docNoPreview}>
              <span className={styles.docBigIcon}>📭</span>
              <p>No document file has been uploaded yet.</p>
              <span className={styles.docHint}>
                The document will appear here once it is uploaded to this stage.
              </span>
            </div>
          )}
        </div>

        <div className={styles.popupFooter}>
          {doc.uploadedByUser && (
            <span className={styles.popupMeta2}>
              Uploaded by:{" "}
              <strong>
                {doc.uploadedByUser.name || doc.uploadedByUser.username}
              </strong>
              {doc.uploadedAt && <> on {fmt(doc.uploadedAt)}</>}
            </span>
          )}
          {doc.approvedByUser && (
            <span className={styles.popupMeta2}>
              Approved by:{" "}
              <strong>
                {doc.approvedByUser.name || doc.approvedByUser.username}
              </strong>
              {doc.approvedAt && <> on {fmt(doc.approvedAt)}</>}
            </span>
          )}
          {doc.filePath && (
            <a href={doc.filePath} download className={styles.downloadBtn}>
              ⬇ Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Stage Tree Node ──────────────────────────────────────────────────────────
const StageNode = ({ stage, depth = 0, onDocClick, onAddDoc }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = stage.childStages?.length > 0;
  const cfg = STATUS_CONFIG[stage.status] || STATUS_CONFIG.NOT_STARTED;
  const allDocs = stage.documents || [];
  const hasMedia = (stage.mediaFiles || []).length > 0;
  const hasTasks = (stage.tasks || []).length > 0;

  return (
    <div className={styles.stageNode} style={{ "--depth": depth }}>
      <div
        className={`${styles.stageHeader} ${hasChildren ? styles.stageExpandable : ""}`}
        onClick={() => hasChildren && setOpen(!open)}
      >
        <div className={styles.stageLeft}>
          {hasChildren && (
            <span
              className={styles.stageChevron}
              style={{ transform: open ? "rotate(90deg)" : "rotate(0)" }}
            >
              ›
            </span>
          )}
          {!hasChildren && (
            <span className={styles.stageDot} style={{ background: cfg.dot }} />
          )}
          <div className={styles.stageInfo}>
            <span className={styles.stageName}>
              {stage.customStageName || stageLabel(stage.stageName)}
              {stage.isMandatory && <span className={styles.mandatory}>*</span>}
            </span>
            {stage.customStageName && (
              <span className={styles.stageType}>
                {stageLabel(stage.stageName)}
              </span>
            )}
          </div>
        </div>
        <div className={styles.stageRight}>
          {stage.progressPercentage != null && depth > 0 && (
            <div className={styles.stageProgress}>
              <div
                className={styles.stageProgressFill}
                style={{ width: `${stage.progressPercentage}%` }}
              />
            </div>
          )}
          <StatusBadge status={stage.status} />
          {allDocs.length > 0 && (
            <button
              className={styles.docsBadge}
              onClick={(e) => {
                e.stopPropagation();
                onDocClick(allDocs);
              }}
            >
              📄 {allDocs.length}
            </button>
          )}

          <button
            className={styles.addDocBtn}
            onClick={(e) => {
              e.stopPropagation();
              onAddDoc(stage);
            }}
          >
            + Add Doc
          </button>
          {hasMedia && (
            <span className={styles.mediaBadge}>
              🖼 {stage.mediaFiles.length}
            </span>
          )}
          {hasTasks && (
            <span className={styles.tasksBadge}>✓ {stage.tasks.length}</span>
          )}
        </div>
      </div>

      {open && hasChildren && (
        <div className={styles.stageChildren}>
          {stage.childStages
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((child) => (
              <StageNode
                key={child.id}
                stage={child}
                depth={depth + 1}
                onDocClick={onDocClick}
                onAddDoc={onAddDoc}
              />
            ))}
        </div>
      )}

      {open && allDocs.length > 0 && depth > 0 && (
        <div className={styles.stageDocsList}>
          {allDocs.map((doc) => (
            <div
              key={doc.id}
              className={styles.docRow}
              onClick={() => onDocClick(doc)}
            >
              <span className={styles.docRowIcon}>
                {doc.filePath ? "📄" : "📭"}
              </span>
              <span className={styles.docRowName}>
                {doc.fileName || "Document"}
              </span>
              <span className={styles.docRowType}>
                {doc.documentType || ""}
              </span>
              <span
                className={styles.docRowStatus}
                style={{ color: doc.isApproved ? "#22c55e" : "#f59e0b" }}
              >
                {doc.isApproved ? "Approved" : "Pending"}
              </span>
              <span className={styles.docRowOpen}>Open ↗</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ p }) => {
  const priorityCfg = PRIORITY_CONFIG[p.priority] || null;

  return (
    <div className={styles.overviewGrid}>
      {/* Core Info Card */}
      <div className={styles.overCard}>
        <div className={styles.overCardHead}>🏗 Project Identity</div>
        <InfoField label="Project ID" value={p.projectId} mono />
        <InfoField label="Project Code" value={p.projectCode} mono />
        <InfoField label="Permanent ID" value={p.permanentProjectId} mono />
        <InfoField label="Project Name" value={p.projectName} />
        {p.projectDetails && (
          <InfoField label="Details" value={p.projectDetails} />
        )}
        <InfoField
          label="Status"
          value={<StatusBadge status={p.projectStatus} />}
        />
        {priorityCfg && (
          <InfoField
            label="Priority"
            value={
              <span
                style={{
                  background: priorityCfg.bg,
                  color: priorityCfg.color,
                  padding: "2px 10px",
                  borderRadius: 999,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {priorityCfg.label}
              </span>
            }
          />
        )}
        {p.postSales?.id && (
          <InfoField label="Post-Sales ID" value={`#${p.postSales.id}`} mono />
        )}
      </div>

      {/* Timeline Card */}
      <div className={styles.overCard}>
        <div className={styles.overCardHead}>◷ Timeline</div>
        <div className={styles.timelineList}>
          {[
            {
              label: "Created",
              val: p.projectCreatedDateTime,
              color: "#94a3b8",
            },
            { label: "Started", val: p.projectStartDateTime, color: "#3b82f6" },
            {
              label: "Expected End",
              val: p.projectExpectedEndDate,
              color: "#f59e0b",
            },
            {
              label: "Actual End",
              val: p.projectEndDateTime,
              color: "#22c55e",
            },
          ].map(({ label, val, color }) => (
            <div key={label} className={styles.tlRow}>
              <div className={styles.tlDot} style={{ background: color }} />
              <div>
                <span className={styles.tlLabel}>{label}</span>
                <span className={styles.tlVal}>{fmt(val)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Card */}
      <div className={styles.overCard}>
        <div className={styles.overCardHead}>📍 Location & Area</div>
        <InfoField label="Address" value={p.address} />
        <InfoField label="City" value={p.city} />
        {(p.latitude || p.longitude) && (
          <InfoField
            label="Coordinates"
            value={`${p.latitude ?? "—"}, ${p.longitude ?? "—"}`}
            mono
          />
        )}
        {p.googlePlace && (
          <InfoField
            label="Maps"
            value={
              <a
                href={`https://maps.google.com/?q=${p.googlePlace}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3b82f6", textDecoration: "none" }}
              >
                Open in Google Maps ↗
              </a>
            }
          />
        )}
        {p.plotArea != null && (
          <InfoField label="Plot Area" value={`${p.plotArea} sq.ft`} />
        )}
        {p.totalBuiltUpArea != null && (
          <InfoField
            label="Built-Up Area"
            value={`${p.totalBuiltUpArea} sq.ft`}
          />
        )}
        {p.totalCarpetArea != null && (
          <InfoField label="Carpet Area" value={`${p.totalCarpetArea} sq.ft`} />
        )}
      </div>

      {/* Stats Card */}
      <div className={styles.statsCard}>
        <div className={styles.overCardHead}>📊 Summary</div>
        <div className={styles.statsGrid}>
          {[
            {
              label: "Total Stages",
              val: p.stages?.filter((s) => !s.parentStageId).length || 0,
              color: "#3b82f6",
            },
            {
              label: "Employees",
              val: p.workingEmployees?.length || 0,
              color: "#8b5cf6",
            },
            {
              label: "Site Visits",
              val: p.siteVisits?.length || 0,
              color: "#f59e0b",
            },
            {
              label: "Structures",
              val: p.structures?.length || 0,
              color: "#10b981",
            },
          ].map(({ label, val, color }) => (
            <div key={label} className={styles.statTile}>
              <span className={styles.statVal} style={{ color }}>
                {val}
              </span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Stages Tab ───────────────────────────────────────────────────────────────
const StagesTab = ({ stages, onDocClick, onAddDoc }) => {
  const roots = useMemo(
    () =>
      (stages || [])
        .filter((s) => !s.parentStageId)
        .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    [stages],
  );

  if (!roots.length) {
    return (
      <div className={styles.emptyState}>
        <span>📋</span>
        <p>No stages defined for this project yet.</p>
      </div>
    );
  }

  const totalStages = roots.length;
  const completedStages = roots.filter((s) => s.status === "COMPLETED").length;
  const overallProgress = Math.round((completedStages / totalStages) * 100);

  return (
    <div>
      {/* Progress Summary */}
      <div className={styles.stagesSummary}>
        <div className={styles.stageSumItem}>
          <span className={styles.stageSumVal}>{totalStages}</span>
          <span className={styles.stageSumLabel}>Total Phases</span>
        </div>
        <div className={styles.stageSumItem}>
          <span className={styles.stageSumVal} style={{ color: "#22c55e" }}>
            {completedStages}
          </span>
          <span className={styles.stageSumLabel}>Completed</span>
        </div>
        <div className={styles.stageSumItem}>
          <span className={styles.stageSumVal} style={{ color: "#f59e0b" }}>
            {roots.filter((s) => s.status === "IN_PROGRESS").length}
          </span>
          <span className={styles.stageSumLabel}>In Progress</span>
        </div>
        <div className={styles.stageSumItem}>
          <span className={styles.stageSumVal} style={{ color: "#6b7280" }}>
            {roots.filter((s) => s.status === "NOT_STARTED").length}
          </span>
          <span className={styles.stageSumLabel}>Not Started</span>
        </div>
        <div className={styles.stageSumProgress}>
          <span className={styles.stageSumProgressLabel}>
            Overall: {overallProgress}%
          </span>
          <ProgressBar value={overallProgress} />
        </div>
      </div>

      {/* Stage Tree */}
      <div className={styles.stageTree}>
        {roots.map((stage, idx) => (
          <div key={stage.id} className={styles.stageGroup}>
            <div className={styles.stageGroupNum}>{idx + 1}</div>
            <div className={styles.stageGroupContent}>
              <StageNode
                stage={stage}
                depth={0}
                onDocClick={onDocClick}
                onAddDoc={onAddDoc}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Employees Tab ────────────────────────────────────────────────────────────
const EmployeesTab = ({ employees, projectId, allEmployees }) => {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    console.log(employees);
  }, [employees]);
  return (
    <div>
      <div className={styles.sectionHeader}>
        <h3>Employees</h3>

        <button
          className={styles.primaryBtn}
          onClick={() => setShowPopup(true)}
        >
          + Add Employee
        </button>
      </div>

      <div className={styles.empGrid}>
        {employees?.map((emp) => (
          <div key={emp.id} className={styles.empCard}>
            <div className={styles.empAvatar}>{emp.name?.charAt(0)}</div>
            {console.log(emp)}
            <div>
              <div>{emp.fullName}</div>
              {/* <div>{emp.email}</div> */}
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <AddEmployeeToProjectPopup
          projectId={projectId}
          employees={allEmployees}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

// ─── Site Visits Tab ──────────────────────────────────────────────────────────

const SiteVisitsTab = ({ siteVisits, projectId, onOpenGallery }) => {
  const [showPopup, setShowPopup] = useState(false);
  // const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setEditPopup] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  if (!siteVisits?.length) {
    return (
      <div className={styles.emptyState}>
        <span>🏠</span>
        <p>No site visits recorded for this project yet.</p>
        <button
          className={styles.primaryBtn}
          onClick={() => setShowPopup(true)}
        >
          + Add Site Visit
        </button>
        {showEditPopup && selectedVisit && (
          <EditSiteVisitPopup
            visit={selectedVisit}
            onClose={() => setEditPopup(false)}
          />
        )}
        {showPopup && (
          <AddSiteVisitPopup
            projectId={projectId}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={styles.sectionHeader}>
        <h3>Site Visits</h3>
        <button
          className={styles.primaryBtn}
          onClick={() => setShowPopup(true)}
        >
          + Add Site Visit
        </button>
      </div>

      <div className={styles.svList}>
        {siteVisits.map((sv, i) => {
          // Normalise photos → same shape DocumentGallery expects
          const photoDocs = (sv.photos || []).map((p) => ({
            id: p.id,
            filePath: p.imageUrl,
            fileName: p.fileName || `Photo ${i + 1}`,
            documentType: "Photo",
          }));

          // Normalise documents → same shape DocumentGallery expects
          const docFiles = (sv.documents || []).map((d) => ({
            id: d.id,
            filePath: d.documentUrl,
            fileName: d.documentName || d.fileName || "Document",
            documentType: d.documentType || "Document",
          }));

          return (
            <div key={sv.id || i} className={styles.svCard}>
              {/* ── Card Header ── */}
              <div className={styles.svHeader}>
                <div className={styles.svNum}>Visit #{i + 1}</div>

                <div className={styles.svActions}>
                  <span className={styles.svDate}>
                    {fmtTime(sv.visitDateTime)}
                  </span>

                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setSelectedVisit(sv);
                      setEditPopup(true);
                    }}
                  >
                    ✏ Edit
                  </button>
                </div>
              </div>

              {/* ── Info Fields ── */}
              {sv.title && <InfoField label="Title" value={sv.title} />}
              {sv.description && (
                <InfoField label="Description" value={sv.description} />
              )}
              {sv.locationNote && (
                <InfoField label="Location Note" value={sv.locationNote} />
              )}

              {/* ── Media Row ── */}
              {(photoDocs.length > 0 || docFiles.length > 0) && (
                <div className={styles.svMediaRow}>
                  {/* Photos button */}
                  {photoDocs.length > 0 && (
                    <button
                      className={styles.svMediaBtn}
                      onClick={() => onOpenGallery(photoDocs)}
                    >
                      <span className={styles.svMediaIcon}>🖼</span>
                      <span>
                        {photoDocs.length}{" "}
                        {photoDocs.length === 1 ? "Photo" : "Photos"}
                      </span>
                    </button>
                  )}

                  {/* Documents button */}
                  {docFiles.length > 0 && (
                    <button
                      className={styles.svDocBtn}
                      onClick={() => onOpenGallery(docFiles)}
                    >
                      <span className={styles.svMediaIcon}>📄</span>
                      <span>
                        {docFiles.length}{" "}
                        {docFiles.length === 1 ? "Document" : "Documents"}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showEditPopup && selectedVisit && (
        <EditSiteVisitPopup
          visit={selectedVisit}
          onClose={() => setEditPopup(false)}
        />
      )}
      {showPopup && (
        <AddSiteVisitPopup
          projectId={projectId}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

// ─── Structures Tab ───────────────────────────────────────────────────────────
// ─── Structures Tab ───────────────────────────────────────────────────────────
// Replace the existing StructuresTab component in ViewProject.jsx with this:

const StructuresTab = ({ structures, navigate, projectId }) => {
  if (!structures?.length) {
    return (
      <div className={styles.emptyState}>
        <span>🏢</span>
        <p>No structures defined for this project yet.</p>
        <button
          className={styles.primaryBtn}
          onClick={() => navigate(`/projects/${projectId}/structure`)}
        >
          + Add Structure
        </button>
      </div>
    );
  }

  return (
    <div className={styles.structList}>
      <div className={styles.sectionHeader}>
        <h3>Structures</h3>
        <button
          className={styles.primaryBtn}
          onClick={() => navigate(`/projects/${projectId}/structure`)}
        >
          + Add Structure
        </button>
      </div>

      <div className={styles.structGrid}>
        {structures.map((s, i) => {
          const STRUCT_ICONS = {
            TOWER: "🗼",
            WING: "🏢",
            BUILDING: "🏗",
            ROW_HOUSE: "🏘",
            BUNGALOW: "🏡",
            PODIUM_BLOCK: "⬛",
          };
          const USAGE_COLORS = {
            RESIDENTIAL: { bg: "#dbeafe", color: "#1e40af" },
            COMMERCIAL: { bg: "#fef3c7", color: "#92400e" },
            PARKING: { bg: "#f3f4f6", color: "#374151" },
            SERVICES: { bg: "#fce7f3", color: "#9d174d" },
            MIXED: { bg: "#ede9fe", color: "#4c1d95" },
          };
          const icon = STRUCT_ICONS[s.structureType] || "🏢";
          const usageCfg = USAGE_COLORS[s.usageType] || null;
          const levelCount = s.levels?.length || 0;
          const avgProgress = levelCount
            ? Math.round(
                s.levels.reduce(
                  (acc, l) => acc + (Number(l.progressPercentage) || 0),
                  0,
                ) / levelCount,
              )
            : null;

          return (
            <div key={s.id || i} className={styles.structCard}>
              {/* Card header */}
              <div className={styles.structHeader}>
                <div className={styles.structIconWrap}>{icon}</div>
                <div className={styles.structHeaderInfo}>
                  <span className={styles.structName}>
                    {s.structureName || `Structure ${i + 1}`}
                  </span>
                  <div className={styles.structBadges}>
                    {s.structureType && (
                      <span className={styles.structType}>
                        {s.structureType.replace(/_/g, " ")}
                      </span>
                    )}
                    {usageCfg && (
                      <span
                        className={styles.structUsage}
                        style={{
                          background: usageCfg.bg,
                          color: usageCfg.color,
                        }}
                      >
                        {s.usageType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className={styles.structStats}>
                <div className={styles.structStat}>
                  <span className={styles.structStatVal}>
                    {s.totalFloors ?? "—"}
                  </span>
                  <span className={styles.structStatLabel}>Floors</span>
                </div>
                <div className={styles.structStat}>
                  <span className={styles.structStatVal}>
                    {s.totalBasements ?? "—"}
                  </span>
                  <span className={styles.structStatLabel}>Basements</span>
                </div>
                <div className={styles.structStat}>
                  <span className={styles.structStatVal}>{levelCount}</span>
                  <span className={styles.structStatLabel}>Levels</span>
                </div>
                {avgProgress !== null && (
                  <div className={styles.structStat}>
                    <span
                      className={styles.structStatVal}
                      style={{
                        color:
                          avgProgress >= 75
                            ? "#10b981"
                            : avgProgress >= 40
                              ? "#f59e0b"
                              : "#6366f1",
                      }}
                    >
                      {avgProgress}%
                    </span>
                    <span className={styles.structStatLabel}>Progress</span>
                  </div>
                )}
              </div>

              {/* Area info */}
              {s.builtUpArea != null && (
                <div className={styles.structArea}>
                  <span className={styles.structAreaLabel}>Built-Up Area</span>
                  <span className={styles.structAreaVal}>
                    {s.builtUpArea.toLocaleString()} sq.ft
                  </span>
                </div>
              )}

              {/* Progress bar */}
              {avgProgress !== null && (
                <div className={styles.structProgBar}>
                  <div
                    className={styles.structProgFill}
                    style={{
                      width: `${avgProgress}%`,
                      background:
                        avgProgress >= 75
                          ? "#10b981"
                          : avgProgress >= 40
                            ? "#f59e0b"
                            : "#6366f1",
                    }}
                  />
                </div>
              )}

              {/* Action */}
              <div className={styles.structFooter}>
                <button
                  className={styles.viewStructBtn}
                  onClick={() =>
                    navigate(`/projects/${projectId}/structure/${s.id}`)
                  }
                >
                  View Structure →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Documents Tab (all docs across stages) ───────────────────────────────────
const DocumentsTab = ({ stages, onDocClick }) => {
  const allDocs = useMemo(() => {
    const docs = [];
    const collectDocs = (stageList) => {
      for (const stage of stageList || []) {
        for (const doc of stage.documents || []) {
          docs.push({
            ...doc,
            stageName: stage.customStageName || stageLabel(stage.stageName),
          });
        }
        collectDocs(stage.childStages);
      }
    };
    collectDocs(stages);
    return docs;
  }, [stages]);

  if (!allDocs.length) {
    return (
      <div className={styles.emptyState}>
        <span>📁</span>
        <p>No documents have been uploaded to any stage yet.</p>
        <span className={styles.emptyHint}>
          Documents will appear here once they are added to project stages.
        </span>
      </div>
    );
  }

  return (
    <div className={styles.docsTable}>
      <div className={styles.docsTableHead}>
        <span>Document</span>
        <span>Stage</span>
        <span>Type</span>
        <span>Size</span>
        <span>Status</span>
        <span>Action</span>
      </div>
      {allDocs.map((doc, i) => (
        <div key={doc.id || i} className={styles.docsTableRow}>
          <span className={styles.docFileName}>
            <span>{doc.filePath ? "📄" : "📭"}</span>
            {doc.fileName || "Unnamed"}
          </span>
          <span className={styles.docStage}>{doc.stageName}</span>
          <span className={styles.docType}>{doc.documentType || "—"}</span>
          <span>{fmtBytes(doc.fileSize)}</span>
          <span>
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                fontSize: "0.7rem",
                fontWeight: 600,
                background: doc.isApproved ? "#dcfce7" : "#fef9c3",
                color: doc.isApproved ? "#14532d" : "#713f12",
              }}
            >
              {doc.isApproved ? "✓ Approved" : "Pending"}
            </span>
          </span>
          <span>
            <button
              className={styles.openDocBtn}
              onClick={() => onDocClick(doc)}
            >
              Open
            </button>
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview", icon: "🏠" },
  { key: "stages", label: "Stages", icon: "📋" },
  { key: "documents", label: "Documents", icon: "📁" },
  { key: "employees", label: "Team", icon: "👥" },
  { key: "sitevisits", label: "Site Visits", icon: "📍" },
  { key: "structures", label: "Structures", icon: "🏢" },
  { key: "meetings", label: "Meetings", icon: "🤝" },
  { key: "rera", label: "RERA", icon: "📋" }, // NEW TAB
];

export default function ViewProject() {
  const [viewerIndex, setViewerIndex] = useState(null);
  const [viewerDocs, setViewerDocs] = useState([]);
  const [galleryDocs, setGalleryDocs] = useState([]);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data, isLoading, isError } = useProjectById(projectId);
  console.log(data);
  const { data: reraData, isLoading: reraLoading } =
    useReraByProject(projectId);
  console.log(reraData);

  const [showReraPopup, setShowReraPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  // const [docPopup, setDocPopup] = useState(null);
  const [addDocStage, setAddDocStage] = useState(null);
  const { data: employeesData } = useEmployeeList();
  const allEmployees = (employeesData || []).filter(
    (e) => e.status === "ACTIVE",
  );
  const { data: rera } = useReraByProject(projectId, { retry: false });
  const p = data?.data;

  // Must be called unconditionally before any early returns
  const docCount = useMemo(() => {
    if (!p?.stages) return null;
    let count = 0;
    const countDocs = (list) => {
      for (const s of list || []) {
        count += (s.documents || []).length;
        countDocs(s.childStages);
      }
    };
    countDocs(p.stages);
    return count || null;
  }, [p?.stages]);

  if (isLoading)
    return (
      <div className={styles.pageWrapper}>
        <Skeleton />
      </div>
    );

  if (isError || !p) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.errorState}>
          <span>⚠️</span>
          <h3>Failed to load project</h3>
          <p>Unable to fetch project details. Please try again.</p>
          <button onClick={() => navigate(-1)} className={styles.errBtn}>
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const tabBadge = {
    stages: (p.stages || []).filter((s) => !s.parentStageId).length || null,
    employees: p.workingEmployees?.length || null,
    sitevisits: p.siteVisits?.length || null,
    structures: p.structures?.length || null,
    documents: docCount,
  };

  const projectInitial = (p.projectName || "P")[0].toUpperCase();

  return (
    <div className={styles.pageWrapper}>
      {/* Breadcrumb */}
      {/* <nav className={styles.breadcrumb}>
        <span
          className={styles.breadLink}
          onClick={() => navigate("/projects")}
        >
          Projects
        </span>
        <span className={styles.sep}>›</span>
        <span>{p.projectName || `NoProjectName`}</span>
      </nav> */}
      {/* ── Hero Header ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroLogo}>
            {p.logoUrl ? (
              <img src={p.logoUrl} alt="logo" />
            ) : (
              <span>{projectInitial}</span>
            )}
          </div>
          <div className={styles.heroMeta}>
            <h1 className={styles.heroTitle}>
              {p.projectName || `Site #${p.projectId}`}
            </h1>
            <div className={styles.heroChips}>
              {p.projectCode && (
                <code className={styles.chip}>{p.projectCode}</code>
              )}
              {p.permanentProjectId && (
                <code className={styles.chip}>{p.permanentProjectId}</code>
              )}
              {p.city && <span className={styles.chip}>📍 {p.city}</span>}
              {p.priority && (
                <span
                  className={styles.chip}
                  style={{
                    background: PRIORITY_CONFIG[p.priority]?.bg,
                    color: PRIORITY_CONFIG[p.priority]?.color,
                  }}
                >
                  {p.priority} PRIORITY
                </span>
              )}
            </div>
            {p.projectDetails && (
              <p className={styles.heroDetails}>{p.projectDetails}</p>
            )}
          </div>
        </div>
        <div className={styles.heroRight}>
          <StatusBadge status={p.projectStatus} />
          <div className={styles.heroDate}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate(`/projects/edit/${p.projectId}`)}
            >
              ⬡ Edit Site
            </button>
            <strong>{fmt(p.projectCreatedDateTime)}</strong>
          </div>
          {p.projectStartDateTime && (
            <div className={styles.heroDate}>
              <span>Started</span>
              <strong>{fmt(p.projectStartDateTime)}</strong>
            </div>
          )}
          {p.projectExpectedEndDate && (
            <div className={styles.heroDate}>
              <span>Expected End</span>
              <strong>{fmt(p.projectExpectedEndDate)}</strong>
            </div>
          )}
        </div>
      </div>
      {/* ── Tabs ── */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
              {tabBadge[tab.key] != null && (
                <span className={styles.tabBadge}>{tabBadge[tab.key]}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      {addDocStage && (
        <AddDocumentPopup
          stage={addDocStage}
          onClose={() => setAddDocStage(null)}
        />
      )}
      {/* ── Tab Content ── */}
      <div className={styles.tabContent}>
        {activeTab === "overview" && <OverviewTab p={p} />}
        {activeTab === "stages" && (
          <StagesTab
            stages={p.stages}
            onDocClick={(docs) => {
              setGalleryDocs(docs);
            }}
            onAddDoc={setAddDocStage}
          />
        )}
        {activeTab === "documents" && (
          <DocumentsTab
            stages={p.stages}
            onDocClick={(doc) => {
              setViewerDocs([doc]);
              setViewerIndex(0);
            }}
          />
        )}
        {activeTab === "employees" && (
          <EmployeesTab
            employees={p.workingEmployees}
            projectId={p.projectId}
            allEmployees={allEmployees}
          />
        )}
        {activeTab === "sitevisits" && (
          <SiteVisitsTab
            siteVisits={p.siteVisits}
            projectId={p.projectId}
            onOpenGallery={(docs) => setGalleryDocs(docs)} // ← add this
          />
        )}
        {activeTab === "structures" && (
          <StructuresTab
            structures={p.structures}
            navigate={navigate}
            projectId={p.projectId}
          />
        )}
        {activeTab === "meetings" && (
          <StructuresTab structures={p.structures} navigate={navigate} />
        )}
        {activeTab === "rera" && (
          <ReraTab
            rera={reraData ?? null}
            isLoading={reraLoading}
            onAddRera={() => setShowReraPopup(true)}
          />
        )}
      </div>
      {/* ── Document Popup ── */}{" "}
      {/* {docPopup && (
        <DocumentPopup doc={docPopup} onClose={() => setDocPopup(null)} />
      )} */}{" "}
      {galleryDocs.length > 0 && (
        <DocumentGallery
          documents={galleryDocs}
          onClose={() => setGalleryDocs([])}
          onOpen={(index) => {
            setViewerDocs(galleryDocs);
            setViewerIndex(index);
          }}
        />
      )}{" "}
      {viewerIndex !== null && (
        <ImageViewer
          documents={viewerDocs}
          activeIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}
      {showReraPopup && (
        <AddReraPopup
          projectId={projectId}
          onClose={() => setShowReraPopup(false)}
        />
      )}
    </div>
  );
}
